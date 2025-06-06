---
draft: false
title: Two articles on web APIs
published: 2022-03-19T13:49:54-04:00
description: Web links worth reading on Canvas2D and the File System Access API.
tags:
  - web-development
---
The first one: [It’s always been you, Canvas2D - Chrome Developers](https://developer.chrome.com/blog/canvas2d/). Lots of nice updates to performance and quality of life for the Canvas API. I have a soft spot for the `<canvas>` tag — when I was (re)learning web development I spent a lot of time at my non-development related job spinning up little web projects that required no libraries or compilation steps to run in the browser pre-installed on my laptop. The canvas element was the most readily available but also _complex_  web API that runs locally, so I built all kinds of interfaces and animations in it while learning.

Second: [Using files with browsers, in reality - macwright.com](https://macwright.com/2022/03/04/browsers-and-files.html)

> The meaning and importance of the *file* has shifted a lot in the last decade. The Verge wrote about how  [students today don’t have a grasp](https://www.theverge.com/22684730/students-file-folder-directory-structure-education-gen-z)  on how files and folders work - or they have a very good understanding of the norms of storing information in the cloud, but not on their local computers. The web contains all sorts of things that we never think of or use as files: is your email an  [Mbox file](https://en.wikipedia.org/wiki/Mbox) ? Do you ever directly use the  [HEIC files](https://en.wikipedia.org/wiki/High_Efficiency_Image_File_Format)  that are the native format of Apple Photos? Or consider any rich text on the internet, like a Notion page - does it have a defined file type and an option to download? And think of the mobile web. You can download a file from mobile Safari, but do you?

Worth noting, I suppose, that I’m writing this in an application which does not use files. But I generally prefer the workflow of “don’t make me think about this as a file, but give me the file if I ask for it”, so it’s nice to see this API coming together.

And I enjoyed this bit from that article:

> Working with the web platform is dealing with history, with the accumulated matter of  [quirksmode](https://www.quirksmode.org/)  and good-enough standards. In exchange for the ability to deliver instantly-updating software directly to customers with no middlemen and no installation, you have to absorb a great deal of nearly-useless information that’s entirely about dodging meaningless traps.