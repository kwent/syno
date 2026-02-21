import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ApiDefinition, DefinitionsMap, MethodEntry } from '../types.js';

function findDefinitionsDir(): string {
  // Walk up from the current file's directory to find the definitions/ folder.
  // Works both in source (src/lib/) and bundled (dist/) contexts.
  let dir: string;
  try {
    dir = path.dirname(fileURLToPath(import.meta.url));
  } catch {
    dir = __dirname;
  }

  for (let i = 0; i < 5; i++) {
    const candidate = path.join(dir, 'definitions');
    if (fs.existsSync(candidate)) return candidate;
    dir = path.dirname(dir);
  }

  // Fallback to cwd
  return path.join(process.cwd(), 'definitions');
}

const definitionsDir = findDefinitionsDir();

const knownVersions = [
  '6.0', '6.0.1', '6.0.2', '6.0.3',
  '6.1', '6.1.1', '6.1.2', '6.1.3', '6.1.4', '6.1.5', '6.1.6', '6.1.7',
  '6.2', '6.2.1', '6.2.2',
  '7.0', '7.1', '7.2',
];

const cache = new Map<string, DefinitionsMap>();

export function validateApiVersion(version: string): void {
  if (!knownVersions.includes(version)) {
    throw new Error(
      `Api version: ${version} is not available. Available versions are: ${knownVersions.join(', ')}`
    );
  }
}

export function loadDefinitions(apiVersion: string): DefinitionsMap {
  if (cache.has(apiVersion)) {
    return cache.get(apiVersion)!;
  }

  const majorVersion = `${apiVersion.charAt(0)}.x`;
  const filePath = path.join(definitionsDir, majorVersion, '_full.json');
  const content = fs.readFileSync(filePath, 'utf8');
  const definitions: DefinitionsMap = JSON.parse(content);

  cache.set(apiVersion, definitions);
  return definitions;
}

export function clearDefinitionsCache(): void {
  cache.clear();
}

export function getMethodsForApi(
  definition: ApiDefinition,
): string[] {
  const methodVersions = Object.keys(definition.methods);
  const lastVersion = methodVersions[methodVersions.length - 1];
  const lastMethods: MethodEntry[] = definition.methods[lastVersion] || [];

  // Extract method names — handles both string and object entries (may be mixed)
  const methods: string[] = [];
  for (const entry of lastMethods) {
    if (typeof entry === 'string') {
      methods.push(entry);
    } else if (typeof entry === 'object' && entry !== null) {
      methods.push(...Object.keys(entry));
    }
  }
  return methods;
}
