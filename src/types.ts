export interface SynoConfig {
  account: string;
  passwd: string;
  protocol?: string;
  host?: string;
  port?: number;
  apiVersion?: string;
  debug?: boolean;
  ignoreCertificateErrors?: boolean;
  otpCode?: string;
  sid?: string;
  followRedirects?: boolean;
}

export interface RequestOptions {
  api: string;
  version: string | number;
  path: string;
  method: string;
  params?: Record<string, string>;
  sessionName?: string;
}

export interface ApiInfos {
  api: string;
  version: string | number;
  path: string;
  method: string;
  sessionName: string;
}

export interface RequestAPIArgs {
  apiInfos: ApiInfos;
  params?: Record<string, unknown>;
  requiredParams?: string[];
}

export interface SynoResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    errors?: unknown[];
  };
}

export interface SessionEntry {
  _sid: string | null;
}

export type SessionMap = Record<string, SessionEntry>;

export type MethodEntry = string | Record<string, unknown>;

export interface ApiDefinition {
  path?: string;
  minVersion: number;
  maxVersion: number;
  methods: Record<string, MethodEntry[]>;
}

export type DefinitionsMap = Record<string, ApiDefinition>;

export interface MethodInfo {
  api: string;
  version: string | number;
  path: string;
  method: string;
  sessionName: string;
}
