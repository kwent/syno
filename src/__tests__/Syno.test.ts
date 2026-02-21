import { describe, it, expect } from 'vitest';
import { Syno } from '../lib/Syno.js';

describe('Syno', () => {
  const validConfig = {
    account: 'admin',
    passwd: 'password',
    protocol: 'http',
    host: 'localhost',
    port: 5000,
    apiVersion: '6.2.2',
  };

  describe('constructor', () => {
    it('creates instance with valid config', () => {
      const syno = new Syno(validConfig);
      expect(syno.account).toBe('admin');
      expect(syno.passwd).toBe('password');
      expect(syno.protocol).toBe('http');
      expect(syno.host).toBe('localhost');
      expect(syno.port).toBe(5000);
      expect(syno.apiVersion).toBe('6.2.2');
    });

    it('throws if account is missing', () => {
      expect(() => new Syno({ account: '', passwd: 'pass' })).toThrow('account');
    });

    it('throws if passwd is missing', () => {
      expect(() => new Syno({ account: 'admin', passwd: '' })).toThrow('passwd');
    });

    it('throws for invalid API version', () => {
      expect(() => new Syno({ ...validConfig, apiVersion: '99.0' })).toThrow('not available');
    });

    it('has all station properties', () => {
      const syno = new Syno(validConfig);
      expect(syno.auth).toBeDefined();
      expect(syno.dsm).toBeDefined();
      expect(syno.diskStationManager).toBeDefined();
      expect(syno.fs).toBeDefined();
      expect(syno.fileStation).toBeDefined();
      expect(syno.dl).toBeDefined();
      expect(syno.downloadStation).toBeDefined();
      expect(syno.as).toBeDefined();
      expect(syno.audioStation).toBeDefined();
      expect(syno.vs).toBeDefined();
      expect(syno.videoStation).toBeDefined();
      expect(syno.dtv).toBeDefined();
      expect(syno.videoStationDTV).toBeDefined();
      expect(syno.ss).toBeDefined();
      expect(syno.surveillanceStation).toBeDefined();
      expect(syno.photo).toBeDefined();
      expect(syno.synologyPhotos).toBeDefined();
    });

    it('short alias points to same instance as long name', () => {
      const syno = new Syno(validConfig);
      expect(syno.dsm).toBe(syno.diskStationManager);
      expect(syno.fs).toBe(syno.fileStation);
      expect(syno.dl).toBe(syno.downloadStation);
      expect(syno.as).toBe(syno.audioStation);
      expect(syno.vs).toBe(syno.videoStation);
      expect(syno.dtv).toBe(syno.videoStationDTV);
      expect(syno.ss).toBe(syno.surveillanceStation);
      expect(syno.photo).toBe(syno.synologyPhotos);
    });
  });

  describe('session reuse (#39)', () => {
    it('pre-populates sessions when sid is provided', () => {
      const syno = new Syno({ ...validConfig, sid: 'existing-sid-123' });
      expect(syno.sessions.FileStation?._sid).toBe('existing-sid-123');
      expect(syno.sessions.AudioStation?._sid).toBe('existing-sid-123');
      expect(syno.sessions.DiskStationManager?._sid).toBe('existing-sid-123');
    });
  });

  describe('defaults', () => {
    it('uses default values', () => {
      const syno = new Syno({ account: 'admin', passwd: 'pass', apiVersion: '6.0' });
      expect(syno.protocol).toBe('http');
      expect(syno.host).toBe('localhost');
      expect(syno.port).toBe(5000);
      expect(syno.debug).toBe(false);
    });
  });

  describe('loadDefinitions', () => {
    it('loads definitions for configured version', () => {
      const syno = new Syno(validConfig);
      const defs = syno.loadDefinitions();
      expect(defs).toBeDefined();
      expect(Object.keys(defs).length).toBeGreaterThan(0);
    });
  });
});
