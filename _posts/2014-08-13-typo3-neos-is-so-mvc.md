---
layout: post
title:  "TYPO3 Neos is so MVC: bridging the gap between two worlds"
date:   2014-08-13 12:23:32
tags: typo3 neos mvc
comments: true
---

This year I took a deep dive into the world of frontend. To my surprise it's not so much about "pixel-perfect" spaghetti CSS code whirled over HTML, page by page. Nowadays frontend has architecture, it has deep thought behind it. The other thing that surprised me is that not many of server-side guys seem to care about it, they think they have a separate, much more sophisticated realm of its own. Heck, even designers have become closer to understanding frontend, than the server-side people. This article will be an attempt to look at the most advanced server-side CMS with the eyes of frontend architect and MVC-lover.

##Starting point

My frontend code is modular and very well organised with the [Atomic design methodology](http://bradfrostweb.com/blog/post/atomic-web-design/), a flavor of [OOCSS](https://github.com/stubbornella/oocss/wiki) and [SMACSS](https://smacss.com/). Also I use [BEM](http://bem.info/) naming convention for classes. On top of that, [the living styleguide](http://alistapart.com/article/creating-style-guides) is generated to provide a collection of LEGO blocks for the whole design team. The CSS is lean and rational, you don't find a magic number in it often. Now I hear you say, what does it have to do with a CMS? -- It has a lot to do with Neos!

##Separation of content and presentation

The idea of separation of content and presentation has begun long ago for the world wide web. I grew up as web developer in [CSSZenGarden](http://www.csszengarden.com/) and have that idea in my guts. But this idea has a sibling in the world of classical software development -- Model-View-Controller pattern. I find this pattern very well applicable to the process of website building.

I have an idea to employ Neos to filling the gap between these two worlds, and ultimately saving the whole world wide web!


##MVC vs. NEOS

I just recently got started digging into Neos, and at first I had a question: we have yaml, we have fluid, why TypoScript2?! The answer I gave to myself: to make it look like MVC. Here follows a brief explanation of this crazy idea.

###Model

With model it's pretty clear: TYPO3CR provides a very well structured way to store and edit your content. You can query it from TypoScript the way many storage solutions would be jealous. Clear, extendable, robust, sitting on top of industry-standard Doctrine. So far so good.


###View

Rooted deeply in the frontend architecture philosophy, we have the view.

Powerful FLUID templates are very easy to overdo and stuff in with all sorts of content specific logic. Ideally the view templates should be completely logic-less.

That would allow creating encapsulated HTML+CSS+JS building blocks, which can be filled with data coming from any location. Imagine having a typical [media element], title+teaser+image, which can hold news articles, promo links to other pages and what not. In addition to that, the same news article can be rendered with different view modules, like Media, Media--Important and Media--Urgent.


###Controller

Now the question is how to connect these two realms in the right way.

For Neos we have a magical heritage from the days of Kasper -- TypoScript, now flexible as ever in its second version!

In TS2 we can easily query our model, the TYPO3CR, traverse nodes, process properties in any ways we can think of. There are still some things missing, like the node linking feature, or media image rendering, but that will soon be added to TS. Finally, if you have something unique, you can create your own TS object with custom implementation class.

Now the difference with real controller is that one controller may have actions classes, so single TS object may function more as analog of action, rather than controller. Multiple action TS objects may be joined to resemble something like a controller with the help of naming conventions or a parent prototype, that will hold relevant action objects together. TODO: think this through.


###Routing

And yes, we even have some sort of routing in the form of 'root' TS object, but there's nothing that stops us from developing this concept even further. I leave it up to your imagination.


##Conclusion

The front end and server-side people should communicate more! We have ideas to share, and here, at front end, we also have passion for code crisp architecture and beautiful design.

This article was meant as a very rough analogy, which certainly has its limits. It's more of an insight, a fresh look at how we look at our code.

DOES IT MAKE ANY SENSE AT ALL?! I need your response!

PS: my English is poor, so any sort of proof-reading and editing is always welcome.
