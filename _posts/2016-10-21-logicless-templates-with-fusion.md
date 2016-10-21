---
layout: post
title:  "Logicless templates, smart Fusion objects"
description: "Personal reflections on the past year and some naive New Year's resolutions"
image: "http://dimaip.github.io/assets/looking-back.jpg"
tags: neos
comments: true
---


When people are starting out with Neos, the first thing they usually see is its templating engine Fluid. Those switching from TYPO3 would feel right at home, as these CMSs share the templating system since some years, but even to newcomers it looks really familiar, sharing the same concepts as other popular templating engines (Twig, Liquid that is used in this Jekyll blog & co.): partials, layouts, viewhelpers and so on.

But after some time you might start to notice that Fluid is not the only thing that is relevant to content rendering in Neos, that is when you meet Fusion. The concept of Fusion seems frightening at first because I’m sure it’s like nothing you’ve ever seen before. But with time you start to like it more and more and start doing more things with it. But the functionality of Fluid and Fusion overlap to great extent: Fluid helpers vs. Eel helpers, Fluid variables vs. context variables and so on, so using two things at the same time greatly increases mental complexity when reasoning about your project. Do I use a partial here or a Fusion object? Should I strip tags from this value in Eel or in Fluid?
That’s a conceptual mess, and I’m sure we can do better with some clear guidelines!

## Moving the logic to Fusion from Fluid

Fluid templates are great for storing your HTML markup, as long as they are not bloated with logic. Fusion is much better for encapsulating logic, as it’s more declarative, better for unplanned extensibility and is definitely more powerful. Let’s examine how to move most logic from Fluid to your Fusion objects.

### f:for -> TypoScript:Collection

Let’s render a list of blog posts.

The way to do it in Fluid would be:

```
<f:for each="{blogPosts}" as="{blogPost}">
    <div class="BlogPost">
        <h2>{blogPost.title}</h2>
        <div>{blogPost.teaser}</div>
    </div>
</f:for>
```

Simple, huh? It is, but it’s not very componentized and declarative. Imagine you’d want to render the latest blog post in a sidebar with the same design? Such template would need a refactoring, perhaps to using partials, but more on that later.

Now the same logic with Fusion:

BlogPost.html:

```
<div class="BlogPost">
    <h2>{blogPost.title}</h2>
    <div>{blogPost.teaser}</div>
</div>
```

BlogPost.ts2:

```
prototype(Your.NameSpace:BlogPost) < prototype(TYPO3.TypoScript:Template) {
    templatePath = ‘resource://Your.NameSpace/.../BlogPost.html’
    blogPost = ${node}
}
prototype(Your.NameSpace:BlogPostsList) < prototype(TYPO3.TypoScript:Collection) {
    collection = ${blogPosts}
    itemName = ‘node’
    itemRenderer = Your.NameSpace:BlogPost
}
```

At first sight, this looks a lot more cryptic and verbose, but also it’s much more functional and modular: each object does one specific purpose, we clearly map the array of blog posts to the rendering object (yes, it’s exactly how we use `.map()` in React).

### f:if -> @if

Fluid conditions are notoriously hard to understand and get right. Eel to the rescue!
If you want to disable rendering of some TypoScript path based on a condition, you should use `@if`:

```
renderMeOnlyInBackend = ‘Secret stuff for logged in folk!’
renderMeOnlyInBackend.@if.onlyInBackend = ${node.context.inBackend}
```

Sometimes it’s just more comfortable to use `f:if` viewhelper in Fluid, but if you don’t want to mess with its weird condition rules, you can map the condition to a template variable, and do all of the hard stuff in Eel. E.g.:

Your.ts2:

```
{
shouldDisplayTeaser = ${node.context.inBackend || String.stripTags(q(node).property(‘teaser’)) ? true : false}
}
```

Your.html:

```
<f:if condition="{shouldDisplayTeaser}">
    <div class="Teaser">{teaser -> f:format.raw()}</div>
</f:if>
```

### f:section -> Fusion object

Fluid has a powerful partial mechanism with `f:section` and `f:render`. It’s helpful for reusing some blocks of functionality. But once you have some components done via partials and some via Fusion objects, it becomes hard to find things. Let’s just use Fusion objects all the time instead of partials, shall we? They feel more modular and are way more powerful anyways.

The Fluid way:

Header.html:

```
<header><h1>My cool website</h1></header>
```

Page.html:

```
<f:render partial="Header"/>
<div>Website content</div>
```


Header.html:

```
<header><h1>My cool website</h1></header>
```

Header.ts2

```
prototype(Your.NameSpace:Header) {
    templatePath = .../Header.html
}
```

Page.ts2:

```
{
    header = Your.NameSpace:Header
}
```

Page.html:

```
{header -> f:format.raw()}
<div>Website content</div>
```

Yet again, in this case, Fusion example looks more verbose, but now it’s much easier to separate data dependencies needed to render the Header in its own Fusion object, so your code becomes less convoluted. And the main benefit is consistency: every piece of reusable code is now a Fusion object, you know where to look for it, you know how to reason about it.

