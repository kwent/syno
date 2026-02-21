import type { RequestOptions, SessionMap } from '../types.js';
import type { APIHost } from './API.js';
import { API } from './API.js';
import type { Auth } from './Auth.js';

export interface AuthenticatedAPIHost extends APIHost {
  sessions: SessionMap;
  auth: Auth;
}

export class AuthenticatedAPI extends API {
  protected override syno: AuthenticatedAPIHost;
  sessionName = '';

  constructor(syno: AuthenticatedAPIHost) {
    super(syno);
    this.syno = syno;
  }

  override async request(options: RequestOptions): Promise<unknown> {
    const sessionName = options.sessionName || this.sessionName;

    // Check if we already have a session SID
    if (
      this.syno.sessions &&
      this.syno.sessions[sessionName] &&
      this.syno.sessions[sessionName]._sid
    ) {
      if (!options.params) options.params = {};
      options.params._sid = this.syno.sessions[sessionName]._sid!;
      return super.request(options);
    }

    // Auto-login if no session
    const response = await this.syno.auth.login(sessionName);

    // Fixed SID bug: store as object with _sid property, not raw string
    this.syno.sessions[sessionName] = { _sid: response.sid };

    if (!options.params) options.params = {};
    options.params._sid = response.sid;

    return super.request(options);
  }
}
