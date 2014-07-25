---
layout: post
title:  "5 tips on making your Foundation based site faster"
date:   2014-07-18 23:23:32
tags: css optimisation foundation
comments: true
---
I'm so ashamed for the performance of the sites I used to build. Hundreds of requests, megabytes of code… oh poor mobile visitors! I knew I had to stop being lazy and finally do something about it!
In this post I'm going to suggest a few easy steps towards making your css framework based sites more speedy.

## 1. Partial load of components
This one is easy. Don't import all of the Foundation's components into your stylesheet, you won't need them all! Foundation is really good at making code modular, that's why I'm not ashamed of using it even on production website, and only for mock-ups.
Comment out general Foundation import: 

```
@import "Foundation";
```
And only import things as you need them.
```
@import …
```

## 2. Don't output unneeded classes to HTML, use mixins

Another strong point about Foundation, is that you can avoid outputing unneccessary style defenitions at all.
For example, for the `block-grid` component you probably don't need all of possible definitions for different screens and sizes in your code. 
Solution: use mixins!
First disable output of block-grid's styles into the stylesheet: `asdfas`
And than import desired mixin where needed.
```

```

## 3. Remove unused styles (with unCSS)

This is a good test of how well you did with previous advices. Determine how many style definitions you have left in your stylesheet. I used the extension for Firefox called AAA, you may look for other tools as well. After optimization, I only had about 15% of overhead in CSS, which is only I couple of KB's. I suggest that you try to optimize CSS on your own, but if you give up, try to use unCSS utillity. It works as a grunt plugin, so there should be no problem adding it to your Gruntfile.js. 

## 4. Lazy load everything you can

### JS

If you have not overused JavaScript, your page should look pretty fine without it, except for few animations. So why make people wait for your JS code to load?
I've seen people using `defer` and `async` attributes for this purpose, but with most browsers it wouldn't work! Use this old school code instead:

```
```
### CSS

Yes, CSS is render-blocking too. If you have a large CSS file you'll make your user stare at a blank screen while CSS is loading. On mobile, that may be a problem.

There is only one real solution: separate CSS code for above-the-fold content from your main CSS, load it first and defer loading of main CSS with this script:

```
```

But if your CSS is written in a modular way, it will be very hard to separate the code which is responsible just for this part of the page. There are tools which help you do it (), but I decided that in my case it's not worth it.

To make the pain of mobile users a little easier, I've thought out an idea of using CSS loading screen, which will reassure the user that the page is loading indeed, and may even show some critical information. Here I've written about this technique in greater detail: []()

### HTML

If your landing page is very heavy, I suggest to leave only the most critical top-most parts in HTML, and load the rest with AJAX requests. News, related articles, all but the most important content are a good candidates for being pushed out of main HTML.
It should be pretty straightforward using jQuery, so I'm not going to write about it. 

## 5. Learn atomic design or other OOCSS technique

This is probably the hardest part: learn to write CSS in a modular way! This is not just some technique, and therefore requires you [put your thought in it]. Google-up OOCSS, SMACSS, atomic design and learn to think about your CSS code in a new way. 
Once refactored, your code size will decrease dramatically and will scale great! And maintanace will become a joy, guranteed! :)



##Conclusion
Go for the low hanging fruit.
