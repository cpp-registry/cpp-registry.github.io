// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), visualizer()],
  },
  site: "https://cpp-registry.github.io/",
  integrations: [
    sitemap(),
    (await import("@playform/compress")).default({
      // CSS: false,
      // HTML: false,
      // Image: false,
      // JavaScript: false,
      // JSON: true,
      // SVG: false,
    }),
    mdx(),
  ],
});
