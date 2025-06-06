---
title: Twenty years and I still can't add a script tag right
published: 2019-03-04
slug: add-a-script-tag
draft: false
tags:
  - web-development
description: 2019 marks twenty years since I first pushed a website to the internet, yet today I was trying to set up a project and I got caught on something very... silly.
---

2019 marks twenty years since I first pushed a website to the internet, yet today I was trying to set up a project and I got caught on something very... silly. I was testing a webpack configuration for a React library so it would run in Internet Explorer 11, but I couldn't get the application code to execute when running the development server. I dug through the code and searched for anything I could think of to narrow down if it was the fault of webpack, the dev server, my application code, or the polyfills I had added for IE11 support. After a (too long) search, it came down to this:

`<script src="main.js" />`

This is not the first time I've made this mistake, and in case it's not immediately clear to you, dear reader, [script tags cannot be self-closing](https://stackoverflow.com/questions/69913/why-dont-self-closing-script-tags-work). Every time this has tripped me up it's been a particularly baffling error because a self-closing script tag will appear to load - the script will show up in the network tab of the dev tools, and all the code will be there, it just won't execute anything.

Since first learning web development, I've done the very basic task of adding a script tag a lot of different ways:

- In some PHP function that tied into a CMS's loading hooks.
- In .NET MVC ScriptBundles.
- `document.createElement("script");` then assigning the script source.
- Not at all, letting the magic of something like Gatsby or webpack add the script tag for me.

On top of that, my mental context for when or when not to close tags comes from a mix of knowing HTML, XHTML, and currently working with React - there's some conflicting ideas of what must, should, and should not be self-closing going on in my head.

The project works now - and supports IE11! - and however many years from now, when I forget that a script tag can't be self-closing, I'll at least have this blog post to look back on. Or, all of the browsers will have started supporting a self-closing script tag, or I'll have moved on to yet another abstraction around loading the script tag that removes the brackets and I'll have forgotten how HTML works entirely.
