// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import {externalLink} from "./remark-plugins/link-rewrite.ts";
import {imageLink} from "./remark-plugins/image-link.ts";
import {footnoteAnchor} from "./remark-plugins/footnote-anchor.ts";
import rehypeSlug from "rehype-slug";
// import {gardenFrontMatterPlugin} from "./remark-plugins/garden-frontmatter.mjs";


// https://astro.build/config
export default defineConfig({
  site: "https://jmartucci.com",

  integrations: [sitemap()],

  markdown: {
    rehypePlugins: [rehypeSlug, externalLink, imageLink, footnoteAnchor],
    //remarkPlugins: [gardenFrontMatterPlugin]
  },
});