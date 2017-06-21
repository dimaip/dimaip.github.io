---
layout: post
title:  "Migrating content from TYPO3 to TYPO3 Neos"
tags: Typo3 Neos
comments: true
---





Unless you are starting with a fresh project, one of the first things you need to get done when starting with Neos is to migrate content from old TYPO3 installation.

To my surprise, I found almost zero information on this subject. There are [great slides](https://speakerdeck.com/kdambekalns/migrating-from-typo3-cms-to-typo3-neos) available by Karsten, but his awesome plugin is not ready yet, so I was stuck in the middle of nowhere with zero knowledge about the new system.

I hope this post will save you at least from part of frustration that I had gone through.

I needed to migrate only tt_news records, but you can easily adapt it to anything you need just grasp the methode.

## 1. Command Controller

The first question I had was where to put my migration code. Most apropriate is to create a command line task for that. Luckily Neos provides an easy way of creating command controllers. Here is [a good tutorial on how to create one](http://www.matthias-witte.net/create-your-own-typo3-flow-command-line-controller/2012/11/).

## 2. Get records from old TYPO3

Next I copied all of the relevant tables from old database to the new one.
I needed a few minutes to figure out how to deal with direct database connections, but it wasn't hard. This is a function that retrieves all records of certain tt_news category, but you can use any query you want here.

{% highlight php %}
private function getNewsByCat($cat){
	$connection = $this->entityManager->getConnection();
	$sql = 'SELECT tt_news.* FROM tt_news
INNER JOIN tt_news_cat_mm mm on tt_news.uid = mm.uid_local 
WHERE mm.uid_foreign = '.$cat." AND tt_news.deleted=0 AND tt_news.hidden=0";
	$statement = $connection->prepare($sql);
	$statement->execute();
	return $statement->fetchAll(\PDO::FETCH_ASSOC);
}
{% endhighlight %}

## 3. Node template

I had defined my own node type: Sfi.Sfi:News to hold news records. Now to actually insert anything to TYPO3CR, you need to create a NodeTemplate object for every news record, and fill it in with relevant properties.

The simple properties were easy to nail:

{% highlight php %}
$this->context = $this->contextFactory->create(array('workspaceName' => 'live'));
//This is where the news records would go
$infoCollectionNode = $this->context->getNode('/sites/sfi/news/info');

 $news = $this->getNewsByCat(1);
        foreach ($news as $newsItem) {
        	$nodeTemplate = new \TYPO3\TYPO3CR\Domain\Model\NodeTemplate();
        	$nodeTemplate->setNodeType($this->nodeTypeManager->getNodeType('Sfi.News:News'));
        	$nodeTemplate->setProperty('title',$newsItem['title']);
        	$nodeTemplate->setProperty('teaser',$newsItem['short']);
        	if($newsItem['datetime']){
        		$date = new \DateTime();
        		$date->setTimestamp($newsItem['datetime']);
        		$nodeTemplate->setProperty('date',$date);        		
        	}
        	$nodeTemplate->setProperty('date',$date);
        	$nodeTemplate->setProperty('authorName',$newsItem['author']);
        	//And finally creare the new node
        	$newsNode = $infoCollectionNode->createNodeFromTemplate($nodeTemplate);
{% endhighlight %}

### Bodytext

I wanted my new News object to be really flexible in the future, so I decided to store bodytext in the mainContent child node.

TODO: I'll need to parse bodytext for TYPO3 specific things like <link> tag.

{% highlight php %}
if($newsItem['bodytext']){
	$mainContentNode = $newsNode->getNode('main');
	$bodytextTemplate = new \TYPO3\TYPO3CR\Domain\Model\NodeTemplate();
	$bodytextTemplate->setNodeType($this->nodeTypeManager->getNodeType('TYPO3.Neos.NodeTypes:Text'));
	$bodytextTemplate->setProperty('text',$newsItem['bodytext']);
	$mainContentNode->createNodeFromTemplate($bodytextTemplate);
}
{% endhighlight %}

### Image

With images I had to spend even more time.

Here's the code:

{% highlight php %}
if($newsItem['image']){
	$assetsNode = $newsNode->getNode('assets');
	$captions = explode(',',$newsItem['imagealttext']);
	foreach(explode(',',$newsItem['image']) as $i => $img_file){
		$image = $this->importImage('*****/web/uploads/pics/'.$img_file);
		$imageTemplate = new \TYPO3\TYPO3CR\Domain\Model\NodeTemplate();
    	$imageTemplate->setNodeType($this->nodeTypeManager->getNodeType('TYPO3.Neos.NodeTypes:Image'));
    	$imageTemplate->setProperty('image',$image);
    	if(isset($captions[$i]))
    		$imageTemplate->setProperty('alternativeText',$captions[$i]);
    	$assetsNode->createNodeFromTemplate($imageTemplate);
	}
}
{% endhighlight %}

And this is how to create an image:

{% highlight php %}
private function importImage($filename){
	$resource = $this->resourceManager->importResource($filename);

	$image = new Image($resource);
	$this->imageRepository->add($image);
	$processingInstructions = Array();

	return $this->objectManager->get('TYPO3\Media\Domain\Model\ImageVariant', $image, $processingInstructions);
}
{% endhighlight %}


### Files

And finally, migrating files:

{% highlight php %}
if($newsItem['news_files']){
	foreach(explode(',',$newsItem['news_files']) as $i => $file_name){
		$asset = $this->importFile('****/web/uploads/media/'.$file_name);
		if($asset){
			$assets[] = $asset;
		}
	}
	$fileTemplate = new \TYPO3\TYPO3CR\Domain\Model\NodeTemplate();
	$fileTemplate->setNodeType($this->nodeTypeManager->getNodeType('TYPO3.Neos.NodeTypes:AssetList'));
	$fileTemplate->setProperty('assets',$assets);
	$assetsNode->createNodeFromTemplate($fileTemplate);
}
{% endhighlight %}

And a relevant file creation function:

{% highlight php %}
private function importFile($filename){
	$resource = $this->resourceManager->importResource($filename);

	$asset = new Asset($resource);
	$this->assetRepository->add($asset);
	return $asset;
}
{% endhighlight %}

### Adding properties in different content dimensions

At first create the context for the different content dimensions. 
Create the context before iterating  your data.

{% highlight php %}
$contextEN = $this->contextFactory->create(
	array(
		'workspaceName' => 'live',
		'currentDateTime' => new \TYPO3\Flow\Utility\Now(),
		'dimensions' => array('language' => array('en', 'de')),
		'targetDimensions' => array('language' => 'en'),
		'invisibleContentShown' => FALSE,
		'removedContentShown' => FALSE,
		'inaccessibleContentShown' => FALSE
	)
{% endhighlight %}
	
While iterating your data, adopt the newly generated node into the context of the other content dimension.
Be sure to do this after setting all the properties you want to keep in the new context.

{% highlight php %}
$infoCollectionNodeEn = $contextEN->adoptNode($infoCollectionNode);
$infoCollectionNodeEn->setProperty('title',$newsItem['titleEN']);
{% endhighlight %}

## Result

Here you can see the final code: [the gist](https://gist.github.com/dimaip/43d027f184e06f1cd37c).

It is a very low-quality code, just to show you the idea and basic methods, until proper migration package is released by Karsten.

**And what is your experience with migrating content from old TYPO3? Share!**
