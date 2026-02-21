import { createRequire } from 'node:module';
import type { SynoConfig, SessionMap, DefinitionsMap } from '../types.js';
import { loadDefinitions, validateApiVersion } from './DefinitionLoader.js';
import { Auth } from './Auth.js';
import { DSM } from '../stations/DSM.js';
import { FileStation } from '../stations/FileStation.js';
import { DownloadStation } from '../stations/DownloadStation.js';
import { AudioStation } from '../stations/AudioStation.js';
import { VideoStation } from '../stations/VideoStation.js';
import { VideoStationDTV } from '../stations/VideoStationDTV.js';
import { SurveillanceStation } from '../stations/SurveillanceStation.js';
import { SynologyPhotos } from '../stations/SynologyPhotos.js';

export class Syno {
  // Config
  readonly account: string;
  readonly passwd: string;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly apiVersion: string;
  readonly debug: boolean;
  readonly ignoreCertificateErrors: boolean;
  readonly otpCode?: string;
  readonly followRedirects: boolean;

  // Internal state
  sessions: SessionMap = {};

  // APIs
  readonly auth: Auth;
  readonly dsm: DSM;
  readonly diskStationManager: DSM;
  readonly fs: FileStation;
  readonly fileStation: FileStation;
  readonly dl: DownloadStation;
  readonly downloadStation: DownloadStation;
  readonly as: AudioStation;
  readonly audioStation: AudioStation;
  readonly vs: VideoStation;
  readonly videoStation: VideoStation;
  readonly dtv: VideoStationDTV;
  readonly videoStationDTV: VideoStationDTV;
  readonly ss: SurveillanceStation;
  readonly surveillanceStation: SurveillanceStation;
  readonly photo: SynologyPhotos;
  readonly synologyPhotos: SynologyPhotos;

  // Dynamic method index signature for station access
  [key: string]: unknown;

  private definitions: DefinitionsMap | null = null;

  constructor(config: SynoConfig) {
    this.account = config.account || process.env.SYNO_ACCOUNT || '';
    this.passwd = config.passwd || process.env.SYNO_PASSWORD || '';
    this.protocol = config.protocol || process.env.SYNO_PROTOCOL || 'http';
    this.host = config.host || process.env.SYNO_HOST || 'localhost';
    this.port = config.port ?? (process.env.SYNO_PORT ? Number(process.env.SYNO_PORT) : 5000);
    this.apiVersion = config.apiVersion || process.env.SYNO_API_VERSION || '7.2';
    this.debug = config.debug ?? !!process.env.SYNO_DEBUG;
    this.ignoreCertificateErrors = config.ignoreCertificateErrors ?? !!process.env.SYNO_IGNORE_CERTIFICATE_ERRORS;
    this.otpCode = config.otpCode;
    this.followRedirects = config.followRedirects !== false;

    if (this.debug) {
      console.log(`[DEBUG] : Account: ${this.account}`);
      console.log(`[DEBUG] : Password: ${this.passwd}`);
      console.log(`[DEBUG] : Host: ${this.host}`);
      console.log(`[DEBUG] : Port: ${this.port}`);
      console.log(`[DEBUG] : API: ${this.apiVersion}`);
      console.log(`[DEBUG] : Ignore certificate errors: ${this.ignoreCertificateErrors}`);
    }

    if (!this.account) throw new Error('Did not specified `account` for syno');
    if (!this.passwd) throw new Error('Did not specified `passwd` for syno');

    validateApiVersion(this.apiVersion);

    // #39: Session reuse — if sid provided, pre-populate sessions
    if (config.sid) {
      this.sessions = {};
    }

    const defs = this.loadDefinitions();
    const host = this.createAPIHost();

    this.auth = new Auth(host as ConstructorParameters<typeof Auth>[0]);
    // Wire auth back into the shared host object so AuthenticatedAPI can auto-login
    host.auth = this.auth;

    // #39: If sid provided, pre-populate sessions for all station session names
    if (config.sid) {
      const sessionNames = [
        'DiskStationManager', 'FileStation', 'DownloadStation',
        'AudioStation', 'VideoStation', 'SurveillanceStation', 'SynologyPhotos',
      ];
      for (const name of sessionNames) {
        this.sessions[name] = { _sid: config.sid };
      }
    }

    this.dsm = this.diskStationManager = new DSM(host as ConstructorParameters<typeof DSM>[0], defs);
    this.fs = this.fileStation = new FileStation(host as ConstructorParameters<typeof FileStation>[0], defs);
    this.dl = this.downloadStation = new DownloadStation(host as ConstructorParameters<typeof DownloadStation>[0], defs);
    this.as = this.audioStation = new AudioStation(host as ConstructorParameters<typeof AudioStation>[0], defs);
    this.vs = this.videoStation = new VideoStation(host as ConstructorParameters<typeof VideoStation>[0], defs);
    this.dtv = this.videoStationDTV = new VideoStationDTV(host as ConstructorParameters<typeof VideoStationDTV>[0], defs);
    this.ss = this.surveillanceStation = new SurveillanceStation(host as ConstructorParameters<typeof SurveillanceStation>[0], defs);
    this.photo = this.synologyPhotos = new SynologyPhotos(host as ConstructorParameters<typeof SynologyPhotos>[0], defs);
  }

  loadDefinitions(): DefinitionsMap {
    if (this.definitions) return this.definitions;
    this.definitions = loadDefinitions(this.apiVersion);
    return this.definitions;
  }

  private createAPIHost() {
    return {
      protocol: this.protocol,
      host: this.host,
      port: this.port,
      debug: this.debug,
      ignoreCertificateErrors: this.ignoreCertificateErrors,
      account: this.account,
      passwd: this.passwd,
      sessions: this.sessions,
      auth: null as unknown as Auth, // Will be set after construction
      otpCode: this.otpCode,
      request: async (url: string, init: RequestInit): Promise<Response> => {
        const fetchOptions: RequestInit = {
          ...init,
          redirect: this.followRedirects ? 'follow' : 'manual',
        };

        // TLS bypass for self-signed certificates
        if (this.ignoreCertificateErrors) {
          // Node.js 24+ supports dispatcher option via undici
          (fetchOptions as Record<string, unknown>).dispatcher = this.getInsecureDispatcher();
        }

        return fetch(url, fetchOptions);
      },
    };
  }

  private insecureDispatcher: unknown = null;

  private getInsecureDispatcher(): unknown {
    if (this.insecureDispatcher) return this.insecureDispatcher;

    // Use undici Agent (bundled with Node 24+) for TLS bypass
    try {
      const req = createRequire(import.meta.url);
      const { Agent } = req('undici');
      this.insecureDispatcher = new Agent({
        connect: { rejectUnauthorized: false },
      });
    } catch {
      // Fallback: set NODE_TLS_REJECT_UNAUTHORIZED
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
    return this.insecureDispatcher;
  }
}
