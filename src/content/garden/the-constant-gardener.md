---
title: "The Constant Gardener"
description: "I’ve been working behind the scenes for the last few months on converting this site into less of a blog and more of a digital garden."
image: "/garden/garden.jpg"
tags: ["blog"]
created: 2025-04-17T23:19:36-0400
modified: 2025-04-18T11:06:13-0400
---
# The Constant Gardener

![](/garden/garden.jpg)I’ve been working behind the scenes for the last few months on converting this site into less of a _blog_ and more of a _digital garden_.

## What is a digital garden?

Probably the first (and best) explanation of a digital garden that I came across was Maggie Appleton’s blog post [A Brief History & Ethos of the Digital Garden](https://maggieappleton.com/garden-history). The basic notion of it is less straightforward blogging and more free form growing of content through inter-linked notes. If you’ve used Obsidian or almost any other note taking app lately, you’ve probably seen Wikilinks, which have become a de-facto standard where you wrap Markdown text in double brackets (`[[Like This]]`) and it becomes a link to another file. This works great in note taking apps, and it’s how I organize all my personal notes, but there’s a lot of content that I’d like to continue to build over time and share with anyone who is interested. Also it would be nice if I wrote something that did look like a blog post (like this one!), if it was easy to link back to something I wrote in the past.

## Attempt one: Content Collections and Tags

My first thought in making this work was to use [Astro’s content collections](https://docs.astro.build/en/guides/content-collections/), with different collections mapping to _types_ and all of those types having a field named `tags` which was an array of strings. The initial pass had types for:

*   `blog` - something like this post.
*   `garden` - general notes.
*   `recipes` - recipes, assuming those would be presented differently.
*   `links` - a link to another website, generally something with a tag and a URL but no content associated with it.
*   `books` - notes about books I had read or was reading.

I was managing these notes in [Obsidian](https://obsidian.md/) by symlinking the content folder from my Astro git repo into my main Obsidian vault. One nice thing about Obsidian in this use case is that if you create a YAML frontmatter field named `tags`, it presents the values in that field as Obsidian-wide tags. This is important because it means the tagging system maps locally as well as it does on the website itself.

  

This was… ok. It all works but I’ve come to the conclusion that directly working with YAML frontmatter in Markdown **kind of sucks**. While I was once a huge fan of the idea, once you grow beyond a few fields it feels like a crappy UI over a crappy database.

  

As a more concrete example, here’s a note for this site in Obsidian:

  

![screenshot of Obsidian with YAML and filenames and titles](/garden/CleanShot%202025-04-16%20at%2013.46.14@2x.png)

  

We see the filename at top, a YAML attribute for the “title” (used to generate previews on the site), and then the actual title way down below. For some other types there were more fields, e.g. books had fields for the author, a [bookshop.org](bookshop.org) link, a cover image. It’s just too much to keep in YAML, and the next step up from here is a CMS, which is an additional layer of complexity I didn’t want to deal with for personal notes on the web.

## Attempt Two: Publishing from Bear

What I realized after building out all these collections was that the note types were quite similar. There’s a title, maybe an image, a description, and some tags. The differences could be part of the note body itself. So what if the top of that Homeserver note looked like this:

  

![screenshot from the MacOS app Bear showing a simple note with a title and some text.](/garden/CleanShot%202025-04-16%20at%2013.47.36@2x.png)

  

And all of the YAML that Astro cares about was just generated from the reading the markup of the note itself? For this I turned to Bear, which has the nicest formatting of any Markdown editor on MacOS, and a wide range of export options. Rather than exporting from Bear to Markdown directly and managing YAML frontmatter in Bear, (which it can do, although not well), the process looks like this:

*   Anything I want to publish gets tagged `mind-garden`.
*   I export everything as HTML.
*   I run [this script](https://github.com/jjmartucci/bear2astro) which extracts all of the relevant (to me) details out of the HTML and injects them as YAML frontmatter, then reconverts the HTML to Markdown.

This works surprisingly well. Wikilinks can be converted to real links, created and modified dates can flow from Bear instead of being injected from the file system into the Markdown YAML, and I can quickly and easily write and edit and update any note on this website.

  

As with anything, the system isn’t perfect:

1.  Any file created outside of Bear as Markdown needs to be imported into Bear and then _re-exported_ from Bear. Which is fine for my use cases but if you’ve got notes all over the place in plain text might be annoying.
2.  Bear doesn’t quite support all Markdown syntax and including something like an embed is clunky, although I don’t know that it’s actually worse than most Markdown editors, and certainly not worse than Obsidian.
3.  Bear doesn’t support image captions, so images won’t have alt text. As a work around I adjusted the script so that if you include an image immediately followed by italic text it will insert the italic text as the alt text in the final output.

## Growing Season

Writing this post was super, duper, extra easy peasy, and linking to other things was too! For example the script I used to convert the content ([jjmartucci/bear2astro](https://github.com/jjmartucci/bear2astro)) was mostly **✨vibe coded✨** using Aider, which I listed over on my [AI Programming Tools](/garden/plant/ai-programming-tools) page, which I just included in this post using a wikilink 🥳.

  

So there we go. Time to get gardening!

  

![Pee Wee Herman watering anthropomorphic flowers](/garden/giphy.gif)