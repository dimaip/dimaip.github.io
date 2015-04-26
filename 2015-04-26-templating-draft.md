Neos is really flexible and powerful thing, I tell ya. But there's a price to pay for that -- there are just inumerous ways you can do the same thing. This short article will try to break down the topic of page templating for you, as it's definitly the first thing one has to face when starting with new CMS.


##`root` of all things

In Neos rendering of every page starts with rendering of `/root` TypoScript path. So the easiest hello-world example would be:
```
root>
root = 'Hello Neos!'
```
With this TypoScript code, you would get "Hello Neos!" outputed for any request.
Of course you won't get far with such hello-world examples, to it makes to study closely the [DefaultTypoScript.ts2](https://git.typo3.org/Packages/TYPO3.Neos.git/blob/HEAD:/Resources/Private/TypoScript/DefaultTypoScript.ts2) file in Neos package, the place where default `root` object is defined. You would see from there, that by default, `/root` is just an object of type `TYPO3.TypoScript:Case`, handling all standard cases like shortcut pages, editPreviewMode, custom page layout and formats, and finally fallback to rendering the `/page` path, just like in old TYPO3 days.

Another important aspect is that root object has configured caching behavior, but that's a [different story](http://dimaip.github.io/2015/04/18/caching-typoscript/).


##Where to go from here

So your first steps with Neos were probably somewhere around default `/page` object, e.g.:

```
page = Page
page.body.templatePath = 'resource://My.Package/Private/Templates/PageTemplate.html'
```

That would render you an object of type `TYPO3.Neos:Page` (`TYPO3.Neos` is the default namespace, so you can omit it), setting custom template for the body part of the page. You can read in detail how to customize the rendering of your page in the [official documentation](http://docs.typo3.org/neos/TYPO3NeosDocumentation/IntegratorGuide/PageRendering.html), as that's not really the point of this article.


##Switching page templates






