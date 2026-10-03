// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import AstroPWA from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), visualizer()],
  },
  site: "https://cpp-registry.github.io/",
  integrations: [
    sitemap(),
    (await import("@playform/compress")).default({
      CSS: true,
      HTML: true,
      Image: true,
      JavaScript: true,
      JSON: true,
      SVG: true,
    }),
    mdx(),
        AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'static C++ community Registry',
        short_name: 'C++ Registry',
        description: 'C++ Registry for community made easy, powered by Gihtub repos',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
