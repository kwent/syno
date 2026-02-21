import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { Syno } from '../lib/Syno.js';
import { resolveConfig } from './config.js';

function readPackageVersion(): string {
  try {
    let dir: string;
    try {
      dir = path.dirname(fileURLToPath(import.meta.url));
    } catch {
      dir = __dirname;
    }
    for (let i = 0; i < 5; i++) {
      const candidate = path.join(dir, 'package.json');
      if (fs.existsSync(candidate)) {
        const pkg = JSON.parse(fs.readFileSync(candidate, 'utf8'));
        return pkg.version || '0.0.0';
      }
      dir = path.dirname(dir);
    }
  } catch {
    // Fallback
  }
  return '0.0.0';
}

const program = new Command();

const STATIONS = [
  { name: 'diskstationmanager', alias: 'dsm', prop: 'dsm', description: 'DSM API' },
  { name: 'filestation', alias: 'fs', prop: 'fs', description: 'DSM File Station API' },
  { name: 'downloadstation', alias: 'dl', prop: 'dl', description: 'DSM Download Station API' },
  { name: 'audiostation', alias: 'as', prop: 'as', description: 'DSM Audio Station API' },
  { name: 'videostation', alias: 'vs', prop: 'vs', description: 'DSM Video Station API' },
  { name: 'videostationdtv', alias: 'dtv', prop: 'dtv', description: 'DSM Video Station DTV API' },
  { name: 'surveillancestation', alias: 'ss', prop: 'ss', description: 'DSM Surveillance Station API' },
  { name: 'synologyphotos', alias: 'photo', prop: 'photo', description: 'DSM Synology Photos API' },
];

async function execute(
  syno: Syno,
  apiProp: string,
  methodName: string,
  options: { payload?: string; pretty?: boolean },
): Promise<void> {
  const debug = syno.debug;

  if (debug) console.log('[DEBUG] : Method name configured : %s', methodName);
  if (options.payload && debug) console.log('[DEBUG] : JSON payload configured : %s', options.payload);
  if (options.pretty && debug) console.log('[DEBUG] : Prettify output detected');

  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(options.payload || '{}');
  } catch (e) {
    console.log('[ERROR] : JSON Exception : %s', e);
    process.exit(1);
  }

  const station = syno[apiProp] as Record<string, unknown>;
  if (typeof station[methodName] !== 'function') {
    console.log('[ERROR] : %s not found for api: %s', methodName, apiProp);
    // Fix: exit 1 on unknown method
    process.exit(1);
  }

  try {
    const data = await (station[methodName] as (params: Record<string, unknown>) => Promise<unknown>)(payload);
    if (data != null) {
      const output = options.pretty
        ? JSON.stringify(data, undefined, 2)
        : JSON.stringify(data);
      console.log(output);
    }
  } catch (err) {
    console.log('[ERROR] : %s', err);
  }

  try {
    await syno.auth.logout();
  } catch {
    // Ignore logout errors
  }
  process.exit(0);
}

program
  .name('syno')
  .version(readPackageVersion())
  .description('Synology Rest API Command Line')
  .option('-c, --config <path>', 'DSM Configuration file. Default to ~/.syno/config.yaml')
  .option('-u, --url <url>', 'DSM URL. Default to https://admin:password@localhost:5001')
  .option('-d, --debug', 'Enabling Debugging Output')
  .option('-a, --api <version>', 'DSM API Version. Default to 7.2')
  .option('-i, --ignore-certificate-errors', 'Ignore certificate errors');

for (const station of STATIONS) {
  program
    .command(`${station.name} <method>`)
    .alias(station.alias)
    .description(station.description)
    .option('-p, --payload <payload>', 'JSON Payload')
    .option('-P, --pretty', 'Prettyprint JSON Output')
    .action(async (method: string, cmdOpts: { payload?: string; pretty?: boolean }) => {
      const globalOpts = program.opts();
      if (globalOpts.debug) {
        console.log('[DEBUG] : %s API command selected', station.description);
      }

      const config = resolveConfig({
        url: globalOpts.url,
        config: globalOpts.config,
        debug: globalOpts.debug,
        api: globalOpts.api,
        ignoreCertificateErrors: globalOpts.ignoreCertificateErrors,
      });

      if (config.debug) {
        console.log(
          '[DEBUG] : DSM Connection URL configured : %s://%s:%s@%s:%s',
          config.protocol, config.account, config.passwd, config.host, config.port,
        );
      }

      const syno = new Syno(config);
      await execute(syno, station.prop, method, cmdOpts);
    });
}

async function main(): Promise<void> {
  // Single parseAsync call (fixes double parse bug)
  await program.parseAsync(process.argv);

  // If no subcommand matched, show help
  if (program.args.length === 0) {
    program.help();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
