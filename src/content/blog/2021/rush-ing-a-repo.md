---
title: Rush - ing a repo
published: 2021-02-24T00:00:00Z
description: Some notes on moving an existing Git repository into a Rush monorepo
  structure.
image: ''
draft: false
slug: rush-ing-a-repo
---
Some notes on moving an existing Git repository into a [Rush monorepo structure](https://rushjs.io):
- The last monorepo setup I did was with Lerna. I much prefer the documentation and incredibly verbose configuration files of Rush. Lerna certainly has it’s place in specific setups but not the one I was trying to set up.
- One point that wasn’t clear: if you have an existing repo you want to add rush to, you have to initialize it with `rush init --overwrite-existing`. Minor point but the error message from just running `rush init` didn’t make it clear that I should, and the documentation is a little vague on what `--overwrite-existing` is going to do (and it sounds worse than it is).
- I used their suggestion of creating a package structure two levels deep. In this case `/apps/[appname]` and `/tools/[toolname]`. We’ll likely add a `/libraries` down the line, and migrate some more apps over.

Seems like a decent tool, so far. The requirements here are low, I’m not trying to create an omni-repo of all of our back and front-end projects, just colocating some already related pieces of code in a happy way, and setting up a future state so more projects can become more closely related in the future.