---
layout: post
title: "[note] Don't forget to include TS in Neos!"
date: {}
tags: neos typoscript
comments: true
published: true
---

Note to whom it may concern.
I assumed that TYPO3 Neos includes TypoScript automatically for every node type.  
Of course when I tried to access some property from template, which I thought I had defined, I got the following  error:

```
No "page/body/content/main/default/element/itemRenderer/default/element/column0" TypoScript object found. Please make sure to define one in your TypoScript configuration. (20140723102105f65989)
```

The solution is simple: include the relevant typoscript file from your root typoscript file!

```
include: NodeTypes/YourElement.ts2
```

It was my fault, but still I wish the docs would mention it somehow.