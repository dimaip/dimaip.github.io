---
layout: post
title:  "Cache Like a Pro: Understanding the Caching Mechanism in Neos"
tags: neos typoscript caching
comments: true
---

This week I finally learned how caching mechanism works in [Neos](http://neos.typo3.org). Time to share!

##Basic concepts

A quick summary of what we know from the [official documentation](http://docs.typo3.org/neos/TYPO3NeosDocumentation/IntegratorGuide/ContentCache.html).
- Each TypoSript path may have its own caching configuration of type `cached`, `embed` and `uncached`. By default all paths are 'embeded' into their paraent's cache entry.
- For configuration of type `cached` there are two things you need to configure: what defines a unique cache entry (`entryIdentifier`) and in what circumstances it should be flushed (`entryTags`).
- For configuration of type `uncached` you must not forget to fill the `context` configuration with all of the context variables needed for rendering given path (like `node` or `documentNode`).

##Some examples

So in most cases you don't need to touch cache configuration at all. Usually you would define new cache entries for the sake of flushing the cache for content that is comming from other pages, so the `entryTags` configuration would be closely related to the FlowQuery you use to pull in your content. There are three main options you have for configuring entry Tags: `NodeType_[My.Package:NodeTypeName]`, `Node_[Identifier]` and `DescendantOf_[Identifier]`.

Here are a few examples from our in-house news package:


###Flush cache when child of certain node changes

With this FlowQuery I pull in news from certain, dynamically configured node: `collection = ${q(rootNode).children('[instanceof Sfi.News:Listable]').get()}`

And here's the corresponding entryTag: `${'DescendantOf_' + rootNode.identifier}`.

###Flush cache when node of certain type changes

With this FlowQuery we pull-in only inportant news of special type to the carousel on main page: `collection = ${q(site).find('[instanceof Sfi.News:ImportantMixin]').filter('[important = TRUE]').get()}`

And here's the corresponding entryTag: `${'NodeType_Sfi.News:ImportantMixin'}`

So far things look really easy, but wait, there are a few nuances that would make you scratch your head.

##Gotchas

###ContentCollection inside of Content

Neos has this little piece of configuration that caused me a lot of trouble:

```
prototype(TYPO3.Neos:Content) {
	prototype(TYPO3.Neos:ContentCollection) {
		# Make ContentCollection inside content node types embedded by default.
		# Usually there's no need for a separate cache entry for container content elements, but depending on the use-case
		# the mode can safely be switched to 'cached'.
		@cache {
			mode = 'embed'
		}
	}
}
```

Most people render their root content collection from their page object (or any object inheriting from TYPO3.Neos:Document), but not me. I always have some proxy object, inheriting from TYPO3.Neos:Content, inside of which I render the root content collection. The result? -- ContentCollections get embeded into the page object, so if I change some element inside of that ContentCollection and refresh the page, the changes are gone. Here's how to fix it:

```
prototype(TYPO3.Neos:Content).prototype(TYPO3.Neos:ContentCollection).@cache.mode = 'cached'
```

###Pagination

When using typo3cr pagination widget, the state of the page is defined not only by the TypoScript path, but also by pagination argument in request, so the `entryIdentifier` must include: `pagination = ${request.pluginArguments.YOUR_PAGINATION_WIDGET_ID.currentPage}`. Actually this is one of the rear cases where you need to add something non-standard to `entryIdentifier`. However, guess what, this config wouldn't work! The reason is given in the small note in documentation, and I bet you overlooked it:

> In the cache hierarchy the outermost cache entry determines all the nested entries, so it's important to add values that influence the rendering for every cached path along the hierarchy.

Now we know how to make it work, add the same config to all parent cache definitions:

```
page.path.to.your.objct.@cache.entryIdentifier.pagination = ${request.pluginArguments.YOUR_PAGINATION_WIDGET_ID.currentPage}
page.@cache.entryIdentifier.pagination = ${request.pluginArguments.YOUR_PAGINATION_WIDGET_ID.currentPage}
root.@cache.entryIdentifier.pagination = ${request.pluginArguments.YOUR_PAGINATION_WIDGET_ID.currentPage}
```

So the rule is, _if you add something non-standard to entryIdentifier, you must also include it in all parent cache defintions_.

##More cool stuff comming

In Neos 2.0 release there'll be a [very reasonable addition called GlobalCacheIdentifiers](https://review.typo3.org/#/c/36210/). Basically it stores all global things which influnce the rendering of a node, acting as default value for a nodeIdentifier: by defualt it's `format` and `baseUri`, but you can add more things there. So in Neos 2.0 we would no longer need to specify `entryIdentifier` in most of the cases.

More additions are comming in the future, like [runtime cached segments](https://review.typo3.org/#/c/36239/), but even what we have now if pretty awesome.

I hope this post has helped you to quickly get up to speed with caching concepts in Neos. If not, write a caching-related question in the comments and I'll try to help.

**Big thanks to Aske Ertmann and Christian Müller for help in understanding all this stuff!**
