import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/generator.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  outDir: 'dist',
})
