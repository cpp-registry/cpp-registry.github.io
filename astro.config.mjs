// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://cpp-registry.github.io/",
  integrations: [
    sitemap(),
    (await import("@playform/compress")).default({
      CSS: false,
      HTML: false,
      Image: false,
      JavaScript: false,
      JSON: true,
      SVG: false,
    }),
    mdx(),
  ],
});
