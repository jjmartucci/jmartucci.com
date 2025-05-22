---
title: JavaScript Generators
published: 2022-11-08T03:45:19.875Z
draft: false
description: Functions with but with a fun *.
slug: javascript-generators
tags:
  - web-development
---
With Tim Tams, at [Why Would Anyone Need JavaScript Generator Functions](https://jrsinclair.com/articles/2022/why-would-anyone-need-javascript-generator-functions/), an enjoyable write-up of a confusing part of JavaScript, although I’m not entirely sure I’d ever use them short of a library that hides all of the implementation details. 

As [noted in the Hacker News comments Redux-Saga uses generators](https://news.ycombinator.com/item?id=33506626), that’s where most of my knowledge of them comes from. After implementing it once (look at me, very smart!) I took over another project that used it and immediately ripped it out which, based on the replies, I’m not the only one:

> I had to rescue a saga based project that went badly off the rails and it was some of the hardest code I’ve ever had to debug in any language. Code flow was very difficult to reason about and forget about trying to use stack traces. [source](https://news.ycombinator.com/item?id=33514897)