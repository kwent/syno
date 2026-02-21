import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Auth } from '../lib/Auth.js';
import type { AuthHost } from '../lib/Auth.js';

function createMockAuthHost(): AuthHost {
  return {
    protocol: 'http',
    host: 'localhost',
    port: 5000,
    debug: false,
    ignoreCertificateErrors: false,
    account: 'admin',
    passwd: 'password',
    sessions: {},
    request: vi.fn().mockResolvedValue({
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, data: { sid: 'test-sid-123' } }),
      arrayBuffer: async () => new ArrayBuffer(0),
    }),
  };
}

describe('Auth', () => {
  let mockHost: AuthHost;
  let auth: Auth;

  beforeEach(() => {
    mockHost = createMockAuthHost();
    auth = new Auth(mockHost);
  });

  describe('login', () => {
    it('sends login request with credentials', async () => {
      const result = await auth.login('FileStation');

      expect(result).toEqual({ sid: 'test-sid-123' });
      expect(mockHost.request).toHaveBeenCalledOnce();

      const [url, init] = (mockHost.request as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toContain('auth.cgi');
      const body = init.body as URLSearchParams;
      expect(body.get('account')).toBe('admin');
      expect(body.get('passwd')).toBe('password');
      expect(body.get('session')).toBe('FileStation');
      expect(body.get('format')).toBe('sid');
    });

    it('initializes session entry before login', async () => {
      await auth.login('FileStation');
      // Session is initialized but _sid set to null before the request
      expect(mockHost.sessions).toHaveProperty('FileStation');
    });

    it('sends otp_code when configured (#42)', async () => {
      mockHost.otpCode = '123456';
      auth = new Auth(mockHost);

      await auth.login('FileStation');

      const [, init] = (mockHost.request as ReturnType<typeof vi.fn>).mock.calls[0];
      const body = init.body as URLSearchParams;
      expect(body.get('otp_code')).toBe('123456');
    });
  });

  describe('logout', () => {
    it('clears specific session', async () => {
      mockHost.sessions = { FileStation: { _sid: 'test' } };
      mockHost.request = vi.fn().mockResolvedValue({
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: {} }),
        arrayBuffer: async () => new ArrayBuffer(0),
      });

      await auth.logout('FileStation');
      expect(mockHost.sessions.FileStation).toBeUndefined();
    });

    it('clears all sessions when no sessionName', async () => {
      mockHost.sessions = {
        FileStation: { _sid: 'test1' },
        AudioStation: { _sid: 'test2' },
      };
      mockHost.request = vi.fn().mockResolvedValue({
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: {} }),
        arrayBuffer: async () => new ArrayBuffer(0),
      });

      await auth.logout();
      expect(Object.keys(mockHost.sessions)).toHaveLength(0);
    });
  });

  describe('resolveError', () => {
    it('resolves auth-specific errors', () => {
      expect(auth.resolveError(400)).toBe('No such account or incorrect password');
      expect(auth.resolveError(403)).toBe('2-step verification code required');
    });
  });
});
