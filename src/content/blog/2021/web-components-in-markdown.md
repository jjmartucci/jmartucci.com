---
draft: false
title: Stencil, Markdown, and web components in Markdown
published: 2021-03-02T00:30:29Z
description: "I’ve had an idea floating around for a while: MDX is great, but I hate all of the steps around configuring / building React components with it. If I’m writing Markdown, HTML is valid in Markdown, and Web Components are valid HTML, so why not just stick Web Components in Markdown and call it a day?"
tags:
  - web-development
---
I’ve had an idea floating around for a while: [MDX](https://mdxjs.com) is great, but I hate all of the steps around configuring / building React components with it. If I’m writing Markdown, HTML is valid in Markdown, and Web Components are valid HTML, so why not just stick Web Components in Markdown and call it a day?

That was the idea, anyway, I just never got around to trying it. I still don’t quite grok the actual [Web Components spec](https://developer.mozilla.org/en-US/docs/Web/Web_Components), but I have used [Stencil](https://stenciljs.com), and figured with some free time today I’d give it a shot. This is the result: [Web Components in Markdown](https://fervent-noyce-fc1b19.netlify.app). It works! Of course it does. Probably the biggest difference between it and MDX (besides, React, obviously), is that Web Components in HTML can only accept string values, so in this example rather than passing an array of image sources, I passed a comma separated list, e.g:

```html
<picture-gallery images="https://source.unsplash.com/lvh5L46VWuA/600x600, https://source.unsplash.com/TjbedCFPQdc/600x600, https://source.unsplash.com/caM2RdHVAoc/600x600"></picture-gallery>
```

One other nice thing here is you can stick fallback HTML into the `<picture-gallery>` part, and you get fallback content. If the JS loads, yay, a gallery. If not, whatever. I made an example of that here:

<p class="codepen" data-height="452" data-theme-id="light" data-default-tab="js,result" data-user="jjmartucci" data-slug-hash="ExNQVdZ" style="height: 452px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Progressive enhancement with Web Components">
  <span>See the Pen <a href="https://codepen.io/jjmartucci/pen/ExNQVdZ">
  Progressive enhancement with Web Components</a> by Joseph Martucci (<a href="https://codepen.io/jjmartucci">@jjmartucci</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

You can see [the code behind the site on Github](https://github.com/jjmartucci/stencil-markdown), it’s slap-dash but it is functional.