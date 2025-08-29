import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { parse as htmlParser } from "node-html-parser";
import type { AstroGlobal } from "astro";
import type { RSSFeedItem } from "@astrojs/rss";
import { getImage } from "astro:assets";

const parser = new MarkdownIt();

// get dynamic import of images as a map collection
const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
    "/src/content/blog/images/**/*.{jpeg,jpg,png,gif}", // add more image formats if needed
);

const posts = (await getCollection("blog"))
    .filter((post) => {
      return process.env.NODE_ENV === "production" ? !post.data.draft : true;
    })
    .sort((a,b) => b.data.published - a.data.published)

export async function GET(context: AstroGlobal) {
  if (!context.site) {
    throw Error("site not set");
  }

  const feed: RSSFeedItem[] = [];

  for (const post of posts) {
    // convert markdown to html string
    const body = parser.render(post.body);
    // convert html string to DOM-like structure
    const html = htmlParser.parse(body);
    // hold all img tags in variable images
    const images = html.querySelectorAll("img");

    for (const img of images) {
      const src = img.getAttribute("src")!;

      // Relative paths that are optimized by Astro build
      if (src.startsWith("./") || src.startsWith("../")) {
        // remove prefix of `./` or `../`
        let prefixRemoved = '';
        if(src.startsWith("./")) {
            prefixRemoved = src.replace("./", "");
        }
        else if(src.startsWith("../")) {
            prefixRemoved = src.replace("../", "");
        }
        // create prefix absolute path from root dir
        const imagePathPrefix = `/src/content/blog/${prefixRemoved}`;

        // call the dynamic import and return the module
        const imagePath = await imagesGlob[imagePathPrefix]?.()?.then(
            (res) => res.default,
        );

        if (imagePath) {
          const optimizedImg = await getImage({ src: imagePath });
          // set the correct path to the optimized image
          img.setAttribute(
              "src",
              context.site + optimizedImg.src.replace("/", ""),
          );
        }
      } else if (src.startsWith("/")) {
        // images starting with `/` is the public dir
        img.setAttribute("src", context.site + src.replace("/", ""));
      }
      else if(src.startsWith("https://")) {
        img.setAttribute("src", src);
      }
      else {
       console.error(`${src} src unknown`);
      }
    }

    feed.push({
      title: post.data.title,
      description: post.data.description,
      author: `joseph.martucci@me.com`,
      pubDate: post.data.published,
      categories: post.data.tags,
      link: `/blog/${post.slug}/`,
      // sanitize the new html string with corrected image paths
      content: sanitizeHtml(html.toString(), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
    });
  }

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: feed,
    //stylesheet: "/rss/styles.xsl",
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: [
      "<language>en-us</language>",
      `<atom:link href="${new URL("rss.xml", context.site)}" rel="self" type="application/rss+xml" />`,
    ].join(""),
    trailingSlash: false,
  });
}

/*
export async function GET(context) {


  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    stylesheet: "/rss/styles.xsl",
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.published,
      description: post.data.description,
      //customData: post.data.customData,

      // Compute RSS link from post `slug`
      // This example assumes all posts are rendered as `/blog/[slug]` routes
      link: `/blog/${post.slug}/`,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
    })),
  });
}
*/