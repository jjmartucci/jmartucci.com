---
title: The Great Gatsby - Upgrade
published: 2018-07-21
description: If you're reading this, huzzah, it worked!
draft: false
---

If you're reading this, huzzah, it worked!

I made a few changes to this site, namely:

- It went from Gatsby 1.0 to Gatsby 2.0.
- It went from pulling content from markdown files saved in the git repo to pulling content from [Contentful](https://www.contentful.com/) and [Pocket](https://getpocket.com/a/queue/).

## Why is this better?

A few things:

1. Contentful can issue a webhook when I publish content, and [Netlify can listen to it](https://www.contentful.com/blog/2018/05/09/building-portfolio-website-contentful-nextjs-netlify/), so I don't have to push code to Netlify to kick off a content build. That separates the code from the content nicely.
2. I find a lot of links I want to keep track of _and_ share, but I'm terrible at following through on it. Saving those links in markdown files didn't make it any easier, but I already use Pocket. Now the flow is: save a site to Pocket, read and archive it, tag it with `bwc`, and [Gatsby will add it to the site's graphql](https://github.com/conradj/gatsby-source-pocket)and I can merge it with the content I've created on the home page.
3. The content here isn't particularly complex schema-wise, but I am a UI developer so I'm very aware of how a few seconds here and there messing with formatting and structure can, over time, become super frustrating. Moving the markdown metadata into nicely formatted Contentful fields makes the process of creating a new post much more enjoyable.

## What's left?

1. I'd like to find a way to connect the Pocket archive task to a webhook so that _also_ does a Netlify deploy, but it's a low priority.
2. Getting the site working offline as a progressive web app. 😁
