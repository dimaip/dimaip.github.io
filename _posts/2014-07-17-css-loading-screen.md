---
layout: post
title:  "Loading screen for CSS"
date:   2014-07-17 18:13:32
tags: css optimization
comments: true
---

Ever since Google PageSpeed has began warning us about [Optimizing CSS Delivery](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery) and render-blocking JS and CSS I began to be uneasy about this issue. When on mobile, having to wait for minutes staring at the blank white screen can put people off.
So how to fix it?

##Defer loading of main CSS

This is easily solved by loadCSS:

{% highlight html %}
<script type="text/javascript">
    function loadCSS(e,t,n){"use strict";var i=window.document.createElement("link");var o=t||window.document.getElementsByTagName("script")[0];i.rel="stylesheet";i.href=e;i.media="only x";o.parentNode.insertBefore(i,o);setTimeout(function(){i.media=n||"all"})}
    loadCSS( "styles.css" );
</script>
<noscript>
  <link href="style.css" type="text/css" rel="stylesheet"/>
</noscript>
{% endhighlight %}

Now the page shows up immediately after the HTML has been loaded. But of course it shows up unstyled, which may scare people off even more than the white screen.

##The hard solution

The best thing we could do is to extract the styles which are responsible for loading above-the-fold content and inlining them in your HTML. But if your CSS is written in modular way (stuff like atomic design, OOCSS), you'll need almost all of your base styles, grids and so on to render the above the fold stuff. And if your CSS code is dynamically generated, you may be unable to automatically inline it anyways.
So I came-up with a very simple hackish solution.

##CSS loading screen

While the poor user on mobile is waiting for your stylesheet to load, show him the loading screen so he would now that the page is not dead. On that loading screen it is possible to show some essential information like contacts or working schedule. When the CSS is onle fully loaded, the message dissapears.

The implementation in the most trivial form could be something like this:

{% highlight html %}
<style>
body:before {
    content: 'The page is loading...';
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 100;
    
    text-align: center;
    font-size: 24px;
    padding-top: 24px;
    font-family: sans-serif;
}
</style>
{% endhighlight %}

And in your stylesheet add something like this:

{% highlight css %}
body:before {display: none;}
{% endhighlight %}

Once the stylesheet is loaded, the loading screen disappears. 
Of course if you need something more fancy, you can add one more element to your HTML and style it the way you want, this is just an example.

#Summary

1. Defer loading of main CSS
2. Add some simple loading screen which would show up instead of the usual white screen. Stuff it with essential information for mobile users if needed.
3. Hide it from CSS, once it's loaded.

##Where to go next

#### 1. Defer loading JS 

Really simple:

{% highlight js %}
function downloadJSAtOnload() {
    var element = document.createElement("script");
    element.src = "your.min.js";
    document.body.appendChild(element);
}
if (window.addEventListener)
window.addEventListener("load", downloadJSAtOnload, false);
else if (window.attachEvent)
window.attachEvent("onload", downloadJSAtOnload);
else window.onload = downloadJSAtOnload;
{% endhighlight %}

#### 2. Ajax-load below-the-fold content

If your page is very heavy, do it! Lazy-load your news articles or whatever secondary content you have there. Just don't overdo it!

#### 3. Optimize CSS

Minify, concatenate, make sure there are no unused styles left (unCSS to the rescue!).

##Your feedback

So now the important part, what do you think about this idea of a loading screen for CSS? Have I missed anything horrible? Comment or tweet me, I'd love to hear some feedback, especially critical!
