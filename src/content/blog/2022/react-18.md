---
draft: false
title: React 18
published: 2022-03-29T21:48:01-04:00
description: React 18 is now available on npm.
tags:
  - web-development
---
React 18 [is now available on npm](https://reactjs.org/blog/2022/03/29/react-v18.html).

I started using React back in the `0.14.X` days. I still prefer it over other front-end frameworks because it’s _not_ a framework, it’s just a library. That said — these days I prefer to use it _with_ a framework. When I first started using React it was as part of an MVC app (usually) or a truly single-page application. Once we moved to handling routing client-side, and handling all data fetching and state management client side, and handling authentication client side… it’s a lot. There’s a lot of cases where you would have been better of using AngularJS or Vue or an MVC whatever backend and some web components than trying to glue together React + React Router (no wait, Reach?) + Redux (no everyone uses MobX now, wait, now it’s just React Hooks WAIT, no, now we’re using state machines) + the CSS-in-JS library of the day.

You see the problem. Still, I think the React combination of JSX and parent/child rendering updates, and prioritizing functional JavaScript without a lot of magic is great. Do I care about most of the updates in React 18? Not really. I’m glad Next, or Remix, or some other great framework is going to do magic with them.