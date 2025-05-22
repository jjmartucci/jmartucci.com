---
title: "TIL: Mojibake"
published: 2022-10-06T00:19:34.137Z
draft: false
description: The garbled text that is the result of text being decoded using an unintended character encoding.
slug: til-mojibake
---
> the garbled text that is the result of text being decoded using an unintended character encoding.

[Wikipedia](https://en.wikipedia.org/wiki/Mojibake) by way of [Hacker News](https://news.ycombinator.com/item?id=33053918), where I learned:

> In Russian this phenomenon is called "бНОПНЯ" (read "b-nop-nya") and was caused by taking the word "Вопрос" (meaning: "question") in win-1251 encoding and reading it as if it was in KOI-8 encoding.
>
> Also this is called "крокозябры" (read: kro-ko-zya-bry, nonsense word, no translation) especially when reading a binary file in a text viewer.