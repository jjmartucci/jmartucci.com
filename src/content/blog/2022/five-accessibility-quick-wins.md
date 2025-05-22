---
draft: false
title: 5 Accessibility Quick Wins (and two for this site)
published: 2022-02-27T19:41:32-05:00
description: Practical A11Y improvements.
slug: five-accessibility-quick-wins
tags:
  - web-development
---
From CSS Tricks: [5 Accessibility Quick Wins You Can Implement Today](https://css-tricks.com/5-accessibility-quick-wins-you-can-implement-today/).

I like articles about accessibility in this format, how-tos of practical examples you see on almost every website. Heydon Pickering’s [Inclusive Components](https://inclusive-components.design) was the first place I saw this, but the site had only a few examples and ended up being short-lived.

I went to implement two of the 5 “quick wins” above that were relevant to this site:

1. The active page now shows up with a bit of style and the `aria-current` page. I was doing a gross hack with the `window.location` to parse out the current page before, and cleaned that up with Next’s [useRouter](https://nextjs.org/docs/api-reference/next/router).
2. I thought the site didn’t have a document language, but it did! Modifying the `<html>` tag in Next is, like most JavaScript frameworks, somewhat unintuitive. This post shows one way: [How to set the HTML lang attribute in Next.js?](https://melvingeorge.me/blog/set-html-lang-attribute-in-nextjs) but I found out it doesn’t work with `next export` when generating a static site. I then realized I had already done it the _other_ way, using a [custom Document](https://nextjs.org/docs/advanced-features/custom-document).