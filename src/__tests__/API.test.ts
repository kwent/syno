import { describe, it, expect, vi, beforeEach } from 'vitest';
import { API } from '../lib/API.js';
import { SynoError } from '../lib/errors.js';

function createMockHost(fetchResponse?: Partial<Response>) {
  const defaultResponse = {
    status: 200,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => ({ success: true, data: { test: 'value' } }),
    arrayBuffer: async () => new ArrayBuffer(0),
    ...fetchResponse,
  };

  return {
    protocol: 'http',
    host: 'localhost',
    port: 5000,
    debug: false,
    ignoreCertificateErrors: false,
    request: vi.fn().mockResolvedValue(defaultResponse),
  };
}

describe('API', () => {
  let mockHost: ReturnType<typeof createMockHost>;
  let api: API;

  beforeEach(() => {
    mockHost = createMockHost();
    api = new API(mockHost);
  });

  describe('request', () => {
    it('constructs correct URL and params', async () => {
      await api.request({
        api: 'SYNO.API.Info',
        version: 1,
        path: 'query.cgi',
        method: 'query',
        params: { query: 'all' },
      });

      expect(mockHost.request).toHaveBeenCalledOnce();
      const [url, init] = mockHost.request.mock.calls[0];
      expect(url).toBe('http://localhost:5000/webapi/query.cgi');
      expect(init.method).toBe('POST');

      const body = init.body as URLSearchParams;
      expect(body.get('api')).toBe('SYNO.API.Info');
      expect(body.get('version')).toBe('1');
      expect(body.get('method')).toBe('query');
      expect(body.get('query')).toBe('all');
    });

    it('returns data on success', async () => {
      const result = await api.request({
        api: 'SYNO.Test',
        version: 1,
        path: 'test.cgi',
        method: 'test',
      });

      expect(result).toEqual({ test: 'value' });
    });

    it('throws SynoError on non-200 status', async () => {
      mockHost = createMockHost({ status: 500 });
      api = new API(mockHost);

      await expect(
        api.request({ api: 'SYNO.Test', version: 1, path: 'test.cgi', method: 'test' }),
      ).rejects.toThrow(SynoError);
    });

    it('throws SynoError on API error response', async () => {
      mockHost = createMockHost({
        json: async () => ({ success: false, error: { code: 102 } }),
      });
      api = new API(mockHost);

      await expect(
        api.request({ api: 'SYNO.Test', version: 1, path: 'test.cgi', method: 'test' }),
      ).rejects.toThrow('The requested API does not exist');
    });

    it('returns ArrayBuffer for binary content types', async () => {
      const buffer = new ArrayBuffer(8);
      mockHost = createMockHost({
        headers: new Headers({ 'content-type': 'image/jpeg' }),
        arrayBuffer: async () => buffer,
      });
      api = new API(mockHost);

      const result = await api.request({
        api: 'SYNO.Test',
        version: 1,
        path: 'test.cgi',
        method: 'test',
      });

      expect(result).toBeInstanceOf(ArrayBuffer);
    });
  });

  describe('requestAPI', () => {
    it('converts params to strings', async () => {
      await api.requestAPI({
        apiInfos: {
          api: 'SYNO.Test',
          version: 1,
          path: 'test.cgi',
          method: 'test',
          sessionName: 'Test',
        },
        params: { limit: 5, offset: 0 },
      });

      const [, init] = mockHost.request.mock.calls[0];
      const body = init.body as URLSearchParams;
      expect(body.get('limit')).toBe('5');
      expect(body.get('offset')).toBe('0');
    });

    it('allows version override in params (#29)', async () => {
      await api.requestAPI({
        apiInfos: {
          api: 'SYNO.Test',
          version: 3,
          path: 'test.cgi',
          method: 'test',
          sessionName: 'Test',
        },
        params: { version: 1 },
      });

      const [, init] = mockHost.request.mock.calls[0];
      const body = init.body as URLSearchParams;
      expect(body.get('version')).toBe('1');
    });
  });
});
