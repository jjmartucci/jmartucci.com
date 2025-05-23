// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import {gardenFrontMatterPlugin} from "./remark-plugins/garden-frontmatter.mjs";
import {externalLink} from "./remark-plugins/link-rewrite.ts";


import netlify from "@astrojs/netlify";


// https://astro.build/config
export default defineConfig({
  site: "https://jmartucci.com",

  integrations: [sitemap()],

  markdown: {
    rehypePlugins: [externalLink],
    remarkPlugins: [gardenFrontMatterPlugin]
  },
});