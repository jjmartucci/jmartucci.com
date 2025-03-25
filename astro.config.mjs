// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";
import {gardenFrontMatterPlugin} from "./remark-plugins/garden-frontmatter.mjs";


// https://astro.build/config
export default defineConfig({
  site: "https://jmartucci.com",
  integrations: [mdx({
    remarkPlugins: [gardenFrontMatterPlugin],
  }), sitemap()],
  markdown: {
    remarkPlugins: [gardenFrontMatterPlugin]
  },

});
