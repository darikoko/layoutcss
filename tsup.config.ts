import { defineConfig } from 'tsup'

export default defineConfig(
    [
        {
            entry: ['src/index.ts'], // CLI
            format: ['esm'],
            outDir: 'dist',
            dts: false,
            clean: true,
            loader: {
                '.css': 'text',
            },
        },
        {
            entry: ['src/generator.ts'], // For browsers
            format: ['esm'],
            outDir: 'dist',
            dts: true,
            clean: false,
            loader: {
                '.css': 'text',
            },
        }
    ]
)
