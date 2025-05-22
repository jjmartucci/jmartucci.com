---
title: Don't Let Ad Blockers Break Your Website
published: 2019-01-27
draft: false
slug: dont-let-ad-blockers-break-your-website
description: If you're a web developer working on a website running tracking or analytics scripts of any type, you absolutely need to make sure it works for users blocking third-party scripts.
---

If you're a web developer working on a website running tracking or analytics scripts of any type, you absolutely need to make sure it works for users blocking third-party scripts. This is just the latest example, from [fabric.com](https://www.fabric.com/), but I've seen this happen many times: a completely blank screen when Ghostery is blocking scripts.

![the fabric.com website in a broken state because ghostery blocked tracking scripts](/assets/images/2018/broke.JPG)

In this particular case the site threw the error:

    Uncaught TypeError: window.cmRecRequest is not a function

I personally run Chrome with [Ghostery](https://www.ghostery.com/) in "shut it all down mode", or set to block everything. The issue is always the same: a piece of code that fires a call to a tracking script (usually set as a global variable), that doesn't check that the variable exists before making the call. It's not often you find it on page load, but turn Ghostery blocking on and watch how many call-to-action buttons on marketing sites stop working.

Even less extreme ad-blocking can cause some unwanted behavior. This is from [css-tricks](https://css-tricks.com/) on Firefox running [uBlock Origin](https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/).
![also-broken](/assets/images/2018/also-broken.JPG)

I don't need any help managing my projects, but it still took me a bit to parse what exactly was going on with this sentence, until I viewed it in another browser and found out it was uBlock hiding text that was a [doubleclick](https://en.wikipedia.org/wiki/DoubleClick) link.

The ad blocking wars are only going to get worse going forward, especially now that Apple is blocking ads at an operating system level, while Google and Microsoft are trying to prevent ad blocking at that same level, and the browsers and lining up on opposite sides of the same battle, with Safari and Firefox helping users block ads and trackers out of the box, and Edge and Chrome have a business interest in delivering ads and tracking their users.
