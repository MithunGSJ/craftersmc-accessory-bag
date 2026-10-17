import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.CRAFTERS_API_KEY || process.env.CRAFTERS_API_KEY || '';

  const proxyConfig: ProxyOptions = {
    target: 'https://api.craftersmc.net',
    changeOrigin: true,
    secure: true,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
    headers: apiKey ? { 'X-API-Key': apiKey } : {}
  };

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': proxyConfig
      }
    },
    preview: {
      port: 5173,
      host: true,
      proxy: {
        '/api': proxyConfig
      }
    }
  };
});
