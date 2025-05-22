// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import netlify from '@astrojs/netlify';

import sitemap from "@astrojs/sitemap";
import {gardenFrontMatterPlugin} from "./remark-plugins/garden-frontmatter.mjs";
import {externalLink} from "./remark-plugins/link-rewrite.ts";


// https://astro.build/config
export default defineConfig({
  site: "https://jmartucci.com",
  adapter: netlify(),

  integrations: [mdx({
    remarkPlugins: [gardenFrontMatterPlugin],
  }), sitemap()],

  markdown: {
    rehypePlugins: [externalLink],
    remarkPlugins: [gardenFrontMatterPlugin]
  },

  output: "server",
});