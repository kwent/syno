import type { SessionMap } from '../types.js';
import type { APIHost } from './API.js';
import { API } from './API.js';
import { resolveAuthError } from './errors.js';

const AUTH_API = 'SYNO.API.Auth';
const AUTH_VERSION = 3;
const AUTH_PATH = 'auth.cgi';

export interface AuthHost extends APIHost {
  account: string;
  passwd: string;
  sessions: SessionMap;
  otpCode?: string;
}

export class Auth extends API {
  protected override syno: AuthHost;

  constructor(syno: AuthHost) {
    super(syno);
    this.syno = syno;
  }

  async login(sessionName: string): Promise<{ sid: string }> {
    if (!this.syno.sessions) {
      this.syno.sessions = {};
    }
    if (!this.syno.sessions[sessionName]) {
      this.syno.sessions[sessionName] = { _sid: null };
    }
    this.syno.sessions[sessionName]._sid = null;

    const params: Record<string, string> = {
      account: this.syno.account,
      passwd: this.syno.passwd,
      session: sessionName,
      format: 'sid',
    };

    // #42: Two-factor authentication OTP support
    if (this.syno.otpCode) {
      params.otp_code = this.syno.otpCode;
    }

    const data = await this.request({
      api: AUTH_API,
      version: AUTH_VERSION,
      path: AUTH_PATH,
      method: 'login',
      params,
    }) as { sid: string };

    // Store SID so direct auth.login() callers don't need to do it manually
    this.syno.sessions[sessionName] = { _sid: data.sid };

    return data;
  }

  async logout(sessionName?: string): Promise<void> {
    if (!this.syno.sessions) return;

    const params: Record<string, string> = {};
    if (sessionName) {
      params.session = sessionName;
    }

    await this.request({
      api: AUTH_API,
      version: AUTH_VERSION,
      path: AUTH_PATH,
      method: 'logout',
      params,
    });

    // Clear sessions after the API call succeeds
    if (sessionName) {
      delete this.syno.sessions[sessionName];
    } else {
      // Clear all entries in-place to preserve shared object reference
      for (const key of Object.keys(this.syno.sessions)) {
        delete this.syno.sessions[key];
      }
    }
  }

  override resolveError(code: number, _api?: string): string {
    return resolveAuthError(code);
  }
}
