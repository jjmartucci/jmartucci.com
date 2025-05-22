---
draft: false
title: An obvious bug
published: 2022-04-09T07:51:56-04:00
description: A minimal reproduction of a bug that took too long to find. 
slug: an-obvious-bug
tags:
	- programming
---
Debugging is one of the things I enjoy about programming. It’s like a little puzzle to solve. But as code gets more complicated, the little bugs can hide themselves in ways that make them very, very, annoyingly hard to find. This one, minimally reproduced in this Codepen, got me this week:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="ZEvxdZg" data-user="jjmartucci" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/jjmartucci/pen/ZEvxdZg">
  A small bug 🐞</a> by Joseph Martucci (<a href="https://codepen.io/jjmartucci">@jjmartucci</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

It seems obvious —  an empty input calculates an invalid date. But then imagine the calculated date was never visible, an empty input is considered valid data, and the system that reported this being an issue was 3 microservice hops away.

And the real issue, it turns out, was ever using `parseInt`. [Day.js](https://day.js.org) can do the calculation just fine with strings.