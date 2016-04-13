/**********************/
/*      SHAPE.js      */
/*  JDMCreator, 2016  */
/* Under MIT License  */
/*       V 0.1a       */
/**********************/
!function(){"use strict"
var e,t=void 0,n=window.document,r=function(e){return new s(e)},i=function(e){return!e&&0!==e&&""!==e&&"0"!==e},o=1e3,a={},s=function(e){if(i(e.top)||i(e.left)||i(e.width)||i(e.height))throw""
this.options=e,this.id="S"+o++,i(e.hyphenCharacter)||_.insertRule('.SHAPE-hyphen[data-shape-id="'+this.id+"\"]::before { content:'"+e.hyphenCharacter+"'; }",_.rules.length),this.destroy=function(){this.remove(),delete a[this.id],r=t
for(var e in this)this.hasOwnProperty(e)&&delete this[e]},this.remove=function(e,t){e=e||n
var r=null,i=n.createRange(),o=e.querySelectorAll("[data-shape-id='"+this.id+"']")
i.setStartBefore(o[0]),i.setEndAfter(o[1]),r=i.commonAncestorContainer,i.detach()
for(var s,h=0,l=o.length;l>h;h++)s=o[h],v(s).removeChild(s)
if(this.cleanMemory(),!t){o=r.querySelectorAll("[data-shape-id]")
for(var s,f={},h=0,l=o.length;l>h;h++){s=o[h]
var d=s.getAttribute("data-shape-id")
if(!f[d]){f[d]=!0
var u=a[d]
u&&u.refresh()}}}return this},this._memory=[],this.resetMemory=function(){return this._memory=[],this},this.cleanMemory=function(){for(var e,t=[],n=0;n<this._memory.length;n++)e=this._memory[n],e.querySelectorAll("[data-shape-id='"+this.id+"']").length>0&&t.push(e)
return this._memory=t,this},this.refresh=function(){return n.body.normalize(),this.applyToNodes(this._memory),this},this.applyToNodes=function(e){e=e||n.elementFromPoint(l,h)
for(var t,r=0,i=Math.max(arguments.length,1);i>r;r++){t=0===r?e:arguments[r],t=t.length||0===t.length?t:[t]
for(var o,a=0;a<t.length;a++)o=t[a],(1==o.nodeType||3==o.nodeType)&&s(o)}return this},this.shape=d
var r=this,s=function(e){for(var t=!1,i=0;i<r._memory.length;i++)e===r._memory[i]&&(t=!0)
t||r._memory.push(e)
var o=y(e)
o.push(r),o=o.sort(function(e,t){e.left-t.left}),A(e,e,o,function(e,t,r){var i,o=!1
if(3==e.nodeType){if(this.options.hyphenation){var a=u(this.options.hyphenation,e,t)
a&&(e=a.node,t=a.offset,o=a.hyphen)}t>0&&(e=e.splitText(t),i=n.createRange(),i.setStart(e,0),i.setEnd(e,1),r=f(i.getBoundingClientRect()))}var s=m(this.id),h=this.shape.right-r.left+1
if(0===h)return e
var l
if(e.previousSibling){var d=e.previousSibling
1==d.nodeType&&d.hasAttribute("data-shape-id")&&(o=!1)}return o?(s.className="SHAPE-hyphen",v(e).insertBefore(s,e),s.style.paddingRight=h-s.offsetWidth+1+"px",l=f(s.getBoundingClientRect())):(s.style.paddingRight=h+"px",v(e).insertBefore(s,e),l=f(s.getBoundingClientRect())),s.shape={o:this,left:l.left,right:l.right},i&&i.detach(),s})},h=e.top-(e.margin||0),l=e.left-(e.margin||0),d=(e.width+(e.margin||0),e.height+(e.margin||0),{top:h,left:l,right:l+e.width+2*(e.margin||0),bottom:h+e.height+2*(e.margin||0)})
this.shape=d,a[this.id]=this
this.id},h=function(e,n,r){var i=/\s+/gi
n||0===n||(n=e.data.length-1)
for(var o=[e],a=[],s=n;s>=0;s--)if(a=[r.startContainer,r.startOffset],r.setStart(e,s),i.test(""+r))return r.setStart(a[0],a[1]),{nodes:o,word:!0}
var l=g(e)
if(l){var f=h(l,t,r)
if(o=o.concat(f.nodes),f.word)return{nodes:o,word:!0}}return{nodes:o,word:!1}},l=function(e,t,n){for(var r=/\s+/gi,t=t||0,i=[e],o=[],a=t;a<e.data.length;a++)if(o=[n.endContainer,n.endOffset],n.setEnd(e,a),r.test(""+n))return n.setEnd(o[0],o[1]),{nodes:i,word:!0}
var s=p(e)
if(s){var h=l(s,0,n)
if(i=i.concat(h.nodes),h.word)return{nodes:i,word:!0}}return{nodes:i,word:!1}},f=function(t){if(!n.body)return t
e||(e=n.createElement("div"),e.style.position="absolute",e.style.left=e.style.top="0",n.body.appendChild(e))
var r=e.getBoundingClientRect()
return{top:t.top-r.top,left:t.left-r.left,right:t.right-r.right,bottom:t.bottom-r.bottom,width:t.width,height:t.height}},d=/^[A-Za-z\u00C0-\u017F]{1}$/,u=function(e,t,n){var r=c(t,n)
if(!r)return{hyphen:!1,node:t,offset:n}
var i=r.maxoffset,o=r.originalOffset,a=r.leftNodes.nodes,s=e.call(this,r.word,i)
s=isNaN(s)?i:Math.min(s,i)
for(var h=0==s?!1:d.test(r.word.charAt(s-1)),l=o-s,f=0;f<a.length;f++){var u=a[f],g=0===f?n:u.data.length
if(!(l>g))return{node:u,offset:Math.max(g-l,0),hyphen:h}
l-=g}},c=function(e,t){var r=n.createRange()
if(r.setStart(e,t),r.setEnd(e,t+1),/^\s+$/.test(""+r))return null
var i=h(e,t,r),o=(""+r).length-1,a=o
l(e,t,r)
var s=""+r
return d.test(s.charAt(o-1))&&o--,r.detach(),{word:s,leftNodes:i,maxoffset:o,originalOffset:a}},g=function(e){for(;e;){for(var t,n=!1;t=n||e.previousSibling;){if(e=t,n=!1,3==e.nodeType)return e
1==e.nodeType&&e.lastChild&&(n=e.lastChild)}e=v(e)}return null},p=function(e){for(;e;){for(var t,n=!1;t=n||e.nextSibling;){if(e=t,n=!1,3==e.nodeType)return e
1==e.nodeType&&e.firstChild&&(n=e.firstChild)}e=v(e)}return null},v=function(e){var t=e.parentNode
return t&&1===t.nodeType?t:null},y=function(e){for(var t,n=e.querySelectorAll("span[data-shape-id]"),r=[],i={},o=0,s=n.length;s>o;o++){t=n[o]
var h=t.getAttribute("data-shape-id")
i[h]||(i[h]=!0,r.push(a[h]))}return r},m=function(e){var t=n.createElement("span")
return t.setAttribute("data-shape-id",e),t},C=function(e,t){for(var n=0;n<t.length;n++)if(b(e,t[n].shape))return t[n]
return!1},b=function(e,t){return e.left<=t.right&&t.left<=e.right&&e.top<=t.bottom&&t.top<=e.bottom},A=function(e,t,n,r){var e=N(e,n)
return e?w(e,t,n,r):null},w=function(e,t,r,i){var o
if(3==e.nodeType){for(var a=-1,s=!1,h=n.createRange();a++<e.data.length-1;){h.setStart(e,a),h.setEnd(e,a+1)
var l=f(h.getBoundingClientRect()),d=C(l,r)
if(d){s=!0,o=i.call(d,e,a,l)
break}}h.detach(),s||(o=e)}else if(1==e.nodeType){var l=e.getBoudingClientRect(),d=C(l,r)
o=i.call(d,e,null,l)}return o?(o=T(o,t,r),o?w(o,t,r,i):null):null},R=function(e){var t=e.textContent||e.innerText
return 0===e.children||!t||/^\s*$/.test(t)},S=function(e){return!e.style.position||"static"==e.style.position},E=function(e){var t=e.shape,n=t.left,r=(t.right,f(e.getBoundingClientRect()))
if(t=a[e.getAttribute("data-shape-id")],t&&(t=t.shape),r.left!=n){var i=v(e)
if(i)return i.removeChild(e)}if(t&&!b(r,t)){var i=v(e)
if(i)return i.removeChild(e)}},T=function(e,t,r){for(var i=e,o=null;e!==t&&(e=e.nextSibling||o);)if(o=null,1==e.nodeType)if(R(e)){if(e.hasAttribute("data-shape-id"))o=e.nextSibling,E(e),o=v(e)?null:o
else if(C(f(e.getBoundingClientRect()),r)&&!S(e))return e}else if(C(f(e.getBoundingClientRect()),r)){var a=N(e,r)
if(a)return a}else for(var s=e.querySelectorAll("span[data-shape-id]"),h=0,l=s.length;l>h;h++)E(s[h])
else if(3==e.nodeType){var d=n.createRange()
if(d.selectNodeContents(e),C(f(d.getBoundingClientRect()),r))return d.detach(),e
d.detach()}return i!==t&&v(i)?T(v(i),t,r):null},N=function(e,t){for(var r,i=0,o=e.childNodes,a=o.length;a>i&&(r=o[i],r);i++)if(1==r.nodeType)if(R(r)){if(r.hasAttribute("data-shape-id"))E(r),r||i--
else if(C(f(r.getBoundingClientRect()),t)&&!S(r))return r}else{var s=N(r,t)
if(s)return s}else if(3==r.nodeType){var h=n.createRange()
if(h.selectNodeContents(r),C(f(h.getBoundingClientRect()),t))return h.detach(),r
h.detach()}return null},B={ANYWHERE:function(e,t){return t},HYPHER:function(e){return function(t,n){for(var r,i=e.hyphenate(t),o="",a=0;a<i.length;a++){if(r=i[a],!(r.length+o.length<=n))return o.length
o+=r}return o.length}},NH_ANYWHERE:function(){},NH_WORD:function(e,t){return 0}}
r.forEach=function(e){for(var n in a)if(a.hasOwnProperty(n)){var r=e.call(a[n])
if(!r&&r!==t)break}},r.removeAll=function(e){e=e||n.body
for(var t,r=n.body.querySelectorAll("[data-shape-id]"),i=0;i<r.length;i++){t=r[i]
var o=v(t)
o&&o.removeChild(t)}e=1===e.nodeType?e:n.body,e.normalize()},r.refreshAll=function(e){e&&r.removeAll(),r.forEach(function(){this.refresh()})},r.HYPHENATION=B
var H=!0
window.addEventListener("resize",function(){H&&r.refreshOnResize&&(H=!1,window.requestAnimationFrame(function(){r.refreshAll(!0),H=!0}))},!1),r.changeDefaultHyphenCharacter=function(e){_.rules[0].style.content='"'+e+'"'},r.version="0.1a",r.build="100",r.refreshOnResize=!0
var x=n.createElement("style")
n.head.appendChild(x)
var _=x.sheet
_.insertRule(".SHAPE-hyphen::before { content:'-'; }",0),window.SHAPE=r}()
