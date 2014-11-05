---
layout: post
title:  "The TypoScript manifesto"
tags: typo3 neos typoscript
comments: true
---

##Love thy TypoScript code

TypoScript2 is an amazing language, that suits TYPO3Neos and TYPO3CR perfectly. If you do not like it, get to meet it better, you will.

Think about TypoScript as a sort of [Controller layer, between TYPOCR(Model) and Fluid(View)](http://dimaip.github.io/2014/08/13/typo3-neos-is-so-mvc/).


##Keep templates as lean and logic-less as possible

Every time you have to iterate over objects in a Fluid template think twice: maybe the collection of things you iterate over would benefit from having a custom TypoScript renderer.

[Look ma, no loops!](https://github.com/dimaip/Sfi.Erm/blob/master/Resources/Private/Templates/NodeTypes/DoctorsList.html)


##Keep your code domain-centric

Remember the times of extending EXT:News to render your custom content? Never again!
Don't resist a pleasure of having your model stay as close to your domain language as possible. (Just do not bring the domain laguage with you to CSS class names! Read about OOCSS/Atomic design first.)
