---
layout: post
title:  "Testing your CSS with CSSCritic and Hologram"
date:   2014-07-07 23:23:32
tags: css styleguide hologram csscritic
---

I'm a big fan of [styleguide driven development][styleguide] and even have plans of writing a longer post about my experience with it some time. But I had one last concern left in my mind: when all website styles are so deeply woven together, *how to test is something goes wrong*?

The answer is an amazingly simple CSS test suite called [CSSCritic]. It basically makes a snapshot of every element of your website, and then compares if anything has changed via simple image diff. If the changes is wanted, you mark it as accepted and then it becomes your new reference.

![CSSCritic in action](/assets/csscritic.png)

The next question is how to generate test pages for CSSCritic with every element from our styleguide. Creating it by hand would be very laborious. Luckily I use Hologram to automatically generate styleguides from documented CSS stylesheets, and that seemed like a good place to start. 

Our styleguide is made of three long pages with atoms, molecules and organisms, according to atomic design methodology. The problem is that for CSSCritic it's best to have multiple small html files for every website unit.

Here are the steps to accomplish it:

1. In every Hologram CSS block, define a secondary category for each block of CSS, call it the same as element name. This way, in addition to main styleguide files, there will be generated small files for each page block.

2. That's cool, but adding them all to CSSCritic by hand would be too laborious, so here's my kind of hackish way to do it: create a php script on server which would return directory listing with needed files in JSON, and then add them all automatically to CSSCrititc. I modified regressioRuner.html in the following way.

{% highlight javascript %}
window.onload = function() {
csscritic.addReporter(csscritic.BasicHTMLReporter());

$.getJSON( '/relfak-style/forCritic.php', function( data ) {
$.each( data, function( key, val ) {
csscritic.add('/relfak-style/'+val);
});
csscritic.execute();
});

};
{% endhighlight %}

Saves a bit of time.

3. Also I have created another copy of Hologram specially for CSSCritic, with tweaked assets, i.e. hidden example code blocks and page header and so on. Then I have updated my grunt file so Hologram would create blocks for CSScritic and a usual styleguide.

The main issue with CSSCrititc is that it doesn't work with files from another domain, i.e. fonts embedded from fonts.com fail to load in my tests. There are workarounds, but I hadn't have time to fix it yet.

If you find this post valuable or would like to hear about this CSS testing thing in greater detail, please comment!


Check out the [Jekyll docs][jekyll] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll's GitHub repo][jekyll-gh].

[styleguide]: http://alistapart.com/article/creating-style-guides
[CSSCritic]: https://github.com/cburgmer/csscritic
