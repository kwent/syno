import { describe, it, expect } from 'vitest';
import {
  resolveSurveillanceStationError,
} from '../../lib/errors.js';

describe('SurveillanceStation error resolver (or bug fix)', () => {
  it('returns Camera disabled only for Camera API', () => {
    expect(resolveSurveillanceStationError(402, 'SYNO.SurveillanceStation.Camera')).toBe('Camera disabled');
    // This should NOT return "Camera disabled" — the old CoffeeScript code had an `or` bug
    // where `if api is 'SYNO.SurveillanceStation.Camera' or 'SYNO.SurveillanceStation.PTZ'`
    // was always truthy because the string 'SYNO.SurveillanceStation.PTZ' is truthy
    expect(resolveSurveillanceStationError(402, 'SYNO.SurveillanceStation.Info')).not.toBe('Camera disabled');
    expect(resolveSurveillanceStationError(402, 'SYNO.SurveillanceStation.Info')).toBe('Unknown error');
  });

  it('returns Parameter invalid only for Camera or PTZ APIs', () => {
    expect(resolveSurveillanceStationError(401, 'SYNO.SurveillanceStation.Camera')).toBe('Parameter invalid');
    expect(resolveSurveillanceStationError(401, 'SYNO.SurveillanceStation.PTZ')).toBe('Parameter invalid');
  });

  it('returns Event errors only for Event or Emap APIs', () => {
    expect(resolveSurveillanceStationError(400, 'SYNO.SurveillanceStation.Event')).toBe('Execution failed');
    expect(resolveSurveillanceStationError(400, 'SYNO.SurveillanceStation.Emap')).toBe('Execution failed');
    expect(resolveSurveillanceStationError(401, 'SYNO.SurveillanceStation.Event')).toBe('Parameter invalid');
  });

  it('returns Device errors only for Device API', () => {
    expect(resolveSurveillanceStationError(400, 'SYNO.SurveillanceStation.Device')).toBe('Execution failed');
    expect(resolveSurveillanceStationError(401, 'SYNO.SurveillanceStation.Device')).toBe('Service is not enabled');
  });

  it('returns Notification errors only for Notification API', () => {
    expect(resolveSurveillanceStationError(400, 'SYNO.SurveillanceStation.Notification')).toBe('Execution failed');
  });

  it('falls back to base errors for unmatched APIs', () => {
    expect(resolveSurveillanceStationError(101, 'SYNO.SurveillanceStation.Unknown')).toBe(
      'No parameter of API, method or version',
    );
    expect(resolveSurveillanceStationError(999, 'SYNO.SurveillanceStation.Unknown')).toBe('Unknown error');
  });
});
