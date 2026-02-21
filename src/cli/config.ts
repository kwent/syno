import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import yaml from 'js-yaml';
import type { SynoConfig } from '../types.js';

const CONFIG_DIR = '.syno';
const CONFIG_FILE = 'config.yaml';
const DEFAULT_PROTOCOL = 'https';
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 5001;
const DEFAULT_ACCOUNT = 'admin';
const DEFAULT_PASSWD = 'password';
const DEFAULT_API_VERSION = '7.2';

interface ParsedUrl {
  protocol: string;
  hostname: string;
  port: number;
  account: string;
  passwd: string;
}

export function parseUrl(rawUrl: string): ParsedUrl {
  let urlStr = rawUrl;
  if (!urlStr.includes('://')) {
    urlStr = `${DEFAULT_PROTOCOL}://${urlStr}`;
  }

  const parsed = new URL(urlStr);

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Invalid Protocol URL detected: ${parsed.protocol.slice(0, -1)}`);
  }

  return {
    protocol: parsed.protocol.slice(0, -1),
    hostname: parsed.hostname || DEFAULT_HOST,
    port: parsed.port ? Number(parsed.port) : DEFAULT_PORT,
    account: parsed.username || DEFAULT_ACCOUNT,
    passwd: parsed.password || DEFAULT_PASSWD,
  };
}

export function loadConfigFile(configPath: string): Record<string, unknown> {
  const content = fs.readFileSync(configPath, 'utf8');
  return (yaml.load(content) as Record<string, unknown>) || {};
}

export function ensureDefaultConfig(): string {
  const configDir = path.join(os.homedir(), CONFIG_DIR);
  const configPath = path.join(configDir, CONFIG_FILE);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!fs.existsSync(configPath)) {
    const defaultConfig = {
      url: {
        protocol: DEFAULT_PROTOCOL,
        host: DEFAULT_HOST,
        port: DEFAULT_PORT,
        account: DEFAULT_ACCOUNT,
        passwd: DEFAULT_PASSWD,
        apiVersion: DEFAULT_API_VERSION,
      },
    };
    fs.writeFileSync(configPath, yaml.dump(defaultConfig), 'utf8');
  }

  return configPath;
}

interface CLIOptions {
  url?: string;
  config?: string;
  debug?: boolean;
  api?: string;
  ignoreCertificateErrors?: boolean;
}

export function resolveConfig(opts: CLIOptions): SynoConfig {
  let protocol = DEFAULT_PROTOCOL;
  let host = DEFAULT_HOST;
  let port: number = DEFAULT_PORT;
  let account = DEFAULT_ACCOUNT;
  let passwd = DEFAULT_PASSWD;
  let apiVersion = DEFAULT_API_VERSION;

  if (opts.url) {
    const parsed = parseUrl(opts.url);
    protocol = parsed.protocol;
    host = parsed.hostname;
    port = parsed.port;
    account = parsed.account;
    passwd = parsed.passwd;
  } else if (opts.config) {
    if (!fs.existsSync(opts.config)) {
      throw new Error(`Config file: ${opts.config} not found`);
    }
    const fileConfig = loadConfigFile(opts.config);
    const urlConfig = (fileConfig.url || fileConfig) as Record<string, unknown>;
    protocol = (urlConfig.protocol as string) || DEFAULT_PROTOCOL;
    host = (urlConfig.host as string) || DEFAULT_HOST;
    port = Number(urlConfig.port) || DEFAULT_PORT;
    account = (urlConfig.account as string) || DEFAULT_ACCOUNT;
    passwd = (urlConfig.passwd as string) || DEFAULT_PASSWD;
    apiVersion = (urlConfig.apiVersion as string) || DEFAULT_API_VERSION;
  } else {
    const configPath = ensureDefaultConfig();
    try {
      const fileConfig = loadConfigFile(configPath);
      const urlConfig = (fileConfig.url || fileConfig) as Record<string, unknown>;
      protocol = (urlConfig.protocol as string) || DEFAULT_PROTOCOL;
      host = (urlConfig.host as string) || DEFAULT_HOST;
      port = Number(urlConfig.port) || DEFAULT_PORT;
      account = (urlConfig.account as string) || DEFAULT_ACCOUNT;
      passwd = (urlConfig.passwd as string) || DEFAULT_PASSWD;
      apiVersion = (urlConfig.apiVersion as string) || DEFAULT_API_VERSION;
    } catch {
      // Use defaults
    }
  }

  // Override with env vars
  protocol = process.env.SYNO_PROTOCOL || protocol;
  host = process.env.SYNO_HOST || host;
  port = Number(process.env.SYNO_PORT) || port;
  account = process.env.SYNO_ACCOUNT || account;
  passwd = process.env.SYNO_PASSWORD || passwd;
  apiVersion = opts.api || process.env.SYNO_API_VERSION || apiVersion;

  return {
    protocol,
    host,
    port,
    account,
    passwd,
    apiVersion,
    debug: opts.debug || !!process.env.SYNO_DEBUG,
    ignoreCertificateErrors: opts.ignoreCertificateErrors || !!process.env.SYNO_IGNORE_CERTIFICATE_ERRORS,
  };
}