### f:layout -> @process

Aha, you might say, partials are easy to replace, but what would you do about the layout mechanism?

Take this Fluid example:

Layout.html:

```
<div class="Wrapper"><f:render section="main"/></div>
```

Page.html:

```
<f:layout name="Layout"/>
<f:section name="main">
<div class="Content">The content</div>
</f:section>
```

With layout mechanism in fluid we have a kind of inversion of control: template declares itself with what to wrap it.

Let’s try to do the same thing in Fusion without the help of Fluid:

```
prototype(Your.NameSpace:Layout) < prototype(TYPO3.TypoScript:Template) {
    templatePath = .../Layout.html
    value = ${value}
}
```

Layout.html:

```
<div class="Wrapper">{value -> f:format.raw()}</div>
```

Page.ts2:

```
prototype(Your.NameSpace:Page) {
    templatePath = .../Page.html
    @process.layout = Your.NameSpace:Layout
}
```

Page.html:

```
<div class="Content">The content</div>
```

Here we use Fusion’s `@process` mechanism to wrap our Page object with layout tags. I would argue that it’s just as readable as our Fluid example.

In cases when you need multiple sections in a layout, you can do it like this:

```
prototype(Your.NameSpace:Layout) < prototype(TYPO3.TypoScript:Template) {
    templatePath = .../Layout.html
    main = ${main}
    sidebar = ${sidebar}
}
```

Layout.html:

```
<div class="Wrapper">{main -> f:format.raw()}</div>
<div class="Sidebar">{sidebar -> f:format.raw()}</div>
```

Page.ts2:

```
prototype(Your.NameSpace:Page) < prototype(Your.NameSpace:Layout) {
    main = ‘Main content’
    sidebar = ‘Sidebar content’
}
```

So the effect of this would be the same as using a Fluid layout, and I believe semantically it’s pretty clear as well.

### Inline editing

Inline editing viewhelper add a lot to template pollution, let’s move them to Fusion too.

```
prototype(Your.NameSpace:SomeObject)  {
title = T:Tag {
        content = ${q(node).property(title)}
        @process.editable = ContentElementEditable {
            property = 'title'
        }
    }
    @process.editable = ContentElementWrapping
}
```

And in the template:

```
{title -> f:format.raw()}
```

### Other ViewHelpers

Now you are probably using `m:media`, `neos:link.node`, `f:format.date` and maybe some other viewhelpers. The good news, most of them are implemented as either Fusion objects (`NodeUri`, `ImageUri`) or as Eel helpers (`Date.format`). If there’s some stuff missing, create an issue or even submit a pull request yourself: creating Eel helpers is no rocket science!

## Filesystem Layout

Now since for almost every object we have a combination of two files now (`.ts2` + `.html`), I find it quite natural to store them together in one folder, because we would almost always be editing or refactoring them simultaneously.

So here is my basic filesystem layout:

```
Packages/Sites/Sfi.Site/Resources/Private/TypoScript/Root.ts2
Packages/Sites/Sfi.Site/Resources/Private/TypoScript/NodeTypes/MainPage.ts2
Packages/Sites/Sfi.Site/Resources/Private/TypoScript/NodeTypes/MainPage.html
Packages/Sites/Sfi.Site/Resources/Private/TypoScript/NodeTypes/BlogPost.ts2
Packages/Sites/Sfi.Site/Resources/Private/TypoScript/NodeTypes/BlogPost.html
Packages/Sites/Sfi.Site/Resources/Private/TypoScript/NodeTypes/Teaser.ts2
Packages/Sites/Sfi.Site/Resources/Private/TypoScript/NodeTypes/Teaser.html
Packages/Sites/Sfi.Site/Resources/Private/TypoScript/NodeTypes/...
Packages/Sites/Sfi.Site/Resources/Private/TypoScript/Objects/Footer.ts2
Packages/Sites/Sfi.Site/Resources/Private/TypoScript/Objects/Footer.html
Packages/Sites/Sfi.Site/Resources/Private/TypoScript/Objects/BlogPostsList.ts2
Packages/Sites/Sfi.Site/Resources/Private/TypoScript/Objects/...
```

I always prefer flat to nested so it's easier to find things, so I divide my Fusion objects only into two groups: those that are related to rendering a specific nodetype (`TypoScript/NodeTypes`) and those that are not (`TypoScript/Objects`).

## Why is this cool? (a.k.a. conclusion)

If Fluid is responsible for only holding HTML markup, and all the rest of the rendering logic is encapsulated in Fusion, that gives you a lot of benefits.

Less mental overload. The rendering process becomes transparent and predictable, you always know where to look for your objects.
The templates are not coupled with any external partials or layouts, all of their data dependencies are going through the Fusion object, so that makes it easy to just grab some code from some old project, without worrying about side-effects.
It’s easier to understand templates for designers: they become just plain HTML with placeholders.
The rendering process is even more modular, functional and declarative now. It will scale like crazy!