import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    outDir: 'dist',
    checks: { legacyCjs: false },
  },
  {
    entry: { cli: 'src/cli/index.ts' },
    format: ['cjs'],
    outDir: 'dist',
    banner: { js: '#!/usr/bin/env node' },
    checks: { legacyCjs: false },
  },
]);
