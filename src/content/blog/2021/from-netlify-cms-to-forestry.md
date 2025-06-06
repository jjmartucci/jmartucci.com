---
title: From Netlify CMS to Forestry
published: 2021-02-23T17:00:00Z
description: Why I switched the content editor on this site from Netlify CMS
  to Forestry.io.
---
I’ve used [Netlify CMS](https://www.netlifycms.org) on and off on this site (and previous iterations of it) and while I think it’s a really great idea, the execution of the application is incredibly lacking, for a few reason:

- The documentation is… not good. It’s ok, and I’m always hesitant to complain about documentation too much given how often I’ve dealt with software that included absolutely zero public documentation, but if I have to dig through Github issues to find answers to configuration problems that’s not a project I would be quick to recommend.

- Running the admin panel locally is annoyingly hard. This has been fixed in later releases but still feels clunky.

- You have to configure all of your fields in a YAML file, then commit them, then go make changes to the content. If you’re like me and you just move code and content independently this creates a lot of mismatched fields and inconsistency. That’s a me thing, but I don’t think it’s uncommon if you’re working with all of your content in Markdown files.

- Sorting never seemed to work, and all of my files were ordered somewhat randomly when I opened the CMS.

- Folders, in content and in the media library, didn’t really work either. I like to store my posts by `year/month/title.md` to cut down on how many I have to look at at once, and Netlify CMS just makes them one big list.

To be clear, the **very good idea** behind Netlify CMS is that it is a light UI wrapper around your Markdown files, and it requires zero installation. You put a script tag on a static page and it does the rest. There’s no database, no deployment steps, you can directly edit the YAML front matter and Markdown content of your files and commit the changes to Git, at which point if you have a static site and Netlify hooked up, everything deploys and your site is updated.  For a while there wasn’t a lot of good options in this market, but now there’s a few, so I started looking at alternatives this weekend. Among the interesting options:

- [Typemill - A CMS for Micro Publishing | Typemill](https://typemill.net)

- [Pico - A stupidly simple, blazing fast, flat file CMS.](http://picocms.org)

- [Grav - A Modern Flat-File CMS | Grav CMS](https://getgrav.org)

But all of those started with “download” or “get started by installing”. Then I found [Forestry.io](https://forestry.io), which runs the UI on their servers (headless, the kids call it), but against your Github content. Getting started was similar to setting up a site on Netlify, you connect your Github account, pick the repo, pick the default branch. After that you give forestry some config settings (which it saves in a `.forestry` folder in the repo) and your content, assuming you already have some, sort of magically appears. You can then configure your media library (which, annoyingly, also doesn’t use folders but at least saves correctly to folders if you configure it to), and you can use existing content to build out a reusable front matter structure. I picked one of my “album a day” posts and forestry did (most of) this for me:

![](../images/2021/02/forestry-front-matter.png)

(I added the Draft field after, since the post I picked didn’t have that in the front matter already).

forestry also has a bundle of other options I don’t yet need but I’ve needed on past projects that are nice:

- It can run a preview version of the site so you can see changes in real time.

- Webhooks.

- User roles (once you go to a paid tier).

In general I recommend it, and editors like this are easy to recommend because they require almost no setup, and if you change your mind, you just go back to whatever other Markdown editing process you were using.