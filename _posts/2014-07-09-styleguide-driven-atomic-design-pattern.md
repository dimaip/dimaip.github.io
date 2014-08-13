---
layout: post
title:  "Styleguide-driven Atomic Design pattern"
date:   2014-07-07 23:23:32
tags: css styleguide atomic-design
comments: true
---

**THIS POST IS A DRAFT, SORRY!**

#Preface

I wanted to write a long post about all and everything in web development, but this proved to be very difficult, that's why I turn it into a collection of links and just an overview of technology, and write so more detailed posts on each technology later.

#The problem
I have learned CSS back in 2005. Since then I've been thinking about writing CSS as a rather boring and mundane task. It's nothing like Domain Driven Design or MVC architecture, just a number of declarations bound by a selector.
Over time I've noticed one ugly tendency: as the project grows, CSS code becomes the most ugly code of the project, looking like some stinking spaghetti. During last few months, I've discovered how flawed my practices had been, now I want to share the fruit of my latest discoveries with you, my dear reader!

The BAD way:

> 1. Designer prepares design combs in Photoshop and hands it in to you.
> 2. You prepare a semantic HTML5 markup, with all of those `section` and `article` and what not.
> 3. Then you go page by page and write CSS code, targeting your html elements and so-called 'semantic' class names like `.news`

What you got:

> 1. CSS that is a pain to maintain. For every new page of website you have to write new code. 
> 2. Inconsistent design: how many shades of grey has designer used? Different margins on every page. You bet!
> 3. CSS tied deeply with HTML structure. Change markup and styles would have to change too. No good!
> 4. Designer and developer don't have a common language to talk about design.

Here comes a set of patterns and tools to remedy the situation!

#Styleguide
The foundation for any complex website design should come in a form of a styleguide -- a collection of reusable modules and patterns, out of which the pages are built. 
Styleguide is a bridge between a designer and a developer, a common language for the project. It takes time to build, but then constructing new pages becomes like playing Lego -- a lot of fun!

Nowadays styleguides don't come in the form of multipage PDF documents -- styleguide must live in a browser and be deeply tied with your CSS code, in fact that's where it must originate from. But more on that latter.

To read:
1. alistapart 

#Atomic design
This may be my most valuable discovery -- atomic design pattern by Brad Frost.
Atomic design is a language to talk about your web page elements: breaking design down to atoms and molecules is very energising!
An *atom*: smallest particle of your design, something that is undividable and used everywhere like different types of headings, base colours and so on. By itself it may not carry a lot of sense.
A *molecule*: a molecule usually joins a couple of atoms. i.e. a searchbox molecule may consist of a label + input field + a button atoms.
An *organism*: even larger part of webpage. Consists of a combination of molecules i.e. a website header organism = site-title+menu+searchbox molecules.

For more details head straight to Brad Frost's [Pattern lab], you'll find some great examples there, though I can't recommend his tools or the style of writing CSS he uses.


##Atoms
* Unbreakable units of design.
* Rarely applied directly in HTML, more like silent placeholders -- more often extended in molecules.

##Molecules
* Compound units, consisting of multiple _atoms_.
* Include atoms via SASS `extend`.
* In backend, molecules may be defined in separate partials, though not necessary.
* We don't create @extend molecules as we do with atoms.

##Organisms
* Organisms, in its own place, consist of multiple molecules. 
* Almost certainly each organism is defined in separate partial in backend.

With atomic design, now you have a ubiquitous way to talk about your design elements with absolutely non-techie people (like designers). 

#OOCSS, SMACSS

#BEM
Block, Element, Modifier, a great naming scheme for your CSS classes.
```
.block__element--modifier
.search-box{}
.search-box__button{}
.search-box--small{}
```
Getting your mind around BEM.

#Designer+Developer
Every designer should understand the medium he's designing for, that's why any designer must know how to code!
For the same reason, and developer should now something about #UX and the basics of designing things.
Ideal situation, of course, is when designer and developer are the same person!
[link to spiekermann]

#Tools
Now for the little nifty tools I use to implement the forementioned.

* Hologram -- helps you to build styleguides directly from your CSS stylesheets.
* CSScritic -- CSS _IS_ testable! Especially helpful during refactoring.
* Browsersync -- better then live-reload: no need for a browser extension, view your site simultenuasly on multiple devices. Who would resist of building a test lab?
* GruntJS -- Here's my grunt file to automate the tools above.
* SublimeText -- userfreindly editor with hell of power. There's even a VIM mode!


#PSD is a clue
#Web Components?
