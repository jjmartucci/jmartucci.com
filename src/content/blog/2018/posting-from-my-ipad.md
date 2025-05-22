---
title: I’m Posting this from my iPad
published: 2018-05-28
draft: false
slug: posting-from-my-ipad
description: This is my first attempt at updating this site from my iPad.
---

This is my first attempt at updating this site from my iPad. "Wait, how hard is that," you might wonder. "Just log in to your CMS and write something and hit publish."

Sure, that _would_ be easy. So maybe I should clarify: this is my first update to this site from my iPad, and this site is completely serverless. The magic here is simply:

- [Working Copy](https://workingcopyapp.com).
- [Gatsby](https://www.gatsbyjs.org).
- and [Netlify](https://www.netlify.com).

Working Copy is a pretty amazing iOS app which lets you pull down, modify, and push git repos. It has a decent editor built in, so I wrote this post (in markdown) in the app. It's also possible to use Working Copy as a file source in iOS's Files app, so you can create a markdown file and then open it in your editor of choice. If you don't have one for iOS, I'm a big fan of [iA Writer](https://ia.net/writer).

After that, you commit the new file and push it. Netlify is setup to look for any changes on the `master` branch, it runs a Gatsby build script that compiles all the markdown content into blog posts and violà, the site is updated.

## Downsides

There's still no way to preview this site on my iPad. Someday, maybe, we'll live in a world where iOS and MacOS overlap enough that you can do actual development on an iPad - what a crazy idea that you could build iOS application in iOS, right?

Until then, I'm just happy to have a very convenient way to update and publish my site from my iPad.
