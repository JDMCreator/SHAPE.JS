/**********************/
/*      SHAPE.js      */
/*  JDMCreator, 2016  */
/* Under MIT License  */
/*       V 0.1a       */
/**********************/
(function() {
	"use strict";
	var undefined = void 0,
		document = window.document,
		SHAPE = function(opt) {
			return new SHAPEO(opt);
		},
		no = function(x) {
			return !x && x !== 0 && x !== "" && x !== '0';
		},
		idShapes = 1000,
		listOfShapes = {},
		SHAPEO = function(opt) {
			if (no(opt.top) || no(opt.left) || no(opt.width) || no(opt.height)) {
				throw "";
			}
			this.options = opt;
			this.id = "S" + (idShapes++);
			if (!no(opt.hyphenCharacter)) {
				sheet.insertRule(".SHAPE-hyphen[data-shape-id=\"" + this.id + "\"]::before { content:'" + opt.hyphenCharacter + "'; }",
					sheet.rules.length);
			}
			this.destroy = function() {
				this.remove();
				delete listOfShapes[this.id];
				_this = undefined;
				for (var i in this) {
					if (this.hasOwnProperty(i)) {
						delete this[i];
					}
				}
			}
			this.remove = function(parent, leaveAsIt) {
				parent = parent || document;
				var ancestor = null,
					range = document.createRange(),
					elements = parent.querySelectorAll("[data-shape-id='" + this.id + "']");

				range.setStartBefore(elements[0]);
				range.setEndAfter(elements[1]);
				ancestor = range.commonAncestorContainer;
				range.detach();

				for (var i = 0, c, l = elements.length; i < l; i++) {
					c = elements[i];
					parentElement(c).removeChild(c);
				}
				this.cleanMemory();
				if (!leaveAsIt) {
					elements = ancestor.querySelectorAll("[data-shape-id]");
					var done = {}
					for (var i = 0, c, l = elements.length; i < l; i++) {
						c = elements[i];
						var id = c.getAttribute("data-shape-id");
						if (!done[id]) {
							done[id] = true;
							var shape = listOfShapes[id];
							if (shape) {
								shape.refresh();
							}
						}
					}
				}
				return this;
			}
			this._memory = [];
			this.resetMemory = function() {
				this._memory = [];
				return this;
			}
			this.cleanMemory = function() {
				var memory = [];
				for (var i = 0, m; i < this._memory.length; i++) {
					m = this._memory[i];
					if (m.querySelectorAll("[data-shape-id='" + this.id + "']").length > 0) {
						memory.push(m);
					}
				}
				this._memory = memory;
				return this;
			}
			this.refresh = function() {
				document.body.normalize();
				this.applyToNodes(this._memory);
				return this;
			}
			this.applyToNodes = function(element) {
				element = element || document.elementFromPoint(left, top);
				for (var i = 0, l = Math.max(arguments.length, 1), a; i < l; i++) {
					a = (i === 0) ? element : arguments[i];
					a = (a.length || a.length === 0) ? a : [a];
					for (var j = 0, n; j < a.length; j++) {
						n = a[j];
						if (n.nodeType == 1 || n.nodeType == 3) {
							_applyToNode(n);
						}
					}
				}
				return this;
			}
			this.shape = shape;
			var _this = this;
			var _applyToNode = function(element) {
				var found = false;
				for (var i = 0; i < _this._memory.length; i++) {
					if (element === _this._memory[i]) {
						found = true;
					}
				}
				if (!found) {
					_this._memory.push(element)
				}
				var shapes = getOtherShapes(element);
				shapes.push(_this);
				shapes = shapes.sort(function(a, b) {
					a.left - b.left;
				});
				travelBreakPoints(element, element, shapes, function(node, offset, coo) {
					var hyphen = false,
						range;
					if (node.nodeType == 3) {
						if (this.options.hyphenation) {
							var result = getHyphenationNodeOffset(this.options.hyphenation, node, offset);
							if (result) {
								node = result.node
								offset = result.offset;
								hyphen = result.hyphen;
							}

						}
						if (offset > 0) {
							node = node.splitText(offset);
							range = document.createRange();
							range.setStart(node, 0);
							range.setEnd(node, 1);
							coo = toAbsolutePosition(range.getBoundingClientRect());
						}
					}
					var space = createSpace(this.id);
					var width = (this.shape.right - coo.left) + 1;
					if (width === 0) {
						return node;
					}
					var bounding;
					if (node.previousSibling) {
						var previous = node.previousSibling;
						if (previous.nodeType == 1 && previous.hasAttribute("data-shape-id")) {
							hyphen = false;
						}
					}
					if (hyphen) {
						space.className = "SHAPE-hyphen";
						parentElement(node).insertBefore(space, node);
						space.style.paddingRight = (width - space.offsetWidth + 1) + "px";
						bounding = toAbsolutePosition(space.getBoundingClientRect());
					} else {
						space.style.paddingRight = width + "px";
						parentElement(node).insertBefore(space, node);
						bounding = toAbsolutePosition(space.getBoundingClientRect());
					}
					space.shape = {
						o: this,
						left: bounding.left,
						right: bounding.right
					}
					if (range) {
						range.detach();
					}
					return space;
				});

			}
			var top = opt.top - (opt.margin || 0),
				left = opt.left - (opt.margin || 0),
				width = opt.width + (opt.margin || 0),
				height = opt.height + (opt.margin || 0),
				shape = {
					top: top,
					left: left,
					right: left + opt.width + 2 * (opt.margin || 0),
					bottom: top + opt.height + 2 * (opt.margin || 0)
				}
			this.shape = shape;
			listOfShapes[this.id] = this;

			var x = left,
				y = top,
				id = this.id;

		},
		extendToLeft = function(node, offset, range) {
			var whitespaces = /\s+/gi;
			if (!offset && offset !== 0) {
				offset = node.data.length - 1;
			}
			var nodes = [node],
				before = [];
			for (var i = offset; i >= 0; i--) {
				before = [range.startContainer, range.startOffset];
				range.setStart(node, i);
				if (whitespaces.test(range.toString())) {
					range.setStart(before[0], before[1]);
					return {
						nodes: nodes,
						word: true
					}
				}
			}
			var previous = getPreviousTextNode(node);
			if (previous) {
				var result = extendToLeft(previous, undefined, range);
				nodes = nodes.concat(result.nodes);
				if (result.word) {
					return {
						nodes: nodes,
						word: true
					}
				}
			}
			return {
				nodes: nodes,
				word: false
			}

		},
		extendToRight = function(node, offset, range) {
			var whitespaces = /\s+/gi,
				offset = offset || 0
			var nodes = [node],
				before = [];
			for (var i = offset; i < node.data.length; i++) {
				before = [range.endContainer, range.endOffset];
				range.setEnd(node, i);
				if (whitespaces.test(range.toString())) {
					range.setEnd(before[0], before[1]);
					return {
						nodes: nodes,
						word: true
					}
				}
			}
			var next = getNextTextNode(node);
			if (next) {
				var result = extendToRight(next, 0, range);
				nodes = nodes.concat(result.nodes);
				if (result.word) {
					return {
						nodes: nodes,
						word: true
					}
				}
			}
			return {
				nodes: nodes,
				word: false
			}

		},
		referencePositionElement,
		toAbsolutePosition = function(bounding) {
			if (!document.body) {
				return bounding;
			}
			if (!referencePositionElement) {
				referencePositionElement = document.createElement("div");
				referencePositionElement.style.position = "absolute";
				referencePositionElement.style.left = referencePositionElement.style.top = "0";
				document.body.appendChild(referencePositionElement);
			}
			var refBounding = referencePositionElement.getBoundingClientRect();
			return {
				top: bounding.top - refBounding.top,
				left: bounding.left - refBounding.left,
				right: bounding.right - refBounding.right,
				bottom: bounding.bottom - refBounding.bottom,
				width: bounding.width,
				height: bounding.height
			}
		},
		hyphensAllowedCharacter = /^[A-Za-z\u00C0-\u017F]{1}$/,
		getHyphenationNodeOffset = function(fn, node, offset) {
			var result = getWord(node, offset);
			if (!result) {
				return {
					hyphen: false,
					node: node,
					offset: offset
				}
			}
			var maxoffset = result.maxoffset,
				originalOffset = result.originalOffset,
				leftNodes = result.leftNodes.nodes;
			var newoffset = fn.call(this, result.word, maxoffset);
			newoffset = isNaN(newoffset) ? maxoffset : Math.min(newoffset, maxoffset);
			var hyphen = newoffset == 0 ? false : hyphensAllowedCharacter.test(result.word.charAt(newoffset - 1));
			var difference = originalOffset - newoffset;
			for (var i = 0; i < leftNodes.length; i++) {
				var leftNode = leftNodes[i];
				var length = i === 0 ? offset : leftNode.data.length;
				if (length < difference) {
					difference -= length;
				} else {
					return {
						node: leftNode,
						offset: Math.max(length - difference, 0),
						hyphen: hyphen
					}
				}
			}

		},
		getWord = function(node, offset) {
			var range = document.createRange();
			range.setStart(node, offset);
			range.setEnd(node, offset + 1);
			if (/^\s+$/.test(range.toString())) {
				return null;
			}
			var leftNodes = extendToLeft(node, offset, range);
			var maxoffset = range.toString().length - 1,
				originalOffset = maxoffset;
			extendToRight(node, offset, range);
			var word = range.toString();
			if (hyphensAllowedCharacter.test(word.charAt(maxoffset - 1))) {
				maxoffset--;
			}
			range.detach();
			return {
				word: word,
				leftNodes: leftNodes,
				maxoffset: maxoffset,
				originalOffset: originalOffset
			};
		};
	var getPreviousTextNode = function(node) {
			while (node) {
				var memory = false,
					newnode;
				while (newnode = memory || node.previousSibling) {
					node = newnode;
					memory = false;
					if (node.nodeType == 3) {
						return node;
					} else if (node.nodeType == 1 && node.lastChild) {
						memory = node.lastChild;
					}
				}
				node = parentElement(node);
			}
			return null;
		},

		getNextTextNode = function(node) {
			while (node) {
				var memory = false,
					newnode;
				while (newnode = memory || node.nextSibling) {
					node = newnode;
					memory = false;
					if (node.nodeType == 3) {
						return node;
					} else if (node.nodeType == 1 && node.firstChild) {
						memory = node.firstChild
					}
				}
				node = parentElement(node);
			}
			return null;
		},
		parentElement = function(element) {
			// Really IE ?
			var parent = element.parentNode;
			if (!parent) {
				return null;
			}
			return (parent.nodeType === 1 ? parent : null);
		},
		getOtherShapes = function(element) {
			var elements = element.querySelectorAll("span[data-shape-id]"),
				a = [],
				o = {};
			for (var i = 0, l = elements.length, n; i < l; i++) {
				n = elements[i];
				var id = n.getAttribute("data-shape-id");
				if (!o[id]) {
					o[id] = true;
					a.push(listOfShapes[id]);
				}
			}
			return a;
		},
		createSpace = function(id) {
			var space = document.createElement("span");
			space.setAttribute("data-shape-id", id);
			return space;
		},
		intersects = function(a, b) {
			for (var i = 0; i < b.length; i++) {
				if (_intersects(a, b[i].shape)) {
					return b[i];
				}
			}
			return false;
		},
		_intersects = function(a, b) {

			return (a.left <= b.right &&
				b.left <= a.right &&
				a.top <= b.bottom &&
				b.top <= a.bottom)
		},
		travelBreakPoints = function(node, ancestor, shapes, fn) {
			var node = getDescendingNodeSibling(node, shapes);
			if (node) {
				return _travelBreakPoints(node, ancestor, shapes, fn);
			}
			return null;
		},
		_travelBreakPoints = function(node, ancestor, shapes, fn) {
			var nextNode;
			if (node.nodeType == 3) {
				var offset = -1,
					found = false,
					range = document.createRange();
				while (offset++ < node.data.length - 1) {
					range.setStart(node, offset);
					range.setEnd(node, offset + 1);
					var bound = toAbsolutePosition(range.getBoundingClientRect());
					var shapeTouched = intersects(bound, shapes);
					if (shapeTouched) {
						found = true;
						nextNode = fn.call(shapeTouched, node, offset, bound);
						break;
					}
				}
				range.detach();
				if (!found) {
					nextNode = node
				}
			} else if (node.nodeType == 1) {
				var bound = node.getBoudingClientRect(),
					shapeTouched = intersects(bound, shapes);
				nextNode = fn.call(shapeTouched, node, null, bound);
			}
			if (!nextNode) {
				return null;
			}
			nextNode = getNextNodeSibling(nextNode, ancestor, shapes);
			if (!nextNode) {
				return null;
			}
			return _travelBreakPoints(nextNode, ancestor, shapes, fn)

		},
		isEmpty = function(element) {
			var text = element.textContent || element.innerText;
			return element.children === 0 || !text || /^\s*$/.test(text);
		},
		isStatic = function(element) {
			return !element.style.position || element.style.position == "static";
		},
		unmovedOrRemove = function(element) {
			var _shape = element.shape,
				left = _shape.left,
				right = _shape.right,
				bounding = toAbsolutePosition(element.getBoundingClientRect());

			_shape = listOfShapes[element.getAttribute("data-shape-id")];
			if (_shape) {
				_shape = _shape.shape;
			}


			if (bounding.left != left) {
				var parent = parentElement(element);
				if (parent) {
					return parent.removeChild(element);
				}
			}
			if (_shape && !_intersects(bounding, _shape)) {
				var parent = parentElement(element);
				if (parent) {
					return parent.removeChild(element);
				}
			}
		},
		getNextNodeSibling = function(node, ancestor, shapes) {
			var oNode = node,
				nextNode = null;
			while (node !== ancestor && !!(node = node.nextSibling || nextNode)) {
				nextNode = null;
				if (node.nodeType == 1) {
					if (!isEmpty(node)) {
						if (intersects(toAbsolutePosition(node.getBoundingClientRect()), shapes)) {
							var result = getDescendingNodeSibling(node, shapes);
							if (result) {
								return result;
							}
						} else {
							var spaces = node.querySelectorAll("span[data-shape-id]");
							for (var i = 0, l = spaces.length; i < l; i++) {
								unmovedOrRemove(spaces[i]);
							}
						}
					} else if (node.hasAttribute("data-shape-id")) {
						nextNode = node.nextSibling;
						unmovedOrRemove(node);
						nextNode = parentElement(node) ? null : nextNode;
					} else if (intersects(toAbsolutePosition(node.getBoundingClientRect()), shapes) && !isStatic(node)) {
						return node;
					}
				} else if (node.nodeType == 3) {
					var range = document.createRange();
					range.selectNodeContents(node);
					if (intersects(toAbsolutePosition(range.getBoundingClientRect()), shapes)) {
						range.detach();
						return node;
					}
					range.detach();
				}
			}
			if (oNode !== ancestor && parentElement(oNode)) {
				return getNextNodeSibling(parentElement(oNode), ancestor, shapes);
			}
			return null;
		},
		getDescendingNodeSibling = function(node, shapes) {
			var last = null;
			for (var i = 0, c = node.childNodes, l = c.length, n; i < l; i++) {
				n = c[i];
				if (!n) {
					break;
				}
				if (n.nodeType == 1) {
					if (!isEmpty(n)) {
						var result = getDescendingNodeSibling(n, shapes);
						if (result) {
							return result;
						}
					} else if (n.hasAttribute("data-shape-id")) {
						unmovedOrRemove(n);
						if (!n) {
							i--;
						}
					} else if (intersects(toAbsolutePosition(n.getBoundingClientRect()), shapes) && !isStatic(n)) {
						return n;
					}
				} else if (n.nodeType == 3) {
					var range = document.createRange();
					range.selectNodeContents(n);
					if (intersects(toAbsolutePosition(range.getBoundingClientRect()), shapes)) {
						range.detach();
						return n;
					}
					range.detach();
				}
			}
			return null;
		},
		HYPHENATION = {
			ANYWHERE: function(word, maxoffset) {
				return maxoffset;
			},
			HYPHER: function(hypher) {
				return function(word, maxoffset) {
					var array = hypher.hyphenate(word),
						str = "";
					for (var i = 0, sub; i < array.length; i++) {
						sub = array[i];
						if (sub.length + str.length <= maxoffset) {
							str += sub;
						} else {
							return str.length;
						}
					}
					return str.length
				}
			},
			NH_ANYWHERE: Function(),
			NH_WORD: function(word, maxoffset) {
				return 0;
			}
		}


	SHAPE.forEach = function(fn) {
		for (var i in listOfShapes) {
			if (listOfShapes.hasOwnProperty(i)) {
				var result = fn.call(listOfShapes[i]);
				if (!result && result !== undefined) {
					break;
				}
			}
		}
	}
	SHAPE.removeAll = function(etn) {
		etn = etn || document.body
		var elements = document.body.querySelectorAll("[data-shape-id]");
		for (var i = 0, element; i < elements.length; i++) {
			element = elements[i];
			var parent = parentElement(element);
			if (parent) {
				parent.removeChild(element);
			}
		}

		etn = (etn.nodeType === 1) ? etn : document.body;
		etn.normalize();
	};
	SHAPE.refreshAll = function(force) {
		if (force) {
			SHAPE.removeAll();
		}
		SHAPE.forEach(function() {
			this.refresh();
		})
	};
	SHAPE.HYPHENATION = HYPHENATION;

	var lastCompleted = true;
	window.addEventListener("resize", function() {
		if (lastCompleted && SHAPE.refreshOnResize) {
			lastCompleted = false;
			window.requestAnimationFrame(function() {
				SHAPE.refreshAll(true);
				lastCompleted = true;
			});
		};
	}, false);
	SHAPE.changeDefaultHyphenCharacter = function(character) {
		sheet.rules[0].style.content = '"' + character + '"';
	}
	SHAPE.version = "0.1a";
	SHAPE.build = "100";
	SHAPE.refreshOnResize = true;

	var style = document.createElement("style");
	document.head.appendChild(style);
	var sheet = style.sheet;
	sheet.insertRule(".SHAPE-hyphen::before { content:'-'; }", 0);

	window.SHAPE = SHAPE;
})();