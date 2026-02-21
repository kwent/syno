import { describe, it, expect } from 'vitest';
import {
  underscoreToCamelize,
  trimSyno,
  trimSynoNamespace,
  fixCamelCase,
  deletePattern,
  listPluralize,
  createFunctionName,
} from '../lib/utils.js';

describe('underscoreToCamelize', () => {
  it('converts underscore to camelCase', () => {
    expect(underscoreToCamelize('get_something')).toBe('getSomething');
    expect(underscoreToCamelize('hello_world_test')).toBe('helloWorldTest');
  });

  it('handles strings without underscores', () => {
    expect(underscoreToCamelize('simple')).toBe('simple');
  });
});

describe('trimSyno', () => {
  it('removes SYNO. prefix and dots', () => {
    expect(trimSyno('SYNO.Backup.Storage.AmazonCloudDrive')).toBe('BackupStorageAmazonCloudDrive');
  });

  it('handles simple SYNO names', () => {
    expect(trimSyno('SYNO.FileStation')).toBe('FileStation');
  });
});

describe('trimSynoNamespace', () => {
  it('extracts namespace from SYNO API name', () => {
    expect(trimSynoNamespace('SYNO.Backup.Storage.AmazonCloudDrive')).toBe('Backup');
    expect(trimSynoNamespace('SYNO.FileStation.Info')).toBe('FileStation');
  });
});

describe('fixCamelCase', () => {
  it('fixes camelCase for known words', () => {
    expect(fixCamelCase('getinfo')).toBe('GetInfo');
  });

  it('handles multiple known words', () => {
    const result = fixCamelCase('listcameras');
    expect(result).toContain('List');
  });
});

describe('deletePattern', () => {
  it('removes pattern from string', () => {
    expect(deletePattern('listFileStationSnapshot', 'FileStation')).toBe('listSnapshot');
  });

  it('is case insensitive', () => {
    expect(deletePattern('listfilestation', 'FileStation')).toBe('list');
  });
});

describe('listPluralize', () => {
  it('pluralizes when method starts with list', () => {
    expect(listPluralize('list', 'Search')).toBe('Searches');
    expect(listPluralize('listAll', 'Camera')).toBe('Cameras');
  });

  it('does not pluralize when already ends with s', () => {
    expect(listPluralize('list', 'Items')).toBe('Items');
  });

  it('does not pluralize non-list methods', () => {
    expect(listPluralize('get', 'Camera')).toBe('Camera');
  });
});

describe('createFunctionName', () => {
  it('creates function name from API name and method', () => {
    const name = createFunctionName('SYNO.FileStation.Info', 'getinfo');
    expect(name).toBe('getInfo');
  });

  it('creates function name for VideoStation.Movie.list', () => {
    const name = createFunctionName('SYNO.VideoStation.Movie', 'list');
    expect(name).toBe('listMovies');
  });

  it('creates function name for complex API', () => {
    const name = createFunctionName('SYNO.DownloadStation.Task', 'create');
    expect(name).toBe('createTask');
  });

  it('handles DSM Core APIs', () => {
    const name = createFunctionName('SYNO.Core.System', 'shutdown');
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });
});
