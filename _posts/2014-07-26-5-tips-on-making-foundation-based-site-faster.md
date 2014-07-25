---
layout: post
title:  "5 tips on making Foundation based site faster"
date:   2014-07-26 03:23:32
tags: css optimisation foundation
comments: true
---
I'm so ashamed for the performance of the sites I used to build. Hundreds of requests, megabytes of code… oh poor mobile visitors! I knew I had to stop being lazy and finally do something about it!
In this post I'm going to suggest a few easy steps towards making your css framework based sites more speedy.

## 0. Minimize the number of requests

If your CSS and JS is not minified and concatenated, stop reading this article, [uglify it](https://github.com/mishoo/UglifyJS), and then return. You just have no excuse! Then look around and see how else you may minimize the number of requests.

## 1. Partial load of components
This one is easy. Don't import all of the Foundation's components into your stylesheet, you won't need them all! Foundation is really good at making code modular, that's why I'm not ashamed of using it even on production website, and only for mock-ups.
Comment out general Foundation import: 

```
//@import "foundation";
```

And only import things as you need them:

```
@import
  "foundation/components/grid",
  "foundation/components/block-grid";
```

## 2. Don't output unneeded classes to HTML, use mixins

Another strong point of Foundation, is that you can avoid outputing unneccessary style defenitions at all.
For example, for the `block-grid` component you probably don't need all of possible definitions for different screens and sizes in your code. 
Solution: use mixins!
First disable output of block-grid's styles into the stylesheet. Go to Foundation's `_settings.scss` and add: `$include-html-block-grid-classes: false;`

And than use desired mixin where needed in your code:

```
.YourGrid-GridItem{@include block-grid(3);}
```

For more advanced examples lookup [the docs](http://foundation.zurb.com/docs/) and [the source code](https://github.com/zurb/foundation/tree/master/scss/foundation/components).

## 3. Check for unused styles

This is a good test of how well you did with previous advices. Determine how many style definitions you have left in your stylesheet. I used the extension for Firefox called [Dust Me Selectors](https://addons.mozilla.org/en-US/firefox/addon/dust-me-selectors/), you may look for other tools as well.
After optimization, I only had about 15% of overhead in CSS, which is only I couple of KB's. I suggest that you try to optimize CSS on your own, but if you give up, try to use [unCSS](https://github.com/giakki/uncss) utillity. It works as a [grunt plugin](https://github.com/addyosmani/grunt-uncss), so there should be no problem adding it to your Gruntfile.js. 

## 4. Lazy load everything you can

There's that horrible word: render-blocking content. It means that while your JS and CSS are loading, your user will see nothing but blank screen. That makes users sad, you know, especially on the go.

### JS

If you have not been overusing JavaScript, your page should look pretty fine without it, except for few animations. So why make people wait for your JS code to load?

I've seen people using `defer` and `async` attributes for this purpose, but with most browsers it wouldn't work! Use this old school code instead:

{% highlight html %}
    <script type="text/javascript">
    function downloadJSAtOnload() {
    var element = document.createElement("script");
    element.src = "/path/to/your.js";
    document.body.appendChild(element);
    }
    if (window.addEventListener)
    window.addEventListener("load", downloadJSAtOnload, false);
    else if (window.attachEvent)
    window.attachEvent("onload", downloadJSAtOnload);
    else window.onload = downloadJSAtOnload;
    </script>
{% endhighlight %}

You can also take part of the javascript, responsible for rendering above the fold part of your page, and inline it in HTML.

### CSS

Yes, CSS is render-blocking too. If you have a large CSS file you'll make your user stare at a blank screen while CSS is loading. On mobile, that may be a problem.

There is only one real solution: separate CSS code for above-the-fold content from your main CSS, inline it into your HTML and defer loading of main CSS with this script:

{% highlight html %}
    <script type="text/javascript">
    function loadCSS(e,t,n){"use strict";var i=window.document.createElement("link");var o=t||window.document.getElementsByTagName("script")[0];i.rel="stylesheet";i.href=e;i.media="only x";o.parentNode.insertBefore(i,o);setTimeout(function(){i.media=n||"all"})}
    loadCSS( "/path/to/your.css" );
    </script>
    <noscript>
      <link href="/path/to/your.css" type="text/css" rel="stylesheet"/>
    </noscript>
{% endhighlight %}

But if your CSS is written in a modular way, it will be very hard to separate the code which is responsible just for this part of the page. There are tools which help you do it, but I decided that in my case it's not worth it.

To make the pain of mobile users a little easier, I've thought out an idea of using CSS loading screen, which will reassure the user that the page is loading indeed, and may even show some critical information. Here I've written about this technique in greater detail: [Loading screen for CSS](http://dimaip.github.io/2014/07/17/css-loading-screen/)

### HTML

If your landing page is very heavy, I suggest to leave only the most critical top-most parts in HTML, and load the rest with AJAX requests. News, related articles, all but the most important content are a good candidates for being pushed out of main HTML.
It should be pretty straightforward using jQuery, so I'm not going to write about it here. 

## 5. Learn atomic design or other OOCSS technique

This is probably the hardest part: learn to write CSS in a modular way! This is not just some technique, and therefore requires you [put your thought in it]. Google-up [OOCSS](https://github.com/stubbornella/oocss/wiki), [SMACSS](http://smacss.com/), [atomic design](http://bradfrostweb.com/blog/post/atomic-web-design/) and learn to think about your CSS code in a new way. I'm a huge fan of development based on Atomic design and [living styleguide](http://alistapart.com/article/creating-style-guides).
Once refactored, your code size will decrease dramatically and will scale great! And belive it or not, maintanace will become a joy! :)



##Conclusion

First head to [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) and see how bad things are. Go for the low hanging fruit first. Concatenate, minimize, drop unused code. If that's not enough, optimize CSS and JS delivery.

If you are lazy to do all of these optimizations by hand, try to use [Google PageSpeed Apache Module](https://developers.google.com/speed/pagespeed/module), I haven't tried it, but seems cool.

Questions? Comments? Have I missed anything vital?
