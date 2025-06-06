---
title: Cross posting from a next.js blog to micro.blog
published: 2020-11-13T18:02:03.590Z
draft: false
slug: cross-posting-from-next-to-micro-blog
description: micro.blog
---

I like the idea of [micro.blog](https://micro.blog), and I’ve lazily cross-posted my blog to the site via RSS for a while, but the feed always ended up in the format of [post title] - [link to post], which doesn’t capture the spirt of microblogging.

I reworked the RSS feed in general when updating this site to [next.js](https://nextjs.org), but I thought I'd take a stab at getting micro.blog crossposting working too.

Since I couldn’t find much in their documentation on what parameters were used to construct the micro.blog feed from an RSS feed, I found users who were cross posting, looked at their feeds, and then tested out a couple posts to see how they showed up on the timeline.

Notes:
1. It's much easier to use a [JSON feed](https://jsonfeed.org). This is perhaps not surprising since [Manton Reece](https://manton.org) drafted the spec and created micro.blog.
2. [Microblogging is strongly against using titles for posts](https://www.manton.org/2014/09/15/defining-a-microblog.html).

 I ended up taking the same loop my index page uses (gets every single markdown post, but then returns the latest ten) and running it through this function:
 
 ```js
 import siteConfig from "../data/config.json";
var md = require("markdown-it")();

const makeJsonFeed = (posts) => {
  const feed = {
    feed_url: siteConfig.jsonURL,
    title: siteConfig.description,
    home_page_url: siteConfig.siteUrl,
    author: {
      url: siteConfig.siteUrl,
      name: siteConfig.author,
    },
  };
  const items = posts.map((post) => {
    return {
      author: {
        url: siteConfig.siteUrl,
        name: siteConfig.author,
      },
      id: `${siteConfig.siteURL}${post.slug}`,
      url: `${siteConfig.siteURL}${post.slug}`,
      date_published: post.frontmatter.date,
      content_html: md.render(post.markdownBody),
    };
  });
  feed.items = items;

  return JSON.stringify(feed);
};

export default makeJsonFeed;
```

And on the index route, I use it like this:

```js
const jsonFeedObj = makeJsonFeed(postsToUse);
fs.writeFileSync("./public/rss/feed.json", jsonFeedObj);
```
While I do have titles on most of my posts, they are optional, and I chose to leave them off the JSON feed. If they are added, micro.blog goes back to the [post title] - [link to post] I was trying to get away from!

You can see the result at [my micro.blog timeline](https://micro.blog/jjmartucci) or in the [JSON feed](https://www.builtwith.coffee/rss/feed.json).