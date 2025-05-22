---
title: A Link Trick for Apple Freeform
description: Getting app callback and shortcuts URLs to work in Apple Freeform
image: images/blog/2024/freeform.jpg
published: 2024-03-09T15:15:00.000Z
tags:
  - software
---

Apple’s [Freeform app](https://www.apple.com/newsroom/2022/12/apple-launches-freeform-a-powerful-new-app-designed-for-creative-collaboration/) is a curious thing. It was released in 2022 and hasn’t seen a lot of updates since then, but it works well with any device (even the iPhone), and it’s great at working like a Mac native app should work. Drag an image in, its sticks to the canvas. Drag a link out of Safari, get a link on the canvas. It’s fairly performant, even if you throw piles of files into it. And (importantly), it animates gifs if you put gifs in.

One other Apple native thing I use a lot is app callback URLs and shortcut URLs (if you’re unaware, you can link to a shortcut on any device with the format `shortcuts://run-shortcut?name=Shortcut%20name%20here`). They do work, but it took me a minute to figure out how. Paste one in and you get plain text, drag a shortcut in and it bounces out. But, there’s two ways to add them:

One way:

* Paste the link in as plain text.
* Add a space or return after 😃


Real tricky huh? But not very intuitive if you *just wanted the link*.

The other option:

* Make a link with the “Link” option under images to any valid URL ([www.apple.com](http://www.apple.com) even, as it suggests).
* Edit the URL to be the callback or shortcut URL you want. You’ll see an error (it can’t generate a preview, which is sad), but then you’ll have a big gray button you can click on to run the callback or shortcut.
  The button is nice if you’re a fan of large tap targets, especially for iPad / phone use. You can decorate it with some text over it, or doodle on it or something to make it less gray.

Here’s a demo video of pasting in the callback URL to the draft of this post, saved in [Bear](https://bear.app).

<video controls><source src="https://coffee-cake.nyc3.cdn.digitaloceanspaces.com/videos/shortcuts-in-freeform.mp4"/></video>
