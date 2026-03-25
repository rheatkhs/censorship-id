import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['index.js'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: true,
    target: 'es2020',
    outDir: 'dist',
});
