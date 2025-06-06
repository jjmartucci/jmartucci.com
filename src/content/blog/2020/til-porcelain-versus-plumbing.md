---
title: "TIL: porcelain versus plumbing"
published: 2020-05-29T15:06:05+00:00
draft: false
description: If you don't want it, I won't do it. Still makes sense to separate the plumbing from the porcelain, though.
---

I guess I haven't spent enough time living in the git documentation to notice this before, but a Stack Overflow answer for something I was trying to do with `git diff` used the term “porcelain” function to describe `diff` versus `diff-index`, which led to _another_ [Stack Overflow answer](https://stackoverflow.com/questions/6976473/what-does-the-term-porcelain-mean-in-git) to what the concept of a porcelain function was, the origin of which appears to be from [this email conversation in the git project](http://www.gelato.unsw.edu.au/archives/git/0504/0881.html)

> If you don't want it, I won't do it. Still makes sense to separate the
> plumbing from the porcelain, though.

It’s interesting to me that software prefers plumbing metaphors to electrical ones (switches from the circuits, in this case), but I guess what travels through the plumbing is critical to the metaphor.
