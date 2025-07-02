import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '');

    if (!env.VITE_API_URL) {
        throw new Error('VITE_API_URL environment variable is required');
    }

    return {
        plugins: [
            react(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode),
            'global': 'globalThis',
        },
        server: {
            port: parseInt(env.VITE_PORT || '5175', 10),
            host: env.VITE_HOST || 'localhost',
        },
        optimizeDeps: {
            include: ['e-punch-common-ui'],
        },
        build: {
            commonjsOptions: {
                transformMixedEsModules: true,
                include: [/common-ui\/dist/, /node_modules/],
            }
        }
    };
}); 