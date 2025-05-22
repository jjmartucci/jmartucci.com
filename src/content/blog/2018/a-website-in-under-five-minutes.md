---
title: Build and Deploy a Website in Under Five Minutes and Fifty-Five Seconds
published: 2018-03-27
description: At first glance, five minutes and fifty-five seconds seems like a pretty arbitraty unit of time to measure something by. Does it read better as 1 “Bohemain Rhapsody”?
draft: false
slug: a-website-in-under-five-minutes
---

At first glance, five minutes and fifty-five seconds seems like a pretty arbitraty unit of time to measure something by. Does it read better as 1 “Bohemain Rhapsody”?

<iframe width="560" height="315" src="https://www.youtube.com/embed/fJ9rUzIMcZQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

I had a goal to show off how to create and deploy a website as fast as possible -- and after a few tries, I couldn't do it under five minutes. But six minutes... plenty of time! Especially when you've got a sweet Brian May guitar solo to give you a little boost 4 minutes in.

I demoed these steps at a weekly work meeting, but everyone in the room had about the same background as me, so for you, random Internet stranger, some assumptions:

## Assumptions (If you really want to get this done in under six minutes):

- You have a github (or bitbucket account), git installed on your computer, and know basic git commands.
- You have node and npm installed and a general idea of how npm works.

If these assumptions don’t apply to you, you’ll need to budget some more time. If you’re just getting started with git or npm, you might need the entirety of _Live at Wembley '86_. If you’re brand new to development, consider loading up the entire Queen discography.

Now that you’ve got a reasonable time bound for this, let’s get to it.

## Create a Website

We’re going to use [Gatsby](https://www.gatsbyjs.org/) for this. Gatsby is a React based static site generator. There’s some comprehensive [getting started instructions](https://www.gatsbyjs.org/docs/) here, but here’s the TL;DR version.

`npm install --global gatsby-cli`

from your favorite command line, pick a folder and then:

```shell
gatsby new gatsby-site
cd gatsby-site
gatsby develop
```

and once it’s done loading, like magic you’ve got a website at [localhost:8000](localhost:8000).

## Set up Git

Create a new repo at your git host of choice (bitbucket or github). Either of them will give you instructions for pushing up new code, basically:

```shell
git init
git remote add origin [your-origin-here]
git push origin master
```

- but follow their instructions if you’re unfamiliar with git. You can refresh the repository to verify the code is there.

## Deploy it Using Netlify

I cannot speak more highly of [Netlify](https://www.netlify.com/), but if you’re doing this at “Bohemian Rhapsody” speed for now I’ll just say that Netlify makes Gatsby deploys crazy easy. Sign up for an account, ideally using the login for your git host (github, bitbucket, etc). Once you’re in you’ll see a dashboard with a big “New site from Git” button. Click that then:

- Pick your git host.
- Pick your repo.
- There’s a third step to set it up, but Netlify already knows it’s a Gatsby site so everything is set up for you.
- Hit deploy and... that’s it, you’re done. Within seconds Netlify should have a semi-randomly generated URL for your website.

## Why This is Awesome

The charade of creating a site and deploying it in under six minutes aside, this is awesome for a few reasons:

- We never actually _built_ the site. Running `gatsby develop` spins up a hot-reloading development environment, but Netlify actually did the build step for you. There are other services that will do this, but there’s usually a few more hoops involved to get it working.
- Netlify will let you change the randomly generated URL to a domain you own for free. They do one-click installs of HTTPS too.

Once you’ve done this once, you can spin up and deploy static sites to your heart’s content. And these sites are only quasi static, Gatsby is based on the idea of the (JAMstack)[https://jamstack.org/] - JavaScript, APIs, and markup. You can even feed Gatsby content from live sources hosted elsewhere, like a WordPress site or [Butter CMS](https://buttercms.com/) - basically anything with an API endpoint. Even Netlify is only quasi-static - they have features like [form handling](https://www.netlify.com/docs/form-handling/) to deal with most of the tasks you might have needed server side code for in the past.

That’s it. Hopefully you followed along and got a website up and running. If not, at least you got to enjoy some Queen.

<iframe src="https://giphy.com/embed/cAfaWIcWr7qus" width="480" height="264" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cAfaWIcWr7qus">via GIPHY</a></p>
