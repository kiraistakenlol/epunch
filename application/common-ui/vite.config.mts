import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(), // For JSX transformation
    dts({  // To generate .d.ts files
      insertTypesEntry: true, // Inserts a .d.ts entry into package.json's exports field
      // Optional: specify tsconfig file if not tsconfig.json
      // tsConfigFilePath: './tsconfig.json',
    }),
    // Custom plugin to copy CSS files
    {
      name: 'copy-css',
      generateBundle() {
        // Copy CSS files to dist during build
        const srcPath = path.resolve(__dirname, 'src/styles/mobile-base.css');
        const distPath = path.resolve(__dirname, 'dist/styles');
        
        if (!fs.existsSync(distPath)) {
          fs.mkdirSync(distPath, { recursive: true });
        }
        
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, path.join(distPath, 'mobile-base.css'));
        }
      }
    }
  ],
  build: {
    sourcemap: true, // Optional: generate sourcemaps for easier debugging
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'), // Entry point of your library
      name: 'EPunchCommon', // Global variable name if used in UMD builds (optional)
      formats: ['es', 'cjs'], // Output formats: ES Module and CommonJS
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // Externalize peer dependencies (react, react-dom) so they are not bundled into your library
      external: ['react', 'react-dom', 'axios'], // Also externalize axios as it's a runtime dep
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps (optional, if UMD is important)
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          axios: 'axios',
        },
        // Ensure CSS is handled. Vite will extract CSS by default when building a library.
        // If you want CSS in JS, specific plugins might be needed, but separate CSS is common.
      },
    },
  },
}); 