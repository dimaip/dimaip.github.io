---
layout: post
title: My hiccups with TYPO3 Neos
date:   2014-07-23 12:13:32
tags: neos typoscript
comments: true
published: true
---

## 1. Forgot to include TypoScript

I assumed that TYPO3 Neos includes TypoScript automatically for every node type.  
Of course when I tried to access some property from template, which I thought I had defined, I got the following  error:

```
No "page/body/content/main/default/element/itemRenderer/default/element/column0" TypoScript object found. Please make sure to define one in your TypoScript configuration. (20140723102105f65989)
```

TODO: lookup what this does:

```
TYPO3:
  Neos:
    typoScript:
      autoInclude:
```

It was my fault, but still I wish the docs would mention it somehow.

**Time wasted**: 2 hours.

**The solution**: include the relevant typoscript file from your root typoscript file!

```
include: NodeTypes/YourElement.ts2
```

---------

## 2. Property names must not contain dashes!

Here's my second hiccup: when trying to implement Foundation Grid, I names one of the properties `large-offset`. Of course it didn't work. 

**Time wasted**: 15 min.

**Solution**: use lowerCamelCase when naming NodeType properties.
