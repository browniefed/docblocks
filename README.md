docblocks
=========

A quick way to get inputs inline. Create blocks, 2 way data binding, quickly add copies of blocks.

Only current dependency is on Ractive.js for the awesomeness of 2 way databinding mustache with extra logic templates.

All you have to do is create some blocks
```javascript

var config = {
		blocks: [
				[{blockType: 'label', cls: 'more classes'}, {blockType: 'input', name:'proj_name', cls: 'none'}],
				{ blockType: 'textarea', name:'description'},
				{ blockType: 'select', name: 'dropselect', options: [
																	{ value:"1", text:'Something 1'},
																	{ value:"2", text:'Something 2'}
																]
			}
		]
	};
````

This configuration creates a label and input both inline with each other (wrapped in an array).
Then a textarea and select on separate lines.

Then create a new DocBlock

```javascript
	var docBlock = new DocBlocks(document.getElementById('container'), config);
```

Have data already?
Pass it in the order as your blocks

```javascript
var data = [
	[
		['This is a value for label', 'Value For Input'],
		'HERE IS HTML AND IT IS IN ORDER SO YEAHHH',
		'1'
	],
	[
		['This is a value for label', 'Value For Input'],
		'HERE IS HTML AND IT IS IN ORDER SO YEAHHH2222222222',
		'2'
	]
	];
	docBlock.init(data);
```

Need the databack after you're done?

```javascript
var laterDater = docBlock.toJson();
```

I think it's easy, but I could be insane. 
One thing to note is that currently loading of data depends on an array sort order and matching the blocks order.
Not exactly the best idea. Will be adding references to add data later but for now it's what I felt like doing.


