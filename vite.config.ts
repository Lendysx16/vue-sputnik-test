import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint2';
import svgLoader from 'vite-svg-loader';

const env = loadEnv(process.cwd(), '');

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 3000,
        host: env.VITE_APP_URL || 'localhost',
    },
    plugins: [vue(), eslint(), svgLoader({ defaultImport: 'component' })],
});
