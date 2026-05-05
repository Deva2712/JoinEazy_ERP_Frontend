import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
	// Get the development host from environment or default to localhost
	const devHost = process.env.VITE_DEV_HOST || "0.0.0.0";
	const hmrHost = process.env.VITE_HMR_HOST || "localhost";

	return {
		plugins: [react()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		root: path.resolve(__dirname, "./"),
		build: {
			outDir: "build",
		},
		server: {
			host: devHost,
			port: 3000,
			open: false,
			strictPort: true,
			allowedHosts: "all", // Allow connections from any host during development
			watch: {
				usePolling: true,
				interval: 1000,
			},
			hmr: {
				host: hmrHost,
				port: 3000,
				clientPort: 3000,
			},
			// Remove the proxy configuration since we're using absolute URLs
			// proxy: {
			//   '/api': {
			//     target: 'http://192.168.31.50:8000',
			//     changeOrigin: true,
			//     secure: false,
			//   },
			// },
		},
		define: {
			// Remove the conflicting API_BASE_URL definition
			// __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || '/api/v1'),
		},
	};
});
