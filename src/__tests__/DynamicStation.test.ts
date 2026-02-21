import { describe, it, expect } from 'vitest';
import { buildMethodMap } from '../lib/DynamicStation.js';
import type { DefinitionsMap } from '../types.js';

const mockDefinitions: DefinitionsMap = {
  'SYNO.FileStation.Info': {
    path: 'FileStation/info.cgi',
    minVersion: 1,
    maxVersion: 2,
    methods: {
      '1': ['getinfo'],
      '2': ['getinfo', 'get'],
    },
  },
  'SYNO.FileStation.List': {
    path: 'FileStation/file_share.cgi',
    minVersion: 1,
    maxVersion: 2,
    methods: {
      '1': ['list', 'list_share'],
      '2': ['list', 'list_share', 'getinfo'],
    },
  },
  'SYNO.Other.API': {
    path: 'other.cgi',
    minVersion: 1,
    maxVersion: 1,
    methods: {
      '1': ['test'],
    },
  },
};

describe('buildMethodMap', () => {
  it('builds method map for matching API prefixes', () => {
    const map = buildMethodMap(mockDefinitions, ['SYNO.FileStation'], 'FileStation');
    expect(map.size).toBeGreaterThan(0);
  });

  it('does not include non-matching APIs', () => {
    const map = buildMethodMap(mockDefinitions, ['SYNO.FileStation'], 'FileStation');
    const keys = Array.from(map.keys());
    expect(keys.every((k) => !k.toLowerCase().includes('other'))).toBe(true);
  });

  it('creates correct method info', () => {
    const map = buildMethodMap(mockDefinitions, ['SYNO.FileStation'], 'FileStation');
    // Check that at least one method is generated
    expect(map.size).toBeGreaterThan(0);

    // All entries should have the correct session name
    for (const [, info] of map) {
      expect(info.sessionName).toBe('FileStation');
      expect(info.api).toMatch(/^SYNO\.FileStation/);
    }
  });

  it('uses maxVersion from definition', () => {
    const map = buildMethodMap(mockDefinitions, ['SYNO.FileStation'], 'FileStation');

    for (const [, info] of map) {
      if (info.api === 'SYNO.FileStation.Info') {
        expect(info.version).toBe('2');
      }
    }
  });

  it('returns empty map for no matches', () => {
    const map = buildMethodMap(mockDefinitions, ['SYNO.NonExistent'], 'Test');
    expect(map.size).toBe(0);
  });

  it('getMethods returns all method names', () => {
    const map = buildMethodMap(mockDefinitions, ['SYNO.FileStation'], 'FileStation');
    const methods = Array.from(map.keys());
    expect(methods.length).toBeGreaterThan(0);
    expect(methods.every((m) => typeof m === 'string')).toBe(true);
  });
});
