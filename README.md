###SHAPE.JS

**Shape.js** is a lightweight Javascript tool to create invisible shape around which content flows. It is inspired by [CSS Exclusions](http://caniuse.com/#feat=css-exclusions) ([W3C draft](https://www.w3.org/TR/css3-exclusions/)). It features basic hyphenation, support for [Hypher.js](https://github.com/bramstein/hypher), all this without dependencies.

You can see a live demo [here](http://jdmcreator.github.io/lab/shapejs/demo.html).

Version 0.1 alpha

#### Support

**Chrome** : Supported

**Firefox** : Supported

**Edge** : Supported

**IE 10+** : Supported

*SHAPE.JS results on Edge/IE10+ are degrading a little.*

#### Documentation

##### SHAPE object

You can access the SHAPE object using `window.SHAPE`

###### Properties

**refreshOnResize** :  `Boolean`. Whether shapes should be refreshed on window resize. (default : true)

###### Methods

**changeDefaultHyphenCharacter(string character)**

Change all hyphen characters to `character`. The default character is U+002D (-).
```javascript
window.SHAPE.changeDefaultHyphenCharacter("\u2010");
```

**forEach(function fn)**

Call the function `fn` for each shape registered, with the `SHAPEObject` as `this`. If the function `fn` return a false value that is not `undefined`, the loop stops.
```javascript
window.SHAPE.forEach(function(){
	console.log(this.id);
});
```


**refreshAll(boolean force)** 

Refresh every shape. If `force` is set to `true`, the result should be perfect, but will take longer.

*You should always set `force` to `true`.*

```javascript
window.SHAPE.refreshAll(true);
```

**removeAll(** Optional `HTMLElement` **element )** 

Remove every shape from the document and normalize `element` (or `document.body`)

```javascript
window.SHAPE.removeAll(true);
```

##### SHAPEObject object

You can create a  `SHAPEObject` Object using `window.SHAPE(options)`.

###### Options

**height** : `Number`. Height of the shape, in pixels.

**hyphenation** : *Optional*. `Function`. Function that will define hyphenation rules for the document. See the section relative to hyphenation for more information.

**hyphenCharacter** : *Optional*. `String`. Hyphen character. If not specified, the default hyphen character is used (See `SHAPE.changeDefaultHyphenCharacter`).

**left** : `Number`. Position of the shape relative to the left of the document, in pixels.

**margin** : *Optional*. `Number`. Margin of the shape, in pixels.

**top** : `Number`. Position of the shape relative to the top of the document, in pixels.

**width** : `Number`. Width of the shape, in pixels.

```javascript
var myshape = window.SHAPE({
	left : 25,
	top: 25,
	width: 50,
	height : 50,
	// Optional values are next
	margin : 5,
	hyphenation : window.SHAPE.HYPHENATION.NH_WORD
});
```

###### Properties

**id** :  `String`. Autogenerated ID of the shape.

**shape** :  `Object`. Object with **bottom**, **left**, **right** and **top** properties.

###### Methods

**applyToNodes(**`Misc` **element1,  **`Misc` **element2, ..., **`Misc` **elementN)** 

Apply the shape to each node specified in the function arguments. `Misc`  means each argument can be an `Array`, a `HTMLElement`, a `TextNode` or a `NodeList`.

```javascript
var element = document.getElementById('element');
window.requestAnimationFrame(function(){
	myshape.applyToNodes(
		element,
		element.nextSibling.querySelectorAll("p")
	);
});
```

```javascript
window.requestAnimationFrame(function(){
	myshape.applyToNodes(document.body);
});
```

*You should use *`window.requestAnimationFrame` *when calling this function because of its heavy use of ressources.*

**cleanMemory()** 

Cleans the internal memory of SHAPE.JS to reflect changes to the DOM. It allows `SHAPEObject.refresh()` to works as expected.

```javascript
myshape.cleanMemory();
```

*You should call* `cleanMemory()` *every time you make yourself changes to the DOM that affects the invisible shape.*

**destroy()** 

Remove every references to the instance from `window.shape`.
```javascript
myshape.destroy();
```

**refresh()** 

Refresh the shape for minor changes.
```javascript
myshape.refresh();
```

To force a full refresh, you should call `SHAPE.refreshAll(true)` or `shape.applyToNodes` this way :

```javascript
myshape.remove()
	   .resetMemory()
	   .applyToNodes(elements);
```

**remove(** *Optional* `HTMLElement` **element,**
					 *Optional* `Boolean` **leaveAsIt)** 

Un-apply the shape from `HTMLElement` **element** (or from the document if non-specified) and then refresh other shapes that could be affected unless **leaveAsIt** is set to `true`.

```javascript
myshape.remove(document.getElementById('my_element'));
```

You can use this code to force a full refresh after you un-applied a shape from an element.

```javascript
shape.remove(element, true);
SHAPE.refreshAll(true);
```

##### SHAPE.JS and Hyphenation

SHAPE.JS comes with a basic support for hyphenation. You can use one of the very basic built-in hyphenation, include [Hypher.js](https://github.com/bramstein/hypher) or use your own hyphenation function.

###### Hyphenation function

The `hyphenation` property of the option object of a `SHAPEObject` is a function that is called with two parameters : the word and the maximum offset.

The function must returns the offset of the character before which the word will be split and a hyphen inserted if necessary. If the returned offset is higher than the maximum offset, the maximum offset will be used instead.

Example :

```javascript
var hyphenationFunction = function(word, maxoffset){
	if(word == "prototype"){
		if(maxoffset < 3){
			return 0;
		}
		else if(maxoffset < 6){
			return 3; // pro-totype
		}
		else{
			return 6; // proto-type
		}
	}
	else{
		return 0;
	}
}
```

###### Built-in hyphenation functions

You can access built-in functions via `window.SHAPE.HYPHENATION`.

**ANYWHERE**

Cut the word anywhere and insert a hyphen if necessary.

``` none
This is a prot|otype.
---->
This is a prot-[    ]otype
```

**HYPHER(** `HypherInstance` **hypherInstance)**

Hyphenate the word using [Hypher.js](https://github.com/bramstein/hypher). Unlike others options, you must call `SHAPE.HYPHENATION.HYPHER` with an instance of Hypher as an argument.

```javascript
var hypherinstance = new Hypher(Hypher.english);
var myshape = window.SHAPE({
	left : 25,
	top: 25,
	width: 50,
	height : 50,
	hyphenation : window.SHAPE.HYPHENATION.HYPHER(hypherinstance)
});
``` 

``` none
This is a prot|otype.
---->
This is a pro-[    ]totype
```
*To use Hypher, you must use language patterns from [Hyphenator.js](https://github.com/mnater/Hyphenator/tree/master/patterns). You have to modify the language pattern js file to only use the language object part.*

**NH_ANYWHERE**

Default behavior. Cut the word anywhere and never insert hyphens.

``` none
This is a prot|otype.
---->
This is a prot[    ]otype
```

**NH_WORD**

Don't cut word and never insert hyphens.

``` none
This is a prot|otype.
---->
This is a [    ]prototype
```

#### License

SHAPE.JS is licensed under MIT License.