import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '');

    if (!env.VITE_API_URL) {
        throw new Error('VITE_API_URL environment variable is required');
    }

    return {
        plugins: [
            react(),
        ],
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode),
        },
        server: {
            port: parseInt(env.VITE_PORT || '5175', 10),
            host: env.VITE_HOST || 'localhost',
        },
        optimizeDeps: {
            include: ['e-punch-common'],
        },
        build: {
            commonjsOptions: {
                transformMixedEsModules: true,
                include: [/common\/dist/, /node_modules/],
            }
        }
    };
}); 