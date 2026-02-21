import type { RequestOptions, RequestAPIArgs, SynoResponse } from '../types.js';
import { SynoError, resolveBaseError } from './errors.js';

export interface APIHost {
  protocol: string;
  host: string;
  port: number;
  debug: boolean;
  ignoreCertificateErrors: boolean;
  request: (url: string, init: RequestInit) => Promise<Response>;
}

export class API {
  protected syno: APIHost;

  constructor(syno: APIHost) {
    this.syno = syno;
  }

  async request(options: RequestOptions): Promise<unknown> {
    const { protocol, host, port } = this.syno;
    const { api, version, path, method, params } = options;

    const url = `${protocol}://${host}:${port}/webapi/${path}`;
    const qs = new URLSearchParams({ api, version: String(version), method, ...params });

    if (this.syno.debug) {
      console.log(`[DEBUG] : Request URL: ${url}?${qs.toString()}`);
    }

    const response = await this.syno.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: qs,
    });

    if (response.status !== 200) {
      const error = new SynoError(`HTTP status code: ${response.status}`, response.status);
      throw error;
    }

    const contentType = response.headers.get('content-type') || '';

    // #40: Return raw ArrayBuffer for binary responses
    if (!contentType.includes('application/json') && !contentType.includes('text/')) {
      return response.arrayBuffer();
    }

    const body = await response.json() as SynoResponse;

    if (
      !body.success ||
      (body.success && Array.isArray(body.data) && (body.data as Record<string, unknown>[])[0]?.error)
    ) {
      let code: number;
      if (body.error) {
        code = body.error.code;
      } else if (Array.isArray(body.data) && (body.data as Record<string, unknown>[])[0]?.error) {
        code = (body.data as Record<string, unknown>[])[0].error as number;
      } else {
        code = 0;
      }
      const message = this.resolveError(code, api);
      const synoError = new SynoError(message, code, body.error?.errors as unknown[] | undefined);
      throw synoError;
    }

    return body.data;
  }

  async requestAPI(args: RequestAPIArgs): Promise<unknown> {
    const { apiInfos, params: rawParams } = args;

    // Force params to be strings
    const params: Record<string, string> = {};
    if (rawParams) {
      for (const [key, value] of Object.entries(rawParams)) {
        if (value != null) {
          params[key] = String(value);
        }
      }
    }

    // #29: Allow version override in params
    const version = params.version || String(apiInfos.version);
    delete params.version;

    return this.request({
      api: apiInfos.api,
      version,
      path: apiInfos.path,
      method: apiInfos.method,
      params,
      sessionName: apiInfos.sessionName,
    });
  }

  resolveError(code: number, _api?: string): string {
    return resolveBaseError(code);
  }
}
