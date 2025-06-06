---
title: "Finding is better than folding"
published: 2021-01-12T01:35:43.672Z
description: Search > Sort
draft: false
---

I was reading [this thread on Reddit about how to structure your React files](https://www.reddit.com/r/webdev/comments/kv403v/react_how_do_you_structure_your_components/). In the past I would have said something like:

```
components/
	layout/
		component_name
	data/
		component_name
	other_domain/
		component_name
	...
```

and used an `index.js` in every folder for the root React component. These days I’m much more inclined to do:

```
components/
	component_name
```

because I find both deeply nested folders and files with the same name annoying. I also think it’s ideal if you can quickly move through files with linked structures (F12 in VS Code if you’re using Typescript) or search for files using the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) rather than trying to guess from `/` down where a file might be.
