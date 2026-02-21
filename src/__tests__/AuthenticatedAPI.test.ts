import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthenticatedAPI } from '../lib/AuthenticatedAPI.js';
import type { AuthenticatedAPIHost } from '../lib/AuthenticatedAPI.js';
import { Auth } from '../lib/Auth.js';

function createMockAuthenticatedHost(): AuthenticatedAPIHost {
  const mockRequest = vi.fn().mockResolvedValue({
    status: 200,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => ({ success: true, data: { result: 'ok' } }),
    arrayBuffer: async () => new ArrayBuffer(0),
  });

  const host: AuthenticatedAPIHost = {
    protocol: 'http',
    host: 'localhost',
    port: 5000,
    debug: false,
    ignoreCertificateErrors: false,
    sessions: {},
    auth: null as unknown as Auth,
    request: mockRequest,
  };

  // Create a mock auth with login
  host.auth = {
    login: vi.fn().mockResolvedValue({ sid: 'new-session-sid' }),
    logout: vi.fn().mockResolvedValue(undefined),
  } as unknown as Auth;

  return host;
}

describe('AuthenticatedAPI', () => {
  let mockHost: AuthenticatedAPIHost;
  let api: AuthenticatedAPI;

  beforeEach(() => {
    mockHost = createMockAuthenticatedHost();
    api = new AuthenticatedAPI(mockHost);
    api.sessionName = 'TestSession';
  });

  it('auto-logins if no session SID exists', async () => {
    await api.request({
      api: 'SYNO.Test',
      version: 1,
      path: 'test.cgi',
      method: 'test',
    });

    expect(mockHost.auth.login).toHaveBeenCalledWith('TestSession');
  });

  it('stores SID as object with _sid property (SID bug fix)', async () => {
    await api.request({
      api: 'SYNO.Test',
      version: 1,
      path: 'test.cgi',
      method: 'test',
    });

    // Verify SID is stored as object, not raw string
    expect(mockHost.sessions.TestSession).toEqual({ _sid: 'new-session-sid' });
    expect(typeof mockHost.sessions.TestSession).toBe('object');
    expect(typeof mockHost.sessions.TestSession._sid).toBe('string');
  });

  it('reuses existing SID without re-login', async () => {
    mockHost.sessions.TestSession = { _sid: 'existing-sid' };

    await api.request({
      api: 'SYNO.Test',
      version: 1,
      path: 'test.cgi',
      method: 'test',
    });

    expect(mockHost.auth.login).not.toHaveBeenCalled();

    const [, init] = (mockHost.request as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = init.body as URLSearchParams;
    expect(body.get('_sid')).toBe('existing-sid');
  });

  it('passes SID in request params after login', async () => {
    await api.request({
      api: 'SYNO.Test',
      version: 1,
      path: 'test.cgi',
      method: 'test',
    });

    const [, init] = (mockHost.request as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = init.body as URLSearchParams;
    expect(body.get('_sid')).toBe('new-session-sid');
  });
});
