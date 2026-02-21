import type { DefinitionsMap, MethodInfo } from '../types.js';
import type { AuthenticatedAPIHost } from '../lib/AuthenticatedAPI.js';
import { AuthenticatedAPI } from '../lib/AuthenticatedAPI.js';
import { buildMethodMap, createProxiedStation } from '../lib/DynamicStation.js';
import { resolveDownloadStationError } from '../lib/errors.js';

const API_PREFIXES = ['SYNO.DownloadStation'];
const SESSION_NAME = 'DownloadStation';

export class DownloadStation extends AuthenticatedAPI {
  private methodMap: Map<string, MethodInfo>;

  constructor(syno: AuthenticatedAPIHost, definitions: DefinitionsMap) {
    super(syno);
    this.sessionName = SESSION_NAME;
    this.methodMap = buildMethodMap(definitions, API_PREFIXES, SESSION_NAME);
    return createProxiedStation(this, this.methodMap);
  }

  getMethods(): string[] {
    return Array.from(this.methodMap.keys());
  }

  async call(methodName: string, params?: Record<string, unknown>): Promise<unknown> {
    const info = this.methodMap.get(methodName);
    if (!info) throw new Error(`Method ${methodName} not found`);
    return this.requestAPI({ apiInfos: info, params });
  }

  override resolveError(code: number, api?: string): string {
    return resolveDownloadStationError(code, api || '');
  }
}
