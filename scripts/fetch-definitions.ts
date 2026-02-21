#!/usr/bin/env npx tsx
/**
 * fetch-definitions.ts
 *
 * Fetches Synology DSM 7.x API definitions by downloading encrypted SPK packages
 * from archive.synology.com, decrypting them, and extracting .api/.lib JSON files.
 *
 * Usage:
 *   npx tsx scripts/fetch-definitions.ts                # Full pipeline: download + decrypt + extract + compile
 *   npx tsx scripts/fetch-definitions.ts --compile-only # Just merge existing .api/.lib files into _full.json
 *
 * SPK decryption uses the same approach as open-source tools:
 *   - https://github.com/prt1999/SynoXtract
 *   - https://github.com/synacktiv/synodecrypt
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { gunzipSync } from 'node:zlib';
import _sodium from 'libsodium-wrappers-sumo';
import { decode } from '@msgpack/msgpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const definitionsDir = path.join(rootDir, 'definitions');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ARCH = 'x86_64';
const MAGIC = 0xadbeef;
const CHUNK_SIZE = 0x400000; // 4 MB
const ENCRYPTED_HEADER_SIZE = 0x193; // 403 bytes
const NONCE_SIZE = 24;
const TAG_OVERHEAD = 17; // crypto_secretstream ABYTES

// SPK signing (Ed25519 public) and master (KDF) keys — from SynoXtract (MIT)
// Key type 3 = SPK packages
const ALL_KEYS: { name: string; signing: string; master: string }[] = [
  { name: 'SYSTEM',            signing: '64FABA48FEEC6C8A2484D2489A11418A0E980317A9CC6B392F1041925B293FE0', master: '078A7529A07A998CFFADB87D7378993B7D9CCFA7171F5C47F150838A6A7CAF61' },
  { name: 'NANO',              signing: '64FABA48FEEC6C8A2484D2489A11418A0E980317A9CC6B392F1041925B293FE0', master: '9C388F52826A10B9838FF743F6B66B30CDCB1247ADBE566275F1F5A69F8F26FB' },
  { name: 'JSON',              signing: '95BBD04B3903C199026BE07AB14FBCF41863AC32251B4FF11774FA0BD98305A7', master: '078A7529A07A998CFFADB87D7378993B7D9CCFA7171F5C47F150838A6A7CAF61' },
  { name: 'SPK',               signing: 'FECAA2DD065A86A68E5FE86BA34CD8481590A79FA2C29A7D69F25A3B3BFAA19E', master: 'CF0D8D6ECB95EF97D0AC6A7021D99124C699808CF2CC5157DFEA5EBF15C805E7' },
  { name: 'SYNOMIBCOLLECTOR',  signing: '2B6D761B5786FF65D16C50E551EA11F2AD4E61E344A8272CBDC65A9AD0619AE8', master: '977D1511DB2B7F7C7158FC717C2E7AC4952703748A884D731FF24F4AFF7E3038' },
  { name: 'SSDB',              signing: 'B8A31F0FDCDAB36415BAC54B2872E1223080CB7C58D0E2B2C9F528523E9E3FB0', master: '8E1BDA67B47F2892C656FB542FDD668A389C718A8ADE429E5ECF4D66D36483AA' },
  { name: 'AUTOUPDATE',        signing: '757E037E512E20FAEDB7218E2AD75AD55244741E54A31049132F4789A3A66C31', master: '6A8360CE72E41347771A06F6C1FEA03CDF0E56994D244EB3FE99DC478086AE04' },
  { name: 'FIRMWARE',          signing: '0169F56624F5BAB7B709D0557CE9BFBB12C25D900CA9C21663E20C8DD31A1AA2', master: '9AD877F649993B05ADF64D13CE5CFB84EA65105F7B48C3ED428B1769B6456DD4' },
  { name: 'DEV',               signing: '50CE5E3E525E1E144C1A749FFF7A79C2E2FFB322DF85093FC1226530CC0EC59C', master: '078A7529A07A998CFFADB87D7378993B7D9CCFA7171F5C47F150838A6A7CAF61' },
  { name: 'WEDJAT',            signing: '9A0A314963458EDFAE530BB2991B66A26B23A276444D29215A94C5CE85EE61A0', master: '25F962A7D4AD6A0C4538989860F1150FB62FC902399DBEE62DBF080AED885990' },
  { name: 'DSM_SUPPORT_PATCH', signing: '64FABA48FEEC6C8A2484D2489A11418A0E980317A9CC6B392F1041925B293FE0', master: '078A7529A07A998CFFADB87D7378993B7D9CCFA7171F5C47F150838A6A7CAF61' },
  { name: 'SMALL',             signing: '64FABA48FEEC6C8A2484D2489A11418A0E980317A9CC6B392F1041925B293FE0', master: '078A7529A07A998CFFADB87D7378993B7D9CCFA7171F5C47F150838A6A7CAF61' },
];

// Packages to fetch for DSM 7.x
const PACKAGES = [
  'AudioStation',
  'DownloadStation',
  'VideoStation',
  'SurveillanceStation',
  'SynologyPhotos',
];

// API prefixes that come from DSM firmware (not station SPKs).
// We copy these from 6.x definitions since they're backward-compatible.
const FIRMWARE_API_PREFIXES = [
  'SYNO.API.',
  'SYNO.Core.',
  'SYNO.DSM.',
  'SYNO.FileStation.',
  'SYNO.Entry.',
];

// ---------------------------------------------------------------------------
// Tar parser (handles both plain tar and ustar formats)
// ---------------------------------------------------------------------------

interface TarEntry {
  name: string;
  size: number;
  data: Buffer;
}

function parseTar(buf: Buffer): TarEntry[] {
  const entries: TarEntry[] = [];
  let offset = 0;

  while (offset + 512 <= buf.length) {
    const header = buf.subarray(offset, offset + 512);

    // End of archive: two consecutive zero blocks
    if (header.every((b) => b === 0)) break;

    // Name: bytes 0–99 (null-terminated)
    let name = header.subarray(0, 100).toString('ascii').replace(/\0.*$/, '');

    // ustar prefix: bytes 345–499
    const prefix = header.subarray(345, 500).toString('ascii').replace(/\0.*$/, '');
    if (prefix) name = `${prefix}/${name}`;

    // Size: bytes 124–135 (octal)
    const sizeStr = header.subarray(124, 136).toString('ascii').replace(/\0/g, '').trim();
    const size = parseInt(sizeStr, 8) || 0;

    // Typeflag: byte 156 ('0' or '\0' = regular file, '5' = directory)
    const typeflag = header[156];

    offset += 512;

    if ((typeflag === 0x30 || typeflag === 0) && size > 0) {
      entries.push({
        name: name.replace(/^\.\//, ''),
        size,
        data: Buffer.from(buf.subarray(offset, offset + size)),
      });
    }

    // Advance past file data (rounded up to 512-byte boundary)
    offset += Math.ceil(size / 512) * 512;
  }

  return entries;
}

// ---------------------------------------------------------------------------
// SPK decryptor
// ---------------------------------------------------------------------------

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function decryptSpk(spkData: Buffer): Promise<TarEntry[]> {
  await _sodium.ready;
  const sodium = _sodium;

  // 1. Check magic (first 4 bytes, mask lower 3 bytes)
  const firstWord = spkData.readUInt32BE(0);
  if ((firstWord & 0xffffff) !== MAGIC) {
    // Not encrypted — treat as plain tar
    console.log('    (not encrypted, parsing as plain tar)');
    return parseTar(spkData);
  }

  let offset = 4;

  // 2. Read header length (uint32 LE)
  const headerLen = spkData.readUInt32LE(offset);
  offset += 4;

  // 3. Read msgpack header + Ed25519 signature
  const header = spkData.subarray(offset, offset + headerLen);
  offset += headerLen;
  const signature = spkData.subarray(offset, offset + 64);
  offset += 64;

  // 4. Auto-detect key type via signature verification (try SPK first)
  let signingKey: Uint8Array | null = null;
  let masterKey: Uint8Array | null = null;
  const spkKeyIdx = ALL_KEYS.findIndex((k) => k.name === 'SPK');
  const tryOrder = [spkKeyIdx, ...ALL_KEYS.map((_, i) => i).filter((i) => i !== spkKeyIdx)];

  for (const i of tryOrder) {
    const k = ALL_KEYS[i];
    const sk = hexToBytes(k.signing);
    try {
      const valid = sodium.crypto_sign_verify_detached(
        new Uint8Array(signature),
        new Uint8Array(header),
        sk,
      );
      if (valid) {
        signingKey = sk;
        masterKey = hexToBytes(k.master);
        console.log(`    Key type: ${k.name}`);
        break;
      }
    } catch {
      // Try next key
    }
  }
  if (!signingKey || !masterKey) {
    throw new Error('No matching signing key found for SPK');
  }

  // 5. Decode msgpack header
  const mp = decode(header) as unknown[];
  const dataBlob = mp[0] as Uint8Array;
  const entriesInfo = mp[1] as unknown[];

  // 6. Key derivation parameters from the data blob
  //    subkey_id: uint64 LE at offset 0x10
  //    context:   bytes 0x18..0x1E + null byte (8 bytes total)
  const subkeyIdBuf = Buffer.from(dataBlob.slice(0x10, 0x18));
  const subkeyId = subkeyIdBuf.readBigUInt64LE(0);
  const ctx = new Uint8Array(8);
  ctx.set(dataBlob.slice(0x18, 0x1f));
  ctx[7] = 0;

  // 7. Derive the XChaCha20-Poly1305 key
  // The high-level crypto_kdf_derive_from_key enforces string ctx (UTF-8 encoded),
  // which corrupts binary bytes > 127. Implement the KDF manually:
  //   KDF = Blake2b(message=∅, key=masterKey, salt=subkeyId‖0⁸, personal=ctx‖0⁸)
  const salt = new Uint8Array(16);
  new DataView(salt.buffer).setBigUint64(0, subkeyId, true);
  const personal = new Uint8Array(16);
  personal.set(ctx.subarray(0, 8));

  const derivedKey = sodium.crypto_generichash_blake2b_salt_personal(
    32,       // output length
    masterKey, // key
    salt,      // salt (16 bytes: subkeyId LE + zeros)
    personal,  // personal (16 bytes: ctx + zeros)
  );

  // 8. Decrypt each entry
  const results: TarEntry[] = [];

  for (let i = 0; i < entriesInfo.length; i++) {
    // Each entry is [size, checksum] where size = total encrypted bytes
    const entryArr = entriesInfo[i] as [number, Uint8Array];
    const entrySize = entryArr[0];
    if (!entrySize || entrySize <= 0) {
      continue;
    }

    const entryBuf = spkData.subarray(offset, offset + entrySize);
    offset += entrySize;
    let pos = 0;

    try {
      // --- Decrypt tar header ---
      // Layout within entry:
      //   0x000: [24 bytes]  Header nonce
      //   0x018: [403 bytes] Encrypted tar header
      //   0x1AB: [85 bytes]  Padding (align to TAR_BLOCKSIZE=512)
      //   0x200: [24 bytes]  Content nonce
      //   0x218: [chunks]    Encrypted content
      const hdrNonce = new Uint8Array(entryBuf.buffer, entryBuf.byteOffset + pos, NONCE_SIZE);
      pos += NONCE_SIZE;

      const encHdr = new Uint8Array(entryBuf.buffer, entryBuf.byteOffset + pos, ENCRYPTED_HEADER_SIZE);

      const hdrState = sodium.crypto_secretstream_xchacha20poly1305_init_pull(hdrNonce, derivedKey);
      const hdrResult = sodium.crypto_secretstream_xchacha20poly1305_pull(hdrState, encHdr);
      if (!hdrResult || !hdrResult.message) {
        console.warn(`    Entry ${i}: header decryption failed`);
        continue;
      }

      // Pad to 512 bytes (standard tar block)
      const tarHeader = Buffer.alloc(512);
      tarHeader.set(hdrResult.message);

      // Parse tar header fields
      let name = tarHeader.subarray(0, 100).toString('ascii').replace(/\0.*$/, '');
      const prefix = tarHeader.subarray(345, 500).toString('ascii').replace(/\0.*$/, '');
      if (prefix) name = `${prefix}/${name}`;
      name = name.replace(/^\.\//, '');

      const sizeStr = tarHeader.subarray(124, 136).toString('ascii').replace(/\0/g, '').trim();
      const fileSize = parseInt(sizeStr, 8) || 0;

      if (fileSize === 0) {
        // Directory or empty file — skip
        continue;
      }

      // --- Decrypt file content ---
      // Content nonce starts at TAR_BLOCKSIZE (0x200) from entry start, NOT right after header
      pos = 0x200;

      const cntNonce = new Uint8Array(entryBuf.buffer, entryBuf.byteOffset + pos, NONCE_SIZE);
      pos += NONCE_SIZE;

      const cntState = sodium.crypto_secretstream_xchacha20poly1305_init_pull(cntNonce, derivedKey);

      const chunks: Uint8Array[] = [];
      let remaining = fileSize;
      while (remaining > 0) {
        const chunkPlain = Math.min(CHUNK_SIZE, remaining);
        const chunkEnc = chunkPlain + TAG_OVERHEAD;
        const encChunk = new Uint8Array(entryBuf.buffer, entryBuf.byteOffset + pos, chunkEnc);
        pos += chunkEnc;

        const cntResult = sodium.crypto_secretstream_xchacha20poly1305_pull(cntState, encChunk);
        if (!cntResult || !cntResult.message) {
          throw new Error('content chunk decryption failed');
        }
        chunks.push(cntResult.message);
        remaining -= cntResult.message.length;
      }

      results.push({
        name,
        size: fileSize,
        data: Buffer.concat(chunks),
      });
    } catch (e) {
      console.warn(`    Failed to decrypt entry ${i}: ${(e as Error).message}`);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Network helpers
// ---------------------------------------------------------------------------

async function scrapeLatestVersion(packageName: string): Promise<string | null> {
  const url = `https://archive.synology.com/download/Package/${packageName}/`;
  const response = await fetch(url);
  if (!response.ok) return null;

  const html = await response.text();
  // Versions look like "7.2.0-5516", "4.1.1-5008", etc.
  const versionRegex = /(\d+\.\d+(?:\.\d+)?-\d+)/g;
  const versions: string[] = [];
  let match;
  while ((match = versionRegex.exec(html)) !== null) {
    if (!versions.includes(match[1])) versions.push(match[1]);
  }

  // Sort by build number descending (the number after the dash is the best ordering key)
  versions.sort((a, b) => {
    const buildA = parseInt(a.split('-')[1]);
    const buildB = parseInt(b.split('-')[1]);
    return buildB - buildA;
  });

  return versions[0] ?? null;
}

async function downloadSpk(packageName: string, version: string): Promise<Buffer> {
  // Try arch-specific first, then noarch
  const urls = [
    `https://global.synologydownload.com/download/Package/spk/${packageName}/${version}/${packageName}-${ARCH}-${version}.spk`,
    `https://global.synologydownload.com/download/Package/spk/${packageName}/${version}/${packageName}-noarch-${version}.spk`,
  ];

  for (const url of urls) {
    console.log(`    Trying: ${url}`);
    const response = await fetch(url, { redirect: 'follow' });
    if (response.ok) {
      return Buffer.from(await response.arrayBuffer());
    }
    console.log(`    ${response.status} — skipping`);
  }

  throw new Error(`Could not download SPK for ${packageName} ${version}`);
}

// ---------------------------------------------------------------------------
// Extract .api/.lib definition files from an SPK
// ---------------------------------------------------------------------------

function decompressArchive(data: Buffer, name: string): Buffer {
  // Detect format by magic bytes
  if (data[0] === 0x1f && data[1] === 0x8b) {
    // gzip
    return gunzipSync(data);
  }
  if (data[0] === 0xfd && data[1] === 0x37 && data[2] === 0x7a && data[3] === 0x58) {
    // xz — use system xz command
    console.log(`    ${name} is xz-compressed, decompressing...`);
    return Buffer.from(execSync('xz -d --stdout -', { input: data, maxBuffer: 1024 * 1024 * 1024 }));
  }
  // Might be plain tar or unknown — try as-is
  console.log(`    ${name} magic: 0x${data[0].toString(16)}${data[1].toString(16)} — treating as plain tar`);
  return data;
}

async function extractDefinitionsFromSpk(spkData: Buffer): Promise<Record<string, unknown>> {
  // Decrypt the SPK outer layer → tar entries
  console.log('    Decrypting SPK...');
  const outerEntries = await decryptSpk(spkData);
  console.log(`    Decrypted: ${outerEntries.length} entries`);

  // Look for .api/.lib files directly in the outer tar first
  const directDefs = extractApiLibFromEntries(outerEntries);
  if (Object.keys(directDefs).length > 0) {
    return directDefs;
  }

  // Find package.tgz (or similar archive names)
  const pkgEntry = outerEntries.find(
    (e) => /^(.*\/)?package\.(tgz|tar\.gz|txz|tar\.xz|tar)$/.test(e.name),
  );
  if (!pkgEntry) {
    console.log('    No package archive found, listing entries:');
    for (const e of outerEntries.slice(0, 20)) {
      console.log(`      ${e.name} (${e.size} bytes)`);
    }
    return {};
  }

  // Decompress and parse inner archive
  console.log(`    Extracting ${pkgEntry.name} (${(pkgEntry.size / 1024 / 1024).toFixed(1)} MB)...`);
  const innerTar = decompressArchive(pkgEntry.data, pkgEntry.name);
  const innerEntries = parseTar(innerTar);
  console.log(`    Inner entries: ${innerEntries.length}`);

  return extractApiLibFromEntries(innerEntries);
}

function extractApiLibFromEntries(entries: TarEntry[]): Record<string, unknown> {
  const merged: Record<string, unknown> = {};
  let count = 0;

  for (const entry of entries) {
    const basename = path.basename(entry.name);
    if (!basename.endsWith('.api') && !basename.endsWith('.lib')) continue;

    try {
      const parsed = JSON.parse(entry.data.toString('utf8'));
      Object.assign(merged, parsed);
      count++;
    } catch {
      console.warn(`    Warning: could not parse ${entry.name}`);
    }
  }

  console.log(`    Parsed ${count} definition files (${Object.keys(merged).length} APIs)`);
  return merged;
}

// ---------------------------------------------------------------------------
// Compile existing .api/.lib files in a directory into _full.json
// ---------------------------------------------------------------------------

function compileDefinitions(version: string): void {
  const versionDir = path.join(definitionsDir, version);
  if (!fs.existsSync(versionDir)) {
    console.log(`  Directory ${versionDir} does not exist, skipping.`);
    return;
  }

  const files = fs.readdirSync(versionDir).filter(
    (f) => f.endsWith('.api') || f.endsWith('.lib'),
  );

  if (files.length === 0) {
    console.log(`  No .api/.lib files found in ${versionDir}, skipping.`);
    return;
  }

  const merged: Record<string, unknown> = {};
  for (const file of files) {
    const filePath = path.join(versionDir, file);
    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      Object.assign(merged, parsed);
    } catch (e) {
      console.warn(`  Warning: Failed to parse ${filePath}: ${(e as Error).message}`);
    }
  }

  const outputPath = path.join(versionDir, '_full.json');
  fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`  Compiled ${files.length} files → ${outputPath} (${Object.keys(merged).length} APIs)`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const compileOnly = args.includes('--compile-only');

  if (compileOnly) {
    console.log('Compile-only mode: merging existing .api/.lib files...\n');
    for (const version of ['6.x', '7.x']) {
      compileDefinitions(version);
    }
    return;
  }

  console.log('Synology DSM 7.x API Definition Fetcher');
  console.log('========================================\n');

  await _sodium.ready;

  const allDefinitions: Record<string, unknown> = {};

  // -----------------------------------------------------------------------
  // 1. Copy firmware-level APIs from 6.x (SYNO.Core.*, SYNO.DSM.*, SYNO.FileStation.*, etc.)
  //    These come from the DSM firmware .pat, not from station SPK packages.
  //    6.x → 7.x is backward-compatible for these APIs.
  // -----------------------------------------------------------------------
  console.log('Step 1: Loading firmware APIs from 6.x definitions...');
  const sixXPath = path.join(definitionsDir, '6.x', '_full.json');
  const sixXDefs = JSON.parse(fs.readFileSync(sixXPath, 'utf8')) as Record<string, unknown>;

  let firmwareCount = 0;
  for (const [key, value] of Object.entries(sixXDefs)) {
    if (FIRMWARE_API_PREFIXES.some((p) => key.startsWith(p))) {
      allDefinitions[key] = value;
      firmwareCount++;
    }
  }
  console.log(`  Copied ${firmwareCount} firmware APIs from 6.x\n`);

  // -----------------------------------------------------------------------
  // 2. Download, decrypt, and extract each station package
  // -----------------------------------------------------------------------
  console.log('Step 2: Fetching station packages from archive.synology.com...\n');

  for (const packageName of PACKAGES) {
    console.log(`  ${packageName}:`);
    try {
      const version = await scrapeLatestVersion(packageName);
      if (!version) {
        console.log('    No version found on archive, skipping\n');
        continue;
      }
      console.log(`    Latest version: ${version}`);

      const spkData = await downloadSpk(packageName, version);
      console.log(`    Downloaded: ${(spkData.length / 1024 / 1024).toFixed(1)} MB`);

      const defs = await extractDefinitionsFromSpk(spkData);
      const apiCount = Object.keys(defs).length;
      if (apiCount > 0) {
        Object.assign(allDefinitions, defs);
        console.log(`    ✓ Added ${apiCount} APIs\n`);
      } else {
        console.log('    ⚠ No APIs extracted\n');
      }
    } catch (e) {
      console.error(`    ✗ Error: ${(e as Error).message}\n`);
    }
  }

  // -----------------------------------------------------------------------
  // 3. Write definitions/7.x/_full.json
  // -----------------------------------------------------------------------
  const outputDir = path.join(definitionsDir, '7.x');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, '_full.json');
  fs.writeFileSync(outputPath, JSON.stringify(allDefinitions, null, 2), 'utf8');

  const totalApis = Object.keys(allDefinitions).length;
  console.log(`\nDone! Wrote ${totalApis} APIs to definitions/7.x/_full.json`);

  // Print a summary by prefix
  const prefixCounts: Record<string, number> = {};
  for (const key of Object.keys(allDefinitions)) {
    const parts = key.split('.');
    const prefix = parts.length >= 2 ? `${parts[0]}.${parts[1]}` : parts[0];
    prefixCounts[prefix] = (prefixCounts[prefix] || 0) + 1;
  }
  console.log('\nAPI summary:');
  for (const [prefix, count] of Object.entries(prefixCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${prefix}: ${count}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
