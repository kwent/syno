import { describe, it, expect } from 'vitest';
import { parseUrl, resolveConfig } from '../../cli/config.js';

describe('parseUrl', () => {
  it('parses full URL', () => {
    const result = parseUrl('https://user:pass@nas.local:5001');
    expect(result.protocol).toBe('https');
    expect(result.hostname).toBe('nas.local');
    expect(result.port).toBe(5001);
    expect(result.account).toBe('user');
    expect(result.passwd).toBe('pass');
  });

  it('adds default protocol if missing', () => {
    const result = parseUrl('user:pass@nas.local:5001');
    expect(result.protocol).toBe('https');
    expect(result.hostname).toBe('nas.local');
  });

  it('uses defaults for missing parts', () => {
    const result = parseUrl('https://nas.local');
    expect(result.account).toBe('admin');
    expect(result.passwd).toBe('password');
    expect(result.port).toBe(5001);
  });

  it('throws on invalid protocol', () => {
    expect(() => parseUrl('ftp://nas.local')).toThrow('Invalid Protocol');
  });
});

describe('resolveConfig', () => {
  it('resolves config from URL option', () => {
    const config = resolveConfig({ url: 'https://admin:secret@mynas:5001' });
    expect(config.protocol).toBe('https');
    expect(config.host).toBe('mynas');
    expect(config.port).toBe(5001);
    expect(config.account).toBe('admin');
    expect(config.passwd).toBe('secret');
  });

  it('throws on invalid config file path', () => {
    expect(() => resolveConfig({ config: '/nonexistent/path/config.yaml' })).toThrow('not found');
  });

  it('applies API version from options', () => {
    const config = resolveConfig({ url: 'https://admin:pass@nas:5001', api: '6.0' });
    expect(config.apiVersion).toBe('6.0');
  });

  it('applies debug flag', () => {
    const config = resolveConfig({ url: 'https://admin:pass@nas:5001', debug: true });
    expect(config.debug).toBe(true);
  });

  it('applies ignore certificate errors flag', () => {
    const config = resolveConfig({
      url: 'https://admin:pass@nas:5001',
      ignoreCertificateErrors: true,
    });
    expect(config.ignoreCertificateErrors).toBe(true);
  });
});
