import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		port: 5000,
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
