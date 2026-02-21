import { describe, it, expect } from 'vitest';
import {
  SynoError,
  resolveBaseError,
  resolveAuthError,
  resolveFileStationError,
  resolveDownloadStationError,
  resolveSurveillanceStationError,
} from '../lib/errors.js';

describe('SynoError', () => {
  it('extends Error', () => {
    const err = new SynoError('test error', 100);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('SynoError');
    expect(err.message).toBe('test error');
    expect(err.code).toBe(100);
  });

  it('accepts optional errors array', () => {
    const err = new SynoError('test', 100, [{ detail: 'foo' }]);
    expect(err.errors).toEqual([{ detail: 'foo' }]);
  });
});

describe('resolveBaseError', () => {
  it('resolves known error codes', () => {
    expect(resolveBaseError(101)).toBe('No parameter of API, method or version');
    expect(resolveBaseError(102)).toBe('The requested API does not exist');
    expect(resolveBaseError(103)).toBe('The requested method does not exist');
    expect(resolveBaseError(104)).toBe('The requested version does not support the functionality');
    expect(resolveBaseError(105)).toBe('The logged in session does not have permission');
    expect(resolveBaseError(106)).toBe('Session timeout');
    expect(resolveBaseError(107)).toBe('Session interrupted by duplicate login');
  });

  it('returns unknown error for unrecognized codes', () => {
    expect(resolveBaseError(999)).toBe('Unknown error');
  });
});

describe('resolveAuthError', () => {
  it('resolves auth-specific error codes', () => {
    expect(resolveAuthError(400)).toBe('No such account or incorrect password');
    expect(resolveAuthError(401)).toBe('Account disabled');
    expect(resolveAuthError(402)).toBe('Permission denied');
    expect(resolveAuthError(403)).toBe('2-step verification code required');
    expect(resolveAuthError(404)).toBe('Failed to authenticate 2-step verification code');
  });

  it('falls back to base errors', () => {
    expect(resolveAuthError(101)).toBe('No parameter of API, method or version');
  });
});

describe('resolveFileStationError', () => {
  it('resolves Favorite API errors', () => {
    expect(resolveFileStationError(800, 'SYNO.FileStation.Favorite')).toContain('favorite');
  });

  it('resolves Upload API errors', () => {
    expect(resolveFileStationError(1800, 'SYNO.FileStation.Upload')).toContain('Content-Length');
  });

  it('resolves generic FileStation errors', () => {
    expect(resolveFileStationError(400, 'SYNO.FileStation.Other')).toBe('Invalid parameter of file operation');
    expect(resolveFileStationError(408, 'SYNO.FileStation.Other')).toBe('No such file or directory');
  });

  it('falls back to base errors', () => {
    expect(resolveFileStationError(101, 'SYNO.FileStation.Other')).toBe('No parameter of API, method or version');
  });
});

describe('resolveDownloadStationError', () => {
  it('resolves Task API errors', () => {
    expect(resolveDownloadStationError(400, 'SYNO.DownloadStation.Task')).toBe('File upload failed');
    expect(resolveDownloadStationError(401, 'SYNO.DownloadStation.Task')).toBe('Max number of tasks reached');
  });

  it('resolves BTSearch API errors', () => {
    expect(resolveDownloadStationError(401, 'SYNO.DownloadStation.BTSearch')).toBe('Invalid parameter');
  });

  it('falls back to base errors', () => {
    expect(resolveDownloadStationError(101, 'SYNO.DownloadStation.Other')).toBe('No parameter of API, method or version');
  });
});

describe('resolveSurveillanceStationError', () => {
  it('resolves Camera API errors', () => {
    expect(resolveSurveillanceStationError(400, 'SYNO.SurveillanceStation.Camera')).toBe('Execution failed');
    expect(resolveSurveillanceStationError(402, 'SYNO.SurveillanceStation.Camera')).toBe('Camera disabled');
  });

  it('resolves PTZ API errors', () => {
    expect(resolveSurveillanceStationError(401, 'SYNO.SurveillanceStation.PTZ')).toBe('Parameter invalid');
  });

  // BUG FIX TEST: The CoffeeScript `or` bug made all APIs match Camera/PTZ errors
  it('does NOT match Camera errors for unrelated APIs (or bug fix)', () => {
    expect(resolveSurveillanceStationError(402, 'SYNO.SurveillanceStation.Info')).toBe('Unknown error');
  });

  it('does NOT match Event errors for unrelated APIs (or bug fix)', () => {
    expect(resolveSurveillanceStationError(401, 'SYNO.SurveillanceStation.Device')).toBe('Service is not enabled');
  });

  it('resolves Notification API errors', () => {
    expect(resolveSurveillanceStationError(400, 'SYNO.SurveillanceStation.Notification')).toBe('Execution failed');
  });

  it('falls back to base errors for unknown codes', () => {
    expect(resolveSurveillanceStationError(101, 'SYNO.SurveillanceStation.Camera')).toBe('No parameter of API, method or version');
  });
});
