import { describe, it, expect, afterEach } from 'vitest';
import {
  validateApiVersion,
  loadDefinitions,
  clearDefinitionsCache,
  getMethodsForApi,
} from '../lib/DefinitionLoader.js';

afterEach(() => {
  clearDefinitionsCache();
});

describe('validateApiVersion', () => {
  it('accepts valid versions', () => {
    expect(() => validateApiVersion('6.0')).not.toThrow();
    expect(() => validateApiVersion('6.0.2')).not.toThrow();
    expect(() => validateApiVersion('6.2.2')).not.toThrow();
    expect(() => validateApiVersion('7.2')).not.toThrow();
  });

  it('rejects invalid versions', () => {
    expect(() => validateApiVersion('4.0')).toThrow('not available');
    expect(() => validateApiVersion('5.0')).toThrow('not available');
    expect(() => validateApiVersion('8.0')).toThrow('not available');
    expect(() => validateApiVersion('invalid')).toThrow('not available');
  });
});

describe('loadDefinitions', () => {
  it('loads 6.x definitions', () => {
    const defs = loadDefinitions('6.0');
    expect(defs).toBeDefined();
    expect(Object.keys(defs).some((k) => k.startsWith('SYNO.'))).toBe(true);
  });

  it('caches definitions', () => {
    const defs1 = loadDefinitions('6.0');
    const defs2 = loadDefinitions('6.0');
    expect(defs1).toBe(defs2); // Same reference
  });
});

describe('getMethodsForApi', () => {
  it('handles string method format', () => {
    const methods = getMethodsForApi({
      minVersion: 1,
      maxVersion: 1,
      methods: {
        '1': ['getinfo', 'list'],
      },
    });
    expect(methods).toEqual(['getinfo', 'list']);
  });

  it('handles object method format', () => {
    const methods = getMethodsForApi({
      minVersion: 1,
      maxVersion: 2,
      methods: {
        '1': ['getinfo'],
        '2': [{ list: { grantable: true } }, { create: { grantable: true } }],
      },
    });
    expect(methods).toContain('list');
    expect(methods).toContain('create');
  });

  it('uses last version methods', () => {
    const methods = getMethodsForApi({
      minVersion: 1,
      maxVersion: 3,
      methods: {
        '1': ['old_method'],
        '2': ['old_method', 'newer_method'],
        '3': ['old_method', 'newer_method', 'newest_method'],
      },
    });
    expect(methods).toContain('newest_method');
  });
});
