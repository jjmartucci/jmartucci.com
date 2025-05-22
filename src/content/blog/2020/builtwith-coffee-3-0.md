---
title: "builtwith.coffee 3.0"
metaimage:
  - /assets/images/2020/Statamic-Logo-Rad.png
description: 'It''s 2020 and I''m stuck in my house watching Democracy fall apart, why not rebuild my website again, and why not go full on "old man yells at clouds" while I''m at it.'
published: 2020-09-29T19:51:41+00:00
draft: false
slug: builtwith-coffee-3-0
---

It's 2020 and I'm stuck in my house watching Democracy fall apart, why not rebuild my website again, and why not go full on "old man yells at clouds" while I'm at it.

If you've been here before you'll notice that the layout has changed, but behind the scenes so has the entire stack the builds the site. This site was originally:

- Gatsby 1.something
- Contentful CMS hosting the content.

I wanted my writing saved locally and wanted it searchable, so I replaced Contentful with [Netlify CMS](https://www.netlifycms.org/). Netlify CMS was... underwhelming. It was an interface that made sorting/creating Markdown easier, but I wasn't excited to use it. Adding to that:

- graphql, for a personal site, is dumb. I apologize if I ever told anyone it was a good idea. I am filled with deep regret. Is it great for stitching together various APIs? Yes! Do I want to deal with it to make CMS content show up? No never.
- Gatsby decided to go for VC funding and turn from questionable to terrible. Look at the rest of the JavaScript stack it's 98% React based (yay, Facebook, great).

That's me being grumpy about things, which, in 2020, I think I'm allowed to do. Wanting a change, the 3.0 version of this site is:

- [Statamic 3.0](https://statamic.com/)
- [Statamic SSG](https://github.com/statamic/ssg)
- Still [Netlify](https://www.netlify.com/). It's going to be a while before I want to deploy a database for a personal site again.

I started as a developer hacking on PHP sites, so maybe this isn't a huge change. Statamic 3 [released very recently](https://statamic.com/blog/statamic-3-launch-announcement) and part of the release notes was this:

![](/assets/images/2020/Screen-Shot-2020-09-28-at-9.18.09-PM.png)

Which got me thinking. I'd used Statamic in the past and was familiar with how it stored content, it's all flat-file Markdown files, so that covered what I was trying to do with Netlify CMS before.

The outstanding question was, how hard would it be to move over what I had, and would I prefer the Statamic site. Given that you're reading this... on the Statamic site, you can figure out how that ended up.

## Notes

- I wrote approximately 3 lines of JavaScript and two lines of PHP to build this site. 98% of the code is antlers templates (HTML and CSS).
- The way statamic handles variable scope is beautiful. I recently did hair-tearing work on a .NET app trying to pass values to the layout.
- I switched the whole (admittedly small) site in ~three days. Maybe four. Who can really keep track of days.
- I've been using headless / roll your own CMSs for so long that I forgot that ones that are focused around content come out of the box with a lot of the features you need. I went to make a Date field to set to the post date, but while I was setting that up I noticed this in the collection configuration panel:
  ![](/assets/images/2020/Screen-Shot-2020-09-27-at-9.13.26-AM.png)
- The "push button, make website" experience was slightly worse than a JavaScript project, but way better than the last time I used PHP. Adding to the project (like setting up the SSG) was easier than anything I've done recently on the JavaScript side. There were some odd errors, like:

![](/assets/images/2020/Screen-Shot-2020-09-24-at-9.07.08-PM.png)
I never figured that one out. [Laravel Valet](https://laravel.com/docs/8.x/valet) was another prickly point, it installed but missed at least one service, which required reading through Stack Overflow for a while.

- The content field/layout/creation experience:
  ![](/assets/gifs/its-beautiful.gif)

And that gif shows up in the Preview tab in the Markdown editor!

In summary, I'm pretty happy with it.
