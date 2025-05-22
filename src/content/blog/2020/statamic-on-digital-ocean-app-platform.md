---
title: "Statamic on Digital Ocean App Platform"
meta_title: "Testing out Statamic on the Digital Ocean App Platform"
image: /assets/images/2020/49aa0a09-06d2-4bba-ad20-4bcbe56ac507_logo.png
description: "I have always really liked Digital Ocean's guides/documentation/shark loading animations, so thought I'd see what their new App Platform was about."
published: 2020-10-07T19:51:41+00:00
draft: false
slug: statamic-on-digital-ocean-app-platform
---

Digital Ocean released their [App Platform](https://www.digitalocean.com/products/app-platform/) the other day. It's similar to Heroku, which has been around for forever, but I never really got along with how Heroku works and have always really liked Digital Ocean's guides/documentation/shark loading animations, so thought I'd see what it's about.

I decided to try [this site](/blog-posts/2020/09/builtwith-coffee-3-0/) but as a full-fledged Statamic site, not the statically generated version you're looking at currently, hosted on Netlify. It was pretty easy, Digital Ocean has a [sample repo for Laravel](https://github.com/digitalocean/sample-laravel), but if you point it at a Statamic repo in Github you get all of the same settings. After that it was just adding some environmental variables, and letting it deploy.

Am I going to use it? Probably not. It was a neat test case, but the leap from this to what Netlify provides, where all of the content for the site is cached neatly on CDNs somewhere, is more than I feel like figuring out right now. A more likely step would be to deploy just the control panel to a Digital Ocean box, then let [Statamic’s Git integration](https://statamic.dev/git-integration) kick off a Netlify build and deploy.

Here’s the important parts of the [App Spec file](https://www.digitalocean.com/docs/app-platform/references/app-specification-reference/) I ended up with, if anyone else ended up here trying to figure out how to get this working, with secrets obviously obscured:

```
name: bwc-statamic
region: nyc
services:
- build_command: “php please stache:clear \nphp please static:clear”
  environment_slug: php
  envs:
  - key: STATAMIC_LICENSE_KEY
    scope: RUN_AND_BUILD_TIME
    value: 1234
  - key: APP_URL
    scope: RUN_AND_BUILD_TIME
    value: your-app-address-here
  - key: APP_KEY
    scope: RUN_AND_BUILD_TIME
    value: 1234
  http_port: 8080
  routes:
  - path: /
  run_command: heroku-php-apache2 public/
```
