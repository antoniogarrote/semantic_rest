/*
 * jQuery JavaScript Library v1.3.2
 * http://jquery.com/
 *
 * Copyright (c) 2009 John Resig
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-02-19 17:34:21 -0500 (Thu, 19 Feb 2009)
 * Revision: 6246
 */
(function(){var l=this,g,y=l.jQuery,p=l.$,o=l.jQuery=l.$=function(E,F){return new o.fn.init(E,F)},D=/^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,f=/^.[^:#\[\.,]*$/;o.fn=o.prototype={init:function(E,H){E=E||document;if(E.nodeType){this[0]=E;this.length=1;this.context=E;return this}if(typeof E==="string"){var G=D.exec(E);if(G&&(G[1]||!H)){if(G[1]){E=o.clean([G[1]],H)}else{var I=document.getElementById(G[3]);if(I&&I.id!=G[3]){return o().find(E)}var F=o(I||[]);F.context=document;F.selector=E;return F}}else{return o(H).find(E)}}else{if(o.isFunction(E)){return o(document).ready(E)}}if(E.selector&&E.context){this.selector=E.selector;this.context=E.context}return this.setArray(o.isArray(E)?E:o.makeArray(E))},selector:"",jquery:"1.3.2",size:function(){return this.length},get:function(E){return E===g?Array.prototype.slice.call(this):this[E]},pushStack:function(F,H,E){var G=o(F);G.prevObject=this;G.context=this.context;if(H==="find"){G.selector=this.selector+(this.selector?" ":"")+E}else{if(H){G.selector=this.selector+"."+H+"("+E+")"}}return G},setArray:function(E){this.length=0;Array.prototype.push.apply(this,E);return this},each:function(F,E){return o.each(this,F,E)},index:function(E){return o.inArray(E&&E.jquery?E[0]:E,this)},attr:function(F,H,G){var E=F;if(typeof F==="string"){if(H===g){return this[0]&&o[G||"attr"](this[0],F)}else{E={};E[F]=H}}return this.each(function(I){for(F in E){o.attr(G?this.style:this,F,o.prop(this,E[F],G,I,F))}})},css:function(E,F){if((E=="width"||E=="height")&&parseFloat(F)<0){F=g}return this.attr(E,F,"curCSS")},text:function(F){if(typeof F!=="object"&&F!=null){return this.empty().append((this[0]&&this[0].ownerDocument||document).createTextNode(F))}var E="";o.each(F||this,function(){o.each(this.childNodes,function(){if(this.nodeType!=8){E+=this.nodeType!=1?this.nodeValue:o.fn.text([this])}})});return E},wrapAll:function(E){if(this[0]){var F=o(E,this[0].ownerDocument).clone();if(this[0].parentNode){F.insertBefore(this[0])}F.map(function(){var G=this;while(G.firstChild){G=G.firstChild}return G}).append(this)}return this},wrapInner:function(E){return this.each(function(){o(this).contents().wrapAll(E)})},wrap:function(E){return this.each(function(){o(this).wrapAll(E)})},append:function(){return this.domManip(arguments,true,function(E){if(this.nodeType==1){this.appendChild(E)}})},prepend:function(){return this.domManip(arguments,true,function(E){if(this.nodeType==1){this.insertBefore(E,this.firstChild)}})},before:function(){return this.domManip(arguments,false,function(E){this.parentNode.insertBefore(E,this)})},after:function(){return this.domManip(arguments,false,function(E){this.parentNode.insertBefore(E,this.nextSibling)})},end:function(){return this.prevObject||o([])},push:[].push,sort:[].sort,splice:[].splice,find:function(E){if(this.length===1){var F=this.pushStack([],"find",E);F.length=0;o.find(E,this[0],F);return F}else{return this.pushStack(o.unique(o.map(this,function(G){return o.find(E,G)})),"find",E)}},clone:function(G){var E=this.map(function(){if(!o.support.noCloneEvent&&!o.isXMLDoc(this)){var I=this.outerHTML;if(!I){var J=this.ownerDocument.createElement("div");J.appendChild(this.cloneNode(true));I=J.innerHTML}return o.clean([I.replace(/ jQuery\d+="(?:\d+|null)"/g,"").replace(/^\s*/,"")])[0]}else{return this.cloneNode(true)}});if(G===true){var H=this.find("*").andSelf(),F=0;E.find("*").andSelf().each(function(){if(this.nodeName!==H[F].nodeName){return}var I=o.data(H[F],"events");for(var K in I){for(var J in I[K]){o.event.add(this,K,I[K][J],I[K][J].data)}}F++})}return E},filter:function(E){return this.pushStack(o.isFunction(E)&&o.grep(this,function(G,F){return E.call(G,F)})||o.multiFilter(E,o.grep(this,function(F){return F.nodeType===1})),"filter",E)},closest:function(E){var G=o.expr.match.POS.test(E)?o(E):null,F=0;return this.map(function(){var H=this;while(H&&H.ownerDocument){if(G?G.index(H)>-1:o(H).is(E)){o.data(H,"closest",F);return H}H=H.parentNode;F++}})},not:function(E){if(typeof E==="string"){if(f.test(E)){return this.pushStack(o.multiFilter(E,this,true),"not",E)}else{E=o.multiFilter(E,this)}}var F=E.length&&E[E.length-1]!==g&&!E.nodeType;return this.filter(function(){return F?o.inArray(this,E)<0:this!=E})},add:function(E){return this.pushStack(o.unique(o.merge(this.get(),typeof E==="string"?o(E):o.makeArray(E))))},is:function(E){return !!E&&o.multiFilter(E,this).length>0},hasClass:function(E){return !!E&&this.is("."+E)},val:function(K){if(K===g){var E=this[0];if(E){if(o.nodeName(E,"option")){return(E.attributes.value||{}).specified?E.value:E.text}if(o.nodeName(E,"select")){var I=E.selectedIndex,L=[],M=E.options,H=E.type=="select-one";if(I<0){return null}for(var F=H?I:0,J=H?I+1:M.length;F<J;F++){var G=M[F];if(G.selected){K=o(G).val();if(H){return K}L.push(K)}}return L}return(E.value||"").replace(/\r/g,"")}return g}if(typeof K==="number"){K+=""}return this.each(function(){if(this.nodeType!=1){return}if(o.isArray(K)&&/radio|checkbox/.test(this.type)){this.checked=(o.inArray(this.value,K)>=0||o.inArray(this.name,K)>=0)}else{if(o.nodeName(this,"select")){var N=o.makeArray(K);o("option",this).each(function(){this.selected=(o.inArray(this.value,N)>=0||o.inArray(this.text,N)>=0)});if(!N.length){this.selectedIndex=-1}}else{this.value=K}}})},html:function(E){return E===g?(this[0]?this[0].innerHTML.replace(/ jQuery\d+="(?:\d+|null)"/g,""):null):this.empty().append(E)},replaceWith:function(E){return this.after(E).remove()},eq:function(E){return this.slice(E,+E+1)},slice:function(){return this.pushStack(Array.prototype.slice.apply(this,arguments),"slice",Array.prototype.slice.call(arguments).join(","))},map:function(E){return this.pushStack(o.map(this,function(G,F){return E.call(G,F,G)}))},andSelf:function(){return this.add(this.prevObject)},domManip:function(J,M,L){if(this[0]){var I=(this[0].ownerDocument||this[0]).createDocumentFragment(),F=o.clean(J,(this[0].ownerDocument||this[0]),I),H=I.firstChild;if(H){for(var G=0,E=this.length;G<E;G++){L.call(K(this[G],H),this.length>1||G>0?I.cloneNode(true):I)}}if(F){o.each(F,z)}}return this;function K(N,O){return M&&o.nodeName(N,"table")&&o.nodeName(O,"tr")?(N.getElementsByTagName("tbody")[0]||N.appendChild(N.ownerDocument.createElement("tbody"))):N}}};o.fn.init.prototype=o.fn;function z(E,F){if(F.src){o.ajax({url:F.src,async:false,dataType:"script"})}else{o.globalEval(F.text||F.textContent||F.innerHTML||"")}if(F.parentNode){F.parentNode.removeChild(F)}}function e(){return +new Date}o.extend=o.fn.extend=function(){var J=arguments[0]||{},H=1,I=arguments.length,E=false,G;if(typeof J==="boolean"){E=J;J=arguments[1]||{};H=2}if(typeof J!=="object"&&!o.isFunction(J)){J={}}if(I==H){J=this;--H}for(;H<I;H++){if((G=arguments[H])!=null){for(var F in G){var K=J[F],L=G[F];if(J===L){continue}if(E&&L&&typeof L==="object"&&!L.nodeType){J[F]=o.extend(E,K||(L.length!=null?[]:{}),L)}else{if(L!==g){J[F]=L}}}}}return J};var b=/z-?index|font-?weight|opacity|zoom|line-?height/i,q=document.defaultView||{},s=Object.prototype.toString;o.extend({noConflict:function(E){l.$=p;if(E){l.jQuery=y}return o},isFunction:function(E){return s.call(E)==="[object Function]"},isArray:function(E){return s.call(E)==="[object Array]"},isXMLDoc:function(E){return E.nodeType===9&&E.documentElement.nodeName!=="HTML"||!!E.ownerDocument&&o.isXMLDoc(E.ownerDocument)},globalEval:function(G){if(G&&/\S/.test(G)){var F=document.getElementsByTagName("head")[0]||document.documentElement,E=document.createElement("script");E.type="text/javascript";if(o.support.scriptEval){E.appendChild(document.createTextNode(G))}else{E.text=G}F.insertBefore(E,F.firstChild);F.removeChild(E)}},nodeName:function(F,E){return F.nodeName&&F.nodeName.toUpperCase()==E.toUpperCase()},each:function(G,K,F){var E,H=0,I=G.length;if(F){if(I===g){for(E in G){if(K.apply(G[E],F)===false){break}}}else{for(;H<I;){if(K.apply(G[H++],F)===false){break}}}}else{if(I===g){for(E in G){if(K.call(G[E],E,G[E])===false){break}}}else{for(var J=G[0];H<I&&K.call(J,H,J)!==false;J=G[++H]){}}}return G},prop:function(H,I,G,F,E){if(o.isFunction(I)){I=I.call(H,F)}return typeof I==="number"&&G=="curCSS"&&!b.test(E)?I+"px":I},className:{add:function(E,F){o.each((F||"").split(/\s+/),function(G,H){if(E.nodeType==1&&!o.className.has(E.className,H)){E.className+=(E.className?" ":"")+H}})},remove:function(E,F){if(E.nodeType==1){E.className=F!==g?o.grep(E.className.split(/\s+/),function(G){return !o.className.has(F,G)}).join(" "):""}},has:function(F,E){return F&&o.inArray(E,(F.className||F).toString().split(/\s+/))>-1}},swap:function(H,G,I){var E={};for(var F in G){E[F]=H.style[F];H.style[F]=G[F]}I.call(H);for(var F in G){H.style[F]=E[F]}},css:function(H,F,J,E){if(F=="width"||F=="height"){var L,G={position:"absolute",visibility:"hidden",display:"block"},K=F=="width"?["Left","Right"]:["Top","Bottom"];function I(){L=F=="width"?H.offsetWidth:H.offsetHeight;if(E==="border"){return}o.each(K,function(){if(!E){L-=parseFloat(o.curCSS(H,"padding"+this,true))||0}if(E==="margin"){L+=parseFloat(o.curCSS(H,"margin"+this,true))||0}else{L-=parseFloat(o.curCSS(H,"border"+this+"Width",true))||0}})}if(H.offsetWidth!==0){I()}else{o.swap(H,G,I)}return Math.max(0,Math.round(L))}return o.curCSS(H,F,J)},curCSS:function(I,F,G){var L,E=I.style;if(F=="opacity"&&!o.support.opacity){L=o.attr(E,"opacity");return L==""?"1":L}if(F.match(/float/i)){F=w}if(!G&&E&&E[F]){L=E[F]}else{if(q.getComputedStyle){if(F.match(/float/i)){F="float"}F=F.replace(/([A-Z])/g,"-$1").toLowerCase();var M=q.getComputedStyle(I,null);if(M){L=M.getPropertyValue(F)}if(F=="opacity"&&L==""){L="1"}}else{if(I.currentStyle){var J=F.replace(/\-(\w)/g,function(N,O){return O.toUpperCase()});L=I.currentStyle[F]||I.currentStyle[J];if(!/^\d+(px)?$/i.test(L)&&/^\d/.test(L)){var H=E.left,K=I.runtimeStyle.left;I.runtimeStyle.left=I.currentStyle.left;E.left=L||0;L=E.pixelLeft+"px";E.left=H;I.runtimeStyle.left=K}}}}return L},clean:function(F,K,I){K=K||document;if(typeof K.createElement==="undefined"){K=K.ownerDocument||K[0]&&K[0].ownerDocument||document}if(!I&&F.length===1&&typeof F[0]==="string"){var H=/^<(\w+)\s*\/?>$/.exec(F[0]);if(H){return[K.createElement(H[1])]}}var G=[],E=[],L=K.createElement("div");o.each(F,function(P,S){if(typeof S==="number"){S+=""}if(!S){return}if(typeof S==="string"){S=S.replace(/(<(\w+)[^>]*?)\/>/g,function(U,V,T){return T.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i)?U:V+"></"+T+">"});var O=S.replace(/^\s+/,"").substring(0,10).toLowerCase();var Q=!O.indexOf("<opt")&&[1,"<select multiple='multiple'>","</select>"]||!O.indexOf("<leg")&&[1,"<fieldset>","</fieldset>"]||O.match(/^<(thead|tbody|tfoot|colg|cap)/)&&[1,"<table>","</table>"]||!O.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!O.indexOf("<td")||!O.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||!O.indexOf("<col")&&[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"]||!o.support.htmlSerialize&&[1,"div<div>","</div>"]||[0,"",""];L.innerHTML=Q[1]+S+Q[2];while(Q[0]--){L=L.lastChild}if(!o.support.tbody){var R=/<tbody/i.test(S),N=!O.indexOf("<table")&&!R?L.firstChild&&L.firstChild.childNodes:Q[1]=="<table>"&&!R?L.childNodes:[];for(var M=N.length-1;M>=0;--M){if(o.nodeName(N[M],"tbody")&&!N[M].childNodes.length){N[M].parentNode.removeChild(N[M])}}}if(!o.support.leadingWhitespace&&/^\s/.test(S)){L.insertBefore(K.createTextNode(S.match(/^\s*/)[0]),L.firstChild)}S=o.makeArray(L.childNodes)}if(S.nodeType){G.push(S)}else{G=o.merge(G,S)}});if(I){for(var J=0;G[J];J++){if(o.nodeName(G[J],"script")&&(!G[J].type||G[J].type.toLowerCase()==="text/javascript")){E.push(G[J].parentNode?G[J].parentNode.removeChild(G[J]):G[J])}else{if(G[J].nodeType===1){G.splice.apply(G,[J+1,0].concat(o.makeArray(G[J].getElementsByTagName("script"))))}I.appendChild(G[J])}}return E}return G},attr:function(J,G,K){if(!J||J.nodeType==3||J.nodeType==8){return g}var H=!o.isXMLDoc(J),L=K!==g;G=H&&o.props[G]||G;if(J.tagName){var F=/href|src|style/.test(G);if(G=="selected"&&J.parentNode){J.parentNode.selectedIndex}if(G in J&&H&&!F){if(L){if(G=="type"&&o.nodeName(J,"input")&&J.parentNode){throw"type property can't be changed"}J[G]=K}if(o.nodeName(J,"form")&&J.getAttributeNode(G)){return J.getAttributeNode(G).nodeValue}if(G=="tabIndex"){var I=J.getAttributeNode("tabIndex");return I&&I.specified?I.value:J.nodeName.match(/(button|input|object|select|textarea)/i)?0:J.nodeName.match(/^(a|area)$/i)&&J.href?0:g}return J[G]}if(!o.support.style&&H&&G=="style"){return o.attr(J.style,"cssText",K)}if(L){J.setAttribute(G,""+K)}var E=!o.support.hrefNormalized&&H&&F?J.getAttribute(G,2):J.getAttribute(G);return E===null?g:E}if(!o.support.opacity&&G=="opacity"){if(L){J.zoom=1;J.filter=(J.filter||"").replace(/alpha\([^)]*\)/,"")+(parseInt(K)+""=="NaN"?"":"alpha(opacity="+K*100+")")}return J.filter&&J.filter.indexOf("opacity=")>=0?(parseFloat(J.filter.match(/opacity=([^)]*)/)[1])/100)+"":""}G=G.replace(/-([a-z])/ig,function(M,N){return N.toUpperCase()});if(L){J[G]=K}return J[G]},trim:function(E){return(E||"").replace(/^\s+|\s+$/g,"")},makeArray:function(G){var E=[];if(G!=null){var F=G.length;if(F==null||typeof G==="string"||o.isFunction(G)||G.setInterval){E[0]=G}else{while(F){E[--F]=G[F]}}}return E},inArray:function(G,H){for(var E=0,F=H.length;E<F;E++){if(H[E]===G){return E}}return -1},merge:function(H,E){var F=0,G,I=H.length;if(!o.support.getAll){while((G=E[F++])!=null){if(G.nodeType!=8){H[I++]=G}}}else{while((G=E[F++])!=null){H[I++]=G}}return H},unique:function(K){var F=[],E={};try{for(var G=0,H=K.length;G<H;G++){var J=o.data(K[G]);if(!E[J]){E[J]=true;F.push(K[G])}}}catch(I){F=K}return F},grep:function(F,J,E){var G=[];for(var H=0,I=F.length;H<I;H++){if(!E!=!J(F[H],H)){G.push(F[H])}}return G},map:function(E,J){var F=[];for(var G=0,H=E.length;G<H;G++){var I=J(E[G],G);if(I!=null){F[F.length]=I}}return F.concat.apply([],F)}});var C=navigator.userAgent.toLowerCase();o.browser={version:(C.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[0,"0"])[1],safari:/webkit/.test(C),opera:/opera/.test(C),msie:/msie/.test(C)&&!/opera/.test(C),mozilla:/mozilla/.test(C)&&!/(compatible|webkit)/.test(C)};o.each({parent:function(E){return E.parentNode},parents:function(E){return o.dir(E,"parentNode")},next:function(E){return o.nth(E,2,"nextSibling")},prev:function(E){return o.nth(E,2,"previousSibling")},nextAll:function(E){return o.dir(E,"nextSibling")},prevAll:function(E){return o.dir(E,"previousSibling")},siblings:function(E){return o.sibling(E.parentNode.firstChild,E)},children:function(E){return o.sibling(E.firstChild)},contents:function(E){return o.nodeName(E,"iframe")?E.contentDocument||E.contentWindow.document:o.makeArray(E.childNodes)}},function(E,F){o.fn[E]=function(G){var H=o.map(this,F);if(G&&typeof G=="string"){H=o.multiFilter(G,H)}return this.pushStack(o.unique(H),E,G)}});o.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(E,F){o.fn[E]=function(G){var J=[],L=o(G);for(var K=0,H=L.length;K<H;K++){var I=(K>0?this.clone(true):this).get();o.fn[F].apply(o(L[K]),I);J=J.concat(I)}return this.pushStack(J,E,G)}});o.each({removeAttr:function(E){o.attr(this,E,"");if(this.nodeType==1){this.removeAttribute(E)}},addClass:function(E){o.className.add(this,E)},removeClass:function(E){o.className.remove(this,E)},toggleClass:function(F,E){if(typeof E!=="boolean"){E=!o.className.has(this,F)}o.className[E?"add":"remove"](this,F)},remove:function(E){if(!E||o.filter(E,[this]).length){o("*",this).add([this]).each(function(){o.event.remove(this);o.removeData(this)});if(this.parentNode){this.parentNode.removeChild(this)}}},empty:function(){o(this).children().remove();while(this.firstChild){this.removeChild(this.firstChild)}}},function(E,F){o.fn[E]=function(){return this.each(F,arguments)}});function j(E,F){return E[0]&&parseInt(o.curCSS(E[0],F,true),10)||0}var h="jQuery"+e(),v=0,A={};o.extend({cache:{},data:function(F,E,G){F=F==l?A:F;var H=F[h];if(!H){H=F[h]=++v}if(E&&!o.cache[H]){o.cache[H]={}}if(G!==g){o.cache[H][E]=G}return E?o.cache[H][E]:H},removeData:function(F,E){F=F==l?A:F;var H=F[h];if(E){if(o.cache[H]){delete o.cache[H][E];E="";for(E in o.cache[H]){break}if(!E){o.removeData(F)}}}else{try{delete F[h]}catch(G){if(F.removeAttribute){F.removeAttribute(h)}}delete o.cache[H]}},queue:function(F,E,H){if(F){E=(E||"fx")+"queue";var G=o.data(F,E);if(!G||o.isArray(H)){G=o.data(F,E,o.makeArray(H))}else{if(H){G.push(H)}}}return G},dequeue:function(H,G){var E=o.queue(H,G),F=E.shift();if(!G||G==="fx"){F=E[0]}if(F!==g){F.call(H)}}});o.fn.extend({data:function(E,G){var H=E.split(".");H[1]=H[1]?"."+H[1]:"";if(G===g){var F=this.triggerHandler("getData"+H[1]+"!",[H[0]]);if(F===g&&this.length){F=o.data(this[0],E)}return F===g&&H[1]?this.data(H[0]):F}else{return this.trigger("setData"+H[1]+"!",[H[0],G]).each(function(){o.data(this,E,G)})}},removeData:function(E){return this.each(function(){o.removeData(this,E)})},queue:function(E,F){if(typeof E!=="string"){F=E;E="fx"}if(F===g){return o.queue(this[0],E)}return this.each(function(){var G=o.queue(this,E,F);if(E=="fx"&&G.length==1){G[0].call(this)}})},dequeue:function(E){return this.each(function(){o.dequeue(this,E)})}});
/*
 * Sizzle CSS Selector Engine - v0.9.3
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){var R=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,L=0,H=Object.prototype.toString;var F=function(Y,U,ab,ac){ab=ab||[];U=U||document;if(U.nodeType!==1&&U.nodeType!==9){return[]}if(!Y||typeof Y!=="string"){return ab}var Z=[],W,af,ai,T,ad,V,X=true;R.lastIndex=0;while((W=R.exec(Y))!==null){Z.push(W[1]);if(W[2]){V=RegExp.rightContext;break}}if(Z.length>1&&M.exec(Y)){if(Z.length===2&&I.relative[Z[0]]){af=J(Z[0]+Z[1],U)}else{af=I.relative[Z[0]]?[U]:F(Z.shift(),U);while(Z.length){Y=Z.shift();if(I.relative[Y]){Y+=Z.shift()}af=J(Y,af)}}}else{var ae=ac?{expr:Z.pop(),set:E(ac)}:F.find(Z.pop(),Z.length===1&&U.parentNode?U.parentNode:U,Q(U));af=F.filter(ae.expr,ae.set);if(Z.length>0){ai=E(af)}else{X=false}while(Z.length){var ah=Z.pop(),ag=ah;if(!I.relative[ah]){ah=""}else{ag=Z.pop()}if(ag==null){ag=U}I.relative[ah](ai,ag,Q(U))}}if(!ai){ai=af}if(!ai){throw"Syntax error, unrecognized expression: "+(ah||Y)}if(H.call(ai)==="[object Array]"){if(!X){ab.push.apply(ab,ai)}else{if(U.nodeType===1){for(var aa=0;ai[aa]!=null;aa++){if(ai[aa]&&(ai[aa]===true||ai[aa].nodeType===1&&K(U,ai[aa]))){ab.push(af[aa])}}}else{for(var aa=0;ai[aa]!=null;aa++){if(ai[aa]&&ai[aa].nodeType===1){ab.push(af[aa])}}}}}else{E(ai,ab)}if(V){F(V,U,ab,ac);if(G){hasDuplicate=false;ab.sort(G);if(hasDuplicate){for(var aa=1;aa<ab.length;aa++){if(ab[aa]===ab[aa-1]){ab.splice(aa--,1)}}}}}return ab};F.matches=function(T,U){return F(T,null,null,U)};F.find=function(aa,T,ab){var Z,X;if(!aa){return[]}for(var W=0,V=I.order.length;W<V;W++){var Y=I.order[W],X;if((X=I.match[Y].exec(aa))){var U=RegExp.leftContext;if(U.substr(U.length-1)!=="\\"){X[1]=(X[1]||"").replace(/\\/g,"");Z=I.find[Y](X,T,ab);if(Z!=null){aa=aa.replace(I.match[Y],"");break}}}}if(!Z){Z=T.getElementsByTagName("*")}return{set:Z,expr:aa}};F.filter=function(ad,ac,ag,W){var V=ad,ai=[],aa=ac,Y,T,Z=ac&&ac[0]&&Q(ac[0]);while(ad&&ac.length){for(var ab in I.filter){if((Y=I.match[ab].exec(ad))!=null){var U=I.filter[ab],ah,af;T=false;if(aa==ai){ai=[]}if(I.preFilter[ab]){Y=I.preFilter[ab](Y,aa,ag,ai,W,Z);if(!Y){T=ah=true}else{if(Y===true){continue}}}if(Y){for(var X=0;(af=aa[X])!=null;X++){if(af){ah=U(af,Y,X,aa);var ae=W^!!ah;if(ag&&ah!=null){if(ae){T=true}else{aa[X]=false}}else{if(ae){ai.push(af);T=true}}}}}if(ah!==g){if(!ag){aa=ai}ad=ad.replace(I.match[ab],"");if(!T){return[]}break}}}if(ad==V){if(T==null){throw"Syntax error, unrecognized expression: "+ad}else{break}}V=ad}return aa};var I=F.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(T){return T.getAttribute("href")}},relative:{"+":function(aa,T,Z){var X=typeof T==="string",ab=X&&!/\W/.test(T),Y=X&&!ab;if(ab&&!Z){T=T.toUpperCase()}for(var W=0,V=aa.length,U;W<V;W++){if((U=aa[W])){while((U=U.previousSibling)&&U.nodeType!==1){}aa[W]=Y||U&&U.nodeName===T?U||false:U===T}}if(Y){F.filter(T,aa,true)}},">":function(Z,U,aa){var X=typeof U==="string";if(X&&!/\W/.test(U)){U=aa?U:U.toUpperCase();for(var V=0,T=Z.length;V<T;V++){var Y=Z[V];if(Y){var W=Y.parentNode;Z[V]=W.nodeName===U?W:false}}}else{for(var V=0,T=Z.length;V<T;V++){var Y=Z[V];if(Y){Z[V]=X?Y.parentNode:Y.parentNode===U}}if(X){F.filter(U,Z,true)}}},"":function(W,U,Y){var V=L++,T=S;if(!U.match(/\W/)){var X=U=Y?U:U.toUpperCase();T=P}T("parentNode",U,V,W,X,Y)},"~":function(W,U,Y){var V=L++,T=S;if(typeof U==="string"&&!U.match(/\W/)){var X=U=Y?U:U.toUpperCase();T=P}T("previousSibling",U,V,W,X,Y)}},find:{ID:function(U,V,W){if(typeof V.getElementById!=="undefined"&&!W){var T=V.getElementById(U[1]);return T?[T]:[]}},NAME:function(V,Y,Z){if(typeof Y.getElementsByName!=="undefined"){var U=[],X=Y.getElementsByName(V[1]);for(var W=0,T=X.length;W<T;W++){if(X[W].getAttribute("name")===V[1]){U.push(X[W])}}return U.length===0?null:U}},TAG:function(T,U){return U.getElementsByTagName(T[1])}},preFilter:{CLASS:function(W,U,V,T,Z,aa){W=" "+W[1].replace(/\\/g,"")+" ";if(aa){return W}for(var X=0,Y;(Y=U[X])!=null;X++){if(Y){if(Z^(Y.className&&(" "+Y.className+" ").indexOf(W)>=0)){if(!V){T.push(Y)}}else{if(V){U[X]=false}}}}return false},ID:function(T){return T[1].replace(/\\/g,"")},TAG:function(U,T){for(var V=0;T[V]===false;V++){}return T[V]&&Q(T[V])?U[1]:U[1].toUpperCase()},CHILD:function(T){if(T[1]=="nth"){var U=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(T[2]=="even"&&"2n"||T[2]=="odd"&&"2n+1"||!/\D/.test(T[2])&&"0n+"+T[2]||T[2]);T[2]=(U[1]+(U[2]||1))-0;T[3]=U[3]-0}T[0]=L++;return T},ATTR:function(X,U,V,T,Y,Z){var W=X[1].replace(/\\/g,"");if(!Z&&I.attrMap[W]){X[1]=I.attrMap[W]}if(X[2]==="~="){X[4]=" "+X[4]+" "}return X},PSEUDO:function(X,U,V,T,Y){if(X[1]==="not"){if(X[3].match(R).length>1||/^\w/.test(X[3])){X[3]=F(X[3],null,null,U)}else{var W=F.filter(X[3],U,V,true^Y);if(!V){T.push.apply(T,W)}return false}}else{if(I.match.POS.test(X[0])||I.match.CHILD.test(X[0])){return true}}return X},POS:function(T){T.unshift(true);return T}},filters:{enabled:function(T){return T.disabled===false&&T.type!=="hidden"},disabled:function(T){return T.disabled===true},checked:function(T){return T.checked===true},selected:function(T){T.parentNode.selectedIndex;return T.selected===true},parent:function(T){return !!T.firstChild},empty:function(T){return !T.firstChild},has:function(V,U,T){return !!F(T[3],V).length},header:function(T){return/h\d/i.test(T.nodeName)},text:function(T){return"text"===T.type},radio:function(T){return"radio"===T.type},checkbox:function(T){return"checkbox"===T.type},file:function(T){return"file"===T.type},password:function(T){return"password"===T.type},submit:function(T){return"submit"===T.type},image:function(T){return"image"===T.type},reset:function(T){return"reset"===T.type},button:function(T){return"button"===T.type||T.nodeName.toUpperCase()==="BUTTON"},input:function(T){return/input|select|textarea|button/i.test(T.nodeName)}},setFilters:{first:function(U,T){return T===0},last:function(V,U,T,W){return U===W.length-1},even:function(U,T){return T%2===0},odd:function(U,T){return T%2===1},lt:function(V,U,T){return U<T[3]-0},gt:function(V,U,T){return U>T[3]-0},nth:function(V,U,T){return T[3]-0==U},eq:function(V,U,T){return T[3]-0==U}},filter:{PSEUDO:function(Z,V,W,aa){var U=V[1],X=I.filters[U];if(X){return X(Z,W,V,aa)}else{if(U==="contains"){return(Z.textContent||Z.innerText||"").indexOf(V[3])>=0}else{if(U==="not"){var Y=V[3];for(var W=0,T=Y.length;W<T;W++){if(Y[W]===Z){return false}}return true}}}},CHILD:function(T,W){var Z=W[1],U=T;switch(Z){case"only":case"first":while(U=U.previousSibling){if(U.nodeType===1){return false}}if(Z=="first"){return true}U=T;case"last":while(U=U.nextSibling){if(U.nodeType===1){return false}}return true;case"nth":var V=W[2],ac=W[3];if(V==1&&ac==0){return true}var Y=W[0],ab=T.parentNode;if(ab&&(ab.sizcache!==Y||!T.nodeIndex)){var X=0;for(U=ab.firstChild;U;U=U.nextSibling){if(U.nodeType===1){U.nodeIndex=++X}}ab.sizcache=Y}var aa=T.nodeIndex-ac;if(V==0){return aa==0}else{return(aa%V==0&&aa/V>=0)}}},ID:function(U,T){return U.nodeType===1&&U.getAttribute("id")===T},TAG:function(U,T){return(T==="*"&&U.nodeType===1)||U.nodeName===T},CLASS:function(U,T){return(" "+(U.className||U.getAttribute("class"))+" ").indexOf(T)>-1},ATTR:function(Y,W){var V=W[1],T=I.attrHandle[V]?I.attrHandle[V](Y):Y[V]!=null?Y[V]:Y.getAttribute(V),Z=T+"",X=W[2],U=W[4];return T==null?X==="!=":X==="="?Z===U:X==="*="?Z.indexOf(U)>=0:X==="~="?(" "+Z+" ").indexOf(U)>=0:!U?Z&&T!==false:X==="!="?Z!=U:X==="^="?Z.indexOf(U)===0:X==="$="?Z.substr(Z.length-U.length)===U:X==="|="?Z===U||Z.substr(0,U.length+1)===U+"-":false},POS:function(X,U,V,Y){var T=U[2],W=I.setFilters[T];if(W){return W(X,V,U,Y)}}}};var M=I.match.POS;for(var O in I.match){I.match[O]=RegExp(I.match[O].source+/(?![^\[]*\])(?![^\(]*\))/.source)}var E=function(U,T){U=Array.prototype.slice.call(U);if(T){T.push.apply(T,U);return T}return U};try{Array.prototype.slice.call(document.documentElement.childNodes)}catch(N){E=function(X,W){var U=W||[];if(H.call(X)==="[object Array]"){Array.prototype.push.apply(U,X)}else{if(typeof X.length==="number"){for(var V=0,T=X.length;V<T;V++){U.push(X[V])}}else{for(var V=0;X[V];V++){U.push(X[V])}}}return U}}var G;if(document.documentElement.compareDocumentPosition){G=function(U,T){var V=U.compareDocumentPosition(T)&4?-1:U===T?0:1;if(V===0){hasDuplicate=true}return V}}else{if("sourceIndex" in document.documentElement){G=function(U,T){var V=U.sourceIndex-T.sourceIndex;if(V===0){hasDuplicate=true}return V}}else{if(document.createRange){G=function(W,U){var V=W.ownerDocument.createRange(),T=U.ownerDocument.createRange();V.selectNode(W);V.collapse(true);T.selectNode(U);T.collapse(true);var X=V.compareBoundaryPoints(Range.START_TO_END,T);if(X===0){hasDuplicate=true}return X}}}}(function(){var U=document.createElement("form"),V="script"+(new Date).getTime();U.innerHTML="<input name='"+V+"'/>";var T=document.documentElement;T.insertBefore(U,T.firstChild);if(!!document.getElementById(V)){I.find.ID=function(X,Y,Z){if(typeof Y.getElementById!=="undefined"&&!Z){var W=Y.getElementById(X[1]);return W?W.id===X[1]||typeof W.getAttributeNode!=="undefined"&&W.getAttributeNode("id").nodeValue===X[1]?[W]:g:[]}};I.filter.ID=function(Y,W){var X=typeof Y.getAttributeNode!=="undefined"&&Y.getAttributeNode("id");return Y.nodeType===1&&X&&X.nodeValue===W}}T.removeChild(U)})();(function(){var T=document.createElement("div");T.appendChild(document.createComment(""));if(T.getElementsByTagName("*").length>0){I.find.TAG=function(U,Y){var X=Y.getElementsByTagName(U[1]);if(U[1]==="*"){var W=[];for(var V=0;X[V];V++){if(X[V].nodeType===1){W.push(X[V])}}X=W}return X}}T.innerHTML="<a href='#'></a>";if(T.firstChild&&typeof T.firstChild.getAttribute!=="undefined"&&T.firstChild.getAttribute("href")!=="#"){I.attrHandle.href=function(U){return U.getAttribute("href",2)}}})();if(document.querySelectorAll){(function(){var T=F,U=document.createElement("div");U.innerHTML="<p class='TEST'></p>";if(U.querySelectorAll&&U.querySelectorAll(".TEST").length===0){return}F=function(Y,X,V,W){X=X||document;if(!W&&X.nodeType===9&&!Q(X)){try{return E(X.querySelectorAll(Y),V)}catch(Z){}}return T(Y,X,V,W)};F.find=T.find;F.filter=T.filter;F.selectors=T.selectors;F.matches=T.matches})()}if(document.getElementsByClassName&&document.documentElement.getElementsByClassName){(function(){var T=document.createElement("div");T.innerHTML="<div class='test e'></div><div class='test'></div>";if(T.getElementsByClassName("e").length===0){return}T.lastChild.className="e";if(T.getElementsByClassName("e").length===1){return}I.order.splice(1,0,"CLASS");I.find.CLASS=function(U,V,W){if(typeof V.getElementsByClassName!=="undefined"&&!W){return V.getElementsByClassName(U[1])}}})()}function P(U,Z,Y,ad,aa,ac){var ab=U=="previousSibling"&&!ac;for(var W=0,V=ad.length;W<V;W++){var T=ad[W];if(T){if(ab&&T.nodeType===1){T.sizcache=Y;T.sizset=W}T=T[U];var X=false;while(T){if(T.sizcache===Y){X=ad[T.sizset];break}if(T.nodeType===1&&!ac){T.sizcache=Y;T.sizset=W}if(T.nodeName===Z){X=T;break}T=T[U]}ad[W]=X}}}function S(U,Z,Y,ad,aa,ac){var ab=U=="previousSibling"&&!ac;for(var W=0,V=ad.length;W<V;W++){var T=ad[W];if(T){if(ab&&T.nodeType===1){T.sizcache=Y;T.sizset=W}T=T[U];var X=false;while(T){if(T.sizcache===Y){X=ad[T.sizset];break}if(T.nodeType===1){if(!ac){T.sizcache=Y;T.sizset=W}if(typeof Z!=="string"){if(T===Z){X=true;break}}else{if(F.filter(Z,[T]).length>0){X=T;break}}}T=T[U]}ad[W]=X}}}var K=document.compareDocumentPosition?function(U,T){return U.compareDocumentPosition(T)&16}:function(U,T){return U!==T&&(U.contains?U.contains(T):true)};var Q=function(T){return T.nodeType===9&&T.documentElement.nodeName!=="HTML"||!!T.ownerDocument&&Q(T.ownerDocument)};var J=function(T,aa){var W=[],X="",Y,V=aa.nodeType?[aa]:aa;while((Y=I.match.PSEUDO.exec(T))){X+=Y[0];T=T.replace(I.match.PSEUDO,"")}T=I.relative[T]?T+"*":T;for(var Z=0,U=V.length;Z<U;Z++){F(T,V[Z],W)}return F.filter(X,W)};o.find=F;o.filter=F.filter;o.expr=F.selectors;o.expr[":"]=o.expr.filters;F.selectors.filters.hidden=function(T){return T.offsetWidth===0||T.offsetHeight===0};F.selectors.filters.visible=function(T){return T.offsetWidth>0||T.offsetHeight>0};F.selectors.filters.animated=function(T){return o.grep(o.timers,function(U){return T===U.elem}).length};o.multiFilter=function(V,T,U){if(U){V=":not("+V+")"}return F.matches(V,T)};o.dir=function(V,U){var T=[],W=V[U];while(W&&W!=document){if(W.nodeType==1){T.push(W)}W=W[U]}return T};o.nth=function(X,T,V,W){T=T||1;var U=0;for(;X;X=X[V]){if(X.nodeType==1&&++U==T){break}}return X};o.sibling=function(V,U){var T=[];for(;V;V=V.nextSibling){if(V.nodeType==1&&V!=U){T.push(V)}}return T};return;l.Sizzle=F})();o.event={add:function(I,F,H,K){if(I.nodeType==3||I.nodeType==8){return}if(I.setInterval&&I!=l){I=l}if(!H.guid){H.guid=this.guid++}if(K!==g){var G=H;H=this.proxy(G);H.data=K}var E=o.data(I,"events")||o.data(I,"events",{}),J=o.data(I,"handle")||o.data(I,"handle",function(){return typeof o!=="undefined"&&!o.event.triggered?o.event.handle.apply(arguments.callee.elem,arguments):g});J.elem=I;o.each(F.split(/\s+/),function(M,N){var O=N.split(".");N=O.shift();H.type=O.slice().sort().join(".");var L=E[N];if(o.event.specialAll[N]){o.event.specialAll[N].setup.call(I,K,O)}if(!L){L=E[N]={};if(!o.event.special[N]||o.event.special[N].setup.call(I,K,O)===false){if(I.addEventListener){I.addEventListener(N,J,false)}else{if(I.attachEvent){I.attachEvent("on"+N,J)}}}}L[H.guid]=H;o.event.global[N]=true});I=null},guid:1,global:{},remove:function(K,H,J){if(K.nodeType==3||K.nodeType==8){return}var G=o.data(K,"events"),F,E;if(G){if(H===g||(typeof H==="string"&&H.charAt(0)==".")){for(var I in G){this.remove(K,I+(H||""))}}else{if(H.type){J=H.handler;H=H.type}o.each(H.split(/\s+/),function(M,O){var Q=O.split(".");O=Q.shift();var N=RegExp("(^|\\.)"+Q.slice().sort().join(".*\\.")+"(\\.|$)");if(G[O]){if(J){delete G[O][J.guid]}else{for(var P in G[O]){if(N.test(G[O][P].type)){delete G[O][P]}}}if(o.event.specialAll[O]){o.event.specialAll[O].teardown.call(K,Q)}for(F in G[O]){break}if(!F){if(!o.event.special[O]||o.event.special[O].teardown.call(K,Q)===false){if(K.removeEventListener){K.removeEventListener(O,o.data(K,"handle"),false)}else{if(K.detachEvent){K.detachEvent("on"+O,o.data(K,"handle"))}}}F=null;delete G[O]}}})}for(F in G){break}if(!F){var L=o.data(K,"handle");if(L){L.elem=null}o.removeData(K,"events");o.removeData(K,"handle")}}},trigger:function(I,K,H,E){var G=I.type||I;if(!E){I=typeof I==="object"?I[h]?I:o.extend(o.Event(G),I):o.Event(G);if(G.indexOf("!")>=0){I.type=G=G.slice(0,-1);I.exclusive=true}if(!H){I.stopPropagation();if(this.global[G]){o.each(o.cache,function(){if(this.events&&this.events[G]){o.event.trigger(I,K,this.handle.elem)}})}}if(!H||H.nodeType==3||H.nodeType==8){return g}I.result=g;I.target=H;K=o.makeArray(K);K.unshift(I)}I.currentTarget=H;var J=o.data(H,"handle");if(J){J.apply(H,K)}if((!H[G]||(o.nodeName(H,"a")&&G=="click"))&&H["on"+G]&&H["on"+G].apply(H,K)===false){I.result=false}if(!E&&H[G]&&!I.isDefaultPrevented()&&!(o.nodeName(H,"a")&&G=="click")){this.triggered=true;try{H[G]()}catch(L){}}this.triggered=false;if(!I.isPropagationStopped()){var F=H.parentNode||H.ownerDocument;if(F){o.event.trigger(I,K,F,true)}}},handle:function(K){var J,E;K=arguments[0]=o.event.fix(K||l.event);K.currentTarget=this;var L=K.type.split(".");K.type=L.shift();J=!L.length&&!K.exclusive;var I=RegExp("(^|\\.)"+L.slice().sort().join(".*\\.")+"(\\.|$)");E=(o.data(this,"events")||{})[K.type];for(var G in E){var H=E[G];if(J||I.test(H.type)){K.handler=H;K.data=H.data;var F=H.apply(this,arguments);if(F!==g){K.result=F;if(F===false){K.preventDefault();K.stopPropagation()}}if(K.isImmediatePropagationStopped()){break}}}},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(H){if(H[h]){return H}var F=H;H=o.Event(F);for(var G=this.props.length,J;G;){J=this.props[--G];H[J]=F[J]}if(!H.target){H.target=H.srcElement||document}if(H.target.nodeType==3){H.target=H.target.parentNode}if(!H.relatedTarget&&H.fromElement){H.relatedTarget=H.fromElement==H.target?H.toElement:H.fromElement}if(H.pageX==null&&H.clientX!=null){var I=document.documentElement,E=document.body;H.pageX=H.clientX+(I&&I.scrollLeft||E&&E.scrollLeft||0)-(I.clientLeft||0);H.pageY=H.clientY+(I&&I.scrollTop||E&&E.scrollTop||0)-(I.clientTop||0)}if(!H.which&&((H.charCode||H.charCode===0)?H.charCode:H.keyCode)){H.which=H.charCode||H.keyCode}if(!H.metaKey&&H.ctrlKey){H.metaKey=H.ctrlKey}if(!H.which&&H.button){H.which=(H.button&1?1:(H.button&2?3:(H.button&4?2:0)))}return H},proxy:function(F,E){E=E||function(){return F.apply(this,arguments)};E.guid=F.guid=F.guid||E.guid||this.guid++;return E},special:{ready:{setup:B,teardown:function(){}}},specialAll:{live:{setup:function(E,F){o.event.add(this,F[0],c)},teardown:function(G){if(G.length){var E=0,F=RegExp("(^|\\.)"+G[0]+"(\\.|$)");o.each((o.data(this,"events").live||{}),function(){if(F.test(this.type)){E++}});if(E<1){o.event.remove(this,G[0],c)}}}}}};o.Event=function(E){if(!this.preventDefault){return new o.Event(E)}if(E&&E.type){this.originalEvent=E;this.type=E.type}else{this.type=E}this.timeStamp=e();this[h]=true};function k(){return false}function u(){return true}o.Event.prototype={preventDefault:function(){this.isDefaultPrevented=u;var E=this.originalEvent;if(!E){return}if(E.preventDefault){E.preventDefault()}E.returnValue=false},stopPropagation:function(){this.isPropagationStopped=u;var E=this.originalEvent;if(!E){return}if(E.stopPropagation){E.stopPropagation()}E.cancelBubble=true},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=u;this.stopPropagation()},isDefaultPrevented:k,isPropagationStopped:k,isImmediatePropagationStopped:k};var a=function(F){var E=F.relatedTarget;while(E&&E!=this){try{E=E.parentNode}catch(G){E=this}}if(E!=this){F.type=F.data;o.event.handle.apply(this,arguments)}};o.each({mouseover:"mouseenter",mouseout:"mouseleave"},function(F,E){o.event.special[E]={setup:function(){o.event.add(this,F,a,E)},teardown:function(){o.event.remove(this,F,a)}}});o.fn.extend({bind:function(F,G,E){return F=="unload"?this.one(F,G,E):this.each(function(){o.event.add(this,F,E||G,E&&G)})},one:function(G,H,F){var E=o.event.proxy(F||H,function(I){o(this).unbind(I,E);return(F||H).apply(this,arguments)});return this.each(function(){o.event.add(this,G,E,F&&H)})},unbind:function(F,E){return this.each(function(){o.event.remove(this,F,E)})},trigger:function(E,F){return this.each(function(){o.event.trigger(E,F,this)})},triggerHandler:function(E,G){if(this[0]){var F=o.Event(E);F.preventDefault();F.stopPropagation();o.event.trigger(F,G,this[0]);return F.result}},toggle:function(G){var E=arguments,F=1;while(F<E.length){o.event.proxy(G,E[F++])}return this.click(o.event.proxy(G,function(H){this.lastToggle=(this.lastToggle||0)%F;H.preventDefault();return E[this.lastToggle++].apply(this,arguments)||false}))},hover:function(E,F){return this.mouseenter(E).mouseleave(F)},ready:function(E){B();if(o.isReady){E.call(document,o)}else{o.readyList.push(E)}return this},live:function(G,F){var E=o.event.proxy(F);E.guid+=this.selector+G;o(document).bind(i(G,this.selector),this.selector,E);return this},die:function(F,E){o(document).unbind(i(F,this.selector),E?{guid:E.guid+this.selector+F}:null);return this}});function c(H){var E=RegExp("(^|\\.)"+H.type+"(\\.|$)"),G=true,F=[];o.each(o.data(this,"events").live||[],function(I,J){if(E.test(J.type)){var K=o(H.target).closest(J.data)[0];if(K){F.push({elem:K,fn:J})}}});F.sort(function(J,I){return o.data(J.elem,"closest")-o.data(I.elem,"closest")});o.each(F,function(){if(this.fn.call(this.elem,H,this.fn.data)===false){return(G=false)}});return G}function i(F,E){return["live",F,E.replace(/\./g,"`").replace(/ /g,"|")].join(".")}o.extend({isReady:false,readyList:[],ready:function(){if(!o.isReady){o.isReady=true;if(o.readyList){o.each(o.readyList,function(){this.call(document,o)});o.readyList=null}o(document).triggerHandler("ready")}}});var x=false;function B(){if(x){return}x=true;if(document.addEventListener){document.addEventListener("DOMContentLoaded",function(){document.removeEventListener("DOMContentLoaded",arguments.callee,false);o.ready()},false)}else{if(document.attachEvent){document.attachEvent("onreadystatechange",function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",arguments.callee);o.ready()}});if(document.documentElement.doScroll&&l==l.top){(function(){if(o.isReady){return}try{document.documentElement.doScroll("left")}catch(E){setTimeout(arguments.callee,0);return}o.ready()})()}}}o.event.add(l,"load",o.ready)}o.each(("blur,focus,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,change,select,submit,keydown,keypress,keyup,error").split(","),function(F,E){o.fn[E]=function(G){return G?this.bind(E,G):this.trigger(E)}});o(l).bind("unload",function(){for(var E in o.cache){if(E!=1&&o.cache[E].handle){o.event.remove(o.cache[E].handle.elem)}}});(function(){o.support={};var F=document.documentElement,G=document.createElement("script"),K=document.createElement("div"),J="script"+(new Date).getTime();K.style.display="none";K.innerHTML='   <link/><table></table><a href="/a" style="color:red;float:left;opacity:.5;">a</a><select><option>text</option></select><object><param/></object>';var H=K.getElementsByTagName("*"),E=K.getElementsByTagName("a")[0];if(!H||!H.length||!E){return}o.support={leadingWhitespace:K.firstChild.nodeType==3,tbody:!K.getElementsByTagName("tbody").length,objectAll:!!K.getElementsByTagName("object")[0].getElementsByTagName("*").length,htmlSerialize:!!K.getElementsByTagName("link").length,style:/red/.test(E.getAttribute("style")),hrefNormalized:E.getAttribute("href")==="/a",opacity:E.style.opacity==="0.5",cssFloat:!!E.style.cssFloat,scriptEval:false,noCloneEvent:true,boxModel:null};G.type="text/javascript";try{G.appendChild(document.createTextNode("window."+J+"=1;"))}catch(I){}F.insertBefore(G,F.firstChild);if(l[J]){o.support.scriptEval=true;delete l[J]}F.removeChild(G);if(K.attachEvent&&K.fireEvent){K.attachEvent("onclick",function(){o.support.noCloneEvent=false;K.detachEvent("onclick",arguments.callee)});K.cloneNode(true).fireEvent("onclick")}o(function(){var L=document.createElement("div");L.style.width=L.style.paddingLeft="1px";document.body.appendChild(L);o.boxModel=o.support.boxModel=L.offsetWidth===2;document.body.removeChild(L).style.display="none"})})();var w=o.support.cssFloat?"cssFloat":"styleFloat";o.props={"for":"htmlFor","class":"className","float":w,cssFloat:w,styleFloat:w,readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",tabindex:"tabIndex"};o.fn.extend({_load:o.fn.load,load:function(G,J,K){if(typeof G!=="string"){return this._load(G)}var I=G.indexOf(" ");if(I>=0){var E=G.slice(I,G.length);G=G.slice(0,I)}var H="GET";if(J){if(o.isFunction(J)){K=J;J=null}else{if(typeof J==="object"){J=o.param(J);H="POST"}}}var F=this;o.ajax({url:G,type:H,dataType:"html",data:J,complete:function(M,L){if(L=="success"||L=="notmodified"){F.html(E?o("<div/>").append(M.responseText.replace(/<script(.|\s)*?\/script>/g,"")).find(E):M.responseText)}if(K){F.each(K,[M.responseText,L,M])}}});return this},serialize:function(){return o.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?o.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||/select|textarea/i.test(this.nodeName)||/text|hidden|password|search/i.test(this.type))}).map(function(E,F){var G=o(this).val();return G==null?null:o.isArray(G)?o.map(G,function(I,H){return{name:F.name,value:I}}):{name:F.name,value:G}}).get()}});o.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","),function(E,F){o.fn[F]=function(G){return this.bind(F,G)}});var r=e();o.extend({get:function(E,G,H,F){if(o.isFunction(G)){H=G;G=null}return o.ajax({type:"GET",url:E,data:G,success:H,dataType:F})},getScript:function(E,F){return o.get(E,null,F,"script")},getJSON:function(E,F,G){return o.get(E,F,G,"json")},post:function(E,G,H,F){if(o.isFunction(G)){H=G;G={}}return o.ajax({type:"POST",url:E,data:G,success:H,dataType:F})},ajaxSetup:function(E){o.extend(o.ajaxSettings,E)},ajaxSettings:{url:location.href,global:true,type:"GET",contentType:"application/x-www-form-urlencoded",processData:true,async:true,xhr:function(){return l.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest()},accepts:{xml:"application/xml, text/xml",html:"text/html",script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"}},lastModified:{},ajax:function(M){M=o.extend(true,M,o.extend(true,{},o.ajaxSettings,M));var W,F=/=\?(&|$)/g,R,V,G=M.type.toUpperCase();if(M.data&&M.processData&&typeof M.data!=="string"){M.data=o.param(M.data)}if(M.dataType=="jsonp"){if(G=="GET"){if(!M.url.match(F)){M.url+=(M.url.match(/\?/)?"&":"?")+(M.jsonp||"callback")+"=?"}}else{if(!M.data||!M.data.match(F)){M.data=(M.data?M.data+"&":"")+(M.jsonp||"callback")+"=?"}}M.dataType="json"}if(M.dataType=="json"&&(M.data&&M.data.match(F)||M.url.match(F))){W="jsonp"+r++;if(M.data){M.data=(M.data+"").replace(F,"="+W+"$1")}M.url=M.url.replace(F,"="+W+"$1");M.dataType="script";l[W]=function(X){V=X;I();L();l[W]=g;try{delete l[W]}catch(Y){}if(H){H.removeChild(T)}}}if(M.dataType=="script"&&M.cache==null){M.cache=false}if(M.cache===false&&G=="GET"){var E=e();var U=M.url.replace(/(\?|&)_=.*?(&|$)/,"$1_="+E+"$2");M.url=U+((U==M.url)?(M.url.match(/\?/)?"&":"?")+"_="+E:"")}if(M.data&&G=="GET"){M.url+=(M.url.match(/\?/)?"&":"?")+M.data;M.data=null}if(M.global&&!o.active++){o.event.trigger("ajaxStart")}var Q=/^(\w+:)?\/\/([^\/?#]+)/.exec(M.url);if(M.dataType=="script"&&G=="GET"&&Q&&(Q[1]&&Q[1]!=location.protocol||Q[2]!=location.host)){var H=document.getElementsByTagName("head")[0];var T=document.createElement("script");T.src=M.url;if(M.scriptCharset){T.charset=M.scriptCharset}if(!W){var O=false;T.onload=T.onreadystatechange=function(){if(!O&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){O=true;I();L();T.onload=T.onreadystatechange=null;H.removeChild(T)}}}H.appendChild(T);return g}var K=false;var J=M.xhr();if(M.username){J.open(G,M.url,M.async,M.username,M.password)}else{J.open(G,M.url,M.async)}try{if(M.data){J.setRequestHeader("Content-Type",M.contentType)}if(M.ifModified){J.setRequestHeader("If-Modified-Since",o.lastModified[M.url]||"Thu, 01 Jan 1970 00:00:00 GMT")}J.setRequestHeader("X-Requested-With","XMLHttpRequest");J.setRequestHeader("Accept",M.dataType&&M.accepts[M.dataType]?M.accepts[M.dataType]+", */*":M.accepts._default)}catch(S){}if(M.beforeSend&&M.beforeSend(J,M)===false){if(M.global&&!--o.active){o.event.trigger("ajaxStop")}J.abort();return false}if(M.global){o.event.trigger("ajaxSend",[J,M])}var N=function(X){if(J.readyState==0){if(P){clearInterval(P);P=null;if(M.global&&!--o.active){o.event.trigger("ajaxStop")}}}else{if(!K&&J&&(J.readyState==4||X=="timeout")){K=true;if(P){clearInterval(P);P=null}R=X=="timeout"?"timeout":!o.httpSuccess(J)?"error":M.ifModified&&o.httpNotModified(J,M.url)?"notmodified":"success";if(R=="success"){try{V=o.httpData(J,M.dataType,M)}catch(Z){R="parsererror"}}if(R=="success"){var Y;try{Y=J.getResponseHeader("Last-Modified")}catch(Z){}if(M.ifModified&&Y){o.lastModified[M.url]=Y}if(!W){I()}}else{o.handleError(M,J,R)}L();if(X){J.abort()}if(M.async){J=null}}}};if(M.async){var P=setInterval(N,13);if(M.timeout>0){setTimeout(function(){if(J&&!K){N("timeout")}},M.timeout)}}try{J.send(M.data)}catch(S){o.handleError(M,J,null,S)}if(!M.async){N()}function I(){if(M.success){M.success(V,R)}if(M.global){o.event.trigger("ajaxSuccess",[J,M])}}function L(){if(M.complete){M.complete(J,R)}if(M.global){o.event.trigger("ajaxComplete",[J,M])}if(M.global&&!--o.active){o.event.trigger("ajaxStop")}}return J},handleError:function(F,H,E,G){if(F.error){F.error(H,E,G)}if(F.global){o.event.trigger("ajaxError",[H,F,G])}},active:0,httpSuccess:function(F){try{return !F.status&&location.protocol=="file:"||(F.status>=200&&F.status<300)||F.status==304||F.status==1223}catch(E){}return false},httpNotModified:function(G,E){try{var H=G.getResponseHeader("Last-Modified");return G.status==304||H==o.lastModified[E]}catch(F){}return false},httpData:function(J,H,G){var F=J.getResponseHeader("content-type"),E=H=="xml"||!H&&F&&F.indexOf("xml")>=0,I=E?J.responseXML:J.responseText;if(E&&I.documentElement.tagName=="parsererror"){throw"parsererror"}if(G&&G.dataFilter){I=G.dataFilter(I,H)}if(typeof I==="string"){if(H=="script"){o.globalEval(I)}if(H=="json"){I=l["eval"]("("+I+")")}}return I},param:function(E){var G=[];function H(I,J){G[G.length]=encodeURIComponent(I)+"="+encodeURIComponent(J)}if(o.isArray(E)||E.jquery){o.each(E,function(){H(this.name,this.value)})}else{for(var F in E){if(o.isArray(E[F])){o.each(E[F],function(){H(F,this)})}else{H(F,o.isFunction(E[F])?E[F]():E[F])}}}return G.join("&").replace(/%20/g,"+")}});var m={},n,d=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];function t(F,E){var G={};o.each(d.concat.apply([],d.slice(0,E)),function(){G[this]=F});return G}o.fn.extend({show:function(J,L){if(J){return this.animate(t("show",3),J,L)}else{for(var H=0,F=this.length;H<F;H++){var E=o.data(this[H],"olddisplay");this[H].style.display=E||"";if(o.css(this[H],"display")==="none"){var G=this[H].tagName,K;if(m[G]){K=m[G]}else{var I=o("<"+G+" />").appendTo("body");K=I.css("display");if(K==="none"){K="block"}I.remove();m[G]=K}o.data(this[H],"olddisplay",K)}}for(var H=0,F=this.length;H<F;H++){this[H].style.display=o.data(this[H],"olddisplay")||""}return this}},hide:function(H,I){if(H){return this.animate(t("hide",3),H,I)}else{for(var G=0,F=this.length;G<F;G++){var E=o.data(this[G],"olddisplay");if(!E&&E!=="none"){o.data(this[G],"olddisplay",o.css(this[G],"display"))}}for(var G=0,F=this.length;G<F;G++){this[G].style.display="none"}return this}},_toggle:o.fn.toggle,toggle:function(G,F){var E=typeof G==="boolean";return o.isFunction(G)&&o.isFunction(F)?this._toggle.apply(this,arguments):G==null||E?this.each(function(){var H=E?G:o(this).is(":hidden");o(this)[H?"show":"hide"]()}):this.animate(t("toggle",3),G,F)},fadeTo:function(E,G,F){return this.animate({opacity:G},E,F)},animate:function(I,F,H,G){var E=o.speed(F,H,G);return this[E.queue===false?"each":"queue"](function(){var K=o.extend({},E),M,L=this.nodeType==1&&o(this).is(":hidden"),J=this;for(M in I){if(I[M]=="hide"&&L||I[M]=="show"&&!L){return K.complete.call(this)}if((M=="height"||M=="width")&&this.style){K.display=o.css(this,"display");K.overflow=this.style.overflow}}if(K.overflow!=null){this.style.overflow="hidden"}K.curAnim=o.extend({},I);o.each(I,function(O,S){var R=new o.fx(J,K,O);if(/toggle|show|hide/.test(S)){R[S=="toggle"?L?"show":"hide":S](I)}else{var Q=S.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),T=R.cur(true)||0;if(Q){var N=parseFloat(Q[2]),P=Q[3]||"px";if(P!="px"){J.style[O]=(N||1)+P;T=((N||1)/R.cur(true))*T;J.style[O]=T+P}if(Q[1]){N=((Q[1]=="-="?-1:1)*N)+T}R.custom(T,N,P)}else{R.custom(T,S,"")}}});return true})},stop:function(F,E){var G=o.timers;if(F){this.queue([])}this.each(function(){for(var H=G.length-1;H>=0;H--){if(G[H].elem==this){if(E){G[H](true)}G.splice(H,1)}}});if(!E){this.dequeue()}return this}});o.each({slideDown:t("show",1),slideUp:t("hide",1),slideToggle:t("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"}},function(E,F){o.fn[E]=function(G,H){return this.animate(F,G,H)}});o.extend({speed:function(G,H,F){var E=typeof G==="object"?G:{complete:F||!F&&H||o.isFunction(G)&&G,duration:G,easing:F&&H||H&&!o.isFunction(H)&&H};E.duration=o.fx.off?0:typeof E.duration==="number"?E.duration:o.fx.speeds[E.duration]||o.fx.speeds._default;E.old=E.complete;E.complete=function(){if(E.queue!==false){o(this).dequeue()}if(o.isFunction(E.old)){E.old.call(this)}};return E},easing:{linear:function(G,H,E,F){return E+F*G},swing:function(G,H,E,F){return((-Math.cos(G*Math.PI)/2)+0.5)*F+E}},timers:[],fx:function(F,E,G){this.options=E;this.elem=F;this.prop=G;if(!E.orig){E.orig={}}}});o.fx.prototype={update:function(){if(this.options.step){this.options.step.call(this.elem,this.now,this)}(o.fx.step[this.prop]||o.fx.step._default)(this);if((this.prop=="height"||this.prop=="width")&&this.elem.style){this.elem.style.display="block"}},cur:function(F){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null)){return this.elem[this.prop]}var E=parseFloat(o.css(this.elem,this.prop,F));return E&&E>-10000?E:parseFloat(o.curCSS(this.elem,this.prop))||0},custom:function(I,H,G){this.startTime=e();this.start=I;this.end=H;this.unit=G||this.unit||"px";this.now=this.start;this.pos=this.state=0;var E=this;function F(J){return E.step(J)}F.elem=this.elem;if(F()&&o.timers.push(F)&&!n){n=setInterval(function(){var K=o.timers;for(var J=0;J<K.length;J++){if(!K[J]()){K.splice(J--,1)}}if(!K.length){clearInterval(n);n=g}},13)}},show:function(){this.options.orig[this.prop]=o.attr(this.elem.style,this.prop);this.options.show=true;this.custom(this.prop=="width"||this.prop=="height"?1:0,this.cur());o(this.elem).show()},hide:function(){this.options.orig[this.prop]=o.attr(this.elem.style,this.prop);this.options.hide=true;this.custom(this.cur(),0)},step:function(H){var G=e();if(H||G>=this.options.duration+this.startTime){this.now=this.end;this.pos=this.state=1;this.update();this.options.curAnim[this.prop]=true;var E=true;for(var F in this.options.curAnim){if(this.options.curAnim[F]!==true){E=false}}if(E){if(this.options.display!=null){this.elem.style.overflow=this.options.overflow;this.elem.style.display=this.options.display;if(o.css(this.elem,"display")=="none"){this.elem.style.display="block"}}if(this.options.hide){o(this.elem).hide()}if(this.options.hide||this.options.show){for(var I in this.options.curAnim){o.attr(this.elem.style,I,this.options.orig[I])}}this.options.complete.call(this.elem)}return false}else{var J=G-this.startTime;this.state=J/this.options.duration;this.pos=o.easing[this.options.easing||(o.easing.swing?"swing":"linear")](this.state,J,0,1,this.options.duration);this.now=this.start+((this.end-this.start)*this.pos);this.update()}return true}};o.extend(o.fx,{speeds:{slow:600,fast:200,_default:400},step:{opacity:function(E){o.attr(E.elem.style,"opacity",E.now)},_default:function(E){if(E.elem.style&&E.elem.style[E.prop]!=null){E.elem.style[E.prop]=E.now+E.unit}else{E.elem[E.prop]=E.now}}}});if(document.documentElement.getBoundingClientRect){o.fn.offset=function(){if(!this[0]){return{top:0,left:0}}if(this[0]===this[0].ownerDocument.body){return o.offset.bodyOffset(this[0])}var G=this[0].getBoundingClientRect(),J=this[0].ownerDocument,F=J.body,E=J.documentElement,L=E.clientTop||F.clientTop||0,K=E.clientLeft||F.clientLeft||0,I=G.top+(self.pageYOffset||o.boxModel&&E.scrollTop||F.scrollTop)-L,H=G.left+(self.pageXOffset||o.boxModel&&E.scrollLeft||F.scrollLeft)-K;return{top:I,left:H}}}else{o.fn.offset=function(){if(!this[0]){return{top:0,left:0}}if(this[0]===this[0].ownerDocument.body){return o.offset.bodyOffset(this[0])}o.offset.initialized||o.offset.initialize();var J=this[0],G=J.offsetParent,F=J,O=J.ownerDocument,M,H=O.documentElement,K=O.body,L=O.defaultView,E=L.getComputedStyle(J,null),N=J.offsetTop,I=J.offsetLeft;while((J=J.parentNode)&&J!==K&&J!==H){M=L.getComputedStyle(J,null);N-=J.scrollTop,I-=J.scrollLeft;if(J===G){N+=J.offsetTop,I+=J.offsetLeft;if(o.offset.doesNotAddBorder&&!(o.offset.doesAddBorderForTableAndCells&&/^t(able|d|h)$/i.test(J.tagName))){N+=parseInt(M.borderTopWidth,10)||0,I+=parseInt(M.borderLeftWidth,10)||0}F=G,G=J.offsetParent}if(o.offset.subtractsBorderForOverflowNotVisible&&M.overflow!=="visible"){N+=parseInt(M.borderTopWidth,10)||0,I+=parseInt(M.borderLeftWidth,10)||0}E=M}if(E.position==="relative"||E.position==="static"){N+=K.offsetTop,I+=K.offsetLeft}if(E.position==="fixed"){N+=Math.max(H.scrollTop,K.scrollTop),I+=Math.max(H.scrollLeft,K.scrollLeft)}return{top:N,left:I}}}o.offset={initialize:function(){if(this.initialized){return}var L=document.body,F=document.createElement("div"),H,G,N,I,M,E,J=L.style.marginTop,K='<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;" cellpadding="0" cellspacing="0"><tr><td></td></tr></table>';M={position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"};for(E in M){F.style[E]=M[E]}F.innerHTML=K;L.insertBefore(F,L.firstChild);H=F.firstChild,G=H.firstChild,I=H.nextSibling.firstChild.firstChild;this.doesNotAddBorder=(G.offsetTop!==5);this.doesAddBorderForTableAndCells=(I.offsetTop===5);H.style.overflow="hidden",H.style.position="relative";this.subtractsBorderForOverflowNotVisible=(G.offsetTop===-5);L.style.marginTop="1px";this.doesNotIncludeMarginInBodyOffset=(L.offsetTop===0);L.style.marginTop=J;L.removeChild(F);this.initialized=true},bodyOffset:function(E){o.offset.initialized||o.offset.initialize();var G=E.offsetTop,F=E.offsetLeft;if(o.offset.doesNotIncludeMarginInBodyOffset){G+=parseInt(o.curCSS(E,"marginTop",true),10)||0,F+=parseInt(o.curCSS(E,"marginLeft",true),10)||0}return{top:G,left:F}}};o.fn.extend({position:function(){var I=0,H=0,F;if(this[0]){var G=this.offsetParent(),J=this.offset(),E=/^body|html$/i.test(G[0].tagName)?{top:0,left:0}:G.offset();J.top-=j(this,"marginTop");J.left-=j(this,"marginLeft");E.top+=j(G,"borderTopWidth");E.left+=j(G,"borderLeftWidth");F={top:J.top-E.top,left:J.left-E.left}}return F},offsetParent:function(){var E=this[0].offsetParent||document.body;while(E&&(!/^body|html$/i.test(E.tagName)&&o.css(E,"position")=="static")){E=E.offsetParent}return o(E)}});o.each(["Left","Top"],function(F,E){var G="scroll"+E;o.fn[G]=function(H){if(!this[0]){return null}return H!==g?this.each(function(){this==l||this==document?l.scrollTo(!F?H:o(l).scrollLeft(),F?H:o(l).scrollTop()):this[G]=H}):this[0]==l||this[0]==document?self[F?"pageYOffset":"pageXOffset"]||o.boxModel&&document.documentElement[G]||document.body[G]:this[0][G]}});o.each(["Height","Width"],function(I,G){var E=I?"Left":"Top",H=I?"Right":"Bottom",F=G.toLowerCase();o.fn["inner"+G]=function(){return this[0]?o.css(this[0],F,false,"padding"):null};o.fn["outer"+G]=function(K){return this[0]?o.css(this[0],F,false,K?"margin":"border"):null};var J=G.toLowerCase();o.fn[J]=function(K){return this[0]==l?document.compatMode=="CSS1Compat"&&document.documentElement["client"+G]||document.body["client"+G]:this[0]==document?Math.max(document.documentElement["client"+G],document.body["scroll"+G],document.documentElement["scroll"+G],document.body["offset"+G],document.documentElement["offset"+G]):K===g?(this.length?o.css(this[0],J):null):this.css(J,typeof K==="string"?K:K+"px")}})})();
/**
   main namespace for the library
*/
var Siesta = {};

/**
   By default the framework is not packaged.
   This setting will be overriden by sprockets
   when requiring the next script
*/
Siesta.isPackaged = false;
Siesta.isPackaged = true;

/**
   main namespace for the framework
*/
Siesta.Framework = {};

/**
   constants

*/
Siesta.Constants = {};
Siesta.Constants.SUCCESS = "success";
Siesta.Constants.FAILURE = "failure";
Siesta.Constants.RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
Siesta.Constants.SIESTA_ID = "http://semantic_rest/siesta#id";


/**
   Checks if one function is defined in the
   runtime.
   - fn : Lambda function wrapping the symbol
   to check.
*/
Siesta.defined = function(fn) {
    try {
        fn();
        return true;
    } catch(ex) {
        return false;
    }
};


/**
   Tests if we are executing under Rhino
*/
Siesta.isRhino = function() {
    return Siesta.defined(function(){gc});
};

/**
   Returns the current path in the browser till the last '/' (not included)
*/
Siesta.currentPath = function() {
    return location.href.split("/").slice(0,-1).join("/");
};


/**
   generic load of scripts it should load
   with the Rhino 'load' function or with
   the javascript framework in the browser
   - scriptPath : path to the script to load.
*/
Siesta.load = function(scriptPath)  {
    if(Siesta.isRhino()) {
	load(scriptPath);
    } else {
        var thePath = "";
        for(i = 0; i<arguments.length; i++) {
            if(i!=0) {
                thePath = thePath.concat("/").concat(arguments[i]);
            } else {
                thePath = thePath.concat(arguments[i]);
            }
        }
        var e = document.createElement("script");
        e.src = thePath;
        e.type="text/javascript";
        document.getElementsByTagName("head")[0].appendChild(e);
    }
};

/**
   load scripts from the path specified from the initial base directory
   - scriptPath : path to the script to load.
*/
Siesta.loadFromBase = function(scriptPath)  {
    if(Siesta.isRhino()) {
	load(scriptPath);
    } else {
        var thePath = "/";
        try{
            var thePath = Siesta.basePath();
        }catch(e) {}
        for(i = 0; i<arguments.length; i++) {
            thePath = thePath.concat("/").concat(arguments[i]);
        }
        var e = document.createElement("script");
        e.src = thePath;
        e.type="text/javascript";
        document.getElementsByTagName("head")[0].appendChild(e);
    }
};

/**
   Allow the enumeration of object methods in Rhino
*/
/*
  Object.prototype.methods = function() {
  var ms = [];
  counter = 0;
  for(var i in this) {
  ms[counter] = i;
  if(Siesta.isRhino()) {
  print(counter+": "+i);
  }
  counter++;
  }

  ms;
  }
*/


/**
 *  XSD datatypes support.
 */
Siesta.XSD = {};
Siesta.XSD.DATATYPES = {
    datatype:"http://www.w3.org/2000/01/rdf-schema#Datatype",
    string:"http://www.w3.org/2001/XMLSchema#string",
    boolean:"http://www.w3.org/2001/XMLSchema#boolean",
    decimal:"http://www.w3.org/2001/XMLSchema#decimal",
    float:"http://www.w3.org/2001/XMLSchema#float",
    double:"http://www.w3.org/2001/XMLSchema#double",
    dateTime:"http://www.w3.org/2001/XMLSchema#dateTime",
    time:"http://www.w3.org/2001/XMLSchema#time",
    date:"http://www.w3.org/2001/XMLSchema#date",
    gYearMonth:"http://www.w3.org/2001/XMLSchema#gYearMonth",
    gYear:"http://www.w3.org/2001/XMLSchema#gYear",
    gMonthDay:"http://www.w3.org/2001/XMLSchema#gMonthDay",
    gDay:"http://www.w3.org/2001/XMLSchema#gDay",
    gMonth:"http://www.w3.org/2001/XMLSchema#gMonth",
    hexBinary:"http://www.w3.org/2001/XMLSchema#hexBinary",
    base64Binary:"http://www.w3.org/2001/XMLSchema#base64Binary",
    anyURI:"http://www.w3.org/2001/XMLSchema#anyURI",
    normalizedString:"http://www.w3.org/2001/XMLSchema#normalizedString",
    token:"http://www.w3.org/2001/XMLSchema#token",
    language:"http://www.w3.org/2001/XMLSchema#language",
    NMTOKEN:"http://www.w3.org/2001/XMLSchema#NMTOKEN",
    Name:"http://www.w3.org/2001/XMLSchema#Name",
    NCName:"http://www.w3.org/2001/XMLSchema#NCName",
    integer:"http://www.w3.org/2001/XMLSchema#integer",
    nonPositiveInteger:"http://www.w3.org/2001/XMLSchema#nonPositiveInteger",
    negativeInteger:"http://www.w3.org/2001/XMLSchema#negativeInteger",
    long:"http://www.w3.org/2001/XMLSchema#long",
    int:"http://www.w3.org/2001/XMLSchema#int",
    short:"http://www.w3.org/2001/XMLSchema#short",
    byte:"http://www.w3.org/2001/XMLSchema#byte",
    nonNegativeInteger:"http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    unsignedLong:"http://www.w3.org/2001/XMLSchema#unsignedLong",
    unsignedInt:"http://www.w3.org/2001/XMLSchema#unsignedInt",
    unsignedShort:"http://www.w3.org/2001/XMLSchema#unsignedShort",
    unsignedByte:"http://www.w3.org/2001/XMLSchema#unsignedByte",
    positiveInteger:"http://www.w3.org/2001/XMLSchema#positiveInteger" };


Siesta.XSD.DATATYPES_INV = {};
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2000/01/rdf-schema#Datatype"] = "datatype";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#string"] = "string";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#boolean"]= "boolean";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#decimal"] = "decimal";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#float"] = "float";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#double"] = "double";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#dateTime"] = "dateTime";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#time"] = "time";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#date"] = "date";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#gYearMonth"] = "gYearMonth";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#gYear"] = "gYear";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#gMonthDay"] = "gMonthDay";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#gDay"] = "gDay";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#gMonth"] = "gMonth";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#hexBinary"] = "hexBinary";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#base64Binary"] = "base64Binary";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#anyURI"] = "anyURI";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#normalizedString"] = "normalizedString";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#token"] = "token";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#language"] = "language";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#NMTOKEN"] = "NMTOKEN";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#Name"] = "Name";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#NCName"] = "NCName";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#integer"] = "integer";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#nonPositiveInteger"] = "nonPositiveInteger";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#negativeInteger"] = "negativeInteger";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#long"] = "long";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#int"] = "int";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#short"] = "short";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#byte"] = "byte";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#nonNegativeInteger"] = "nonNegativeInteger";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#unsignedLong"] = "unsignedLong";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#unsignedInt"] = "unsignedInt";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#unsignedShort"] = "unsignedShort";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#unsignedByte"] = "unsignedByte";
Siesta.XSD.DATATYPES_INV["http://www.w3.org/2001/XMLSchema#positiveInteger" ] = "positiveInteger";

/**
 *  Registers a new namespace in the javascript
 *  runtime.
 */
Siesta.registerNamespace = function() {
    var nsPath = "";
    for (var i=0; i<arguments.length; i++) {
        var ns = arguments[i];
        if(nsPath != "") {
            nsPath = nsPath + ".";
        }
        var nsPath = nsPath + ns;
        try {
            var res = eval(nsPath);
            if(res == null) {
                throw "Non existant path";
            }
        } catch(e) {
            eval(nsPath + " = {};");
        }
    }
}

Siesta.Framework.classBuilder = function(origin,specification) {
    for(var member in specification) {
        origin.prototype[member] = specification[member];
    }
}

/**
     *  Namespace object definition.
     *  Stores a name and url for the namespace.
     */
Siesta.Framework.Namespace = function(name,uri) { this.initialize(name,uri) };
Siesta.Framework.classBuilder(Siesta.Framework.Namespace, {

    /**
         *  Builds a new namespace.
         *
         *  @arguments
         *  - name: the name of the namespace.
         *  - uri: the uri of this namespace.
         */
    initialize: function(name,uri) {
        this.name = name;
        this.uri = uri;
        this.__type = 'namespace';
    }
});
/**
 *  Uri object definition.
 *  Stores a a Uri for the namespace.
 */
Siesta.Framework.Uri = function() {
  if(arguments.length == 2) {
      this.initialize(arguments[0],arguments[1]);
  } else if(arguments.length == 1) {
      this.initialize(arguments[0]);
  }
};

Siesta.Framework.classBuilder(Siesta.Framework.Uri, {

    /**
     *  Builds a new Uri object.
     *
     *  @arguments
     *  - namespace: optional prefix of a namespace.
     *  - value: mandatory value for the URI.
     *
     *  @throws
     *  - an exception is thrown if no value or namespace and value are given.
     */
    initialize: function() {
        if(arguments.length == 2) {
            this.namespace = arguments[0];
            this.value = arguments[1];
        } else if(arguments.length == 1) {
            this.value = arguments[0];
            this.namespace = null;
        } else {
            throw new Error("Trying to create null Siesta.Framework.Uri");
        }
        this.__type = 'uri';
    },

    /**
     * Human readable representation of this URI
     */
    toString: function() {
        if(this.namespace == null) {
            return this.value;
        } else {
            return this.namespace + this.value;
        }
    }
});
/**
 *  BlankNode object definition.
 */
Siesta.Framework.BlankNode = function(identifier) { this.initialize(identifier) };
Siesta.Framework.classBuilder(Siesta.Framework.BlankNode, {

    /**
         *  Builds a new BlankNode object.
         *
         *  @arguments
         *  - identifier: the identifier of the blank node.
         *
         */
    initialize: function(identifier) {
        if(identifier == null) {
            throw new Error("Trying to create a Siesta.Framework.BlankNode with a null identifier");
        }

        this.value = identifier;
        this.__type = 'blanknode';
    },

    /**
             * Human readable representation of this URI
             */
    toString: function() {
        return "_:"+this.value;
    }
});

/**
 *  Literal object definition.
 */
Siesta.Framework.Literal = function(options) { this.initialize(options) };
Siesta.Framework.classBuilder(Siesta.Framework.Literal, {

    /**
         *  Builds a new Literal object.
         *
         *  @arguments
         *  - object with the following fields:
         *    - value: mandator value for the literal.
         *    - language: optional language for the literal.
         *    - type: optional Siesta.framework.Uri for the type.
         *
         *  @throws
         *  - an exception is thrown if no value or namespace and value are given.
         */
    initialize: function(options) {
        if(options.value == null) {
            throw new Error("Trying to create null Siesta.Framework.Literal");


        } else if(arguments.length == 1) {

            this.value = options.value;
            this.language = options.language;
            this.type = options.type

        } else {

            throw new Error("Trying to set up the type of Siesta.Framework.Literal with a more than one argument");

        }
        this.__type = 'literal';
    },

    /**
             * Human readable representation of this URI
             */
    toString: function() {
        var str = '"'+this.value+'"';
        if(this.type != null) {
            str = str+"^^"+this.type.toString();
        }
        if(this.language != null) {
            str = str+"@"+this.language;
        }

        return str;
    }
});
/**
 *  Triple object definition to
 *  be shared between drivers
 *
 *  A Siesta triple is basically a container for
 *  the subject, predicate and object of the
 *  triple.
 */
Siesta.Framework.Triple = function() {
        if(arguments.length == 3) {
            this.initialize(arguments[0],arguments[1],arguments[2]);
        } else if(arguments.length == 2) {
            this.initialize(arguments[0],arguments[1]);
        } else if(arguments.length == 1) {
            this.initialize(arguments[0]);
        } else {
            this.initialize();
        }
};
Siesta.Framework.classBuilder(Siesta.Framework.Triple, {
    /**
         * Builds a new Triple.
         * Every argument is optional.
         *
         * @arguments:
         * - subject: the subject of the triple.
         * - predicate: the predicate of the triple.
         * - object: the object of the triple.
         */
    initialize: function() {
        if(arguments.length == 3) {
            this.subject = arguments[0];
            this.predicate = arguments[1];
            this.object = arguments[2];
        } else if(arguments.length == 2) {
            this.subject = arguments[0];
            this.predicate = arguments[1];
            this.object = null;
        } else if(arguments.length == 1) {
            this.subject = arguments[0];
            this.predicate = null;
            this.object = null;
        } else {
            this.subject = null;
            this.predicate = null;
            this.object = null;
        }
        this.__type = 'triple';
    },

    /**
             * Test if subject, predicate and object
             * are set for this triple.
             *
             * @returns Bool
             */
    isValid: function() {
        return (this.subject != null &&
                this.predicate != null &&
                this.object != null)
    },

    /**
             *  Human readable representation of this triple.
             */
    toString: function() {
        return "("+this.subject+","+this.predicate+","+this.object+")";
    }
});
/**
 *  Graph object definition to
 *  be shared between drivers
 *
 *  A Siesta graph is basically a container of triples,
 *  each driver must manipulate this graph and
 *  transform it to their native representation.
 */
Siesta.Framework.Graph = function() { this.initialize() };
Siesta.Framework.classBuilder(Siesta.Framework.Graph, {
    initialize: function() {

        this.namespaces = {};

        this.invNamespaces = {};

        this.triples = {};

        this.triplesCache = [];

        this.baseUri = null;

        this.blankNodeCounter = 0;

        this.respectBlankNodeCounter = false;

        this.__blankNodeMap = {};
    },

    /**
             *  Resets the mapping of blank nodes
             */
    resetBlankNodeMapping: function() {
        this.__blankNodeMap = {};
    },

    /**
             *  Adds a new namespace to this graph.
             *
             *  @arguments
             *  - aNamespace: the namespace to be added
             */
    addNamespace: function(aNamespace /* Siesta.Framework.Namespace */) {
        this.namespaces[aNamespace.name] = aNamespace.uri;
        this.invNamespaces[aNamespace.uri] = aNamespace.name;
    },

    /**
             *  Computes the union between graphs respecting blank node
             *  identifiers in both graphs.
             *
             *  @arguments
             *  - aGraph: the graph to compute the union with.
             */
    mergeGraph: function(aGraph /* Siesta.Framework.Graph */) {
        for(ns in aGraph.namespaces) {
            this.addNamespace(ns);
        }

        var triplesToMerge = aGraph.triplesArray();
        for(var _i=0; _i<triplesToMerge.length; _i++) {
            this.mergeTriple(triplesToMerge[_i]);
        }
    },

    /**
             *  Computes the union between graphs without respecting blank node
             *  identifiers in the graph to add.
             *
             *  @arguments
             *  - aGraph: the graph to compute the union with.
             */
    addGraph: function(aGraph /* Siesta.Framework.Graph */) {
        this.__blankNodeMap = {};
        for(ns in aGraph.namespaces) {
            this.addNamespace(ns);
        }

        var triplesToAdd = aGraph.triplesArray();
        for(var _i=0; _i<triplesToAdd.length; _i++) {
            this.addTriple(triplesToAdd[_i]);
        }
    },

    /**
             *  Computes the difference between graphs.
             *
             *  @arguments
             *  - aGraph: the graph to compute the difference with.
             */
    removeGraph: function(aGraph /* Siesta.Framework.Graph */) {
        var triplesToRemove = aGraph.triplesArray();
        for(var _i=0; _i<triplesToRemove.length; _i++) {
            this.removeTriple(triplesToRemove[_i]);
        }
    },

    /**
             *  Adds one triple to the index.
             *  If one blank node identifier is found, it will be overwritten with a new one.
             *
             *  @arguments
             *  - aTriple: the triple to be added.
             */
    addTriple: function(aTriple /* Siesta.Framework.Triple */) {
        this.respectBlankNodeCounter = false;
        if(aTriple.__type != 'triple') {
            throw "Trying to add something different of a Siesta.Framework.Triple to a Siesta.Framework.Graph";
        } else {

            var wasInserted = this.__addTripleByObject(aTriple,
                this.__addTripleByPredicate(aTriple,
                this.__addTripleBySubject(aTriple)));
            if(wasInserted == true) {
                this.triplesCache.push(aTriple);
            }
        }
    },

    /**
             *  Merges one triple into the index.
             *  If one blank node identifier is found, it will be respected.
             *
             *  @arguments
             *  - aTriple: the triple to be added.
             */
    mergeTriple: function(aTriple /* Siesta.Framework.Triple */) {
        this.respectBlankNodeCounter = true;
        if(aTriple.__type != 'triple') {
            throw "Trying to add something different of a Siesta.Framework.Triple to a Siesta.Framework.Graph";
        } else {

            var wasInserted = this.__addTripleByObject(aTriple,
                this.__addTripleByPredicate(aTriple,
                this.__addTripleBySubject(aTriple)));
            if(wasInserted == true) {
                this.triplesCache.push(aTriple);
            }
        }
    },

    /**
             *  Remove one triple from the index.
             *
             *  @arguments
             *  - aTriple: the triple to be removed.
             */
    removeTriple: function(aTriple /* Siesta.Framework.Triple */) {
        this.respectBlankNodeCounter = false;
        if(aTriple.__type != 'triple') {
            throw "Trying to add something different of a Siesta.Framework.Triple to a Siesta.Framework.Graph";
        } else {

            var wasRemoved = this.__removeTripleByObject(aTriple,
                this.__removeTripleByPredicate(aTriple,
                this.__removeTripleBySubject(aTriple)));
            if(wasRemoved == true) {
                var newTriplesCache = [];
                for(var _i=0; _i<this.triplesCache.length; _i++) {
                    var _theTriple = this.triplesCache[_i];
                    if(_theTriple.subject.value != aTriple.subject.value ||
                       _theTriple.predicate.value != aTriple.predicate.value ||
                       _theTriple.object.value != aTriple.object.value) {
                        newTriplesCache.push(_theTriple);
                    }
                }
                this.triplesCache = newTriplesCache;
            }
        }
    },

    /**
             *  Returns all the triples stored in the graph as an array.
             */
    triplesArray: function() {
        return this.triplesCache;
    },

    /*
             *  Private methods
             */

    /**
             *  Looks in the subject index of the triple hash.
             *
             *  @arguments:
             *  - aTriple: the triple to insert.
             *
             *  @returns:
             *  - a hash for the triples with the same predicate than the triple to store.
             */
    __addTripleBySubject: function(aTriple /* Siesta.Framework.Triple */) {
        var identifier = null;
        switch(aTriple.subject.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.subject);
            break;
        case 'blanknode':
            if(this.respectBlankNodeCounter) {
                identifier = aTriple.subject.value;
            } else {
                var identifierInGraph = this.__blankNodeMap[aTriple.subject.value]
                if(identifierInGraph == undefined) {
                    identifier = ''+this.blankNodeCounter++;
                    aTriple.subject.value = identifier;
                    this.__blankNodeMap[aTriple.subject.value] = identifier;
                } else {
                    identifier = identifierInGraph;
                }
            }
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.subject);
            break;
        }

        if(this.triples[identifier] == null) {
            this.triples[identifier] = {};
        }
        return this.triples[identifier];

    },

    /**
             *  Looks in the predicate index of the triple hash.
             *
             *  @arguments:
             *  - aTriple: the triple to insert.
             *  - predicates: a hash with the predicates for the triples with the same subject
             *
             *  @returns:
             *  - a hash for the triples with the same predicate than the triple to store.
             */
    __addTripleByPredicate: function(aTriple /* Siesta.Framework.Triple */,predicates) {
        var identifier = null;

        switch(aTriple.predicate.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.predicate);
            break;
        case 'blanknode':
            if(this.respectBlankNodeCounter) {
                identifier = aTriple.subject.value;
            } else {
                var identifierInGraph = this.__blankNodeMap[aTriple.predicate.value]
                if(identifierInGraph == undefined) {
                    identifier = ''+this.blankNodeCounter++;
                    aTriple.predicate.value = identifier;
                    this.__blankNodeMap[aTriple.predicate.value] = identifier;
                } else {
                    identifier = identifierInGraph;
                }
            }
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.predicate);
            break;
        }

        if(predicates[identifier] == null) {
            predicates[identifier] = {};
        }
        return predicates[identifier];

    },

    /**
             *  Looks in the object index of the triple hash.
             *
             *  @argument aTriple: the triple to insert.
             *  @argument objects: a hash with the objects for the triples with the same subject
             *
             *  @returns true if the triple is inserted, false if it was already inserted
             */
    __addTripleByObject: function(aTriple /* Siesta.Framework.Triple */,objects) {
        var identifier = null;

        switch(aTriple.object.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.object);
            break;
        case 'blanknode':
            if(this.respectBlankNodeCounter) {
                identifier = aTriple.subject.value;
            } else {
                var identifierInGraph = this.__blankNodeMap[aTriple.object.value]
                if(identifierInGraph == undefined) {
                    identifier = ''+this.blankNodeCounter++;
                    aTriple.object.value = identifier;
                    this.__blankNodeMap[aTriple.object.value] = identifier;
                } else {
                    identifier = identifierInGraph;
                }
            }
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.object);
            break;
        }

        if(objects[identifier] == null) {
            objects[identifier] = aTriple;
            return true;
        } else {
            return false;
        }

    },

    /**
             *  Looks in the subject index of the triple hash.
             *
             *  @arguments:
             *  - aTriple: the triple to insert.
             *
             *  @returns:
             *  - a hash for the triples with the same predicate than the triple to store.
             */
    __removeTripleBySubject: function(aTriple /* Siesta.Framework.Triple */) {
        var identifier = null;

        switch(aTriple.subject.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.subject);
            break;
        case 'blanknode':
            identifier = aTriple.subject.value;
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.subject);
            break;
        }

        if(this.triples[identifier] == null) {
            return [identifier, {}];
        } else {
            return [identifier, this.triples[identifier]]
        }

    },

    /**
             *  Looks in the predicate index of the triple hash.
             *
             *  @arguments:
             *  - aTriple: the triple to insert.
             *  - an array of
             *     - the identifier of the subject
             *     - predicates: a hash with the predicates for the triples with the same subject
             *
             *  @returns:
             *  - a hash for the triples with the same predicate than the triple to store.
             */
    __removeTripleByPredicate: function(aTriple /* Siesta.Framework.Triple */,tmp) {
        var identifier = null;

        switch(aTriple.predicate.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.predicate);
            break;
        case 'blanknode':
            identifier = aTriple.subject.value;
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.predicate);
            break;
        }

        var subjectIdentifier = tmp[0];
        var predicates = tmp[1];
        if(predicates[identifier] == null) {
            return [subjectIdentifier, identifier, {}];
        }
        return [subjectIdentifier, identifier, predicates[identifier]];

    },

    /**
             *  Looks in the object index of the triple hash.
             *
             *  @argument aTriple: the triple to insert.
             *  @argument tmp: an array wit subject identifier, preidcate identifier and a hash with the objects for the triples with the same subject
             *
             *  @returns true if the triple is inserted, false if it was already inserted
             */
    __removeTripleByObject: function(aTriple /* Siesta.Framework.Triple */,tmp) {
        var identifier = null;

        switch(aTriple.object.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.object);
            break;
        case 'blanknode':
            if(this.respectBlankNodeCounter) {
                identifier = aTriple.subject.value;
            } else {
                var identifierInGraph = this.__blankNodeMap[aTriple.object.value]
                if(identifierInGraph == undefined) {
                    identifier = ''+this.blankNodeCounter++;
                    aTriple.object.value = identifier;
                    this.__blankNodeMap[aTriple.object.value] = identifier;
                } else {
                    identifier = identifierInGraph;
                }
            }
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.object);
            break;
        }

        var subjectId = tmp[0];
        var predicateId = tmp[1];
        var objects = tmp[2];

        if(objects[identifier] != null) {
            var theTriple = objects[identifier];
            var newObjects = {};
            var newObjsCounter = 0;
            for(var _id in objects) {
                if(_id != identifier) {
                    newObjsCounter++;
                    newObjects[_id] = objects[_id];
                }
            }
            if(newObjsCounter != 0) {
                this.triples[subjectId][predicateId] = newObjects;
            } else {
                var newPreds = {};
                var newPredsCounter = 0;
                for(var _id in this.triples[subjectId]) {

                    if(_id != predicateId) {
                        newPredsCounter++;
                        newPreds[_id] = this.triples[subjectId][_id];
                    }
                }
                if(newPredsCounter != 0) {
                    this.triples[subjectId] = newPreds;
                } else {
                    var newSubjs = {};
                    for(var _id in this.triples) {
                        if(_id != subjectId)
                        {
                            newSubjs[_id] = this.triples[_id];
                        }
                    }
                    this.triples = newSubjs;
                }
            }
            return true;
        } else {
            return false;
        }

    },

    /**
             *  Generates a String key for this URI expanding the possible namespace
             *  of the URI if it is registered in the namespaces of the graph
             *
             *  @arguments aUri: a Siesta.Framework.Uri to be normalized.
             *
             *  @returns a String normalized for this URI.
             */
    __normalizeUri: function(aUri /* Siesta.Framework.Uri */) {
        if(aUri.namespace == null) {
            return aUri.value;
        } else {
            if(this.namespaces[aUri.namespace] != null) {
                return this.namespaces[aUri.namespace] + aUri.value;
            } else {
                return aUri.namespace + aUri.value;
            }
        }
    },

    /**
             *  Generates a String key for this literal expanding the possible type
             *  URI if its namespace is registered in the namespaces of the graph
             *
             *  @argument aLiteral: a Siesta.Framework.Literal to be normalized.
             *
             *  @returns a String normalized for this literal.
             */
    __normalizeLiteral: function(aLiteral /* Siesta.Framework.Literal */) {
        var str = '"'+aLiteral.value+'"';
        if(aLiteral.type != null) {
            str = str+"^^"+this.__normalizeUri(aLiteral.type);
        }
        if(aLiteral.language != null) {
            str = str+"@"+aLiteral.language;
        }

        return str;
    }


});
/*                                              Utils                                                         */

Siesta.registerNamespace("Siesta","Utils");

Siesta.Utils.htmlParser = function(doc) {


    try //Internet Explorer
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async="false";
        xmlDoc.loadXML(doc);
        return xmlDoc;
    }
    catch(e)
    {
        parser=new DOMParser();
        xmlDoc=parser.parseFromString(doc,"text/xml");
        return xmlDoc;
    }
}

Siesta.Utils.Sequentializer = function() { this.initialize() };
/**
   @class Siesta.Utils.Network.SequentialRemoteRequester

   Helper class for easing the creation of sequential asynchronous calls.
*/
Siesta.Framework.classBuilder(Siesta.Utils.Sequentializer, {
    /**
         * @constructor
         *
         * Builds a new requester.
         */
    initialize: function() {
        this._requestsQueue = [];
        this._finishedCallback = null;
    },

    /**
             * Adds a remote request to the queue of requests.
             *
             * @argument remoteRequest, function containing the invocation
             */
    addRemoteRequest: function(remoteRequest) {
        this._requestsQueue.push(remoteRequest);
    },

    /**
             * Adds a remote request to the queue of requests and passes the argument to it.
             * The callback function must accept one parameter.
             *
             * @argument remoteRequest, function containing the invocation.
             * @argument env, the environment to pass to the function.
             */
    addRemoteRequestWithEnv: function(remoteRequest,env) {
        this._requestsQueue.push(function(){ remoteRequest(env) });
    },

    /**
             * Sets the function that will be optionally invoked
             * when all the requests have been processed.
             *
             * @argument callback, the function to be invoked.
             */
    finishedCallback: function(callback) {
        this._finishedCallback = callback;
    },

    /**
             * This funcition must be invoked in the callbacks of the remote requests
             * callbacks to notify the request has finished.
             */
    notifyRequestFinished: function() {
        this._nextRequest();
    },

    /**
             * Starts the processing of the requests.
             */
    start: function() {
        this._nextRequest();
    },

    _nextRequest: function() {
        if(this._requestsQueue.length == 0) {
            this._finishedCallback();
        } else {
            (this._requestsQueue.pop())();
        }
    }
});
/*                                              Model Layer                                                   */

/**
   Capitalize function
*/
String.prototype.capitalize = function(){ //v1.0
    return this.replace(/\w+/g, function(a){
        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
    });
};

Siesta.registerNamespace("Siesta","Model");

Siesta.registerNamespace("Siesta","Model","Namespaces");
Siesta.Model.Namespaces.map = {};
Siesta.Model.Namespaces.register = function(prefix,value){
    Siesta.Model.Namespaces.map[prefix] = value;
};
Siesta.Model.Namespaces.unregister = function(prefix){
    delete Siesta.Model.Namespaces.map[prefix];
};
Siesta.Model.Namespaces.resolve = function(mapping){
    if(typeof mapping == 'object') {
        for(var _prefix in mapping) {
            if(Siesta.Model.Namespaces.map[_prefix] != undefined) {
                return Siesta.Model.Namespaces.map[_prefix] + mapping[_prefix];
            }
        }
        throw "Unable to find registered namespace for " + mapping;
    } else {
        throw "Cannot resolve namespace for a "+(typeof mapping)+" an object {prefix: sufix} must be provided";
    }
};

Siesta.registerNamespace("Siesta","Model","Repositories");
Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();
Siesta.Model.Repositories.data = new Siesta.Framework.Graph();


Siesta.registerNamespace("Siesta","Services");


/**
   Callback function for registering of services if AJAX used

   @argumet serviceDescription: the text with the description of the service in any format.
*/
Siesta.Services.onRegisteredServiceAjax = function(serviceDescription) {

};

Siesta.Services.chooseFormaterFor = function(document) {
    var format = Siesta.Framework.Common.determineFormat(document);
    var formater = null;

    if(format == "xml") {
        formater = Siesta.Formats.Xml;
    } else if(format == "turtle") {
        formater = Siesta.Formats.Turtle;
    } else if(format == 'rdfa') {
        formater = Siesta.Formats.Rdfa;
    }

    return formater;
};

Siesta.Services.TRIPLET_CHANGE_EVENT = "TRIPLET_CHANGE_EVENT";

/**
   Parses a new doc and add the parsed triplets to the provided repository.

   @argument doc, to be parsed in a valid format: N3, XML, JSON...
   @argument repository, the repository where the triplets will be added.

   @returns throw a Siesta.Services.TRIPLET_CHANGE_EVENT with an object message including the repository \
   where the triplets have been added an the graph from the document.
*/
Siesta.Services.parseAndAddToRepository = function(doc,repository,callback) {
    var  formater = Siesta.Services.chooseFormaterFor(doc);

    if(formater.isParserAsynchronous() == false) {
        var parsedGraph = formater.parseDoc("",doc);
        for(_i=0; _i< parsedGraph.triplesArray().length; _i++) {
            repository.addTriple(parsedGraph.triplesArray()[_i]);
        }

        var resp = {
            repository: repository,
            parsedGraph: parsedGraph
        };

        Siesta.Events.publish(Siesta.Services.TRIPLET_CHANGE_EVENT,resp);
        if(callback != undefined) {
            callback(resp);
        }
    } else {
        formater.parseDoc("",doc, function(resBaseUri, resDoc, parsedGraph) {
            for(_i=0; _i< parsedGraph.triplesArray().length; _i++) {
                repository.addTriple(parsedGraph.triplesArray()[_i]);
            }

            var resp = {
                repository: repository,
                parsedGraph: parsedGraph
            };

            Siesta.Events.publish(Siesta.Services.TRIPLET_CHANGE_EVENT,resp);
            if(callback != undefined) {
                callback(resp);
            }
        });
    }
};

/**
   Callback function for registering of services if JSONP used

   @argumet serviceDescription: the text with the description of the service in any format.
*/
Siesta.Services.onRegisteredServiceJsonp = function(serviceDescription) {
    try {
        var formater = Siesta.Services.chooseFormaterFor(serviceDescription);

        var parsedGraph = formater.parseDoc("",serviceDescription);
        for(_i=0; _i< parsedGraph.triplesArray().length; _i++) {
            Siesta.Model.Repositories.services.addTriple(parsedGraph.triplesArray()[_i]);
        }

        for(_f=0; _f<Siesta.Services.serviceRegistrationCallbacks.length; _f++) {
            Siesta.Services.serviceRegistrationCallbacks[_f].call(Siesta.Constants.SUCCESS,parsedGraph);
        }
    } catch(e) {
        for(_f=0; _f<Siesta.Services.serviceRegistrationCallbacks.length; _f++) {
            Siesta.Services.serviceRegistrationCallbacks[_f].call(Siesta.Constants.FAILURE,e);
        }
    }
};

/**
   Starts the registrations of a service.
   The user must provide the URL of the service and the network transport mechanism to retrieve
   the service: "ajax" or "jsonp" are valid transport mechanisms.
   If "jsonp" is chosen as the transport mechanism, and additional parameter is accepted with
   the value for the callback function parameter, if none is provided 'callback' will be used.


   @argument serviceUrl: URL of the service
   @argument networkTransport: transport mechanism, 'ajax' or 'jsonp' are valid
   @argument callback (optional): an optional third parameter with the name used for the callback parameter if jsonp is used as mechanim.
*/
Siesta.Services.registerService = function(serviceUrl, networkTransport /*, callback (optional)*/) {
    if(networkTransport == "jsonp") {
        var callbackParam = arguments[2] || "callback";
        Siesta.Network.jsonpRequest(serviceUrl,callbackParam, "Siesta.Services.onRegisteredServiceJsonp");
    } else if(networkTransport == "ajax"){
        throw new Error("not implemented yet");
    } else {
        throw new Error("uknown transport: "+networkTransport);
    }
};

Siesta.Services.serviceRegistrationCallbacks = [];
/**
   Registers a function that will be notified with success or failure after
   a service registration trial.

   @argument callback: the function to be notified, it must receive two arguments, a status and a value.
*/
Siesta.Services.addServiceRegistrationCallback = function(callback) {
    Siesta.Services.serviceRegistrationCallbacks.push(callback);
}

Siesta.registerNamespace("Siesta","Framework","Common");
/**
   Try to determine the format of the test passed as a parameter.

   @argument documentText: the text to be checked.

   @returns "turtle" or "xml"

   @throws Error if no format can be determined.
*/
Siesta.Framework.Common.determineFormat = function(documentText) {
    if(documentText.indexOf("<rdf:RDF") != -1 ||
       documentText.indexOf("<?xml") != -1 ) {
        return "xml";
    } else if(documentText.indexOf("<html") != -1 ||
              documentText.indexOf("<body") != -1 ||
              documentText.indexOf("<head") != -1 ||
              documentText.indexOf("<div") != -1 ||
              documentText.indexOf("<span") != -1 ||
              documentText.indexOf("<a") != -1 ){
        return "rdfa";
    } else if(documentText.indexOf("@prefix") != -1 ||
              documentText.indexOf(".") != -1) {
        return "turtle";
    } else  {
        throw new Error("Unknown format");
    }
};

Siesta.Services.RestfulOperationInputParameter = function(parameterUri) { this.initialize(parameterUri) };
/**
   @class Siesta.Services.RestfulOperationInputParameter

   An input parameter for a hRESTS operation of a hRESTS service.
*/
Siesta.Framework.classBuilder(Siesta.Services.RestfulOperationInputParameter, {
    /**
         * @constructor
         *
         * Initiates a new RestfulOperationInputParameter object with the
         * the data associated to the URI passed as an
         * argument in the constructor.
         *
         * Triplets are looked up in the Siesta.Model.Repositories.services repository,
         * they must have been retrieved first via a callo to Siesta.Services.registerService.
         *
         * @see Siesta.Services.registerService
         *
         * @argument parameterUri: input message URI (blank node identifier), a Siesta.Framework.Uri object, a Siesta.Framework.BlankNode or a String
         */
    initialize: function(parameterUri) {
        this.uri = parameterUri;
        this.uriInQuery = this.uri;
        if(parameterUri.__type == 'uri') {
            this.uri = uri.toString();
            this.uriInQuery = "<"+this.uri+">";
        } else if(parameterUri.__type == 'blanknode') {
            this.uri = uri.toString();
            this.uriInQuery = this.uri;
        }

        this._type = null;
        this._parameterName = null;
    },

    type: function() {
        if(this._type != null) {
            return this._type;
        } else {
            var query = "SELECT ?type WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "?type } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the type for the input parameter "+this.uri);
            } else {
                this._type = result[0].type.value
            }
            return this._type;
        }
    },

    parameterName: function() {
        if(this._parameterName != null) {
            return this._parameterName;
        } else {
            var query = "SELECT ?name WHERE {  " + this.uriInQuery + " <http://www.wsmo.org/ns/hrests#parameterName> " + "?name } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the parameterName for the input parameter "+this.uri);
            } else {
                this._parameterName = result[0].name.value
            }
            return this._parameterName;
        }
    }
});
Siesta.Services.RestfulOperationInputMessage = function(messageUri) { this.initialize(messageUri) };
/**
   @class Siesta.Services.RestfulOperationInputMessage

   An input message for a hRESTS operation of a hRESTS service.
*/
Siesta.Framework.classBuilder(Siesta.Services.RestfulOperationInputMessage, {
    /**
         * @constructor
         *
         * Initiates a new RestfulOperationInputMessage object with the
         * the data associated to the URI passed as an
         * argument in the constructor.
         *
         * Triplets are looked up in the Siesta.Model.Repositories.services repository,
         * they must have been retrieved first via a callo to Siesta.Services.registerService.
         *
         * @see Siesta.Services.registerService
         *
         * @argument messageUri: input message URI (blank node identifier), a Siesta.Framework.Uri object, a Siesta.Framework.BlankNode or a String
         */
    initialize: function(messageUri) {
        this.uri = messageUri;
        this.uriInQuery = this.uri;
        if(messageUri.__type == 'uri') {
            this.uri = uri.toString();
            this.uriInQuery = "<"+this.uri+">";
        } else if(messageUri.__type == 'blanknode') {
            this.uri = uri.toString();
            this.uriInQuery = this.uri;
        }

        this._modelReference = null;
        this._loweringSchemaMapping = null;
        this.loweringSchemaMappingContent = null;
        this.connected = false;
        this._model = null;
        this_transportMechanism = null;
    },

    modelReference: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {

            var query = "SELECT ?model WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#modelReference> ?model }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the modelReference for the input message "+this.uri);
            } else {
                /*
                      var found = false;
                      for(_i=0; _i<result.length; _i++) {
                      if(result[_i].id.toString() == this.uriInQuery) {
                      found = true;
                      this._modelReference = result[0].model.value;
                      break;
                      }
                      }
                      if(!found) {
                      throw new Error("Error retrieving the modelReference for the input message "+this.uri);
                      }
                    */
                this._modelReference = result[0].model.value
            }
            return this._modelReference;
        }
    },

    loweringSchemaMapping: function() {
        if(this._loweringSchemaMapping != null) {
            return this._loweringSchemaMapping;
        } else {
            var query = "SELECT ?schema WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#loweringSchemaMapping> ?schema }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the loweringSchemaMapping for the input message "+this.uri);
            } else {
                this._loweringSchemaMapping = result[0].schema.value
            }
            return this._loweringSchemaMapping;
        }
    },

    model: function() {
        if(this._model != null) {
            return this._model;
        } else {
            if(this.modelReference() != null) {
                this._model = new Siesta.Model.Schema(this.modelReference());
            }
        }
    },

    /**
               Retrieves all the remote references of this message.

               @returns The method sends the event: EVENT_MESSAGE_LOADED
            */
    connect: function(mechanism) {
        this._transportMechanism = mechanism;
        if(this.connected == false) {
            if(this.model() == null) {
                try {
                    if(mechanism == "jsonp") {
                        var callback = "callback";
                        if(arguments.length == 2) {
                            callback = arguments[1];
                        }
                        var that = this;
                        Siesta.Network.jsonpRequestForFunction(this.modelReference(),callback,function(resp){
                            Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.schemas);
                            that.model();

                            that._retrieveLoweringSchemaMapping(that._transportMechanism);
                        });
                    } else {

                    }
                } catch(e) { _retrieveLoweringSchemaMapping(mechanism); }
            } else {
                _retrieveLoweringSchemaMapping(mechanism);
            }
        }
    },


    EVENT_MESSAGE_LOADED: "EVENT_MESSAGE_LOADED",


    _retrieveLoweringSchemaMapping: function(mechanism) {
        if(this.connected == false) {
            this.connected = true;
            if(this.loweringSchemaMappingContent == null) {
                try {
                    if(mechanism == "jsonp") {
                        var callback = "callback";
                        if(arguments.length == 2) {
                            callback = arguments[1];
                        }
                        var that = this;
                        Siesta.Network.jsonpRequestForFunction(this.loweringSchemaMapping(),callback,function(res){
                            that.loweringSchemaMappingContent = res;
                            Siesta.Events.publish(that.EVENT_MESSAGE_LOADED,that);
                        });
                    } else {

                    }
                } catch(e) {  Siesta.Events.publish(this.EVENT_MESSAGE_LOADED,this); }
            }
        } else {
            Siesta.Events.publish(this.EVENT_MESSAGE_LOADED,this);
        }
    }
});
Siesta.Services.RestfulOperationOutputMessage = function(messageUri) { this.initialize(messageUri) };
/**
   @class Siesta.Services.RestfulOperationOutputMessage

   An input message for a hRESTS operation of a hRESTS service.
*/
Siesta.Framework.classBuilder(Siesta.Services.RestfulOperationOutputMessage, {
    /**
         * @constructor
         *
         * Initiates a new RestfulOperationOutputMessage object with the
         * the data associated to the URI passed as an
         * argument in the constructor.
         *
         * Triplets are looked up in the Siesta.Model.Repositories.services repository,
         * they must have been retrieved first via a callo to Siesta.Services.registerService.
         *
         * @see Siesta.Services.registerService
         *
         * @argument messageUri: input message URI (blank node identifier), a Siesta.Framework.Uri object, a Siesta.Framework.BlankNode or a String
         */
    initialize: function(messageUri) {
        this.uri = messageUri;
        this.uriInQuery = this.uri;
        if(messageUri.__type == 'uri') {
            this.uri = uri.toString();
            this.uriInQuery = "<"+this.uri+">";
        } else if(messageUri.__type == 'blanknode') {
            this.uri = uri.toString();
            this.uriInQuery = this.uri;
        }

        this._modelReference = null;
        this._liftingSchemaMapping = null;
        this.liftingSchemaMappingContent = null;
        this.connected = false;
    },

    modelReference: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {

            var query = "SELECT ?model WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#modelReference> ?model }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the modelReference for the input message "+this.uri);
            } else {
                /*
                      var found = false;
                      for(_i=0; _i<result.length; _i++) {
                      if(result[_i].id.toString() == this.uriInQuery) {
                      found = true;
                      this._modelReference = result[0].model.value;
                      break;
                      }
                      }
                      if(!found) {
                      throw new Error("Error retrieving the modelReference for the input message "+this.uri);
                      }
                    */
                this._modelReference = result[0].model.value
            }
            return this._modelReference;
        }
    },

    /**
               Retrieves the liftinSchemaMapping for this message.

               @returns the URL of the schema mapping
            */
    liftingSchemaMapping: function() {
        if(this._liftingSchemaMapping != null) {
            if(this._liftingSchemaMapping == 0) {
                return null;
            } else {
                return this._liftingSchemaMapping;
            }
        } else {
            var query = "SELECT ?schema WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#liftingSchemaMapping> ?schema }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                this._liftingSchemaMapping = 0; // this is to avoid continously quering the repository in case of no liftingSchema
            } else {
                this._liftingSchemaMapping = result[0].schema.value
            }
            return this._liftingSchemaMapping;
        }
    },


    EVENT_CONNECTED: "EVENT_OUTPUT_MESSAGE_CONNECTED",


    connect: function(mechanism) {
        if(this.connected == false) {
            this.connected = true;
            if(this.liftingSchemaMappingContent == null) {
                try {
                    if(mechanism == "jsonp") {
                        var callback = "callback";
                        if(arguments.length == 2) {
                            callback = arguments[1];
                        }
                        var that = this;
                        Siesta.Network.jsonpRequestForFunction(this.liftingSchemaMapping(),callback,function(res){
                            that.liftingSchemaMappingContent = res;
                            Siesta.Events.publish(that.EVENT_CONNECTED,that);
                        });
                    } else {
                    }
                } catch(e) {  Siesta.Events.publish(this.EVENT_CONNECTED,this); }
            }
        } else {
            Siesta.Events.publish(this.EVENT_CONNECTED,this);
        }
    }
});
Siesta.Services.RestfulOperation = function(operationUri) { this.initialize(operationUri) };

Siesta.Services.RestfulOperation.GET = 'GET',
Siesta.Services.RestfulOperation.POST = 'POST',
Siesta.Services.RestfulOperation.PUT = 'PUT',
Siesta.Services.RestfulOperation.DELETE = 'DELETE',

/**
   @class Siesta.Services.RestfulOperation

   A hRESTS operation of a hRESTS service.
*/
Siesta.Framework.classBuilder(Siesta.Services.RestfulOperation, {
    /**
             * @constructor
             *
             * Initiates a new RestfulOperation object with the
             * the data associated to the URI passed as an
             * argument in the constructor.
             *
             * Triplets are looked up in the Siesta.Model.Repositories.services repository,
             * they must have been retrieved first via a callo to Siesta.Services.registerService.
             *
             * @see Siesta.Services.registerService
             *
             * @argument operationUri: operation location URI, a Siesta.Framework.Uri object or a String
             */
    initialize: function(operationUri) {
        this.uri = operationUri;
        if(operationUri.__type == 'uri') {
            this.uri = uri.toString();
        }

        this._label = null;
        this._method = null;
        this._address = null;
        this._inputMessages = null;
        this._inputParameters = null;
        this._outputMessage = null;
        this.connected = false;
        this._addressAttributes = null;
    },

    label: function() {
        if(this._label != null) {
            return this._label;
        } else {
            var query = "SELECT ?text WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Operation> . ";
            query = query + "<"+this.uri+"> <http://www.w3.org/2000/01/rdf-schema#label> ?text }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                this._label = "";
            } else {
                this._label = result[0].text.value;
            }
            return this._label;
        }
    },

    method: function() {
        if(this._method != null) {
            return this._method.toUpperCase();
        } else {
            var query = "SELECT ?method WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/hrests#hasMethod> " + "?method } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the method associated to the operation "+this.uri);
            } else {
                this._method = result[0].method.value;
                return this._method.toUpperCase();
            }
        }
    },

    address: function() {
        if(this._address != null) {
            return this._address;
        } else {
            var query = "SELECT ?address WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/hrests#hasAddress> " + "?address } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the address associated to the operation "+this.uri);
            } else {
                this._address = result[0].address.value;
                return this._address;
            }
        }
    },

    _parsingAddressPatterRegExOut: /\{[\w%]+\}/g,

    _parsingAddressPatternRegExIn: /[^\{\}]+/,

    /**
               Parses the address of the operation retrieving the list of prameters
               from the address.

               @returns the list of parsed parameters
            */
    addressAttributes: function() {
        var theAddress = this.address();
        if(this._addressAttributes == null) {
            this._addressAttributes = [];

            var finished = false;
            while(!finished) {
                var attribute = this._parsingAddressPatterRegExOut.exec(theAddress);
                if(attribute != null) {
                    this._addressAttributes.push(this._parsingAddressPatternRegExIn.exec(attribute)[0]);
                } else {
                    finished = true;
                }
            }
        }
        return this._addressAttributes;
    },

    /**
               Returns an array of RestfulOperationInputMessages object with all the
               input messages associated to this operation.

               @returns An array of RestulOperationInputMessages objects
            */
    inputMessages: function() {
        if(this._inputMessages != null) {
            return this._inputMessages;
        } else {
            var query = "SELECT ?message WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/wsmo-lite#hasInputMessage> " + "?message } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            this._inputMessages = [];

            for(_i=0; _i<result.length; _i++) {
                var msg = new Siesta.Services.RestfulOperationInputMessage(result[_i].message.toString());
                this._inputMessages.push(msg);
            }

            return this._inputMessages;
        }
    },


    /**
               Returns the RestfulOperationOutputMessage object associated
               to this operation.

               @returns A RestulOperationOutputMessage objects or null if no output message is associated.
            */
    outputMessage: function() {
        if(this._outputMessage != null) {
            return this._outputMessage;
        } else {
            var query = "SELECT ?message WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/wsmo-lite#hasOutputMessage> " + "?message } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            for(_i=0; _i<result.length; _i++) {
                var msg = new Siesta.Services.RestfulOperationOutputMessage(result[_i].message.toString());
                this._outputMessage = msg;
            }

            return this._outputMessage;
        }
    },


    /**
               Returns an array of RestfulOperationInputParameter object with all the
               input messages associated to this operation.

               @returns An array of RestulOperationInputMessages objects
            */
    inputParameters: function() {
        if(this._inputParameters != null) {
            return this._inputParameters;
        } else {
            var query = "SELECT ?parameter WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/hrests#hasInputParameter> " + "?parameter } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            this._inputParameters = [];

            for(_i=0; _i<result.length; _i++) {
                var msg = new Siesta.Services.RestfulOperationInputParameter(result[_i].parameter.toString());
                this._inputParameters.push(msg);
            }

            return this._inputParameters;
        }
    },

    connect: function(mechanism) {
        var that = this;
        if(that.connected == false) {
            var sequentializer = new Siesta.Utils.Sequentializer();

            this.method();
            this.address();
            this.label();

            for(var _i=0; _i<that.inputMessages().length; _i++) {
                sequentializer.addRemoteRequestWithEnv(function(message){
                    var subscription = Siesta.Events.subscribe(message.EVENT_MESSAGE_LOADED,function(event,msg,myData) {
                        if(myData == message) {
                            Siesta.Events.unsubscribe(subscription);
                            sequentializer.notifyRequestFinished();
                        }
                    }, that,message);
                    message.connect(mechanism);
                },that.inputMessages()[_i]);
            }

            var outputMessage = this.outputMessage();
            if(outputMessage != null) {
                sequentializer.addRemoteRequest(function(){
                    var subscription = Siesta.Events.subscribe(outputMessage.EVENT_CONNECTED,function(event,msg,myData) {
                        if(outputMessage == myData) {
                            Siesta.Events.unsubscribe(subscription);
                            sequentializer.notifyRequestFinished();
                        }
                    },that,outputMessage);
                    outputMessage.connect(mechanism);
                });
            }

            sequentializer.finishedCallback(function() {

                that.connected = true;
                Siesta.Events.publish(that.EVENT_CONNECTED,that);
            });

            sequentializer.start();
        }
    },

    consume: function(mechanism,graph) {
        if(this.connected == false) {
            throw "Unable to consume a disconnected service";
        }

        var loweredParametersMap = {};
        var inputMsgs = this.inputMessages();
        for(var _i=0; _i<inputMsgs.length; _i++) {
            var inputMsg = inputMsgs[_i];
            var result = Siesta.Sparql.query(graph,inputMsg.loweringSchemaMappingContent);
            for(var v in result[0]) {
                if((typeof result[0][v]) == "object") {
                    loweredParametersMap[v] = result[0][v];
                }
            }
        }
        var theAddress = this.address();
        for(var _i=0; _i<this.addressAttributes().length; _i++) {
            var theAttr = this.addressAttributes()[_i];
            var theAttrInAddress = "{"+ theAttr +"}";
            try{
                theAddress = theAddress.replace(theAttrInAddress,encodeURIComponent(loweredParametersMap[theAttr].value));
            } catch(e) {
                debugger;
                throw "ERROR lowering object: "+e;
            }
        }

        if(mechanism == "jsonp") {
            var that = this;
            if(theAddress.indexOf("?") != -1) {
                theAddress = theAddress + "&_method=" + this.method().toLowerCase();
            } else {
                theAddress = theAddress + "?_method=" + this.method().toLowerCase();
            }
            Siesta.Network.jsonpRequestForFunction(theAddress,"callback",function(resp) {

                var notifyWhenParsed = function(resp) {
                    Siesta.Events.publish(that.EVENT_CONSUMED,resp.parsedGraph);
                }

                if(that._repositoryMethod == Siesta.Services.RestfulOperation.GET ||
                   that._repositoryMethod == Siesta.Services.RestfulOperation.POST ||
                   that.method() == 'GET' ||
                   that.method() == 'POST') {
                    Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.data,notifyWhenParsed);

                } else if(that._repositoryMethod == Siesta.Services.RestfulOperation.DELETE ||
                          that.method() == 'DELETE') {

                    Siesta.Model.Repositories.data.removeGraph(graph);
                    notifyWhenParsed({parsedGraph: graph});

                } else if(that._repositoryMethod == Siesta.Services.RestfulOperation.PUT ||
                          that.method() == 'PUT') {

                    Siesta.Model.Repositories.data.removeGraph(graph);
                    Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.data,notifyWhenParsed);

                }
            });
        } else {
        }
    },


    EVENT_CONNECTED: "EVENT_OPERATION_CONNECTED",

    EVENT_CONSUMED: "CONSUMED_OPERATON_EVENT"
});
Siesta.Services.RestfulService = function(serviceUri,networkMechanism) { this.initialize(serviceUri,networkMechanism) };

/**
   A cache for the requested services.
*/
Siesta.Services.RestfulService.servicesCache = {};

/**
   Class methods
*/
Siesta.Services.RestfulService.findForSchema = function(schemaUri) {
    var query = "SELECT ?reference WHERE { ?reference " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Service> . ";
    query = query + "?reference <http://www.w3.org/ns/sawsdl#modelReference> <"+schemaUri+"> }";

    var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

    if(result.length == 0) {
        throw new Error("Error retrieving Service for modelReference:<"+schemaUri+"> uri.");
    } else {
        var service = Siesta.Services.RestfulService.find(result[0].reference);
        return service;
    }
}

Siesta.Services.RestfulService.find = function(serviceUri) {
    if(Siesta.Services.RestfulService.servicesCache[serviceUri] != undefined) {
        return Siesta.Services.RestfulService.servicesCache[serviceUri];
    } else {
        throw "Service <"+ serviceUri +"> not found in services cache, may be it is not connected";
    }
}

/**
       @class Siesta.Services.RestfulService

       A Semantic Restful hRESTS service.
    */
Siesta.Framework.classBuilder(Siesta.Services.RestfulService, {
    /**
                 * @constructor
                 *
                 * Initiates a new RestfulService object with the
                 * the data associated to the URI passed as an
                 * argument in the constructor.
                 *
                 * Triplets are looked up in the Siesta.Model.Repositories.services repository,
                 * they must have been retrieved first via a callo to Siesta.Services.registerService.
                 *
                 * @see Siesta.Services.registerService
                 *
                 * @argument serviceuri: Service location URI, a Siesta.Framework.Uri object or a String
                 * @argument networkMechanism: what kind of network transport will be used to access this service
                 */
    initialize: function(serviceUri,networkMechanism) {
        this.uri = serviceUri;
        if(serviceUri.__type == 'uri') {
            this.uri = uri.toString();
        }

        this._operations = null;
        this._operationsUris = null;

        this._modelReference = null;
        this.connected = false;
        this._model = null;
        this._mechanism = networkMechanism;
    },

    networkMechanism: function() {
        return this._mechanism;
    },

    modelReference: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {
            var query = "SELECT ?reference WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Service> . ";
            query = query + "<"+this.uri+"> <http://www.w3.org/ns/sawsdl#modelReference> ?reference }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                this._modelReference = null;
            } else {
                this._modelReference = result[0].reference.value;
            }
            return this._modelReference;
        }
    },

    isDefinedBy: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {
            var query = "SELECT ?defined WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Service> . ";
            query = query + "<"+this.uri+"> <http://www.w3.org/2000/01/rdf-schema#isDefinedBy> ?defined }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving rdfs#isDefinedBy for <"+this.uri+"> uri. Found "+result.length+" results instead of 1");
            } else {
                this._modelReference = result[0].defined.value;
                return this._modelReference;
            }
        }
    },

    operationsUris: function() {
        if(this._operationsUris != null) {
            return this._operationsUris;
        } else {
            this._operationsUris = [];

            var query = "SELECT ?operation WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/wsmo-lite#hasOperation> " + "?operation } ";


            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            for(var _i=0; _i<result.length; _i++) {
                this._operationsUris.push(result[_i].operation.value);
            }
            return this._operationsUris;
        }
    },

    operations: function() {
        if(this._operations != null) {
            return this._operations;
        } else {
            this._operations = [];
            var opsUris = this.operationsUris();

            for(_i=0; _i<opsUris.length; _i++) {
                var opName = opsUris[_i];
                this._operations.push(new Siesta.Services.RestfulOperation(opName));
            }

            return this._operations;
        }
    },

    model: function() {
        if(this._model != null) {
            return this._model;
        } else {
            if(this.modelReference() != null) {
                this._model = new Siesta.Model.Schema(this.modelReference());
            }
        }
    },

    /**
                       Retrieves all the external resources for this service: model, lowering and lifting operations, etc.

                       @returns nothing
                    */
    connect: function(mechanism) {
        if(this._mechanism == undefined) {
            this._mechanism = mechanism;
        }
        if(arguments.length == 0) {
            mechanism = this._mechanism;
        }
        if(this.connected == false) {

            var that = this;
            var sequentializer = new Siesta.Utils.Sequentializer();

            if(this.model() == null) {
                try {
                    if(mechanism == "jsonp") {
                        var callback = "callback";
                        if(arguments.length == 2) {
                            callback = arguments[1];
                        }
                        sequentializer.addRemoteRequest(function(){
                            Siesta.Network.jsonpRequestForFunction(that.modelReference(),callback,function(resp){

                                Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.schemas);
                                that.model();
                                sequentializer.notifyRequestFinished();
                            });
                        });
                    } else {

                    }
                } catch(e) { }
            }

            for(var _i=0; _i<this.operations().length; _i++){

                /*
                              var f = (function (theOperation) { return function () {
                              Siesta.Events.addListener(theOperation,theOperation.EVENT_CONNECTED,that,function(event,op) {

                              Siesta.Events.removeListener(theOperation,theOperation.EVENT_CONNECTED,that);
                              sequentializer.notifyRequestFinished();
                              });
                              theOperation.connect(mechanism);
                              }})(this.operations()[_i]);
                              sequentializer.addRemoteRequest(f);
                            */
                sequentializer.addRemoteRequestWithEnv(function(theOperation) {

                    var subscription = Siesta.Events.subscribe(theOperation.EVENT_CONNECTED,function(event,op,myData) {
                        if(theOperation == myData) {
                            Siesta.Events.unsubscribe(subscription);
                            sequentializer.notifyRequestFinished();
                        }
                    },that,theOperation);
                    theOperation.connect(mechanism);
                }, this.operations()[_i]);
            }

            sequentializer.finishedCallback(function() {
                Siesta.Services.RestfulService.servicesCache[this.serviceUri] = that;
                that.connected = true;
                Siesta.Events.publish(that.EVENT_SERVICE_LOADED,that);
            });

            sequentializer.start();
        }
    },

    _retryConnectModel: function(resp) {
        Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.schemas);
        this.model();

        Siesta.Events.publish(this.EVENT_SERVICE_LOADED,this);
    },

    EVENT_SERVICE_LOADED: "EVENT_SERVICE_LOADED"
});
Siesta.Model.Schema = function(schemaUri) { this.initialize(schemaUri) };
/**
   @class Siesta.Model.Schema

   A RDF model schema.
*/
Siesta.Framework.classBuilder(Siesta.Model.Schema, {
    /**
         * @constructor
         *
         * Initiates a new model schema object with the
         * the data associated to the URI passed as an
         * argument in the constructor.
         *
         * Triplets are looked up in the Siesta.Model.Repositories.schemas repository,
         * they must have been retrieved before initating the schema object.
         *
         * @argument serviceuri: Schema URI: a Siesta.Framework.Uri object or a String
         */
    initialize: function(schemaUri) {
        this.uri = schemaUri;
        if(typeof this.uri == 'object') {
            if(schemaUri.__type == 'uri') {
                this.uri = uri.toString();
            } else {
                this.uri = Siesta.Model.Namespaces.resolve(this.uri);
            }
        }

        if(this.uri == undefined) {
            throw "Cannot initialize Siesta.Model.Schema without schemaUri";
        }

        this._type = null;
        this._properties = null;
    },

    /**
               Retrieves the type of this model schema.

               @returns The URI of the type associated to this schema model
            */
    type: function() {
        if(this._type != null) {
            return this._type;
        } else {
            var query = "SELECT ?type WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "?type }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.schemas,query);

            if(result.length != 1) {
                throw new Error("Error retrieving rdfs#type for <"+this.uri+"> uri. Found "+result.length+" results instead of 1");
            } else {
                this._type = result[0].type.value;
                return this._type;
            }
        }
    },

    /**
               Retrieves all the properties associated to this schema URI by a rdfs:domain predicate.

               @returns A hash of URIs -> range for the properties of the model schema.
            */
    properties: function() {
        if(this._properties != null) {
            return this._properties;
        } else {
            var query = "SELECT ?prop ?range WHERE { ?prop  <http://www.w3.org/2000/01/rdf-schema#domain> <"+ this.uri +"> . ?prop <http://www.w3.org/2000/01/rdf-schema#range> ?range}";
            var result = Siesta.Sparql.query(Siesta.Model.Repositories.schemas,query);

            this._properties = [];

            for(_i=0; _i<result.length; _i++) {
                var prop = {};
                prop['uri'] = result[_i].prop.value;
                prop['range'] = result[_i].range.value;

                this._properties.push(prop);
            }
            return this._properties;
        }
    }
});
Siesta.Model.Class = function(parameters) { this.initialize(parameters) };

Siesta.Model.Class.registry = {};

Siesta.Model.Class.findForSchema = function(modelUri) {
    return Siesta.Model.Class.registry[modelUri];
};

Siesta.Model.Class.registerForSchema = function(modelUri,classObject) {
    return Siesta.Model.Class.registry[modelUri] = classObject;
};

/**
   @class Siesta.Model.Class

   A RDF model Class.
*/
Siesta.Framework.classBuilder(Siesta.Model.Class, {

    initialize: function(parameters) {
        this.uri = parameters.schemaUri;
        if(typeof this.uri == 'object') {
            if(this.uri.__type == 'uri') {
                this.uri = uri.toString();
            } else {
                this.uri = Siesta.Model.Namespaces.resolve(this.uri);
            }
        }

        if(this.uri == undefined) {
            throw "Cannot initialize Siesta.Model.Schema without schemaUri";
        }

        this.schema = new Siesta.Model.Schema(this.uri);

        if(parameters.serviceUri != undefined) {
            this.indexServices = parameters.serviceUri;
            this.getServices = parameters.serviceUri;
            this.postServices = parameters.serviceUri;
            this.deleteServices = parameters.serviceUri;
            this.putServices = parameters.serviceUri;
        }

        this.indexServices = parameters.indexServiceUri || this.indexServices;
        this.getServices = parameters.getServiceUris || this.getServices;
        this.postServices = parameters.postServicesUris || this.postServices;
        this.putServices = parameters.putServicesUris || this.putServices;
        this.deleteServices = parameters.deleteServicesUris || this.deleteServices;

        if(this.indexServices == undefined &&
           this.getServices == undefined &&
           this.postServices == undefined &&
           this.putServices == undefined &&
           this.deleteServices == undefined) {
            try {
                var service = Siesta.Services.RestfulService.findForSchema(this.uri);

                this.indexServices = service.uri;
                this.getServices = service.uri;
                this.postServices = service.uri;
                this.deleteServices = service.uri;
                this.putServices = service.uri;

            } catch(e) {
            }
        }

        if(this.indexServices != undefined) {
            this.indexServices = Siesta.Services.RestfulService.find(this.indexServices);
        }
        if(this.getServices != undefined) {
            this.getServices = Siesta.Services.RestfulService.find(this.getServices);
        }
        if(this.postServices != undefined) {
            this.postServices = Siesta.Services.RestfulService.find(this.postServices);
        }
        if(this.deleteServices != undefined) {
            this.deleteServices = Siesta.Services.RestfulService.find(this.deleteServices);
        }
        if(this.putServices != undefined) {
            this.putServices = Siesta.Services.RestfulService.find(this.putServices);
        }

        this.indexOperationUri = parameters.indexOperationUri;
        this.getOperationUri = parameters.getOperationUri;
        this.putOperationUri = parameters.putOperationUri;
        this.postOperationUri = parameters.postOperationUri;
        this.deleteOperationUri = parameters.deleteOperationUri;

        if(this.indexServices != undefined) {
            var indexServicesGET = 0;
            var candidateIndex = null;
            for(var _i=0;_i< this.indexServices.operations().length;_i++) {
                if(this.indexServices.operations()[_i].method() == Siesta.Services.RestfulOperation.GET) {
                    indexServicesGET++;
                    candidateIndex = this.indexServices.operations()[_i];
                }
            }
            if(indexServicesGET > 1) {
                if(this.indexOperationUri == undefined) {
                    throw 'several posible GET operations for index';
                }
            } else {
                if(this.indexOperationUri == undefined) {
                    this.indexOperationUri = candidateIndex.method().uri;
                }
            }
        }

        if(this.getServices != undefined) {
            var getServicesGET = 0;
            var candidateGet = null;
            for(var _i=0;_i< this.getServices.operations().length;_i++) {
                if(this.getServices.operations()[_i].method() == Siesta.Services.RestfulOperation.GET) {
                    getServicesGET++;
                    candidateGet = this.getServices.operations()[_i];
                }
            }
            if(getServicesGET > 1) {
                if(this.getOperationUri == undefined) {
                    throw 'several posible GET operations for find';
                }
            } else {
                if(this.getOperationUri == undefined) {
                    this.getOperationUri = candidateGet.method().uri;
                }
            }
        }

        this._propertyMapping = null;

        Siesta.Model.Class.registerForSchema(this.uri,this);
        if(parameters.nestedThrough != null && this.property(parameters.nestedThrough)!=null){
            this.nestedThrough = this.property(parameters.nestedThrough);
        } else {
            this.nestedThrough = parameters.nestedThrough;
        }

    },

    definePropertiesAliases: function(mapping) {
        this._propertyMapping = {};
        var propertiesNames = [];
        for(var _i=0; _i<this.schema.properties().length; _i++) {
            propertiesNames.push(this.schema.properties()[_i]['uri']);
        }

        for(_name in mapping) {
            var thisProperty = mapping[_name];
            if(typeof thisProperty == 'object') {
                thisProperty = Siesta.Model.Namespaces.resolve(thisProperty);
            }
            var found = false;
            for(var _i=0; _i<propertiesNames.length; _i++) {
                if(propertiesNames[_i] == thisProperty) {
                    found = true;
                    break;
                }
            }
            if(found == true) {
                this._propertyMapping[_name]  = thisProperty
            } else {
                throw "Cannot define property class name for unknown property " + thisProperty ;
            }
        }
    },

    properties: function() {
        return this.schema.properties();
    },

    property: function(nameOrUri) {
        if(this._propertyMapping != null && this._propertyMapping[nameOrUri] != undefined) {
            return this._propertyMapping[nameOrUri];
        } else {
            for(var _i=0; _i<this.schema.properties().length; _i++) {
                if(this.schema.properties()[_i]['uri'] == nameOrUri) {
                    return this.schema.properties()[_i]['uri'];
                }
            }
            return null;
        }
    },

    propertyRange: function(nameOrUri) {
        var uri = this.property(nameOrUri);
        for(var _i=0; _i<this.schema.properties().length; _i++) {
            if(this.schema.properties()[_i]['uri'] == uri) {
                return this.schema.properties()[_i]['range'];
            }
        }
        return null;
    },

    isDatatypeProperty: function(nameOrUri) {
        var range = this.propertyRange(nameOrUri);
        if(range!=null) {
            if(Siesta.XSD.DATATYPES_INV[range]!=undefined) {
                return true;
            } else {
                return false;
            }
        } else {
            return null;
        }
    },

    isObjectProperty: function() {
        return !this.isDatatypeProperty();
    },

    propertiesAliases: function() {
        var toReturn = [];
        for(var p in this._propertyMapping) {
            toReturn.push(p);
        }
        return toReturn;
    },

    isPropertyAlias: function(propertyName) {
        if(this._propertyMapping[propertyName] == undefined) {
            return false;
        } else {
            return true;
        }
    },


    /*
             * Operations
             */

    /**
               Returns a new instance of the class without saving it into the server
            */
    build: function(params) {
        return new Siesta.Model.Instance({
            type: this,
            properties: params
        });
    },

    /**
               Invokes the POST method of the associated service for the given instance
            */
    post: function(instance,callback) {
        if(this.postServices == undefined) {
            throw "Cannot save instance for ModelClass without POST service";
        } else {
            var service = this.postServices;
            var op = null;
            var operations = service.operations();
            for(var _i=0; _i<operations.length; _i++) {
                if(this.postOperationUri == undefined) { // no URI look for the HTTP method
                    if(operations[_i].method() == Siesta.Services.RestfulOperation.POST) {
                        op = operations[_i];
                        break;
                    }
                } else{ // URI, we don't care about the HTTP method
                    if(operations[_i].uri == this.postOperationUri) {
                        op = operations[_i];
                        op._repositoryMethod = Siesta.Services.RestfulOperation.POST;
                        break;
                    }
                }
            }

            var that = this;
            var subscription = Siesta.Events.subscribe(op.EVENT_CONSUMED,function(event,graph,myData) {
                Siesta.Events.unsubscribe(subscription);
                if(myData == instance) {
                    if(callback != undefined) {
                        callback(graph);
                    }
                }
            },that,instance);
            var g = instance.toGraph();
            op.consume(service.networkMechanism(),g);
        }
    },

    /**
               Invokes the PUT method of the associated service for the given instance
            */
    put: function(instance,callback) {
        if(this.putServices == undefined) {
            throw "Cannot save instance for ModelClass without PUT service";
        } else {
            var service = this.putServices;
            var op = null;
            var operations = service.operations();
            for(var _i=0; _i<operations.length; _i++) {
                if(this.putOperationUri == undefined) { // no URI look for the HTTP method
                    if(operations[_i].method() == Siesta.Services.RestfulOperation.PUT) {
                        op = operations[_i];
                        break;
                    }
                } else{ // URI, we don't care about the HTTP method
                    if(operations[_i].uri == this.putOperationUri) {
                        op = operations[_i];
                        op._repositoryMethod = Siesta.Services.RestfulOperation.PUT;
                        break;
                    }
                }
            }

            var that = this;
            var subscription = Siesta.Events.subscribe(op.EVENT_CONSUMED,function(event,graph,myData) {
                Siesta.Events.unsubscribe(subscription);
                if(myData == instance) {
                    if(callback != undefined) {
                        callback(graph);
                    }
                }
            },that,instance);
            var g = instance.toGraph();
            op.consume(service.networkMechanism(),g);
        }
    },

    _findUrisInGraph:function(graph){
        var uris = [];
        for(var _id in graph.triples) {
            for(var _pred in graph.triples[_id]) {
                if(_pred == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
                    for(_obj in graph.triples[_id][_pred]){
                        if(_obj == this.uri) {
                            uris.push(_id);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        return uris;
    },

    _updateInstance:function(graph,instance) {
        for(var _id in graph.triples) {
            if(_id == instance.uri) {
                for(var _pred in graph.triples[_id]) {
                    if(instance.type.property(_pred) != null) {
                        try{
                            for(_obj in graph.triples[_id][_pred]){
                                if(graph.triples[_id][_pred][_obj].object.__type=='literal')
                                    instance.set(_pred,graph.triples[_id][_pred][_obj].object);
                                else {
                                    instance.set(_pred,_obj);
                                }
                                break;
                            }
                        } catch(e) {

                        }
                    }
                }
            }
        }
    },

    /**
               Does a remote request to the server with the GET operation
               of the service matching the property mapping passed as a
               parameter.

               @argument: mapping, a JS object containing pairs of key-value or a Model.Instance
               object that will be used to retrieve the parameters for the query.
               @argument: callback, a function that will be invoked with the objects
               returned from the serer in an array as argument.
            */
    find: function(mapping,callback) { //
        if(this.getServices == undefined) {
            throw "Cannot find instance for ModelClass without GET service";
        } else {
            var instance = mapping;
            if(mapping.__type == undefined) {
                instance = this.build(mapping);
            }

            var service = this.getServices;
            var op = null;
            var operations = service.operations();
            for(var _i=0; _i<operations.length; _i++) {
                if(this.getOperationUri == undefined) {
                    if(operations[_i].method() == Siesta.Services.RestfulOperation.GET) {
                        op = operations[_i];
                        break;
                    }
                } else {
                    if(operations[_i].uri == this.getOperationUri) {
                        op = operations[_i];
                        op._repositoryMethod = Siesta.Services.RestfulOperation.GET;
                        break;
                    }
                }
            }
            var that = this;
            var subscription = Siesta.Events.subscribe(op.EVENT_CONSUMED,function(event,graph,myData) {
                Siesta.Events.unsubscribe(subscription);
                if(myData == instance) {
                    instance.uri = graph.triplesArray()[0].subject.value;
                    instance._graph = null;
                    instance.type._updateInstance(graph,instance);
                    instance.stored = true;
                    if(callback != undefined) {
                        callback(instance);
                    }
                }
            },that,instance);
            var g = instance.toGraph();
            op.consume(service.networkMechanism(),g);
        }
    },

    findAll: function(mapping,callback) {
        if(this.indexServices == undefined) {
            throw "Cannot index instances for ModelClass without INDEX service";
        } else {
            var instance = mapping;
            if(mapping.__type == undefined) {
                instance = this.build(mapping);
            }

            var service = this.indexServices;
            var op = null;
            var operations = service.operations();
            for(var _i=0; _i<operations.length; _i++) {
                if(this.indexOperationUri == undefined) {
                    if(operations[_i].method() == Siesta.Services.RestfulOperation.GET) {
                        op = operations[_i];
                        break;
                    }
                } else {
                    if(operations[_i].uri == this.indexOperationUri) {
                        op = operations[_i];
                        op._repositoryMethod = Siesta.Services.RestfulOperation.GET;
                        break;
                    }
                }
            }
            var that = this;
            var subscription = Siesta.Events.subscribe(op.EVENT_CONSUMED,function(event,graph,myData) {
                Siesta.Events.unsubscribe(subscription);
                if(myData == instance) {
                    if(callback != undefined) {
                        callback(graph);
                    }
                }
            },that,instance);
            var g = instance.toGraph();
            op.consume(service.networkMechanism(),g);
        }
    },

    deleteOperation: function(instance,callback) {
        if(this.deleteServices == undefined) {
            throw "Cannot destroy instance for ModelClass without DELETE service";
        } else {
            var service = this.deleteServices;
            var op = null;
            var operations = service.operations();
            for(var _i=0; _i<operations.length; _i++) {
                if(this.deleteOperationUri == undefined) { // if no URI look for HTTP method
                    if(operations[_i].method() == Siesta.Services.RestfulOperation.DELETE) {
                        op = operations[_i];
                        break;
                    }
                } else { // we have URI we don't care about the HTTP method
                    if(operations[_i].uri == this.deleteOperationUri) {
                        op = operations[_i];
                        op._repositoryMethod = Siesta.Services.RestfulOperation.DELETE;
                        break;
                    }
                }
            }
            var that = this;
            var subscription = Siesta.Events.subscribe(op.EVENT_CONSUMED,function(event,graph,myData) {
                Siesta.Events.unsubscribe(subscription);
                if(myData == instance) {
                    if(callback != undefined) {
                        callback(graph);
                    }
                }
            },that,instance);
            var g = instance.toGraph();
            op.consume(service.networkMechanism(),g);
        }
    }
});
Siesta.Model.Instance = function(params) { this.initialize(params) };

/**
   @class Siesta.Model.Instance

   A RDF instance of some model.
*/
Siesta.Framework.classBuilder(Siesta.Model.Instance, {
    /**
         * @constructor
         *
         * Initiates a new instance model with the URI andvalues
         * provided in the constructor.
         *
         * @argument schema: Siesta.Model.Schema for the instance.
         * @argument uri: instance URI, it can be null.
         * @argument properties: values for the properties of the instance
         */
    initialize: function(params) {

        this.type = params.type;
        if(this.type == undefined) {
            throw "Cannot create instance with undefined type";
        }

        this.uri = params.uri;
        this._properties = {};

        this._graph = null;

        if(this.uri == undefined) {
            this.stored = false;
        } else {
            this.stored = true;
        }

        this.originalObjects = {};

        this.dirty = false;

        for(var p in params.properties) {
            if(this.type.isDatatypeProperty(p)) {
                this.set(p,params.properties[p]);
            } else {
                var toStore = params.properties[p];
                if(toStore.length) {
                    for(var _i=0; _i<toStore.length; _i++) {
                        var _toStore = toStore[_i];
                        if(_toStore.stored == true) {
                            if(this.type.nestedThrough != p) {
                                throw "Cannot create instance with already initiated object " + _toStore.uri  + " in a relation";
                            }
                        }
                    }
                } else {
                    if(toStore.stored == true) {
                        if(this.type.nestedThrough != p) {
			    throw "Cannot create instance with already initiated object " + _toStore.uri  + " in a relation";
                        }
                    }
                }
                if(this.type.nestedThrough != p) {
                    this.collectionsToSave[this.type.property(p)] = toStore;
                }
                this._properties[this.type.property(p)] = params.properties[p];
            }
        }
    },

    set: function(property,value) {
        var range =  this.type.propertyRange(property);
        if(this.type.property(property) != null) {
            if(value.__type == null) { // cannot be instance nor literal
                if(Siesta.XSD.DATATYPES_INV[range]!=undefined) {
                    this.dirty = true;
                    this._properties[this.type.property(property)] = new Siesta.Framework.Literal({value: value});
                } else {
                    this._properties[this.type.property(property)] = value;
                }
            } else { // instance or literal
                if(Siesta.XSD.DATATYPES_INV[range]!=undefined) {
                    this.dirty = true;
                    this._properties[this.type.property(property)] = value;
                } else {
                    this._properties[this.type.property(property)] = [value];
                }
            }
        } else {
            throw "Unknown property "+property+" for instance of class "+this.type.uri;
        }
    },

    get: function(property) {
        if(this.type.property(property) != null) {
            var prop =  this._properties[this.type.property(property)];
            return prop.value;
        } else {
            throw "Unknown property "+property+" for instance of class "+this.type.uri;
        }
    },

    relationFindAll: function(property,callback) {
        if(this.type.property(property) != null) {
            var range =  this.type.propertyRange(property);
            var relationClass = Siesta.Model.Class.findForSchema(range);

            var argument = {};
            argument[relationClass.nestedThrough] =  this;

            var that = this;
            relationClass.findAll(argument,function(instances) {
                var genInstances = [];

                for(var _s in instances.triples) {
                    var _tmp = relationClass.build({});
                    _tmp.uri = _s;
                    _tmp._graph = null;
                    _tmp.type._updateInstance(instances,_tmp);
                    _tmp.stored = true;
                    _tmp.dirty= false;
                    _tmp._properties[relationClass.nestedThrough] = that;
                    genInstances.push(_tmp);
                }
                var _origGenInstances = [];
                for(var _i=0; _i<genInstances.length; _i++) {
                    _origGenInstances.push(genInstances[_i])
                }
                that.originalObjects[that.type.property(property)] = _origGenInstances;
                that.set(property,genInstances);
                callback(that);
            });
        } else {
            throw "Unknown relation "+property+" for instance of class "+this.type.uri;
        }
    },

    relationFind: function(property,callback) {
        if(this.type.property(property) != null) {
            var range =  this.type.propertyRange(property);
            var relationClass = Siesta.Model.Class.findForSchema(range);

            var argument = {};
            argument[relationClass.nestedThrough] =  this;

            var that = this;
            relationClass.findAll(argument,function(instances) {

                for(var _s in instances.triples) {
                    var _tmp = relationClass.build({});
                    _tmp.uri = _s;
                    _tmp._graph = null;
                    _tmp.type._updateInstance(instances,_tmp);
                    _tmp.stored = true;
                    _tmp.dirty = false;
                    _tmp._properties[relationClass.nestedThrough] = that;
                    that.set(property,_tmp);
                    that.originalObjects[that.type.property(property)] = _tmp;
                    break;
                }
                callback(that);
            });
        } else {
            throw "Unknown relation "+property+" for instance of class "+this.type.uri;
        }
    },

    relationGet: function(property) {
        if(this.type.property(property) != null) {
            var prop =  this._properties[this.type.property(property)];
            return prop;
        } else {
            debugger;
            throw "Unknown property "+property+" for instance of class "+this.type.uri;
        }
    },

    relationSet: function(property,value) {
        if(this.type.property(property) != null) {
            this._properties[this.type.property(property)] = value;
        } else {
            throw "Unknown relation "+property+" for instance of class "+this.type.uri;
        }
    },

    relationAdd: function(property,value) {
        if(this.type.property(property) != null) {
            var old_value = this._properties[this.type.property(property)];
            if(old_value == undefined) {
                throw "The collection has not been retrieved with a relationFindAll message";
            }
            if(old_value.length) {
                this._properties[this.type.property(property)].push(value);
            } else {
                throw "I cannot add instances to an scalar relation"
            }
        } else {
            throw "Unknown relation "+property+" for instance of class "+this.type.uri;
        }
    },

    relationRemove: function(property,value) {
        if(this.type.property(property) != null) {
            for(var _p in this._properties) {
                var newValue = [];
                var oldValue = this._properties[this.type.property(property)];
                if(oldValue == undefined) {
                    throw "The collection has not been retrieved with a relationFindAll message";
                }
                if(oldValue.length) {
                    var _found = false;
                    for(var _i; _i<oldValue.length; _i++) {
                        var val = oldValue[_i];
                        if(val.equalTo(value) && !_found) {
                            _found = true;
                        } else {
                            newValue.push(val);
                        }
                    }
                    this._properties[this.type.property(property)] = newValue;
                } else {
                    throw "I cannot remove instances from an scalar relation"
                }

            }
        } else {
            throw "Unknown relation "+property+" for instance of class "+this.type.uri;
        }
    },

    equalTo: function(instance) {
        if(instance.uri) {
            return this.uri == instance.uri;
        } else if(instance._properties) {
            for(var _p in instance._properties) {
                var _v = instance._properties[_p];
                var _tv = this._properties[_p];
                if(_v.equalTo && _tv.equalTo) {
                    if(_v.equalTo(_tv) == false) {
                        return false;
                    }
                } else if(_v.length && _tv.length) {
                    if(_v.length != _tv.length) {
                        return false;
                    }
                } else {
                    if(_v != _tv) {
                        return false;
                    }
                }
            }
            return true;
        } else {
            return this == instance;
        }
    },

    toGraph: function() {
        if(this._graph == null) {
            this._graph = new  Siesta.Framework.Graph();
            if(this.uri == null) {
                this.uri = "_:0";
            }
            var subject = new Siesta.Framework.Uri(this.uri);
            for(var p in this._properties) {
                var propertyValue = this._properties[p];
                if(propertyValue.__type != null && propertyValue.__type == 'instance') {
                    this._graph.addTriple(new Siesta.Framework.Triple(new Siesta.Framework.Uri(this.uri),
                                                                      new Siesta.Framework.Uri(p),
                                                                      new Siesta.Framework.Uri(propertyValue.uri)));
                } else if(propertyValue.__type == null && propertyValue.length) {
                    for(var _i=0; _i< propertyValue.length; _i++) {
                        this._graph.addTriple(new Siesta.Framework.Triple(new Siesta.Framework.Uri(this.uri),
                                                                          new Siesta.Framework.Uri(p),
                                                                          new Siesta.Framework.Uri(propertyValue[_i].uri)));
                    }
                } else {
                    this._graph.addTriple(new Siesta.Framework.Triple(new Siesta.Framework.Uri(this.uri),
                                                                      new Siesta.Framework.Uri(p),
                                                                      propertyValue));
                }
            }

            var nestedTriples = this._nestingTriples();
            if(nestedTriples.length > 0) {
                for(var _i=0; _i<nestedTriples.length; _i++) {
                    this._graph.addTriple(nestedTriples[_i]);
                }

            } else {
                this._graph.addTriple(new Siesta.Framework.Triple(new Siesta.Framework.Uri(this.uri),
                                                                  new Siesta.Framework.Uri(Siesta.Constants.RDF_TYPE),
                                                                  new Siesta.Framework.Uri(this.type.uri)));
            }
        }
        return this._graph;
    },

    /*
     * Operations
     */

    /**
       Saves or updates this instance using the provided backend service.

       @argument callback, a callback function that will be invoked when the save
       operation had finished passing as a parameter the saved instance.
      */
    save: function(callback) {
        var that = this;
        if(this.stored == false) { // no saved, we use POST to create and save
            that.type.post(that,function(graph) {
                that.uri = graph.triplesArray()[0].subject.value;
                that._graph = null;
                that.type._updateInstance(graph,that);
                that.stored = true;
                callback(that);
            });
        } else { // already saved, we use PUT to update
            that.type.put(that,function(graph) {
                that._graph = null;
                that.type._updateInstance(graph,that);
                that.stored = true;
                callback(that);
            });
        }
    },

    _updateCollections: function(callback) {
        var that = this;

        var toModify = [];


        for(var _p in that._properties) {
            if(that.type.isObjectProperty(_p)) {
                var propValue = that.get(_p);
                var origPropValue = that.originalObjects[_p];

                if(propValue.length) {
                    for(var _i=0; _i<propValue.length; _i++) {
                        var thePropValue = propValue[_i];
                        var theOrigPropValue = that._findInstanceInArray(thePropValue,origPropValue);
                        if(theOrigPropValue == undefined) {
                            toModify.push({object: thePropValue, action: 'create'});
                        } else {
                            if(theOrigPropValue.uri == thePropValue.uri) {
                                if(thePropValue.dirty) {
                                    toModify.push({object: thePropValue, action: 'update'});
                                }
                            } else {
                                toModify.push({object: thePropValue, action: 'create'});
                            }
                        }
                    }
                    for(var _i=0; _i<origPropValue.length; _i++) {
                        var thePropValue = origPropValue[_i];
                        var retrieved = that._findInstanceInArray(thePropValue,propValue);
                        if(retrieved == undefined) {
                            toModify.push({object: thePropValue, action: 'delete'});
                        } else {
                            if(retrieved.uri != thePropValue.uri) {
                                toModify.push({object: thePropValue, action: 'delete'});
                            }
                        }
                    }
                } else {
                    _classifyByStatus(origPropValue,propValue,toModify);
                }

            }
        }

        if(toModify.length > 0) {
            var sequentializer = new Siesta.Utils.Sequentializer();
            var maximum = toModify.length - 1
            for(var _i=0; _i<toModify.length; _i++) {
                var toModifyInstance = toModify[_i];
                toModifyInstance['pos'] = _i
                sequentializer.addRemoteRequestWithEnv(function(instanceObj){
                    if(instanceObj.action == 'create' || instanceObj.action == 'update') {
                        instanceObj.object.save(function(savedObj) {
                            sequentializer.notifyRequestFinished();
                        });
                    } else { // destroy
                        instanceObj.object.destroy(function(destryedObj) {
                            sequentializer.notifyRequestFinished();
                        });

                    }
                },toModifyInstance);
            }

            sequentializer.finishedCallback(function() {
                callback(that);
            });

            sequentializer.start();

        }

    },

    _findInstanceInArray: function(instance,instances)  {
        for(var _i=0; _i<instances.length; _i++) {
            if(instance.equalTo(instances[_i])) {
                return instances[_i];
            }
        }
        return undefined;
    },

    _classifyByStatus: function(origPropValue,propValue,toModify) {
        if(origPropValue == undefined) {
            if(propValue != undefined) {
                toModify.push({object: propValue, action: 'create'});
            }
        } else if(origPropValue.equalTo(propValue)) {
            if(propValue.dirty) {
                toModify.push({object: propValue, action: 'update'});
            }
        } else {
            toModify.push({object: origPropValue, action: 'delete'});
            if(propValue != undefined) {
                toModify.push({object: propValue, action: 'create'});
            }
        }
    },

    /**
      Destroys this instance using the provided backend service.

      @argument callback, a callback function that will be invoked when the destroy
      operation had finished passing as a parameter the destroyed instance.
     */
    destroy: function(callback) {
        var that = this;
        this.type.deleteOperation(this,function(graph) {
            that.uri = undefined;
            this.stored = false;
            callback(that);
        });
    },

    _nestingTriples: function() {
        var triples = [];
        if(this.type.nestedThrough == undefined) {
            return triples;
        }
        var nestedIn = this.relationGet(this.type.nestedThrough);
        if(nestedIn != undefined) {
            triples.push(new Siesta.Framework.Triple(new Siesta.Framework.Uri(this.uri),
                                                     new Siesta.Framework.Uri(this.type.nestedThrough),
                                                     new Siesta.Framework.Uri(nestedIn.uri)));
            triples.push(new Siesta.Framework.Triple(new Siesta.Framework.Uri(this.uri),
                                                     new Siesta.Framework.Uri(Siesta.Constants.RDF_TYPE),
                                                     new Siesta.Framework.Uri(this.type.uri)));
            if(nestedIn.get(Siesta.Constants.SIESTA_ID) != undefined) {
                triples.push(new Siesta.Framework.Triple(new Siesta.Framework.Uri(nestedIn.uri),
                                                         new Siesta.Framework.Uri(Siesta.Constants.SIESTA_ID),
                                                         new Siesta.Framework.Uri(nestedIn.get(Siesta.Constants.SIESTA_ID))));
            }
            var nestedTriples = nestedIn._nestingTriples();
            for(var _i=0; _i<nestedTriples.length; _i++) {
                triples.push(nestedTriples[_i]);
            }
        }
        return triples;
    },

    __type: "instance"
});
/**
   Events manager
*/
Siesta.Events = {
    eventsDictionary: {},

    subscriptionsMap: {},

    _subscriptionsCounter: 0,

    /**
     * Creates a subscription on the specified topic name.
     *
     * @param {String} name
     *     The name of the topic to which you want to subscribe.
     * @param {Function|String} refOrName
     *     A function object reference or the name of a function
     *     that is invoked whenever an event is published on the topic.
     * @param {Object} [scope]
     *     An Object in which to execute refOrName when handling the event.
     *     If null, window object is used. The scope parameter will be the
     *     "this" object when the callback is invoked.
     * @param {*} [subscriberData]
     *     Client application provides this data, which is handed
     *     back to the client application in the subscriberData
     *     parameter of the callback function.
     * @returns
     *     A String Object (a "subscription") that is unique for this particular subscription.
     * @type {String}
     */
    subscribe: function(name, refOrName, scope, subscriberData) {
        if(this.eventsDictionary[name] == undefined) {
            this.eventsDictionary[name] = {};
        }
        var subscriptionId = '_'+this._subscriptionsCounter++;
        this.eventsDictionary[name][subscriptionId] = { refOrName: refOrName,
                                                        scope: scope || this,
                                                        subscriberData: subscriberData || {} };
        this.subscriptionsMap[subscriptionId] = name;
        return subscriptionId;
    },

    /**
     * Removes a subscription to an event.
     *
     * @param {String} subscription
     *     The return value from a previous call to OpenAjax.hub.subscribe().
     */
    unsubscribe: function(subscription) {
        var event = this.subscriptionsMap[subscription];
        if(event != undefined) {
            if(this.eventsDictionary[event] != undefined) {
                delete this.eventsDictionary[event][subscription];
                var hasMore = false;
                for(var _p in this.eventsDictionary[event]) {
                    if(this.eventsDictionary[event][_p] != undefined) {
                        hasMore = true;
                    }
                }
                if(hasMore == false) {
                    delete this.eventsDictionary[event];
                }
                delete this.subscriptionsMap[subscription];
            }
        }
    },

    /**
     * Publishes (broadcasts) an event.
     *
     * @param {String} name
     *     The name of the topic that is being published.
     * @param {*} [publisherData]
     *     (Optional) An arbitrary Object holding extra information that
     *     will be passed as an argument to the handler function.
     * @type {Object}
     */
    publish: function(name, publisherData) {
        if(this.eventsDictionary[name] != undefined) {
            for(var subscriptionId in this.eventsDictionary[name]) {
                var subscription = this.eventsDictionary[name][subscriptionId];
                var theUserData = subscription.subscriberData;

                subscription.refOrName.apply(subscription.scope,[name,publisherData,theUserData]);
            }
        }
    }
};

/*                            Framework configuration and initalization                                       */
Siesta.registerNamespace("Siesta","Sparql");
Siesta.registerNamespace("Siesta","Formats","Turtle");
Siesta.registerNamespace("Siesta","Formats","Xml");

Siesta.defineConfiguration = function(theConfiguration) {
    Siesta.Configuration = theConfiguration;
    Siesta.loadFrameworks();
}

Siesta.loadConfiguration = function(basePath) {
    /**
           Returns the current URL till the last '/' (not included) in th URL:
           - http://test.com/scripts/my_script.js -> http://test.com/scripts
        */
    Siesta.basePath = function() {
        return basePath;
    };

    Siesta.load(Siesta.basePath(),"configuration.js");
};

Siesta.loadFrameworks = function() {
    Siesta.remainingFrameworks = {};
    Siesta.remainingFrameworks["sparql"] = true;
    Siesta.remainingFrameworks["formats/turtle"] = true;
    Siesta.remainingFrameworks["formats/xml"] = true;
    Siesta.remainingFrameworks["formats/rdfa"] = true;
    Siesta.remainingFrameworks["network"] = true;

    if(!Siesta.isPackaged) {
        if(Siesta.Configuration.drivers != null) {
            for(_i=0; _i< Siesta.Configuration.drivers.length; _i++) {
                var path = "libs/drivers/"+Siesta.Configuration.drivers[_i]+"/load.js";
                Siesta.loadFromBase(path);
            }
        }


        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.sparql.toLowerCase()+"/sparql/query.js");
        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.formats.turtle.toLowerCase()+"/formats/turtle.js"); //turtle
        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.formats.xml.toLowerCase()+"/formats/xml.js"); //xml
        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.formats.rdfa.toLowerCase()+"/formats/rdfa.js"); //rdfa
        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.network.toLowerCase()+"/network.js"); //xml
    }
};

Siesta.WhenInitiatedScripts = [];

Siesta.onFrameworkInitiated = function(f) {
    Siesta.WhenInitiatedScripts.push(f);
};

Siesta.defineConfiguration({
    drivers: ["hercules","oat","jquery","w3c"],
    sparql: "Hercules",
    formats: {
        turtle: "Hercules",
        xml: "OAT",
        rdfa: "W3c"
    },
    network: "jQuery"
});

Siesta.registerFramework = function(key) {
    Siesta.remainingFrameworks[key] = false;

    var notReady = false;

    notReady = notReady || Siesta.remainingFrameworks["sparql"];
    notReady = notReady || Siesta.remainingFrameworks["formats/turtle"];
    notReady = notReady || Siesta.remainingFrameworks["formats/xml"];
    notReady = notReady || Siesta.remainingFrameworks["formats/rdfa"];
    notReady = notReady || Siesta.remainingFrameworks["network"];

    if(key == "sparql") {
        Siesta.Sparql = eval("Siesta.Drivers."+Siesta.Configuration.sparql+".Sparql");
    } else if(key == "formats/turtle") {
        Siesta.Formats.Turtle = eval("Siesta.Drivers."+Siesta.Configuration.formats.turtle+".Formats.Turtle");
    } else if(key == "formats/xml") {
        Siesta.Formats.Xml = eval("Siesta.Drivers."+Siesta.Configuration.formats.xml+".Formats.Xml");
    } else if(key == "formats/rdfa") {
        Siesta.Formats.Rdfa = eval("Siesta.Drivers."+Siesta.Configuration.formats.rdfa+".Formats.Rdfa");
    } else if(key == "network") {
        Siesta.Network = eval("Siesta.Drivers."+Siesta.Configuration.network+".Network");
    }

    if(!notReady) {
        for(_i=0; _i< Siesta.WhenInitiatedScripts.length; _i++) {
            Siesta.WhenInitiatedScripts[_i].call();
        }
    }
}
if (! Arielworks) var Arielworks = {};
if (! Arielworks.Util) Arielworks.Util = {};
if (! Arielworks.Parser) Arielworks.Parser = {};
if (! Arielworks.Parser.RecursiveDescentParser) Arielworks.Parser.RecursiveDescentParser = {};
if (! Arielworks.Hercules) Arielworks.Hercules = {};
if (! Arielworks.Hercules.Rdf) Arielworks.Hercules.Rdf = {};
if (! Arielworks.Hercules.Rdf.Datatype) Arielworks.Hercules.Rdf.Datatype = {};
if (! Arielworks.Hercules.Rdf.Datatype.Xsd) Arielworks.Hercules.Rdf.Datatype.Xsd = {};
if (! Arielworks.Hercules.Sparql) Arielworks.Hercules.Sparql = {};
if (! Arielworks.Hercules.Serialized) Arielworks.Hercules.Serialized = {};
if (! Arielworks.Hercules.Serialized.Turtle) Arielworks.Hercules.Serialized.Turtle = {};

Arielworks.Hercules.turtleToGraph = function(baseUri,turtleDoc) {
    var turtleParser = new Arielworks.Parser.RecursiveDescentParser.Parser();
    turtleParser.setRuleSet(Arielworks.Hercules.Serialized.Turtle.Parser.RULE_SET);
    turtleParser.setWhiteSpaceRule(Arielworks.Hercules.Serialized.Turtle.Parser.WHITE_SPACE_RULE);
    turtleParser.compileRuleSet();
    var action = new Arielworks.Hercules.Serialized.Turtle.Turtle_1_0(baseUri);
    var ret = turtleParser.parse(turtleDoc, Arielworks.Hercules.Serialized.Turtle.Parser.START_RULE, action);

    return action;
}

Arielworks.Util.Class = {
  create: function(initializer) {
      var obj = function() {
          if (! this.___initialized) {
              this.___initialized = true;
              Arielworks.Util.Class.__callInitializers(this, this.constructor);
              this.___extendingStack = Array.apply(null, this.constructor.___extendingStack); // copy
          } else {
              var now = this.___extendingStack.shift();
          }

          if (this.___extendingStack[0].prototype.___constructor) {
              this.___extendingStack[0].prototype.___constructor.apply(this, arguments);
          }

          if (now) this.___extendingStack.unshift(now);
      };

      obj.___managed = true;
      obj.___initializer = initializer;
      obj.prototype.instanceOf = Arielworks.Util.Class.__instanceOfCall;
      obj.prototype.kindOf = Arielworks.Util.Class.__kindOfCall;
      obj.___extendingStack = [obj];
      obj.prototype.___mixin = Arielworks.Util.Class.__mixinCall;

      return obj;
  },

  extend: function(superClass, mixin1/*, mixin2, mixin3...*/, initializer) {
      var hasInitializer = arguments[arguments.length - 1].___managed != true;
      var subClass = Arielworks.Util.Class.create(hasInitializer ? arguments[arguments.length - 1] : undefined);
      var dontCallConstructor = function() {};
      dontCallConstructor.prototype = superClass.prototype;
      subClass.prototype =  new dontCallConstructor();
      subClass.prototype.constructor = subClass;

      subClass.prototype.___super = superClass;
      subClass.___super = superClass;
      subClass.___extendingStack = Array.apply(null, superClass.___extendingStack);
      subClass.___extendingStack.unshift(subClass);


      var drops = {};
      for (property in subClass) if (subClass.hasOwnProperty(property)) drops[property] = true;
      for (property in superClass) if (superClass.hasOwnProperty(property)) {
          if (drops[property] !== true) subClass[property] = superClass[property];
      }


      subClass.___mixin = [];
      for (var i = 1; i < arguments.length - (hasInitializer ? 1 : 0); i++) {
          var mixin = arguments[i];
          subClass.___mixin.push(mixin);
          for (property in mixin) if (drops[property] !== true && ! Object.prototype.hasOwnProperty(property)) {
              subClass[property] = mixin[property];
          }
      }
      return subClass;
  },

  __instanceOfCall: function(klass) {
      return this.constructor == klass;
  },

   __kindOfCall: function(klass) {
       Arielworks.Util.Class.__kindOfClassChain(this.constructor, klass);
  },

  __kindOfClassChain: function(about, to) {
      if (about == to) return true;

      var mixin = about.___mixin;
      for (var i = 0; i < mixin.length; i++) {
          if (Arielworks.Util.Class.__kindOfCallMixin(mixin[i], to)) return true;
      }

      if (about.__super) return Arielworks.Util.Class.__kindOfClassChain(about.__super, to);

      return false;
  },

  __callInitializers: function(object, klass) {
      var chainStack = [];
      var currentClass = klass;
      while (currentClass) {
          chainStack.push(currentClass);
          currentClass = currentClass.___super;
      }
      while (currentClass = chainStack.pop()) {
          if (currentClass.___mixin) {
              for (var i = 0; i < currentClass.___mixin.length; i++) {
                  Arielworks.Util.Class.__callInitializers(object, currentClass.___mixin[i]);
              }
          }
          if (currentClass.___initializer) {
              currentClass.___initializer.apply(object);
          }
      }
  },

  __mixinCall: function(num, arg) {
      var mixinClass = this.___extendingStack[0].___mixin[num]
      var ___constructor = mixinClass.prototype.___constructor;
      var tempExtendingStack = this.___extendingStack;
      this.___extendingStack = Array.apply(null, mixinClass.___extendingStack);
      Array.prototype.shift.apply(arguments)
      if (___constructor) ___constructor.apply(this, arguments);
      this.___extendingStack = tempExtendingStack;
  }
};


Arielworks.Util.argToArray = function(from) {
    var to = new Array(from.length)
    for(var i = 0; i < from.length; i ++) to[i] = from[i];
    return to;
};




var ParserClass = {
    create: function() {
        return function() {
            if (this.___constructor) {
                this.___constructor.apply(this, arguments);
            }
        }
    },

    extend: function(superClass) {
        var subClass =ParserClass.create();
        var _constructor = subClass.prototype.constructor;
        subClass.prototype =  new superClass();
        subClass.prototype.constructor = _constructor;
        subClass.prototype.___constructor = undefined;
        subClass.prototype.___super = superClass;
        subClass.___super = superClass;
        var dropList = ["prototype", "___super", "___constructor"];
        for (property in subClass) {
            dropList.push(property);
        }
        for (property in superClass) {
            var drop = false;
            for (var i = 0; i < dropList.length; i++) {
                if (dropList[i] == property) {
                    drop = true;
                    break;
                }
            }
            if (! drop) {
                subClass[property] = superClass[property];
            }
        }
        return subClass;
    }
};


Arielworks.Hercules.Rdf.RDF_NAMESPACE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
Arielworks.Hercules.Rdf.RDF_COLLECTION_FIRST = Arielworks.Hercules.Rdf.RDF_NAMESPACE + "first";
Arielworks.Hercules.Rdf.RDF_COLLECTION_REST = Arielworks.Hercules.Rdf.RDF_NAMESPACE + "rest";
Arielworks.Hercules.Rdf.RDF_COLLECTION_NIL = Arielworks.Hercules.Rdf.RDF_NAMESPACE + "nil";
Arielworks.Hercules.Rdf.RDF_TYPE = Arielworks.Hercules.Rdf.RDF_NAMESPACE + "type";



/**
 * An abstract Class for RDF Resource.
 * @abstract
 */
Arielworks.Hercules.Rdf.Resource = Arielworks.Util.Class.create();

/**
 * Constructs an instance.
 * @param value The value which is hold by the instance
 */
Arielworks.Hercules.Rdf.Resource.prototype.___constructor = function(/*string*/ value) {
    this.value = value;
};

/**
 * Sets the value of the instance.
 * @param value The value of the instance.
 */
Arielworks.Hercules.Rdf.Resource.prototype.setValue = function(/*string*/ value) {
    this.value = value;
};

/**
 * Returns the value of the instance.
 * @return The value of the instance. "undefined" will be returned when not be set.
 */
Arielworks.Hercules.Rdf.Resource.prototype.getValue = function() {
    return this.value;
};

/**
 * Returns whether the given object is equals to the instance.
 * Equality is deceided by comparing their values, not by "==" operator.
 * This method will be overrided by child classes. e.g.) PlainLiteral checks their value of LanguageTag.
 * @param to An instance compared for.
 * @return bool
 */
Arielworks.Hercules.Rdf.Resource.prototype.equals = function(/*Arielworks.Hercules.Rdf.Resource*/ to) {
    if(this instanceof Arielworks.Hercules.Sparql.BlankNode && to instanceof Arielworks.Hercules.Rdf.BlankNode) {
        return this.value == to.value;
    } else {
        return (to instanceof this.constructor && this.value == to.value);
    }
};




/**
 * A Class for the IRI Reference Resource.
 */
Arielworks.Hercules.Rdf.RdfUriRef = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);


/**
 * Constructs an instance.
 * @param uriString The uri value of the instance without any delimiters. e.g.) http://www.arielworks.net/, not <http://www.arielworks.net/>
 */
Arielworks.Hercules.Rdf.RdfUriRef.prototype.___constructor = function(/*string*/ uriString) {
    this.___super(this.constructor.normalize(uriString));
};

Arielworks.Hercules.Rdf.RdfUriRef.normalize = function(uriString) {

    var percentRegex = /(%(?!3A|2F|3F|23|5B|5D|40|21|24|26|27|28|29|2A|2B|2C|3B|3D|25)[0-9A-F]{2})+/g;
    uriString = uriString.replace(percentRegex, function() {
        return decodeURIComponent(arguments[0]);
    });
    return uriString;
};

Arielworks.Hercules.Rdf.RdfUriRef.COMPONENT_REGEX = componentsRegExp = /^([^:\/?#]+:)?(\/\/[^\/?#]*)?([^?#]*)(\?[^#]*)?(#.*)?$/;
Arielworks.Hercules.Rdf.RdfUriRef.resolveUriRef = function(baseUri, uriRef) {
    var bComp = baseUri.match(Arielworks.Hercules.Rdf.RdfUriRef.COMPONENT_REGEX);
    bComp.shift();
    var rComp = uriRef.match(Arielworks.Hercules.Rdf.RdfUriRef.COMPONENT_REGEX);
    rComp.shift();

    if (rComp[0]) {
        bComp.splice(0, 5, rComp[0], rComp[1], Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments(rComp[2]), rComp[3], rComp[4]);
    } else {
        if (! bComp || ! bComp[1]) throw "Given Base URI is not a valid Absolute URI." //@TODO
        if(rComp[1]) {
            bComp.splice(1, 4, rComp[1], Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments(rComp[2]), rComp[3], rComp[4]);
        } else if (rComp[2] == "") {
            if (rComp[3]) {
                bComp.splice(3, 2, rComp[3], rComp[4]);
            } else {
                bComp.splice(4, 1, rComp[4]);
            }
        } else if (rComp[2][0] == "/") {
            bComp.splice(2, 3, Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments(rComp[2]), rComp[3], rComp[4]);
        } else {
            bComp.splice(2, 3, Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments(Arielworks.Hercules.Rdf.RdfUriRef.__merge(bComp[2], rComp[2])), rComp[3], rComp[4]);
        }
    }

    return bComp.join("");
};

Arielworks.Hercules.Rdf.RdfUriRef.__removeDotSegments = function(path) {
    var segments = path.split("/");
    var resultStack = [];
    for (var i = 0; i < segments.length; i++) {
        if (i == 0) {
            if (segments[i] == "." || segments[i] == ".." || segments == "") resultStack.push("");
            else resultStack.push(segments[i]);
        } else if (i == segments.length - 1) {
            if (segments[i] == "..") {
                var top = resultStack.pop();
                if (top === "") resultStack.push(top);
            }

            if (segments[i] == "." || segments[i] == ".." || segments == "") resultStack.push("");
            else resultStack.push(segments[i]);
        } else {
            if (segments[i] == "." || segments[i] == "") continue;
            else if (segments[i] == "..") {
                var top = resultStack.pop();
                if (top === "") resultStack.push(top);
            }
            else resultStack.push(segments[i]);
        }
    }
    return resultStack.join("/");
};

Arielworks.Hercules.Rdf.RdfUriRef.__merge = function(base, relative) {
    base = base.substring(0, base.lastIndexOf("/"));
    return base + "/" + relative;
};


/**
 * An abstract class for the RDF literal.
 * @abstract
 */
Arielworks.Hercules.Rdf.Literal = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);





/**
 * A class for the Plain Literal.
 * The Plain Literal is the Literal without datatypes and has optionally language tags.
 */
Arielworks.Hercules.Rdf.PlainLiteral = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Literal);

/**
 * Constructs an instance
 * @param value The value of the instance.
 * @param languageTag The optional language tag for the instance. e.g.) en-US
 */
Arielworks.Hercules.Rdf.PlainLiteral.prototype.___constructor = function(/*string*/ value, /*string*/ languageTag) {
    this.languageTag = languageTag;
    this.___super(value);
};

/**
 * Sets the language tag of the instnace.
 * @param language The language tag to set. e.g.) en-US
 */
Arielworks.Hercules.Rdf.PlainLiteral.prototype.setLanguageTag = function(languageTag) {
    this.languageTag = languageTag;
};

/**
 * Returns the language tag of the instance.
 * @return The language tag of the instance. "undefined" will be returned when not be set.
 */
Arielworks.Hercules.Rdf.PlainLiteral.prototype.getLanguageTag = function () {
    return this.languageTag;
};

/**
 * Returns whether the given object is equals to the instance.
 * Equality is deceided by comparing their values and language tags, not by "==" operator.
 * Note: One of pair of literals has the language tag and the other doesn't have, the method will reuturn "false"
 * e.g.) "Hercules"@en-US is NOT equal to "Hercules"
 * see also: http://www.w3.org/TR/2004/REC-rdf-concepts-20040210/#section-Literal-Equality
 * @param to An instance compared for.
 * @return bool
 */
Arielworks.Hercules.Rdf.PlainLiteral.prototype.equals = function(to) {
    return (to instanceof this.constructor && this.value == to.value && this.languageTag == to.languageTag);
};





/**
 * A class for the Typed Literal.
 * The Typed Literal is the Literal with datatypes like xsd:integer.
 */
Arielworks.Hercules.Rdf.TypedLiteral = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Literal);

/**
 * Constructs an instance.
 * @param value the value of the instance.
 * @datatypeIri The absolute IRI of the datatype of the instance.
 */
Arielworks.Hercules.Rdf.TypedLiteral.prototype.___constructor = function(value, datatypeIri) {
    this.datatypeIri = datatypeIri;
    this.___super(value)
};

/**
 * Sets the datatype of the instnace.
 * @param datatypeIri The datatype iri to set.
 */
Arielworks.Hercules.Rdf.TypedLiteral.prototype.setDataTypeIri = function(datatypeIri) {
    this.datatypeIri = datatypeIri;
};

/**
 * Returns the datatype IRI of the instance.
 * @return The dattype IRI of the instance. "undefined" will be returned when not be set.
 */
Arielworks.Hercules.Rdf.TypedLiteral.prototype.getDataTypeIri = function () {
    return this.datatypeIri;
};

/**
 * Returns whether the given object is equals to the instance.
 * Equality is deceided by comparing their values and language tags, not by "==" operator.
 * @param to An instance compared for.
 * @return bool
 */
Arielworks.Hercules.Rdf.TypedLiteral.prototype.equals = function(to) {
    return (to instanceof this.constructor && this.value == to.value && this.datatypeIri == to.datatypeIri);
};





/**
 * A Class for the Blank Node.
 */
Arielworks.Hercules.Rdf.BlankNode = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);

/**
 * Constructs an instance.
 * @param id The id of the blank node instance to identifer.
 */
Arielworks.Hercules.Rdf.BlankNode.prototype.___constructor = function(/*string*/ id) {
    this.___super(id);
};






/**
 * A class for the Triple.
 */
Arielworks.Hercules.Rdf.Triple = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);

/**
 * Constructs an instance.
 * @param subject The subject of the triple
 * @param predicate The predicate of the triple
 * @param object The object of the triple
 */
Arielworks.Hercules.Rdf.Triple.prototype.___constructor = function(/*Arielworks.Hercules.Rdf.Resource*/ subject, /*Arielworks.Hercules.Rdf.Resource*/ predicate, /*Arielworks.Hercules.Rdf.Resource*/ object) {
    /*
    if (subject instanceof Arielworks.Hercules.Rdf.Literal) throw ""; //TODO
    if (! (predicate instanceof Arielworks.Hercules.Rdf.RdfUriRef)) throw ""; //TODO
    */

    this.subject = subject;
    this.predicate = predicate;
    this.object = object;

    this.___super();
};

/**
 * Sets the subject of the instance.
 * @param subject An instance of _RD.Resource to set
 */
Arielworks.Hercules.Rdf.Triple.prototype.setSubject = function(/*Arielworks.Hercules.Rdf.Resource*/ subject) {
     this.subject = subject;
};

/**
 * Sets the predicate of the instance.
 * @param predicate An instance of _RD.Resource to set
 */
Arielworks.Hercules.Rdf.Triple.prototype.setPredicate = function(/*Arielworks.Hercules.Rdf.Resource*/ predicate) {
    this.predicate = predicate;
};

/**
 * Sets the object of the instance.
 * @param object An instance of _RD.Resource to set
 */
Arielworks.Hercules.Rdf.Triple.prototype.setObject = function(/*Arielworks.Hercules.Rdf.Resource*/ object) {
    this.object = object;
};

/**
 * Returns the subject of the instance.
 * @return Arielworks.Hercules.Rdf.Resource The subject of the instance.
 */
Arielworks.Hercules.Rdf.Triple.prototype.getSubject = function() {
    return this.subject;
};

/**
 * Returns the predicate of the instance.
 * @return Arielworks.Hercules.Rdf.Resource The predicate of the instance.
 */

Arielworks.Hercules.Rdf.Triple.prototype.getPredicate = function() {
    return this.predicate;
};

/**
 * Returns the object of the instance.
 * @return Arielworks.Hercules.Rdf.Resource The object of the instance.
 */

Arielworks.Hercules.Rdf.Triple.prototype.getObject = function() {
    return this.object;
};

/**
 * Returns whether the given object is equals to the instance.
 * Triples are considered as same when subject, predicate and object of the triples are equal.
 * @param to An instance compared for.
 * @return bool
 */
Arielworks.Hercules.Rdf.Triple.prototype.equals = function(to) {
    return (to instanceof this.constructor) && this.subject.equals(to.subject) && this.predicate.equals(to.predicate) && this.object.equals(to.object);
}









Arielworks.Hercules.Rdf.Graph = Arielworks.Util.Class.create();

Arielworks.Hercules.Rdf.Graph.prototype.___constructor = function() {
    this.tripleList = [];
    this.triples = {};
    this.resourceCount = 0;
    this.blankNodeCount = 0;
    this.blankNodes = {};
    this.rdfUriRdfs = {};
    this.plainLiterals = {};
    this.typedLiterals = {};
};


Arielworks.Hercules.Rdf.Graph.prototype.addTriple = function(subject, predicate, object) {
    if (subject.graph != this) throw ""; //TODO
    if (predicate.graph != this) throw ""; //TODO
    if (object.graph != this) throw ""; //TODO

    var sId = subject.resourceId;
    var pId = predicate.resourceId;
    var oId = object.resourceId;
    if (! this.triples[sId]) this.triples[sId] = {};
    if (! this.triples[sId][pId]) this.triples[sId][pId] = {};
    if (! this.triples[sId][pId][oId]) this.triples[sId][pId][oId] = 0;
    if (++this.triples[sId][pId][oId] == 1) {
        this.tripleList.push(new Arielworks.Hercules.Rdf.Triple(subject, predicate, object));
    }

    return this;
};

Arielworks.Hercules.Rdf.Graph.prototype.getRdfUriRef = function(/*string*/ uri) {
    var normalized = Arielworks.Hercules.Rdf.RdfUriRefInGraph.normalize(uri);
    if (! this.rdfUriRdfs[normalized]) this.rdfUriRdfs[normalized] = new Arielworks.Hercules.Rdf.RdfUriRefInGraph(this, this.resourceCount++, uri);
    return this.rdfUriRdfs[normalized];
};

Arielworks.Hercules.Rdf.Graph.prototype.getPlainLiteral = function(/*string*/ value, languageTag) {
    if (! this.plainLiterals[value]) this.plainLiterals[value] = {};
    if (! this.plainLiterals[value][languageTag]) this.plainLiterals[value][languageTag] = new Arielworks.Hercules.Rdf.PlainLiteralInGraph(this, this.resourceCount++, value, languageTag);
    return this.plainLiterals[value][languageTag];
};

Arielworks.Hercules.Rdf.Graph.prototype.getTypedLiteral = function(/*string*/ value, datatypeIri) {
    if (! this.typedLiterals[value]) this.typedLiterals[value] = {};
    if (! this.typedLiterals[value][datatypeIri]) this.typedLiterals[value][datatypeIri] = new Arielworks.Hercules.Rdf.TypedLiteralInGraph(this, this.resourceCount++, value, datatypeIri);
    return this.typedLiterals[value][datatypeIri];
};

Arielworks.Hercules.Rdf.Graph.prototype.getBlankNode = function(/*string*/ id) {
    if (! id) {
        return new  Arielworks.Hercules.Rdf.BlankNodeInGraph(this, this.resourceCount++, this.blankNodeCount++);
    } else {
        if (! this.blankNodes[id]) this.blankNodes[id] = new Arielworks.Hercules.Rdf.BlankNodeInGraph(this, this.resourceCount++, this.blankNodeCount++);
        return this.blankNodes[id];
    }
};

Arielworks.Hercules.Rdf.Graph.prototype.clearBlankNodeId = function() {
    this.blankNodes = {};
    return this;
};



/**

 */

Arielworks.Hercules.Rdf.ResourceInGraph = Arielworks.Util.Class.create(function() {
    this.graph;
    this.resourceId;
});

Arielworks.Hercules.Rdf.ResourceInGraph.prototype.___constructor = function(graph, resourceId) {
    this.graph = graph;
    this.resourceId = resourceId;
};


Arielworks.Hercules.Rdf.ResourceInSubject = Arielworks.Util.Class.create(function() {
});

Arielworks.Hercules.Rdf.ResourceInSubject.prototype.addProperty = function(predicate, object) {
    this.graph.addTriple(this, predicate, object);
    return this;
};

Arielworks.Hercules.Rdf.ResourceInObject = Arielworks.Util.Class.create(function() {
});

Arielworks.Hercules.Rdf.ResourceInObject.prototype.addReverseProperty = function(predicate, subject) {
    this.graph.addTriple(subject, predicate, this);
    return this;
};




Arielworks.Hercules.Rdf.RdfUriRefInGraph = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.RdfUriRef, Arielworks.Hercules.Rdf.ResourceInGraph, Arielworks.Hercules.Rdf.ResourceInObject);

Arielworks.Hercules.Rdf.RdfUriRefInGraph.prototype.___constructor = function(graph, resourceId, uriString) {
    this.___super(uriString);
    this.___mixin(0, graph, resourceId);
};

Arielworks.Hercules.Rdf.PlainLiteralInGraph = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.PlainLiteral, Arielworks.Hercules.Rdf.ResourceInGraph);

Arielworks.Hercules.Rdf.PlainLiteralInGraph.prototype.___constructor = function(graph, resourceId, /*string*/ value, /*string*/ languageTag) {
    this.___super(value, languageTag);
    this.___mixin(0, graph, resourceId);
};

Arielworks.Hercules.Rdf.TypedLiteralInGraph = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.TypedLiteral, Arielworks.Hercules.Rdf.ResourceInGraph);

Arielworks.Hercules.Rdf.TypedLiteralInGraph.prototype.___constructor = function(graph, resourceId, /*string*/ value, /*string*/ datatypeIri) {
    this.___super(value, datatypeIri);
    this.___mixin(0, graph, resourceId);
};

Arielworks.Hercules.Rdf.BlankNodeInGraph = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.BlankNode, Arielworks.Hercules.Rdf.ResourceInGraph, Arielworks.Hercules.Rdf.ResourceInObject);

Arielworks.Hercules.Rdf.BlankNodeInGraph.prototype.___constructor = function(graph, resourceId, id) {
    this.___super(id);
    this.___mixin(0, graph, resourceId);
};
Arielworks.Parser.RecursiveDescentParser.Parser =ParserClass.create();

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.___constructor = function() {
    this.ruleSet;
    this.isCompiled = false;
    this.compiledRules;
    this.whiteSpaceRule = /\s*/m;

    this.initializeRuleSet();
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.addRule = function(name, expression) {
    this.ruleSet[name] = expression;
    this.isCompiled = false;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.initializeRuleSet = function() {
    this.ruleSet = {};
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.setRuleSet = function(ruleSet) {
    this.ruleSet = ruleSet;
    this.isCompiled = false;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.setWhiteSpaceRule = function(regExp) {
    this.whiteSpaceRule = regExp;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.getWhiteSpaceRule = function() {
    return this.whiteSpaceRule;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.parse = function(input, startRule, actions) {
    if (! this.isCompiled) {
        this.compileRuleSet();
    }
    var context = new Arielworks.Parser.RecursiveDescentParser.Context(this, input, actions);
    context.__skipWhiteSpace();
        var r = this.compiledRules[startRule].descend(context);
    if (context.hasRemaing()) {
        throw startRule;
    }


    return r;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.compileRuleSet = function() {
    this.compiledRules = {};
    for (var name in this.ruleSet) {
        var syntax = this.__resolveSugar(this.ruleSet[name]);
        if(typeof syntax != "function") {
            if (typeof(syntax) == "string") {
                this.compiledRules[name] = new Arielworks.Parser.RecursiveDescentParser.SequentialExpression();
                this.ruleSet[name] = [syntax];
            } else if (syntax instanceof Object) {
                this.compiledRules[name] = this.__createExpressionInstance(syntax);
            } else {
                throw "SyntaxError"
            }
            this.compiledRules[name].setName(name);
            this.compiledRules[name].setCallee(name);
        }
    }

    for (var name in this.ruleSet) {
        if(typeof this.__resolveSugar(this.ruleSet[name]) != "function") {
            this.__compileSyntax(this.ruleSet[name], this.compiledRules[name]);
        }
    }

    this.isCompiled = true;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.__compileSyntax = function(syntax, exp) {
    syntax = this.__resolveSugar(syntax);
    if (typeof(syntax) == "string") {
        return this.compiledRules[syntax];
    }

    if (! exp) {
        if (syntax instanceof Object) {
            exp = this.__createExpressionInstance(syntax);
        }
    }

    var element;
    if (syntax["Sequential"]) {
        element = new Array();
        for (var i = 0; i < syntax["Sequential"].length; i++) element.push(this.__compileSyntax(syntax["Sequential"][i]));
    } else if (syntax["Or"]) {
        element = new Array();
        for (var i = 0; i < syntax["Or"].length; i++) element.push(this.__compileSyntax(syntax["Or"][i]));
    }
    else if (syntax["OneOrNothing"]) element = this.__compileSyntax(syntax["OneOrNothing"]);
    else if (syntax["ZeroOrMore"]) element = this.__compileSyntax(syntax["ZeroOrMore"]);
    else if (syntax["OneOrMore"]) element = this.__compileSyntax(syntax["OneOrMore"]);
    else if (syntax["TerminalString"]) element = syntax["TerminalString"];
    else if (syntax["TerminalRegExp"]) element = syntax["TerminalRegExp"];
    else throw "SyntaxError";


    exp.setElement(element);

    if (syntax["callee"]) exp.setCallee(syntax["callee"]);

    return exp;
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.__createExpressionInstance = function(syntax) {
    if(typeof syntax == "function") {

    } else {
        if (syntax["Sequential"]) return new Arielworks.Parser.RecursiveDescentParser.SequentialExpression();
        else if (syntax["Or"]) return new Arielworks.Parser.RecursiveDescentParser.OrExpression();
        else if (syntax["TerminalString"]) return new Arielworks.Parser.RecursiveDescentParser.TerminalString();
        else if (syntax["TerminalRegExp"]) return new Arielworks.Parser.RecursiveDescentParser.TerminalRegExp();
        else if (syntax["OneOrNothing"]) return new Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression();
        else if (syntax["ZeroOrMore"]) return new Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression();
        else if (syntax["OneOrMore"]) return new Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression();
        else throw "SyntaxError";
    }
};

Arielworks.Parser.RecursiveDescentParser.Parser.prototype.__resolveSugar = function (syntax) {
    if (syntax instanceof Array) {
        return {Sequential: syntax};
    } else if (syntax instanceof RegExp) {
        return Arielworks.Parser.RecursiveDescentParser.Parser.$re(syntax);
    } else {
        return syntax;
    }
};


Arielworks.Parser.RecursiveDescentParser.Parser.seq = function() {
    return {Sequential: Arielworks.Util.argToArray(arguments)};
};

Arielworks.Parser.RecursiveDescentParser.Parser.or = function() {
    return {Or: Arielworks.Util.argToArray(arguments)};
};

Arielworks.Parser.RecursiveDescentParser.Parser.$ = function() {
    return {TerminalString: arguments[0]}
};

Arielworks.Parser.RecursiveDescentParser.Parser.$re = function() {
    return {TerminalRegExp: arguments[0]}
};

Arielworks.Parser.RecursiveDescentParser.Parser.n = function() {
    return {OneOrNothing: arguments.length == 1 ? arguments[0] : Arielworks.Util.argToArray(arguments)};
};

Arielworks.Parser.RecursiveDescentParser.Parser.z = function() {
    return {ZeroOrMore: arguments.length == 1 ? arguments[0] : Arielworks.Util.argToArray(arguments)};
};

Arielworks.Parser.RecursiveDescentParser.Parser.o = function() {
    return {OneOrMore: arguments.length == 1 ? arguments[0] : Arielworks.Util.argToArray(arguments)};
};



Arielworks.Parser.RecursiveDescentParser.Context =ParserClass.create();

Arielworks.Parser.RecursiveDescentParser.Context.prototype.___constructor = function(parser, input, actions) {
    this.parser = parser;
    this.actions = actions;
    this.input = input;
    this.stack = [];
    this.position = 0;
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.__skipWhiteSpace = function() {
    var s = this.input.substring(this.position).match(this.parser.getWhiteSpaceRule());
    if (s) this.position += s[0].length;
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.matchHead = function(str) {
    return this.input.substring(this.position, this.position + str.length) == str ? str : false;
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.matchRegExp = function(regExp) {
    var r = this.input.substring(this.position).match(regExp);
    if (r) {
        return r;
    } else {
        return false;
    }
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.proceed = function(length) {
    var r = this.input.substring(this.position, this.position + length);
    this.position += length;
    this.__skipWhiteSpace();
    return r;
};

Arielworks.Parser.RecursiveDescentParser.Context.prototype.hasRemaing = function() {
    return this.input.length < this.position;
}



Arielworks.Parser.RecursiveDescentParser.Expression =ParserClass.create();

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.___constructor = function(element, name, callee) {
    this.setElement(element);
    this.setCallee(callee || name);
    this.setName(name);
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.setElement = function(element) {
    this.element = element;
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.setCallee = function(callee) {
    this.callee = callee;
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.setName = function(name) {
    this.name = name;
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.descend = function(context) {
    if (this.name) context.stack.push(this);

    var preR;
    if (context.actions["_" + this.callee]) var preR = (context.actions["_" + this.callee])(context);

    if (context.actions[this.callee]) {
        var r = (context.actions[this.callee])(this.__doDescend(context), context, preR);
    } else {
        var r = this.__doDescend(context);
    }
    if (this.name) context.stack.pop(this);

    return r;
};

Arielworks.Parser.RecursiveDescentParser.Expression.prototype.lookahead = function(context) {
    var x = this.__doLookahead(context);

    return x;
};




Arielworks.Parser.RecursiveDescentParser.SequentialExpression =ParserClass.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.SequentialExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.SequentialExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.SequentialExpression.prototype.__doDescend = function(context) {
    var r = new Array(this.element.length);
    for (var i = 0; i < this.element.length; i++) {
        r[i] = this.element[i].descend(context);
    }
    return r;
};

Arielworks.Parser.RecursiveDescentParser.SequentialExpression.prototype.__doLookahead = function(context) {
    return this.element[0].lookahead(context);
};




Arielworks.Parser.RecursiveDescentParser.OrExpression =ParserClass.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.OrExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.OrExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.OrExpression.prototype.__doDescend = function(context) {
    var r = new Array(this.element.length);
    var found = false;
    for (var i = 0; i < this.element.length; i++) {
        if (this.element[i].lookahead(context)) {
            r[i] = this.element[i].descend(context);
            found = true;
            break;
        }
    }

    if (found) {
        return r;
    } else {
        debugger;
        throw "Or";
    }
};

Arielworks.Parser.RecursiveDescentParser.OrExpression.prototype.__doLookahead = function(context) {
    for (var i = 0; i < this.element.length; i++) {
        if (this.element[i].lookahead(context)) {
            return true;
        }
    }
    return false;
};




Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression =ParserClass.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression.prototype.__doDescend = function(context) {
    var r;
    if (this.element.lookahead(context)) {
        r = this.element.descend(context);
    }
    return r;
};

Arielworks.Parser.RecursiveDescentParser.OneOrNothingExpression.prototype.__doLookahead = function(context) {
    return true;
};




Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression =ParserClass.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression.prototype.__doDescend = function(context) {
    var r = [];
    while (this.element.lookahead(context)) {
        r.push(this.element.descend(context));
    }
    return r;
};

Arielworks.Parser.RecursiveDescentParser.ZeroOrMoreExpression.prototype.__doLookahead = function(context) {
    return true;
};




Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression =ParserClass.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression.prototype.__doDescend = function(context) {
    var r = [];
    if (this.element.lookahead(context)) {
        r.push(this.element.descend(context));
    } else {
        throw "OneOrMore";
    }

    while (this.element.lookahead(context)) {
        r.push(this.element.descend(context));
    }
    return r;
};

Arielworks.Parser.RecursiveDescentParser.OneOrMoreExpression.prototype.__doLookahead = function(context) {
    return this.element.lookahead(context);
};




Arielworks.Parser.RecursiveDescentParser.TerminalString =ParserClass.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.TerminalString.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.TerminalString.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.TerminalString.prototype.__doDescend = function(context) {
    var m;
    if (m = context.matchHead(this.element)) {
        r = context.proceed(m.length);
        return r;
    } else {
        throw "TerminalString";
    }
};

Arielworks.Parser.RecursiveDescentParser.TerminalString.prototype.__doLookahead = function(context) {
    return context.matchHead(this.element);
};




Arielworks.Parser.RecursiveDescentParser.TerminalRegExp =ParserClass.extend(Arielworks.Parser.RecursiveDescentParser.Expression);

Arielworks.Parser.RecursiveDescentParser.TerminalRegExp.prototype.___constructor = function() {
    Arielworks.Parser.RecursiveDescentParser.TerminalRegExp.___super.prototype.___constructor.apply(this, arguments);
};

Arielworks.Parser.RecursiveDescentParser.TerminalRegExp.prototype.__doDescend = function(context) {
    var m;
    if (m = context.matchRegExp(this.element)) {
        context.proceed(m[0].length);
        return m;
    } else {
        throw "TerminalRegExp";
    }
};

Arielworks.Parser.RecursiveDescentParser.TerminalRegExp.prototype.__doLookahead = function(context) {
    return context.matchRegExp(this.element);
};

Arielworks.Hercules.Serialized.Turtle.Parser =ParserClass.create();
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE = "http://www.w3.org/2001/XMLSchema#";
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_INTEGER = Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE + "integer";
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_DECIMAL = Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE + "decimal";
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_DOUBLE = Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE + "double";
Arielworks.Hercules.Serialized.Turtle.Parser.XSD_BOOLEAN = Arielworks.Hercules.Serialized.Turtle.Parser.XSD_NAMESPACE + "boolean";
/*
Arielworks.Hercules.Serialized.Turtle.serialize = function(graph) {
    for (var i = 0; i < graph.tripleList.length; i++) {
        var currentTriple = graph.tripleList[i]

    }
}

Arielworks.Hercules.Serialized.Turtle.serializeTerm = function(term) {
    if (term instanceof Arielworks.Hercules.Rdf.RdfUriRef) {
        return "<" + term.value.replace(">", "\\>") + ">";
    } else if (term instanceof Arielworks.Hercules.Rdf.PlainLiteral) {
        return term.value + (term.languageTag ? ""term.languageTag : "");
    } else if (term instanceof Arielworks.Hercules.Rdf.TypedLiteral) {
        return term.value + (term.languageTag ? term.languageTag : "");
    }
}
*/with(Arielworks.Parser.RecursiveDescentParser.Parser) {
    Arielworks.Hercules.Serialized.Turtle.Parser.WHITE_SPACE_RULE = /^(?:[\u0020\u0009\u000D\u000A]*|#.*?$)*/m;
    Arielworks.Hercules.Serialized.Turtle.Parser.START_RULE = "turtleDoc";
    Arielworks.Hercules.Serialized.Turtle.Parser.RULE_SET = {
        "turtleDoc" : z("statement"),
        "statement" : [or("directive", "triples"), $('.')],
        "directive" : or("prefixID", "base"),
        "prefixID" : [$('@prefix'), n("PREFIX_NAME"), $(':'), "URI_REF"],
        "base" : [$('@base'), "URI_REF"],
        "triples" : ["subject", "predicateObjectList"],
        "predicateObjectList" : ["verb", "objectList", z($(';'), "verb", "objectList"), n($(';'))],
        "objectList" : ["object", z($(','), "object")],
        "verb" : or("predicate", $('a')),
        "subject" : or("resource", "blank"),
        "predicate" : "resource",
        "object" : or("resource", "blank", "literal"),
        "literal" : or(["quotedString", n(or("LANGUAGE_TAG", [$('^^'), "resource"]))], "DOUBLE", "DECIMAL", "INTEGER", "bool"),
        "INTEGER" : /^[-+]?[0-9]+/,
        "DOUBLE" : /^[-+]?(?:[0-9]+\.[0-9]*|\.[0-9]+|[0-9]+)[eE][-+]?[0-9]+/,
        "DECIMAL" : /^[-+]?(?:[0-9]+\.[0-9]*|\.[0-9]+)/,
        "EXPONENT" : /^[eE][-+]?[0-9]+/,
        "bool" : or($('true'), $('false')),
        "blank" : or("NODE_ID", [$('['), or($(']'), ["predicateObjectList", $(']')])], "collection"),
        "itemList" : o("object"),
        "collection" : [$('('), n("itemList"), $(')')],
        "ws" : /^[\u0009\u000A\u000D\u0020]/,
        "resource" : or("URI_REF", "QNAME"),
        "NODE_ID" : /^_:([A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*)/,
        "QNAME" : /^([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*)?:([A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*)?/,
        "URI_REF" : /^<((?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u003D\u003F-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\>)*)>/,
        "LANGUAGE_TAG" : /^@([a-z]+(?:-[a-z0-9])*)/,
        "NAME_START_CHAR" : /^[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
        "NAME_CHAR" : /^[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]/,
        "NAME" : /^[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*/,
        "PREFIX_NAME" : /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD0-9\u00B7\u0300-\u036F\u203F-\u2040-]*/,
        "RELATIVE_URI" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u003D\u003F-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\>)*/,
        "quotedString" : or("LONG_STRING", "STRING"),
        "STRING" : /^"((?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u0021\u0023-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\")*)"/,
        "LONG_STRING" : /^"""((?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u005B\u005D-\uFFFF\u0009\u000A\u000D]|\\t|\\n|\\r|\\")*)"""/,
        "CHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u005B\u005D-\uFFFF])/,
        "ECHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u005B\u005D-\uFFFF]|\\t|\\n|\\r)/,
        "HEX" : /^[\u0030-\u0039\u0041-\u0046]/,
        "UCHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u003D\u003F-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\>)/,
        "SCHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u0021\u0023-\u005B\u005D-\uFFFF]|\\t|\\n|\\r|\\")/,
        "LCHARACTER" : /^(?:\\u[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\U[\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046][\u0030-\u0039\u0041-\u0046]|\\\\|[\u0020-\u005B\u005D-\uFFFF\t\n\r\u0009\u000A\u000D]|\\")/
    };
}
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0 =ParserClass.create();

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.ECHARACTER_ESCAPE_REGX = /\\([\\tnruU])([\u0030-\u0039\u0041-\u0046]{8}|[\u0030-\u0039\u0041-\u0046]{4})?/g;
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.UCHARACTER_ESCAPE_REGX = /\\([\\tnruU>])([\u0030-\u0039\u0041-\u0046]{8}|[\u0030-\u0039\u0041-\u0046]{4})?/g
Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.SCHARACTER_ESCAPE_REGX = /\\([\\tnruU"])([\u0030-\u0039\u0041-\u0046]{8}|[\u0030-\u0039\u0041-\u0046]{4})?/g //"comment to fix color hilighting of the editor

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.___constructor = function(baseUri) {
    this.graph = new Arielworks.Hercules.Rdf.Graph();
    this.nameSpace = {};
    this.defaultNameSpace = "";
    this.baseUri = Arielworks.Hercules.Rdf.RdfUriRef.normalize(baseUri);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.__registerNameSpace = function(prefix, uri) {
    if (!prefix || prefix == "") {
        this.defaultNameSpace = uri;
    } else {
        this.nameSpace[prefix] = uri;
    }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.__resolvePrefiexName = function(prefix, local) {
    if (!prefix || prefix == "") {
        return this.defaultNameSpace + local;
    } else {
        return this.nameSpace[prefix] + local;
    }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.__resolveRelativeIri = function(uri) {
    return Arielworks.Hercules.Rdf.RdfUriRef.resolveUriRef(this.baseUri, uri);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.__unescapeEcharacterCallback  = function(whole, e, hexs) {
    switch (e) {
      case "u" :
        return String.fromCharCode(parseInt(hexs, 16));
      case "U" :
        return String.fromCharCode(parseInt(hexs, 16));
      case "t" :
        return String.fromCharCode(0x0009);
      case "n" :
        return String.fromCharCode(0x000A);
      case "r" :
        return String.fromCharCode(0x000D);
      case "\"" :
        return String.fromCharCode(0x0022);
      case ">" :
        return String.fromCharCode(0x003E);
      case "\\" :
        return String.fromCharCode(0x005E);
      }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.prefixID = function(r) {
    this.__registerNameSpace(r[1], r[3]);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.base = function(r) {
    this.baseUri = r[1];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.triples = function(r) {
    for (var i = 0; i < r[1].length; i += 2) {
        for (var j = 0; j < r[1][i + 1].length; j++) {
            this.graph.addTriple(r[0], r[1][i], r[1][i + 1][j]);
        }
    }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.predicateObjectList = function(r) {
    var o = [r[0], r[1]];
    for (var i = 0; i < r[2].length; i++) {
        o.push(r[2][i][1]);
        o.push(r[2][i][2]);
    }
    return o;
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.objectList = function(r) {
    var o = [r[0]];
    for (var i = 0; i < r[1].length; i++) {
        o.push(r[1][i][1]);
    }
    return o;
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.verb = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return this.graph.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_TYPE);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.subject = function(r) {
    if(r[0]) return r[0]
    else if (r[1]) return r[1];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.predicate = function(r) {
    return r[0];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.object = function(r) {
    if(r[0]) return r[0];
    else if (r[1]) return r[1];
    else if (r[2]) return r[2];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.literal = function(r) {
    if (r[0]) {
        if (r[0][1]) {
            if(r[0][1][0]) {
                var o = this.graph.getPlainLiteral(r[0][0], r[0][1][0]);
            } else if (r[0][1][1]) {
                var o = this.graph.getTypedLiteral(r[0][0], r[0][1][1][1].getValue());
            }
        } else {
            var o = this.graph.getPlainLiteral(r[0][0]);
        }
    } else if (r[1]) {
        var o = this.graph.getTypedLiteral(r[1], Arielworks.Hercules.Serialized.Turtle.Parser.XSD_DOUBLE);
    } else if (r[2]) {
        var o = this.graph.getTypedLiteral(r[1], Arielworks.Hercules.Serialized.Turtle.Parser.XSD_DECIMAL);
    } else if (r[3]) {
        var o = this.graph.getTypedLiteral(r[1], Arielworks.Hercules.Serialized.Turtle.Parser.XSD_INTEGER);
    } else if (r[4]) {
        var o = this.graph.getTypedLiteral(r[1], Arielworks.Hercules.Serialized.Turtle.Parser.XSD_BOOLEAN);
    }
    return o;
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.INTEGER = function(r) {
    return r[0];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.DOUBLE = function(r) {
    return r[0];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.DECIMAL = function(r) {
    return r[0];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.bool = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return r[1];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.blank = function(r) {
    if (r[0]) {
        return this.graph.getBlankNode(r[0]);
    } else if (r[1]) {
        if (r[1][1][0]) {
            return this.graph.getBlankNode();
        } else if (r[1][1][1]) {
            var o = this.graph.getBlankNode();
            for (var i = 0; i < r[1][1][1][0].length; i += 2) {
                for (var j = 0; j < r[1][1][1][0][i + 1].length; j++) {
                    this.graph.addTriple(o, r[1][1][1][0][i], r[1][1][1][0][i + 1][j]);
                }
            }
            return o;
        }
    } else if (r[2]) {
        var o = this.graph.getBlankNode();
        var subject = o;
        for (var i = 0; i < r[2].length; i++) {
            this.graph.addTriple(subject, this.graph.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_COLLECTION_FIRST), r[2][i]);
            if (i < (r[2].length - 1)) {
                var object = this.graph.getBlankNode();
            } else {
                var object = this.graph.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_COLLECTION_NIL);
            }
            this.graph.addTriple(subject, this.graph.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_COLLECTION_REST), object);
            subject = object;
        }
        return o;
    }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.itemList = function(r) {
    return r;
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.collection = function(r) {
    if (r[1]) {
        return r[1];
    } else {
        return [];
    }
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.resource = function(r) {
    if (r[0]) {
        return this.graph.getRdfUriRef(this.__resolveRelativeIri(r[0]));
    } else if(r[1]) {
        return this.graph.getRdfUriRef(this.__resolvePrefiexName(r[1]["prefix"], r[1]["local"]));
    }
}


Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.NODE_ID = function(r) {
    return r[1];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.QNAME = function(r) {
    return {"prefix" : r[1], "local" : r[2]};
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.URI_REF = function(r) {
    return r[1].replace(this.constructor.UCHARACTER_ESCAPE_REGX, this.__unescapeEcharacterCallback);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.LANGUAGE_TAG = function(r) {
    return r[1];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.PREFIX_NAME = function(r) {
    return r[0];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.quotedString = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return r[1];
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.STRING = function(r) {
    return r[1].replace(this.constructor.SCHARACTER_ESCAPE_REGX, this.__unescapeEcharacterCallback);
};

Arielworks.Hercules.Serialized.Turtle.Turtle_1_0.prototype.LONG_STRING = function(r) {
    return r[1].replace(this.constructor.SCHARACTER_ESCAPE_REGX, this.__unescapeEcharacterCallback);
};
Arielworks.Hercules.Sparql.ResultSet =ParserClass.create();

Arielworks.Hercules.Sparql.ResultSet.prototype.___constructor = function(variableList) {
    this.variableList = variableList || [];
    this.length = 0;
};

/**
 * Returns an array of the variable names in the result set.
 * @return Array<string>
 */
Arielworks.Hercules.Sparql.ResultSet.prototype.getVariableList = function() {
    return this.variableList;
};

Arielworks.Hercules.Sparql.ResultSet.prototype.push = function(result) {
    this[this.length++] = result;
};



Arielworks.Hercules.Sparql.Variable = Arielworks.Util.Class.extend(Arielworks.Hercules.Rdf.Resource);
Arielworks.Hercules.Sparql.Variable.prototype.___constructor =  function(/*string*/ value) {
    this.___super(value);
};

Arielworks.Hercules.Sparql.Variable.prototype.toTableName = function() {
    return this.value;
};

Arielworks.Hercules.Sparql.BlankNode = Arielworks.Util.Class.extend(Arielworks.Hercules.Sparql.Variable);
Arielworks.Hercules.Sparql.BlankNode.prototype.___constructor =  function(/*string*/ value) {
    this.___super(value);
};

Arielworks.Hercules.Sparql.BlankNode.prototype.toTableName = function() {
    return "[" + this.value + "]";
};

Arielworks.Hercules.Sparql.VariableBindingTable =ParserClass.create();

/**
 * TODO: Temporary class
 */
Arielworks.Hercules.Sparql.VariableBindingTable.prototype.___constructor = function(cloneOriginal) {
    this.table = {};

    if (cloneOriginal) for (var name in cloneOriginal.table) if (cloneOriginal.table.hasOwnProperty(name)) {
        this.table[name] = cloneOriginal.table[name];
    }
};

Arielworks.Hercules.Sparql.VariableBindingTable.prototype.bindAndClone = function(variables) {
    var cloned = new Arielworks.Hercules.Sparql.VariableBindingTable(this);
    for (var i = 0; i < variables.length; i += 2) {
        var key = variables[i].toTableName();
        var value = variables[i + 1];
        if (cloned.table[key] && ! cloned.table[key].equals(value)) {
            return false;
        } else {
            cloned.table[key] = value;
        }
    }
    return cloned;
};



Arielworks.Hercules.Sparql.MatchingResult =ParserClass.create();

Arielworks.Hercules.Sparql.MatchingResult.prototype.___constructor = function(pattern) {
    this.pattern = pattern;
};


Arielworks.Hercules.Sparql.TripleMatchingResult =ParserClass.extend(Arielworks.Hercules.Sparql.MatchingResult);

Arielworks.Hercules.Sparql.TripleMatchingResult.prototype.___constructor = function(pattern) {
    Arielworks.Hercules.Sparql.TripleMatchingResult.___super.prototype.___constructor.apply(this, arguments);
    this.resultList = [];
    this.isSubjectVariable = this.pattern.subject instanceof Arielworks.Hercules.Sparql.Variable;
    this.isPredicateVariable = this.pattern.predicate instanceof Arielworks.Hercules.Sparql.Variable;
    this.isObjectVariable = this.pattern.object instanceof Arielworks.Hercules.Sparql.Variable;
};

Arielworks.Hercules.Sparql.TripleMatchingResult.prototype.add = function(triple) {
    this.resultList.push(triple);
};

Arielworks.Hercules.Sparql.TripleMatchingResult.prototype.bindVariableRecursive = function(matchingResultListStack, depth, position, currentVariableTable, resultVariableTableList) {
    var pattern = this.pattern;
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    var nextMatchingResult = matchingResultListStack[depth][position + 1];
    var isSubjectVariable = this.isSubjectVariable;
    var isPredicateVariable = this.isPredicateVariable;
    var isObjectVariable = this.isObjectVariable;

    for (var i = 0; i <resultListLength; i++) {
        var currentResult = resultList[i]
        var variabiles = [];

        if (isSubjectVariable) {
            variabiles.push(pattern.subject);
            variabiles.push(currentResult.subject);
        }
        if (isPredicateVariable) {
            variabiles.push(pattern.predicate);
            variabiles.push(currentResult.predicate);
        }
        if (isObjectVariable) {
            variabiles.push(pattern.object);
            variabiles.push(currentResult.object);
        }

        var newTable  = currentVariableTable.bindAndClone(variabiles);
        if (newTable != false) {
            if (nextMatchingResult) {
                nextMatchingResult.bindVariableRecursive(matchingResultList, position + 1, newTable, resultVariableTableList);
            } else {
                resultListener.report(newTable);
            }
        }
    }
};

Arielworks.Hercules.Sparql.TripleMatchingResult.prototype.bindVariableAllOpations = function(currentVariableTableList) {
    var pattern = this.pattern;
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    var isSubjectVariable = this.isSubjectVariable;
    var isPredicateVariable = this.isPredicateVariable;
    var isObjectVariable = this.isObjectVariable;

    var currentVariableTableListLength = currentVariableTableList.length;
    var resultVariableTableList = [];

    for (var i = 0; i <resultListLength; i++) {
        var currentResult = resultList[i];
        var variabiles = [];

        if (isSubjectVariable) {
            variabiles.push(pattern.subject);
            variabiles.push(currentResult.subject);
        }
        if (isPredicateVariable) {
            variabiles.push(pattern.predicate);
            variabiles.push(currentResult.predicate);
        }
        if (isObjectVariable) {
            variabiles.push(pattern.object);
            variabiles.push(currentResult.object);
        }

        for (var j = 0; j < currentVariableTableListLength; j++) {
            var newTable = currentVariableTableList[j].bindAndClone(variabiles);
            if (newTable != false) resultVariableTableList.push(newTable);
        }
    }

    return resultVariableTableList;
};


Arielworks.Hercules.Sparql.GraphMatchingResult =ParserClass.extend(Arielworks.Hercules.Sparql.MatchingResult);

Arielworks.Hercules.Sparql.GraphMatchingResult.prototype.___constructor = function(pattern) {
    Arielworks.Hercules.Sparql.GraphMatchingResult.___super.prototype.___constructor.apply(this, arguments);
    this.resultList = [];
};

Arielworks.Hercules.Sparql.GraphMatchingResult.prototype.add = function(matchingResult) {
    this.resultList.push(matchingResult);
};

Arielworks.Hercules.Sparql.GraphMatchingResult.prototype.bindVariableRecursive = function(matchingResultList, position, currentVariableTable, resultListener) {
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    var clonedTable = new Arielworks.Hercules.Sparql.VariableBindingTable(currentVariableTable);
    this.resultList[0].bindVariableRecursive(this.resultList, position, clonedTable, this);
};

Arielworks.Hercules.Sparql.GraphMatchingResult.prototype.bindVariableAllOpations = function(currentVariableTableList) {
    var resultList = this.resultList;
    var resultListLength = resultList.length;
    for (var i = 0; i< resultListLength; i++) {
        currentVariableTableList = resultList[i].bindVariableAllOpations(currentVariableTableList);
    }
    return currentVariableTableList;
};


Arielworks.Hercules.Sparql.UnionMatchingResult =ParserClass.extend(Arielworks.Hercules.Sparql.MatchingResult);
Arielworks.Hercules.Sparql.UnionMatchingResult.prototype.___constructor = function(pattern) {
    Arielworks.Hercules.Sparql.GraphMatchingResult.___super.prototype.___constructor.apply(this, arguments);
    this.resultList = [];
};

Arielworks.Hercules.Sparql.UnionMatchingResult.prototype.add = function(matchingResult) {
    this.resultList.push(matchingResult);
};

Arielworks.Hercules.Sparql.UnionMatchingResult.prototype.bindVariableAllOpations = function(currentVariableTableList) {
    var resultList = this.resultList;
    var resultListLength = resultList.length;

    var currentVariableTableListLength = currentVariableTableList.length
    var resultVariableTableList = [];
    for (var i = 0; i < resultListLength; i++) {
        resultVariableTableList = resultVariableTableList.concat(resultList[i].bindVariableAllOpations(currentVariableTableList));
    }
    return resultVariableTableList;
};





Arielworks.Hercules.Sparql.Pattern =ParserClass.create();
Arielworks.Hercules.Sparql.Pattern.prototype.___constructor = function() {
};

Arielworks.Hercules.Sparql.TriplePattern =ParserClass.extend(Arielworks.Hercules.Sparql.Pattern);
Arielworks.Hercules.Sparql.TriplePattern.prototype.___constructor = function(subject, predicate, object) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
    this.variableCount = 0;

    if (this.subject instanceof Arielworks.Hercules.Sparql.Variable) this.variableCount++;
    if (this.predicate instanceof Arielworks.Hercules.Sparql.Variable) this.variableCount++;
    if (this.object instanceof Arielworks.Hercules.Sparql.Variable) this.variableCount++;
};

Arielworks.Hercules.Sparql.TriplePattern.prototype.match = function(targetGraph) {
    var result = new Arielworks.Hercules.Sparql.TripleMatchingResult(this);

    var targetGraphLength = targetGraph.length;
    var subject = this.subject;
    var predicate = this.predicate;
    var object = this.object;
    var isNotSubjectVariable = (! (subject instanceof Arielworks.Hercules.Sparql.Variable) ||  (subject instanceof Arielworks.Hercules.Sparql.BlankNode) );
    var isNotPredicateVariable = (! (predicate instanceof Arielworks.Hercules.Sparql.Variable) ||  (subject instanceof Arielworks.Hercules.Sparql.BlankNode) );
    var isNotObjectVariable = (! (object instanceof Arielworks.Hercules.Sparql.Variable ||  (subject instanceof Arielworks.Hercules.Sparql.BlankNode) ));

    for (var i = 0;  i < targetGraphLength; i++) {
        var targetTriple = targetGraph[i];
        if (isNotSubjectVariable && ! subject.equals(targetTriple.subject)) continue;
        if (isNotPredicateVariable && ! predicate.equals(targetTriple.predicate)) continue;
        if (isNotObjectVariable && ! object.equals(targetTriple.object)) continue;
        result.add(targetTriple);
    }

    return result;
};



Arielworks.Hercules.Sparql.GraphPattern =ParserClass.extend(Arielworks.Hercules.Sparql.Pattern);

Arielworks.Hercules.Sparql.GraphPattern.prototype.___constructor = function() {
    this.patternList = [];
};

Arielworks.Hercules.Sparql.GraphPattern.prototype.addPattern = function(/*Arielworks.Hercules.Sparql.Pattern*/ pattern) {
    this.patternList.push(pattern);
};

Arielworks.Hercules.Sparql.GraphPattern.prototype.match = function(targetGraph) {
    var matchingResult = new Arielworks.Hercules.Sparql.GraphMatchingResult(this);
    for (var i = 0; i < this.patternList.length; i++) {
        matchingResult.add(this.patternList[i].match(targetGraph));
    }
    return matchingResult;
};


Arielworks.Hercules.Sparql.UnionPattern =ParserClass.extend(Arielworks.Hercules.Sparql.Pattern);
Arielworks.Hercules.Sparql.UnionPattern.prototype.___constructor = function() {
    this.patternList = [];
};

Arielworks.Hercules.Sparql.UnionPattern.prototype.addPattern = function(/*Arielworks.Hercules.Sparql.GraphPattern*/ pattern) {
    this.patternList.push(pattern);
};

Arielworks.Hercules.Sparql.UnionPattern.prototype.match = function(targetGraph) {
    var matchingResult = new Arielworks.Hercules.Sparql.UnionMatchingResult(this);
    for (var i = 0; i < this.patternList.length; i++) {
        matchingResult.add(this.patternList[i].match(targetGraph));
    }
    return matchingResult;
};



Arielworks.Hercules.Sparql.Engine =ParserClass.create();

Arielworks.Hercules.Sparql.Engine.prototype.___constructor = function(graph) {
    this.graph = graph;
    this.parser;
};

Arielworks.Hercules.Sparql.Engine.prototype.prepare = function(queryString) {
    if (! this.parser) {
        this.parser = new Arielworks.Parser.RecursiveDescentParser.Parser();
        this.parser.setRuleSet(Arielworks.Hercules.Sparql.Engine.RULE_SET);
        this.parser.setWhiteSpaceRule(Arielworks.Hercules.Sparql.Engine.WHITE_SPACE_RULE);
        this.parser.compileRuleSet();
    };

    var action = new Arielworks.Hercules.Sparql.SparqlAction_1_0(this);
    var query = this.parser.parse(queryString, Arielworks.Hercules.Sparql.Engine.START_RULE, action);
    return query;
};

Arielworks.Hercules.Sparql.Engine.prototype.getTriplePattern = function(subject, predicate, object) {
    return new Arielworks.Hercules.Sparql.TriplePattern(subject, predicate, object);
};


Arielworks.Hercules.Sparql.Query =ParserClass.create();

Arielworks.Hercules.Sparql.Query.prototype.___constructor = function(engine) {
    this.engine = engine;
    this.namespaceList = {};
};



Arielworks.Hercules.Sparql.Query.prototype.getTriplePattern = function(subject, predicate, object) {
    return this.engine.getTriplePattern(subject, predicate, object);
};

Arielworks.Hercules.Sparql.Query.prototype.getRdfUriRef = function(/*string*/ uri) {
    return new Arielworks.Hercules.Rdf.RdfUriRef(uri);
};

Arielworks.Hercules.Sparql.Query.prototype.getPlainLiteral = function(/*string*/ value, languageTag) {
    return new Arielworks.Hercules.Rdf.PlainLiteral(value, languageTag);
};

Arielworks.Hercules.Sparql.Query.prototype.getTypedLiteral = function(/*string*/ value, datatypeIri) {
    return new Arielworks.Hercules.Rdf.TypedLiteral(value, datatypeIri);
};

Arielworks.Hercules.Sparql.Query.prototype.getBlankNode = function(/*string*/ id) {
    return new Arielworks.Hercules.Sparql.BlankNode(id);
};

Arielworks.Hercules.Sparql.Query.prototype.getVariable = function(name) {
    if (! this.variableHash[name]) {
        this.variableHash[name] = new Arielworks.Hercules.Sparql.Variable(name);
        this.variableList.push(name);
    }
    return this.variableHash[name];
};



Arielworks.Hercules.Sparql.SelectQuery =ParserClass.extend(Arielworks.Hercules.Sparql.Query);

Arielworks.Hercules.Sparql.SelectQuery.prototype.___constructor = function() {
    Arielworks.Hercules.Sparql.SparqlQuery.___super.prototype.___constructor.apply(this, arguments);
    this.duplicateSolution = "DEFAULT";
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.___constructor = function() {
    Arielworks.Hercules.Sparql.SelectQuery.___super.prototype.___constructor.apply(this, arguments);
    this.variableHash = {};
    this.variableList = [];
    this.isAllVariableSelected = false;
    this.resultVariableList = [];
    this.rootPattern;
};


Arielworks.Hercules.Sparql.SelectQuery.prototype.registerResultVariable = function(variableName) {
    this.resultVariableList.push(variableName);
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.setIsAllVariableSelected = function(isAllVariableSelected) {
    this.isAllVariableSelected = isAllVariableSelected;
}

Arielworks.Hercules.Sparql.SelectQuery.prototype.addTriplePattern = function(pattern) {
    this.rootPattern.addTriplePattern(pattern);
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.setDuplicateSolution = function(name) {
    this.duplicateSolution = name;
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.setRootPattern = function(pattern) {
    this.rootPattern = pattern;
};

Arielworks.Hercules.Sparql.SelectQuery.prototype.execute = function() {


    var matchingResult = this.rootPattern.match(this.engine.graph);


/*
    matchingResultList.sort(function(a, b) {
        if (a.resultList.getLength() > b.resultList.getLength()) {
            return true;
        } else if (a.resultList.getLength() == b.resultList.getLength()) {
            if (a instanceof Arielworks.Hercules.Sparql.Variable) return true;
            else if (b instanceof Arielworks.Hercules.Sparql.Variable) return false;
            else if (a.pattern.variableCount > b.pattern.variableCount) return true;
        } else {
            return false;
        }
    });
*/
    var variableBindingTableList = matchingResult.bindVariableAllOpations([new Arielworks.Hercules.Sparql.VariableBindingTable()]);

    var variableBindingTableListLength = variableBindingTableList.length;
    var resultVariableList = this.isAllVariableSelected ? this.variableList : this.resultVariableList;
    var resultVariableListLength = resultVariableList.length;
    var resultSet = new Arielworks.Hercules.Sparql.ResultSet(resultVariableList);
    for (var i = 0; i < variableBindingTableListLength; i++) {
        var result = {};
        var currentVariableBindingTable = variableBindingTableList[i].table;
        for (var j = 0; j < resultVariableListLength; j++) {
            result[resultVariableList[j]] = currentVariableBindingTable[resultVariableList[j]];
        }
        resultSet.push(result);
    }



    return resultSet;
};
with(Arielworks.Parser.RecursiveDescentParser.Parser) {
    Arielworks.Hercules.Sparql.Engine.WHITE_SPACE_RULE = /^([\u0020\u0009\u000D\u000A]*|#.*?$)*/m;
    Arielworks.Hercules.Sparql.Engine.START_RULE = "Query";
    Arielworks.Hercules.Sparql.Engine.RULE_SET = {
        "Query": ["Prologue", or("SelectQuery", "ConstructQuery", "DescribeQuery", "AskQuery")],
        "Prologue": [n("BaseDecl"), z("PrefixDecl")],
        "BaseDecl": [$('BASE'), "IRI_REF"],
        "PrefixDecl": [$('PREFIX'), "PNAME_NS", "IRI_REF"],
        "SelectQuery": [$('SELECT'), n(or($('DISTINCT'), $('REDUCED'))), or(o("Var"), $('*')), z("DatasetClause"), "WhereClause", "SolutionModifier"],
        "ConstructQuery": [$('CONSTRUCT'), "ConstructTemplate", z("DatasetClause"), "WhereClause", "SolutionModifier"],
        "DescribeQuery": [$('DESCRIBE'), or(o("VarOrIRIref"), $('*')), z("DatasetClause"), n("WhereClause"), "SolutionModifier"],
        "AskQuery": [$('ASK'), z("DatasetClause"), "WhereClause"],
        "DatasetClause": [$('FROM'), or("DefaultGraphClause", "NamedGraphClause")],
        "DefaultGraphClause": "SourceSelector",
        "NamedGraphClause": [$('NAMED'), "SourceSelector"],
        "SourceSelector": "IRIref",
        "WhereClause": [n($('WHERE')), "GroupGraphPattern"],
        "SolutionModifier": [n("OrderClause"), n("LimitOffsetClauses")],
        "LimitOffsetClauses": or(["LimitClause", n("OffsetClause")],["OffsetClause", n("LimitClause")]),
        "OrderClause": [$('ORDER'), $('BY'), o("OrderCondition")],
        "OrderCondition": or([or($('ASC'), $('DESC')), "BrackettedExpression"], or("Constraint", "Var")),
        "LimitClause": [$('LIMIT'), "INTEGER"],
        "OffsetClause": [$('OFFSET'), "INTEGER"],
        "GroupGraphPattern": [$('{'), n("TriplesBlock"), z(or( "GraphPatternNotTriples", "Filter"), n($('.')), n("TriplesBlock")), $('}')],
        "TriplesBlock": ["TriplesSameSubject", n($('.'), n("TriplesBlock"))],
        "GraphPatternNotTriples": or("OptionalGraphPattern", "GroupOrUnionGraphPattern", "GraphGraphPattern"),
        "OptionalGraphPattern": [$('OPTIONAL'), "GroupGraphPattern"],
        "GraphGraphPattern": [$('GRAPH'), "VarOrIRIref", "GroupGraphPattern"],
        "GroupOrUnionGraphPattern": ["GroupGraphPattern", z($('UNION'), "GroupGraphPattern")],
        "Filter": [$('FILTER'), "Constraint"],
        "Constraint": or("BrackettedExpression", "BuiltInCall", "FunctionCall"),
        "FunctionCall": ["IRIref", "ArgList"],
        "ArgList": or("NIL", [$('('), "Expression", z($(','), "Expression"), $(')')]),
        "ConstructTemplate": [$('{'), n("ConstructTriples"), $('}')],
        "ConstructTriples": ["TriplesSameSubject", n($('.'), n("ConstructTriples"))],
        "TriplesSameSubject": or(["VarOrTerm", "PropertyListNotEmpty"],["TriplesNode", "PropertyList"]),
        "PropertyListNotEmpty": ["Verb", "ObjectList", z($(';'), n("Verb", "ObjectList"))],
        "PropertyList": n("PropertyListNotEmpty"),
        "ObjectList": ["Object", z($(','), "Object")],
        "Object": "GraphNode",
        "Verb": or("VarOrIRIref", $('a')),
        "TriplesNode": or("Collection", "BlankNodePropertyList"),
        "BlankNodePropertyList": [$('['), "PropertyListNotEmpty", $(']')],
        "Collection": [$('('), o("GraphNode"), $(')')],
        "GraphNode": or("VarOrTerm", "TriplesNode"),
        "VarOrTerm": or("Var", "GraphTerm"),
        "VarOrIRIref": or("Var", "IRIref"),
        "Var": or("VAR1", "VAR2"),
        "GraphTerm": or("IRIref", "RDFLiteral", "NumericLiteral", "BooleanLiteral", "BlankNode", "NIL"),
        "Expression": "ConditionalOrExpression",
        "ConditionalOrExpression": ["ConditionalAndExpression", z($('||'), "ConditionalAndExpression")],
        "ConditionalAndExpression": ["ValueLogical", z($('&&'), "ValueLogical" )],
        "ValueLogical": "RelationalExpression",
        "RelationalExpression": ["NumericExpression", n(or([$('='), "NumericExpression"], [$('!='), "NumericExpression"], [$('<'), "NumericExpression"], [$('>'), "NumericExpression"], [$('<='), "NumericExpression"], [$('>='), "NumericExpression" ]))],
        "NumericExpression": "AdditiveExpression",
        "AdditiveExpression": ["MultiplicativeExpression", z(or([$('+'), "MultiplicativeExpression"], [$('-'), "MultiplicativeExpression"], "NumericLiteralPositive", "NumericLiteralNegative"))],
        "MultiplicativeExpression": ["UnaryExpression", z(or([$('*'), "UnaryExpression"], [$('/'), "UnaryExpression"]))],
        "UnaryExpression": or([$('!'), "PrimaryExpression"], [$('+'), "PrimaryExpression"], [$('-'), "PrimaryExpression"], "PrimaryExpression"),
        "PrimaryExpression": or("BrackettedExpression", "BuiltInCall", "IRIrefOrFunction", "RDFLiteral", "NumericLiteral", "BooleanLiteral", "Var"),
        "BrackettedExpression": [$('('), "Expression", $(')')],
        "BuiltInCall": or([$('STR'), $('('), "Expression", $(')')], [$('LANG'), $('('), "Expression", $(')')], [$('LANGMATCHES'), $('('), "Expression", $(','), "Expression", $(')')], [$('DATATYPE'), $('('), "Expression", $(')')], [$('BOUND'), $('('), "Var", $(')')], [$('sameTerm'), $('('), "Expression", $(','), "Expression", $(')')], [$('isIRI'), $('('), "Expression", $(')')], [$('isURI'), $('('), "Expression", $(')')], [$('isBLANK'), $('('), "Expression", $(')')], [$('isLITERAL'), $('('), "Expression", $(')')], "RegexExpression"),
        "RegexExpression": [$('REGEX'), $('('), "Expression", $(','), "Expression", n($(','), "Expression"), $(')')],
        "IRIrefOrFunction": ["IRIref", n("ArgList")],
        "RDFLiteral": ["String", n(or("LANGTAG", [$('^^'), "IRIref"]))],
        "NumericLiteral": or("NumericLiteralUnsigned", "NumericLiteralPositive", "NumericLiteralNegative"),
        "NumericLiteralUnsigned": or("DOUBLE", "DECIMAL", "INTEGER"),
        "NumericLiteralPositive": or("DOUBLE_POSITIVE", "DECIMAL_POSITIVE", "INTEGER_POSITIVE"),
        "NumericLiteralNegative": or("DOUBLE_NEGATIVE", "DECIMAL_NEGATIVE", "INTEGER_NEGATIVE"),
        "BooleanLiteral": or($('true'), $('false')),
        "String": or("STRING_LITERAL_LONG1", "STRING_LITERAL_LONG2", "STRING_LITERAL1", "STRING_LITERAL2"),
        "IRIref": or("IRI_REF", "PrefixedName"),
        "PrefixedName": or("PNAME_LN", "PNAME_NS"),
        "BlankNode": or("BLANK_NODE_LABEL", "ANON"),
        "IRI_REF": /^<((?:[^<>"{}])*)>/,
        "PNAME_NS": /^([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?)?:/,
        "PNAME_LN": /^([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?)?:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?)/,
        "BLANK_NODE_LABEL": /^_:([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?)/,
        "VAR1": /^\?([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040]*)/,
        "VAR2": /^\$([A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040]*)/,
        "LANGTAG": /^@([a-zA-Z]+(?:-[a-zA-Z0-9]+)*)/,
        "INTEGER": /^[0-9]+/,
        "DECIMAL": /^(?:[0-9]+\.[0-9]*|\.[0-9]+)/,
        "DOUBLE": /^(?:[0-9]+\.[0-9]*[eE][+-]?[0-9]+|\.[0-9]+[eE][+-]?[0-9]+|[0-9]+[eE][+-]?[0-9]+)/,
        "INTEGER_POSITIVE": /^\+(?:[0-9]+)/,
        "DECIMAL_POSITIVE": /^\+(?:[0-9]+\.[0-9]*|\.[0-9]+)/,
        "DOUBLE_POSITIVE":  /^\+(?:[0-9]+\.[0-9]*[eE][+-]?[0-9]+|\.[0-9]+[eE][+-]?[0-9]+|[0-9]+[eE][+-]?[0-9]+)/,
        "INTEGER_NEGATIVE": /^-[0-9]+/,
        "DECIMAL_NEGATIVE": /^-(?:[0-9]+\.[0-9]*|\.[0-9]+)/,
        "DOUBLE_NEGATIVE": /^-(?:[0-9]+\.[0-9]*[eE][+-]?[0-9]+|\.[0-9]+[eE][+-]?[0-9]+|[0-9]+[eE][+-]?[0-9]+)/,
        "EXPONENT": /^[eE][+-]?[0-9]+/,
        "STRING_LITERAL1": /^'((?:[^\u0027\u005C\u000A\u000D]|\\[tbnrf\\"'])*)'/,
        "STRING_LITERAL2": /^"((?:[^\u0022\u005C\u000A\u000D]|\\[tbnrf\\"'])*)"/,
        "STRING_LITERAL_LONG1": /^'''((?:(?:'|'')?(?:[^'\\]|\\[tbnrf\\"']))*)'''/,
        "STRING_LITERAL_LONG2": /^"""((?:(?:"|"")?(?:[^"\\]|\\[tbnrf\\"']))*)"""/,
        "ECHAR":  /^\\[tbnrf\\"']/,
        "NIL": /^\([\u0020\u0009\u000D\u000A]*\)/,
        "WS": /^[\u0020\u0009\u000D\u000A]/,
        "ANON": /^\[[\u0020\u0009\u000D\u000A]*\]/,
        "PN_CHARS_BASE": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
        "PN_CHARS_U": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_]/,
        "VARNAME": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040]*/,
        "PN_CHARS": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040=]/,
        "PN_PREFIX": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?/,
        "PN_LOCAL": /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9](?:[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040.-]*[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD_0-9\u00B7\u0300-\u036F\u203F-\u2040-])?/
    };
}
Arielworks.Hercules.Sparql.SparqlAction_1_0 =ParserClass.create();

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.___constructor = function(engine) {
    this.engine = engine;
    this.query;
    this.graphStack = [];
    this.namespaceList = {};
    this.baseIri;
    this.blankNodes = {};
    this.blankNodeCount = 0;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__registerNamespace = function(prefix, uri) {
    this.namespaceList[prefix] = uri;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__resolvePrefiexName = function(prefix, local) {
    if (! this.namespaceList[prefix]) throw "Prefix " + prefix + " is not decreared.";
    return this.namespaceList[prefix] + local;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__setBaseIri = function(uri) {
    this.baseIri = uri;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__resolveIriRef = function(iri) {
    return Arielworks.Hercules.Rdf.RdfUriRef.resolveUriRef(this.baseIri, iri);
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.__getBlankNode = function(name) {
    if (! name || name == "") return this.query.getBlankNode(this.blankNodeCount++);
    if (! this.blankNodes[name]){
       this.blankNodeCount++
       this.blankNodes[name] = this.query.getBlankNode(name);
    }
    return this.blankNodes[name];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.Query = function(r) {
    for (var i = 0; i < r[1].length; i++) if (r[1][i]) return r[1][i];
}

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.BaseDecl = function(r) {
    this.__setBaseIri(r[1][1]);
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.PrefixDecl = function(r) {
    this.__registerNamespace(r[1][1], r[2][1]);
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype._SelectQuery = function(r) {
    this.query = new Arielworks.Hercules.Sparql.SelectQuery(this.engine);
};
Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.SelectQuery = function(r) {
    if (r[1]) {
        if (r[1][0]) this.query.setDuplicateSolution(r[1][0]);
        else if (r[1][1]) this.query.setDuplicateSolution(r[1][1]);
    }
    if (r[2][1]) {
        this.query.setIsAllVariableSelected(true);
    } else {
        for (var i = 0; i < r[2][0].length; i++) {
            this.query.registerResultVariable(r[2][0][i]);
        }
    }

    if (r[3]) {
    }

    this.query.setRootPattern(r[4]);

    return this.query;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.DatasetClause = function(r) {
    throw "Dataset is NOT supported.";
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.WhereClause = function (r) {
    return r[1];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype._GroupGraphPattern = function(r) {
    this.graphStack.unshift(new Arielworks.Hercules.Sparql.GraphPattern());
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GroupGraphPattern = function(r) {
    var o = this.graphStack[0];
    if (r[1]) {
        for (var i = 0; i < r[1].length; i++) o.addPattern(r[1][i]);
    }

    for (var i = 0; i < r[2].length; i++) {
        if (r[2][i][0][0]) {
            o.addPattern(r[2][i][0][0]);
        } else if (r[2][i][0][1]) {
            throw "NOT IMPLEMENTED YET"; //TODO
        }
        if (r[2][i][2]) {
            for (var j = 0; j < r[2][i][2].length; j++) o.addPattern(r[2][i][2][j]);
        }
    }
    this.graphStack.shift();
    return o;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.TriplesBlock = function(r) {
    var o = [];
    for (var i = 0; i < r[0].length; i++) o.push(r[0][i]);
    if (r[1] && r[1][1]) {
        for (var i = 0; i < r[1][1].length; i++) o.push(r[1][1][i]);
    }
    return o;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GraphPatternNotTriples = function(r) {
    if (r[0]) {
    } else if (r[1]) {
        return r[1];
    } else if (r[2]) {
        throw "GRAPH pattern is not supported";
    }

};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GroupOrUnionGraphPattern = function(r) {

    var patternList = [r[0]];
    for (var i = 0; i < r[1].length; i++) patternList.push(r[1][i][1]);

    if (patternList.length > 1) {
        var union = new Arielworks.Hercules.Sparql.UnionPattern();
        for (var i = 0; i < patternList.length; i++) {
            union.addPattern(patternList[i]);
        }
        return union;
    } else {
        return patternList[0];
    }
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.TriplesSameSubject = function(r) {
    if (r[0]) {
        var o = [];
        for (var i = 0; i < r[0][1].length; i++) {
            for (var j = 0; j < r[0][1][i][1].length; j++) {
                o.push(this.query.getTriplePattern(r[0][0], r[0][1][i][0], r[0][1][i][1][j]));
            }
        }
        return o;
    } else if (r[1]) {
        var o  = [];
        for (var i = 0; i < r[1][1].length; i++) {
            for (var j = 0; j < r[1][1][i][1].length; j++) {
                o.push(this.query.getTriplePattern(r[1][0], r[1][1][i][0], r[1][1][i][1][j]));
            }
        }
        return o;
    }
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.PropertyListNotEmpty = function(r) {
    var o = [];
    o.push([r[0], r[1]]);
    for (var i = 0; i < r[2].length; i++) {
        if(r[2][i][1]) o.push([r[2][i][1][0], r[2][i][1][1]]);
    }
    return o;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.PropertyList = function(r) {
    return r;
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.ObjectList = function(r) {
    var o = [];
    o.push(r[0]);
    for (var i = 0; i <r[1].length; i++) o.push(r[1][i][1]);
    return o;
};


Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.Object = function(r) {
    return r[0];
}


Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.TriplesNode = function(r) {
    if (r[0]) {
    } else if (r[1]) {
        var o = this.__getBlankNode();
        for (var i = 0; i < r[1].length; i++) {
            for(var j = 0; j < r[1][i][1].length; j++) {
                this.graphStack[0].addPattern(this.query.getTriplePattern(o, r[1][i][0], r[1][i][1][j]));
            }
        }
        return o;
    };
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.BlankNodePropertyList = function(r) {
    return r[1];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GraphNode = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return r[1];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.VarOrTerm = function(r) {
    if (r[0]) return this.query.getVariable(r[0]);
    else if (r[1]) return r[1];

};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.VarOrIRIref = function(r) {
    if (r[0]) return this.query.getVariable(r[0]);
    else if (r[1]) return r[1];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.Var = function(r) {
    return r[0] ? r[0][1] : r[1][1];
};




Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.Verb = function(r) {
    if (r[0]) return r[0];
    else if (r[1]) return this.query.getRdfUriRef(Arielworks.Hercules.Rdf.RDF_TYPE);
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.GraphTerm = function(r) {
    for (var i = 0; i < r.length; i++) if (r[i]) return r[i];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.RDFLiteral = function(r) {
    if (r[1]) {
        if (r[1][0]) return this.query.getPlainLiteral(r[0], r[1][0]);
        else if (r[1][1]) return Arielworks.Hercules.Rdf.TypedLiteral(r[0], r[1][1][1].getValue());
    } else {
        return this.query.getPlainLiteral(r[0]);
    }
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.String = function(r) {
    for (var i = 0; i < r.length; i++) if (r[i]) return r[i][1];
};

Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.IRIref = function(r) {
    if (r[0]) {
        return this.query.getRdfUriRef(r[0][1]);
    } else {
        if (r[1][0]) {
            return this.query.getRdfUriRef(this.__resolvePrefiexName(r[1][0][1], r[1][0][2]));
        } else if (r[1][1]) {
            return this.query.getRdfUriRef(this.__resolvePrefiexName(r[1][1][1], ""));
        } else {
        }
    }
};


Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.BlankNode = function(r) {
    if (r[0]) {
        return this.__getBlankNode(r[0][1]);
    } else if (r[1]) {
        return this.__getBlankNode();
    }
};


Arielworks.Hercules.Sparql.SparqlAction_1_0.prototype.LANGTAG = function(r) {
    return r[1];
};
OAT = {};

OAT.Loader = {featureLoaded: function() {}};

OAT.RDFData = {
	DISABLE_HTML:1,
	DISABLE_DEREFERENCE:2,
	DISABLE_BOOKMARK:4,
	DISABLE_FILTER:8
}

OAT.RDF = {
	ignoredAttributes:["about","nodeID","ID","parseType"],
	toTriples:function(xmlDoc,url) {
		var triples = [];
		var root = xmlDoc.documentElement;
		if (!root || !root.childNodes) { return triples; }
		var bnodePrefix = "_:" + Math.round(1000*Math.random()) + "_";
		var bnodeCount = 0;

		var u = url || "";
		u = u.match(/^[^#]+/);
		u = u? u[0] : "";
		var idPrefix = u + "#";

		function getAtt(obj,att) {
			if (att in obj) { return obj[att]; }
			return false;
		}

		function processNode(node,isPredicateNode) {
			/* get info about node */
			var attribs = OAT.Xml.getLocalAttributes(node);
			/* try to get description from node header */
			var subj = getAtt(attribs,"about");
			var id1 = getAtt(attribs,"nodeID");
			var id2 = getAtt(attribs,"ID");
			/* no subject in triplet */
			if (!subj) {
				/* try construct it from ids */
				if (id1) {
					subj = idPrefix+id1;
				} else if (id2) {
					subj = idPrefix+id2;
				} else {
					/* create anonymous subject */
					subj = bnodePrefix+bnodeCount;
					bnodeCount++;
				}
			}
			/* now we have a subject */

			/* handle literals ? */
			if (OAT.Xml.localName(node) != "Description" && !isPredicateNode) { /* add 'type' where needed */
				var pred = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
				var obj = node.namespaceURI + OAT.Xml.localName(node);
				triples.push([subj,pred,obj,0]); /* 0 - literal, 1 - reference */
			}

			/* for each of our own attributes, push a reference triplet into the graph */
			for (var i=0;i<node.attributes.length;i++) {
				var a = node.attributes[i];
				var local = OAT.Xml.localName(a);
			    if (OAT.RDF.ignoredAttributes.find(function(attr){ return attr == local}) == undefined ) {
					var pred = a.namespaceURI+OAT.Xml.localName(a);
					var obj = a.nodeValue;
					triples.push([subj,pred,obj,1]);
			    }
			} /* for all attributes */

			/* for each of our children create triplets based on their type */
			for (var i=0;i<node.childNodes.length;i++) if (node.childNodes[i].nodeType == 1) {
				var n = node.childNodes[i];
				var nattribs = OAT.Xml.getLocalAttributes(n);
				var pred = n.namespaceURI+OAT.Xml.localName(n);
				if (getAtt(nattribs,"resource") != "") { /* link via id */
					var obj = getAtt(nattribs,"resource");
					if (obj[0] == "#") { obj = idPrefix + obj.substring(1); }
					triples.push([subj,pred,obj,1]);
				} else if (getAtt(nattribs,"nodeID") != "") { /* link via id */
					/* recurse */
					var obj = processNode(n,true);
					triples.push([subj,pred,obj,1]);
				} else if (getAtt(nattribs,"ID") != "") { /* link via id */
					/* recurse */
					var obj = processNode(n,true);
					triples.push([subj,pred,obj,1]);
				} else {
					var children = [];
					for (var j=0;j<n.childNodes.length;j++) if (n.childNodes[j].nodeType == 1) {
						children.push(n.childNodes[j]);
					}
					/* now what those children mean: */
					if (children.length == 0) { /* no children nodes - take text content */
						var obj = OAT.Xml.textValue(n);
						triples.push([subj,pred,obj,0]);
					} else if (children.length == 1) { /* one child - it is a standalone subject */
						var obj = processNode(children[0]);
						triples.push([subj,pred,obj,1]);
					} else if (getAtt(nattribs,"parseType") == "Collection") { /* multiple children - each is a standalone node */
						for (var j=0;j<children.length;j++) {
							var obj = processNode(children[j]);
							triples.push([subj,pred,obj,1]);
						}
					} else { /* multiple children - each is a pred-obj pair */
						var obj = processNode(n,true);
						triples.push([subj,pred,obj,1]);
					} /* multiple children */
				}
			} /* for all subnodes */
			return subj;
		} /* process node */

		for (var i=0;i<root.childNodes.length;i++) {
			var node = root.childNodes[i];
			if (node.nodeType == 1) { processNode(node); }
		}
		return triples;
	}
} /* OAT.RDF */
OAT.Loader.featureLoaded("rdf");

OAT.Browser = {
    isIE:function() {
        return (window.attachEvent && navigator.userAgent.indexOf('Opera') === -1);
    }
};

OAT.Xml = {
	textValue:function(elem) {
		/*
			gecko: textContent
			ie: text
			safari: .nodeValue of first child
		*/
		if (!elem) { return; }
		if (document.implementation && document.implementation.createDocument) {
			var result = elem.textContent;
			/* safari hack */
			if (typeof(result) == "undefined") {
				result = elem.firstChild;
				return (result ? result.nodeValue : "");
			}
			return result;
		} else if (window.ActiveXObject) {
			return elem.text;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
	},

	localName:function(elem) {
		if (!elem) { return; }
	        if (OAT.Browser.isIE()) {
			return elem.baseName;
		} else {
			return elem.localName;
		}
	},

	createXmlDoc:function(string) {
		if (document.implementation && document.implementation.createDocument) {
			if (!string) { return document.implementation.createDocument("","",null); }
			var parser = new DOMParser();
			try {
				var xml = parser.parseFromString(string, "text/xml");
			} catch(e) {
				alert('XML parsing error. Either the XML file is not well-formed or your browser sucks.');
			}
			return xml;
		} else if (window.ActiveXObject) {
			var xml = new ActiveXObject("Microsoft.XMLDOM");
			if (!string) { return xml; }
			xml.loadXML(string);
			if (xml.parseError.errorCode) {
				alert('IE XML ERROR: '+xml.parseError.reason+' ('+xml.parseError.errorCode+')');
				return false;
			}
			return xml;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
		return false;
	},

	newXmlDoc:function() {
		if (document.implementation && document.implementation.createDocument) {
			var xml = document.implementation.createDocument("","",null);
			return xml;
		} else if (window.ActiveXObject) {
			var xml = new ActiveXObject("Microsoft.XMLDOM")
			return xml;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
		return false;
	},

	serializeXmlDoc:function(xmlDoc) {
		if (document.implementation && document.implementation.createDocument) {
			var ser = new XMLSerializer();
			var s = ser.serializeToString(xmlDoc);
			return s;
		} else if (window.ActiveXObject) {
			var s = xmlDoc.xml;
			return s;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
		return false;
	},

	transformXSLT:function(xmlDoc,xslDoc,paramsArray) {
		if (document.implementation && document.implementation.createDocument) {
			var xslProc = new XSLTProcessor();
			if (paramsArray) for (var i=0;i<paramsArray.length;i++) {
				var param = paramsArray[i];
				xslProc.setParameter(param[0],param[1],param[2]);
			}
			xslProc.importStylesheet(xslDoc);
			var result = xslProc.transformToDocument(xmlDoc);
			return result;
		} else if (window.ActiveXObject) {
			/* new solution with parameters */
			var freeXslDoc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
			freeXslDoc.load(xslDoc);
			var template = new ActiveXObject("MSXML2.XSLTemplate");
			template.stylesheet = freeXslDoc;
			var proc = template.createProcessor();
			proc.input = xmlDoc;
			if (paramsArray) for (var i=0;i<paramsArray.length;i++) {
				var param = paramsArray[i];
				proc.addParameter(param[1],param[2]);
			}
			proc.transform();
			var result = proc.output;
			var rDoc = OAT.Xml.createXmlDoc(result);
			return rDoc;
		} else {
			alert("Ooops - no XSL parser available");
			return false;
		}
	},

	getElementsByLocalName:function(elem,tagName) {
		var result = [];
		var elems = elem;
		if (!elem) { return result; }
		if (!(elems instanceof Array)) { elems = [elem]; }
		for (var i=0;i<elems.length;i++) {
			var all = elems[i].getElementsByTagName("*");
			for (var j=0;j<all.length;j++)
				if (all[j].localName == tagName || all[j].baseName == tagName) { result.push(all[j]); }
		}
		return result;
	},

	childElements:function(elem) {
		var result = [];
		if (!elem) { return result; }
		var all = elem.getElementsByTagName("*");
		for (var i=0;i<all.length;i++) {
			if (all[i].parentNode == elem) { result.push(all[i]); }
		}
		return result;
	},

	getLocalAttribute:function(elm,localName) {
		var all = elm.attributes;
		for (var i=0;i<elm.attributes.length;i++) {
			if (elm.attributes[i].localName == localName || elm.attributes[i].baseName == localName) { return elm.attributes[i].nodeValue; }
		}
		return false;
	},

	getLocalAttributes:function(elm) {
		var obj = {};
		if(!elm) { return obj; }
		for (var i=0;i<elm.attributes.length;i++) {
			var att = elm.attributes[i];
			var ln = att.localName;
			var key = ln ? ln : att.baseName;
			obj[key] = att.nodeValue;
		}
		return obj;
	},

	xpath:function(xmlDoc,xpath,nsObject) {
		var result = [];
		function resolver(prefix) {
			var b = " ";
			if (prefix in nsObject) { return nsObject[prefix]; }
			if (b in nsObject) { return nsObject[" "]; } /* default ns */
			return ""; /* fallback; should not happen */
		}
		if (document.evaluate) {
			var it = xmlDoc.evaluate(xpath,xmlDoc,resolver,XPathResult.ANY_TYPE,null);
			var node;
			while ((node = it.iterateNext())) {	result.push(node); }
			return result;
		} else if (window.ActiveXObject) {
			var tmp = xmlDoc.selectNodes(xpath);
			for (var i=0;i<tmp.length;i++) { result.push(tmp[i]); }
			return result;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
	},

	removeDefaultNamespace:function(xmlText) {
		var xml = xmlText.replace(/xmlns="[^"]*"/g,"");
		return xml;
	}/*,

	escape:OAT.Dom.toSafeXML,
	unescape:OAT.Dom.fromSafeXML*/
}
GRDDL_initializers = {};

RDFA = new Object();

if (typeof(__RDFA_BASE) == 'undefined')
   __RDFA_BASE = 'http://www.w3.org/2001/sw/BestPractices/HTML/rdfa-bookmarklet/';

var __RDFA_VERSION_SUBDIR = '2006-10-08/';



XH = new Object();

XH.getNodeAttributeValue = function(element, attr) {
    if (!element)
        return null;

    if (element.getAttribute) {
        if (element.getAttribute(attr))
            return(element.getAttribute(attr));
    }

    if (!element.attributes)
        return null;

	if (!element.attributes[attr])
		return null;

	return element.attributes[attr].value;
};

XH.setNodeAttributeValue = function(element, attr, value) {
    if (!element)
        return;

    if (element.setAttribute) {
        element.setAttribute(attr,value);
        return;
    }

    if (!element.attributes)
        element.attributes = new Object();

    element.attributes[attr] = new Object();
    element.attributes[attr].value = value;
};

XH.get_special_subject = function(element) {
	if (XH.getNodeAttributeValue(element,'about'))
		return XH.getNodeAttributeValue(element,'about');

    if (element.name == 'head')
        return ""

	if (XH.getNodeAttributeValue(element,'id'))
		return "#" + XH.getNodeAttributeValue(element,'id');

  if (typeof(XH.bnode_counter) == 'undefined')
    XH.bnode_counter = 0;

  XH.bnode_counter++;
  return '[_:' + element.nodeName + XH.bnode_counter + ']';
};


XH.SPECIAL_RELS_ARR = ['next','prev','home'];

XH.SPECIAL_RELS = new Object();
for (var i=0; i<XH.SPECIAL_RELS_ARR.length; i++) {
  XH.SPECIAL_RELS[XH.SPECIAL_RELS_ARR[i]] = true;
}

XH.RDF_PREFIX = 'rdf';
XH.RDF_URI = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

XH.XHTML_PREFIX = 'xhtml';
XH.XHTML_URI = 'http://www.w3.org/1999/xhtml';

XH.transform = function(element) {
    var children = element.childNodes;
    for (var i=0; i < children.length; i++) {
	    XH.transform(children[i]);
    }

    if (typeof(element.className) != 'undefined' && element.className != '') {
      var classes = element.className.split(' ');

      for (var i=0; i<classes.length; i++) {
        var link_el = document.createElement('link');
        link_el.rel= 'rdf:type';
        link_el.href= '[' + classes[i] + ']'
        element.appendChild(link_el);
      }
    }

    if (typeof(element.rel) != 'undefined' && element.rel != '') {
      var rels = element.rel.split(' ');

      var new_rels=[];
      for (var i=0; i<rels.length; i++) {
        var the_rel = rels[i];
        if (XH.SPECIAL_RELS[the_rel]) {
          the_rel = XH.XHTML_PREFIX + ':' + the_rel;
        }
        new_rels[new_rels.length] = the_rel;
      }

      element.setAttribute('rel',new_rels.join(" "));
    }

    return;

    if (element.nodeName == 'UL' || element.nodeName == 'OL') {
      var link_el = document.createElement('link');
      XH.setNodeAttributeValue(link_el, 'rel', 'rdf:type');
      XH.setNodeAttributeValue(link_el, 'href', 'rdf:Bag');
      element.appendChild(link_el);

      var li_els = element.getElementsByTagName('li');
      for (var i=0; i<li_els.length; i++) {
        var new_rel = "rdf:_" + (i+1);
        var existing_rel = XH.getNodeAttributeValue(li_els[i],'rel');
        if (existing_rel) {
          new_rel = existing_rel + ' ' + new_rel;
        }
        XH.setNodeAttributeValue(li_els[i],'rel',new_rel);
      }
    }
};

XH.initForDoc = function(doc) {
    XH.transform(doc.body)
    XH.transform(doc.getElementsByTagName('head')[0])
    doc.body.setAttribute('xmlns:' + XH.RDF_PREFIX, XH.RDF_URI);
    doc.body.setAttribute('xmlns:' + XH.XHTML_PREFIX, XH.XHTML_URI);
    doc.getElementsByTagName('head')[0].setAttribute('xmlns:' + XH.RDF_PREFIX, XH.RDF_URI);
    doc.getElementsByTagName('head')[0].setAttribute('xmlns:' + XH.XHTML_PREFIX, XH.XHTML_URI);
    RDFA.GRDDL.DONE_LOADING(__RDFA_BASE + __RDFA_VERSION_SUBDIR + 'xhtml1-hgrddl.js');
}

GRDDL_initializers[__RDFA_BASE + __RDFA_VERSION_SUBDIR + 'xhtml1-hgrddl.js'] = XH.initForDoc;

/**
 *	RDF/A in Javascript
 *	Ben Adida - ben@mit.edu
 *  Nathan Yergler - nathan@creativecommons.org
 *
 *	licensed under GPL v2
 */



RDFA.triples = new Array();
RDFA.bnode_counter = 0;

if (!RDFA.CALLBACK_NEW_TRIPLE_WITH_URI_OBJECT)
    RDFA.CALLBACK_NEW_TRIPLE_WITH_URI_OBJECT = function(foo,bar) {};

if (!RDFA.CALLBACK_NEW_TRIPLE_WITH_LITERAL_OBJECT)
    RDFA.CALLBACK_NEW_TRIPLE_WITH_LITERAL_OBJECT = function(foo,bar) {};

if (!RDFA.CALLBACK_NEW_TRIPLE_WITH_SUBJECT)
    RDFA.CALLBACK_NEW_TRIPLE_WITH_SUBJECT = function(foo,bar) {};

Array.prototype.add = function(name,value) {
    this.push(value);
    this[name] = value;

    if (!this.names) {
        this.names = new Array();
    }

    this.names.push(name);
};

Array.prototype.copy = function() {
    var the_copy = new Array();

    if (this.names) {
        for (var i=0; i < this.names.length; i++) {
            the_copy.add(this.names[i],this[this.names[i]]);
        }
    }

    return the_copy;
};


RDFA.Namespace = function(prefix, uri) {
    this.prefix = prefix;
    this.uri = uri;
};

RDFA.Namespace.prototype.equals = function(other) {
    return (this.uri == other.uri);
};

RDFA.CURIE = function(ns,suffix) {
    this.ns = ns;
    this.suffix = suffix;
};

RDFA.CURIE.VALID_END_CHARS = new Array('/','#');

RDFA.CURIE.prototype.pretty = function() {
    return (this.ns? this.ns.prefix:'?') + ':' + this.suffix;
};

RDFA.CURIE.prototype.uri = function() {
  if (!this.ns) return '';

  if (this.ns.uri[this.ns.uri.length - 1] in RDFA.CURIE.VALID_END_CHARS) {
   	return this.ns.uri + this.suffix;
  } else {
   	return this.ns.uri + "#" + this.suffix;
  }
};

RDFA.CURIE.prototype.equals = function(other) {
    return (this.ns.equals(other.ns) && (this.suffix == other.suffix));
};

RDFA.CURIE.parse = function(str, namespaces) {
    var position = str.indexOf(':');

    var prefix = str.substring(0,position);
    var suffix = str.substring(position+1);

    var curie = new RDFA.CURIE(namespaces[prefix],suffix);
    return curie;
};

RDFA.CURIE.prettyCURIEorURI = function(str) {
    if (str[0] == '[')
        return str.substring(1,str.length - 1);
    else
        return '<' + str + '>';
}

RDFA.CURIE.prettyCURIEorURIinHTML = function(str) {
    if (str[0] == '[')
        return str.substring(1,str.length - 1);
    else
        return '&lt;' + str + '&gt;';
}

RDFA.Triple = function() {
    this.subject = '';
    this.predicate = '';
    this.object = '';
    this.object_literal_p = null;
};

RDFA.Triple.prototype.setLiteral= function(is_literal) {
    this.object_literal_p = is_literal;
};

RDFA.Triple.prototype.pretty = function() {

    var pretty_string = RDFA.CURIE.prettyCURIEorURI(this.subject) + ' ';

    pretty_string += this.predicate.pretty() + ' ';

    if (this.object_literal_p) {
        pretty_string+= '"'+ this.object + '"';
    } else {
        pretty_string+= RDFA.CURIE.prettyCURIEorURI(this.object);
    }

    return pretty_string;
};

RDFA.Triple.prototype.prettyhtml = function() {
    var pretty_subject = this.subject;

    var pretty_string= RDFA.CURIE.prettyCURIEorURIinHTML(this.subject) + ' <a href="' + this.predicate.uri() + '">' + this.predicate.pretty() + '</a> ';

    if (this.object_literal_p) {
        pretty_string+= '"'+ this.object + '"';
    } else {
        pretty_string+= RDFA.CURIE.prettyCURIEorURIinHTML(this.object);
    }

    return pretty_string;
};


RDFA.getNodeAttributeValue = function(element, attr) {
    if (!element)
        return null;

    if (element.getAttribute) {
        if (element.getAttribute(attr))
            return(element.getAttribute(attr));
    }

    if (!element.attributes)
        return null;

	if (!element.attributes[attr])
		return null;

	return element.attributes[attr].value;
};

RDFA.setNodeAttributeValue = function(element, attr, value) {
    if (!element)
        return;

    if (element.setAttribute) {
        element.setAttribute(attr,value);
        return;
    }

    if (!element.attributes)
        element.attributes = new Object();

    element.attributes[attr] = new Object();
    element.attributes[attr].value = value;
};


RDFA.GRDDL = new Object();

RDFA.GRDDL.CALLBACKS = new Array();

RDFA.GRDDL.DONE_LOADING = function(url) {
    RDFA.GRDDL.CALLBACKS[url]();
};

RDFA.GRDDL.load = function(url, callback,parsed_document)
{

    RDFA.GRDDL.CALLBACKS[url] = callback;

    GRDDL_initializers[url](parsed_document);

};


RDFA.GRDDL._profiles = new Array();

RDFA.GRDDL.addProfile = function(js_url) {
    RDFA.GRDDL._profiles[RDFA.GRDDL._profiles.length] = js_url;
};

RDFA.GRDDL.runProfiles = function(callback,parsedDoc) {
    if (RDFA.GRDDL._profiles.length == 0) {
      callback();
      return;
    }

    var next_profile = RDFA.GRDDL._profiles.shift();

    if (!next_profile) {
        callback();
        return;
    }

    RDFA.GRDDL.load(next_profile, function() {
        RDFA.GRDDL.runProfiles(callback,parsedDoc);
    },parsedDoc);
}



RDFA.add_triple = function (subject, predicate, object, literal_p) {
    var triple = new RDFA.Triple();
    triple.subject = subject;
    triple.predicate = predicate;
    triple.object = object;
    triple.setLiteral(literal_p);

    if (!RDFA.triples[triple.subject]) {
        RDFA.triples.add(triple.subject, new Array());
    }

    var predicate_uri = triple.predicate.uri();

    if (!RDFA.triples[triple.subject][predicate_uri]) {
        RDFA.triples[triple.subject][predicate_uri] = new Array();
    }

    var the_array = RDFA.triples[triple.subject][predicate_uri];
    the_array.push(triple);

	return triple;
};

RDFA.get_special_subject = function(element) {
	if (RDFA.getNodeAttributeValue(element,'about'))
		return RDFA.getNodeAttributeValue(element,'about');

    if (element.name == 'head')
        return ""

	if (RDFA.getNodeAttributeValue(element,'id'))
		return "#" + RDFA.getNodeAttributeValue(element,'id');

	if (!element.special_subject) {
		element.special_subject = '[_:' + element.nodeName + RDFA.bnode_counter + ']';
		RDFA.bnode_counter++;
	}

	return element.special_subject
};

RDFA.add_namespaces = function(element, namespaces) {
    var copied_yet = 0;

    var attributes = element.attributes;

    if (!attributes)
        return namespaces;

    for (var i=0; i<attributes.length; i++) {
        if (attributes[i].name.substring(0,5) == "xmlns") {
            if (!copied_yet) {
                namespaces = namespaces.copy();
                copied_yet = 1;
            }

            if (attributes[i].name.length == 5) {
                namespaces.add('',new RDFA.Namespace('',attributes[i].value));
            }

            if (attributes[i].name[5] != ':')
                continue;

            var prefix = attributes[i].name.substring(6);
            var uri = attributes[i].value;

            namespaces.add(prefix, new RDFA.Namespace(prefix,uri));
        }
    }

    return namespaces;
};

RDFA.traverse = function (element, inherited_about, explicit_about, namespaces) {

    namespaces = RDFA.add_namespaces(element,namespaces);

    var current_about = inherited_about;
    var children_about = null;
    var element_to_callback = element;

    var new_explicit_about = null;
    if (RDFA.getNodeAttributeValue(element,'about')) {
        new_explicit_about = RDFA.getNodeAttributeValue(element,'about');
        current_about = new_explicit_about;
    }

    var el_object = null;
    if (RDFA.getNodeAttributeValue(element,'href'))
      el_object = RDFA.getNodeAttributeValue(element,'href');
    if (RDFA.getNodeAttributeValue(element,'src'))
      el_object = RDFA.getNodeAttributeValue(element,'src');

    if (element.nodeName == 'link' || element.nodeName == 'meta') {
      current_about = RDFA.get_special_subject(element.parentNode);
      element_to_callback = element.parentNode;
    }

    if (RDFA.getNodeAttributeValue(element,'rel')) {
      if (!el_object) {
        el_object = RDFA.get_special_subject(element);
        children_about = el_object;
      }

      var triple = RDFA.add_triple(current_about, RDFA.CURIE.parse(RDFA.getNodeAttributeValue(element,'rel'),namespaces), el_object, 0);
      RDFA.CALLBACK_NEW_TRIPLE_WITH_URI_OBJECT(element_to_callback, triple);
    }

    if (RDFA.getNodeAttributeValue(element,'rev')) {
      if (!el_object) {
        el_object = RDFA.get_special_subject(element);
        children_about = el_object;
      }

      var triple = RDFA.add_triple(el_object, RDFA.CURIE.parse(RDFA.getNodeAttributeValue(element,'rev'),namespaces), current_about, 0);
      RDFA.CALLBACK_NEW_TRIPLE_WITH_URI_OBJECT(element_to_callback, triple);
    }

    if (RDFA.getNodeAttributeValue(element,'property')) {
        var content = RDFA.getNodeAttributeValue(element,'content');

        if (!content)
            content = element.textContent;

        var triple = RDFA.add_triple(current_about, RDFA.CURIE.parse(RDFA.getNodeAttributeValue(element,'property'),namespaces), content, 1);
        RDFA.CALLBACK_NEW_TRIPLE_WITH_LITERAL_OBJECT(element_to_callback, triple);
    }

    if (children_about) {
      new_explicit_about = children_about;
      current_about = children_about;
    }

    var children = element.childNodes;
    for (var i=0; i < children.length; i++) {
	    RDFA.traverse(children[i], current_about, new_explicit_about, namespaces);
    }
};

RDFA.getTriples = function(subject, predicate) {
    if (!RDFA.triples[subject])
        return null;

    return RDFA.triples[subject][predicate.uri()];
};

RDFA.parse = function(parse_document,parse_base) {
    parse_document = parse_document || document;

    var current_base = parse_base;
    var default_ns = new RDFA.Namespace('',current_base);
    var namespaces = new Array();

    namespaces.add('',default_ns);

    RDFA.GRDDL.addProfile(__RDFA_BASE + __RDFA_VERSION_SUBDIR + 'xhtml1-hgrddl.js');




    RDFA.GRDDL.runProfiles(function() {
        RDFA.traverse(parse_document, '', null, namespaces);

        RDFA.CALLBACK_DONE_PARSING();
    },parse_document);
};

RDFA.log = function(str) {
    alert(str);
};

RDFA.reset = function() {
   RDFA.triples = new Array();
}


/**
 * The RDFa Javascript template.
 *
 * Ben Adida - ben@mit.edu
 * 2006-03-21
 * 2006-05-22 moved to W3C
 *
 * licensed under GPL v2
 */

RDFA.url = __RDFA_BASE + __RDFA_VERSION_SUBDIR + 'rdfa.js';

RDFA.N3_GRAPH = new Siesta.Framework.Graph();

N3_ADD = function(el,triple) {
    var subj = RDFA.__parseReference(triple.subject);
    var pred = RDFA.__parseReference(triple.predicate);
    var obj = null;
    if(triple.object_literal_p == null) {
        obj = new Siesta.Framework.Uri(triple.object)
    } else {
        /*
        var obj_lit = triple.object_literal_p
        if (obj_lit.indexOf('^^') != -1) {

        } else {

        }
        */
        obj = new Siesta.Framework.Literal({value: triple.object});
    }
    var triple = new Siesta.Framework.Triple(subj,pred,obj);
    RDFA.N3_GRAPH.addTriple(triple);
}

RDFA.CALLBACK_NEW_TRIPLE_WITH_LITERAL_OBJECT = function(el, triple) {
	N3_ADD(el,triple);
}

RDFA.CALLBACK_NEW_TRIPLE_WITH_URI_OBJECT = function(el, triple) {
	N3_ADD(el,triple);
}

RDFA.CALLBACK_NEW_TRIPLE_WITH_SUBJECT = function(el, triple) {
	N3_ADD(el,triple);
}










/*
*/


/**
 *  Parses a Hercules reference into a Siesta reference
 *
 *  @arguments:
 *  - reference: some kind of Hercules reference
 *
 *  @returns:
 *  - the equivalente Siesta.Framework reference
 */
RDFA.__parseReference = function(reference) {
    if(typeof reference == 'string') {
        if(reference.indexOf('_:') == -1) {
            return new Siesta.Framework.Uri(reference);
        } else {
            var bnodeId = reference.split(':')[1].split(']')[0]
            return new Siesta.Framework.BlankNode(bnodeId);
        }
    } else {
        return new Siesta.Framework.Uri(reference.uri());
    }
    /*
    } else if(reference instanceof Arielworks.Hercules.Rdf.TypedLiteral.prototype.constructor) {

        return new Siesta.Framework.Literal({value: reference.value,
                                             type: new Siesta.Framework.Uri(reference.datatypeIri)});

    } else if(reference instanceof Arielworks.Hercules.Rdf.PlainLiteral.prototype.constructor) {

        return new Siesta.Framework.Literal({value: reference.value,
                                             language:  reference.languageTag});

    } else if(reference instanceof Arielworks.Hercules.Rdf.BlankNode.prototype.constructor) {
        return new Siesta.Framework.BlankNode(reference.value);

    } else {
        throw "Parsing Hercules unknown reference";
    }
*/
};
Siesta.registerNamespace("Siesta","Drivers","Hercules","Sparql");

/**
 *  Queries a Siesta.Framework.Graph of triples with a certain
 *  SPARQL query passed as a reference.
 *
 *  @arguments:
 *  - graph: a Siesta.Framework.Graph containing Siesta.Framework.Triples.
 *  - sparqlQuery: a string containing a SPARQL query.
 *
 *  @returns:
 *  - A set of result bindings containing Siesta.Framework references.
 */
Siesta.Drivers.Hercules.Sparql.query = function (/* Siesta.Framework.Graph */ graph,
                                                 /* String */ sparqlQuery) {

    var hg = new Arielworks.Hercules.Rdf.Graph();

    var ts = graph.triplesArray();

    for(var i=0; i<ts.length; i++) {
        var t = ts[i];
        hg.addTriple(Siesta.Drivers.Hercules.__parseSiestaReference(hg,t.subject,graph),
                     Siesta.Drivers.Hercules.__parseSiestaReference(hg,t.predicate,graph),
                     Siesta.Drivers.Hercules.__parseSiestaReference(hg,t.object,graph));
    }

    var engine = new Arielworks.Hercules.Sparql.Engine(hg.tripleList);
    var query = engine.prepare(sparqlQuery);
    var results = query.execute();
    var resultVariables = results.getVariableList();

    var toReturn = [];

    for(var i=0; i< results.length; i++) {
        var result  = results[i];
        var toAdd = {}
        for(j=0; j<resultVariables.length; j++) {
            toAdd[resultVariables[j]] = Siesta.Drivers.Hercules.__parseReference(results[i][resultVariables[j]]);
        }
        toReturn.push(toAdd);
    }

    return toReturn;
};


/**
 *  Transforms a Siesta.Framework object into its Hercules equivalent.
 *
 *  @arguments:
 *  - graph: a Hercules graph where the built reference will be inserted.
 *  - reference: a Siesta reference.
 *
 *  @returns:
 *  - a Hercules equivalent reference.
 *
 *  @throws:
 *  - an exception if the reference passed is of unknown type.
 */
Siesta.Drivers.Hercules.__parseSiestaReference = function(/* Arielworks.Hercules.Graph */ graph,
                                                          /* Siesta.Framework.* */ reference,
                                                          /* Siesta.Framework.Graph */ siestaGraph) {
    if(reference.__type == 'uri') {
        return graph.getRdfUriRef(siestaGraph.__normalizeUri(reference));
    } else if(reference.__type == 'literal') {
        if(reference.type != null) {
            return graph.getTypedLiteral(reference.value,
                                         siestaGraph.__normalizeUri(reference.type));
        } else if(reference.language != null) {
            return graph.getPlainLiteral(reference.value,
                                         reference.language);
        } else {
            return graph.getTypedLiteral(reference.value,
                                         siestaGraph.__normalizeUri(new Siesta.Framework.Uri("http://www.w3.org/2000/01/rdf-schema#Literal")));
        }
    } else if(reference.__type == 'blanknode') {
        var blankId = reference.value;
        if(typeof blankId == "number") {
            blankId = ""+blankId;
        }
        return graph.getBlankNode(blankId);
    } else {
        throw "Uknown type for Siesta resource: " + reference.__type ;
    }
};


Siesta.registerFramework("sparql");
Siesta.registerNamespace("Siesta","Drivers","Hercules","Formats","Turtle");

/**
 * informs the client that if this parser is synchronous or asynchronous
 */
Siesta.Drivers.Hercules.Formats.Turtle.isParserAsynchronous = function() {
    return false;
}

/**
 *  Parses a Turtle enconded RDF document and returns a
 *  Siesta.Framework.Graph of Siesta.Framework.Triple objects
 *  with the RDF triples encoded in the Turtle document
 *
 *  @arguments
 *  - baseUri: the URI of the document to be parsed.
 *  - doc: a String containing the Turtle document.
 *
 *  @returns
 *  - Siesta.Framework.Graph
 */
Siesta.Drivers.Hercules.Formats.Turtle.parseDoc = function(baseUri, doc /* turtle document string */) {
    var turtleParser = new Arielworks.Parser.RecursiveDescentParser.Parser();
    turtleParser.setRuleSet(Arielworks.Hercules.Serialized.Turtle.Parser.RULE_SET);
    turtleParser.setWhiteSpaceRule(Arielworks.Hercules.Serialized.Turtle.Parser.WHITE_SPACE_RULE);
    turtleParser.compileRuleSet();
    var action = new Arielworks.Hercules.Serialized.Turtle.Turtle_1_0(baseUri);
    turtleParser.parse(doc, Arielworks.Hercules.Serialized.Turtle.Parser.START_RULE, action);

    var parsedTriples = action.graph.tripleList;

    var graph = new Siesta.Framework.Graph();
    graph.baseUri = baseUri;

    for(var i=0; i<parsedTriples.length; i++) {
        var triple = new Siesta.Framework.Triple(Siesta.Drivers.Hercules.__parseReference(parsedTriples[i].subject),
                                                 Siesta.Drivers.Hercules.__parseReference(parsedTriples[i].predicate),
                                                 Siesta.Drivers.Hercules.__parseReference(parsedTriples[i].object));
        graph.addTriple(triple);
    }

    return graph;
};


/**
 *  Parses a Hercules reference into a Siesta reference
 *
 *  @arguments:
 *  - reference: some kind of Hercules reference
 *
 *  @returns:
 *  - the equivalente Siesta.Framework reference
 */
Siesta.Drivers.Hercules.__parseReference = function(reference) {
    if(reference instanceof Arielworks.Hercules.Rdf.RdfUriRef.prototype.constructor) {

        return new Siesta.Framework.Uri(reference.value);

    } else if(reference instanceof Arielworks.Hercules.Rdf.TypedLiteral.prototype.constructor) {

        return new Siesta.Framework.Literal({value: reference.value,
                                             type: new Siesta.Framework.Uri(reference.datatypeIri)});

    } else if(reference instanceof Arielworks.Hercules.Rdf.PlainLiteral.prototype.constructor) {

        return new Siesta.Framework.Literal({value: reference.value,
                                             language:  reference.languageTag});

    } else if(reference instanceof Arielworks.Hercules.Rdf.BlankNode.prototype.constructor) {
        return new Siesta.Framework.BlankNode(reference.value);

    } else {
        throw new Exception("Parsing Hercules unknown reference");
    }
};

Siesta.registerFramework("formats/turtle");
Siesta.registerNamespace("Siesta","Drivers","OAT","Formats","Xml");

/**
 * informs the client that if this parser is synchronous or asynchronous
 */
Siesta.Drivers.OAT.Formats.Xml.isParserAsynchronous = function() {
    return false;
}

Siesta.Drivers.OAT.Formats.Xml.parseDoc = function(baseUri, doc /* RDF/XML document string */) {

    var xmlDoc = OAT.Xml.createXmlDoc(doc);
    var parsedTriples = OAT.RDF.toTriples(testDoc,baseUri);

    var graph = new Siesta.Framework.Graph();
    graph.baseUri = baseUri;

    for(var i=0; i<parsedTriples.length; i++) {
        var triple = new Siesta.Framework.Triple(Siesta.Drivers.OAT.__parseReference(baseUri,parsedTriples[i][0]),
                                                 Siesta.Drivers.OAT.__parseReference(baseUri,parsedTriples[i][1]),
                                                 Siesta.Drivers.OAT.__parseReference(baseUri,parsedTriples[i][2]));
        graph.addTriple(triple);
    }

    return graph;
}

/**
 *  Parses a String containing a reference as it has been
 *  parsed by OAT.
 *
 *  @arguments:
 *  - reference: some kind of OAT parsed reference
 *
 *  @returns:
 *  - the equivalente Siesta.Framework reference
 */
Siesta.Drivers.OAT.__parseReference = function(baseUri,reference) {
    if(reference.indexOf("http") == 0) {

        return new Siesta.Framework.Uri(reference);

    } else if(reference.indexOf("#") == 0) {

        return new Siesta.Framework.Uri(baseUri+reference);

    } else if(reference.indexOf("_:") == 0) {

        return new Siesta.Framework.BlankNode(reference);

    } else {

        return new Siesta.Framework.Literal({value: reference});

    }
};

Siesta.registerFramework("formats/xml");
Siesta.registerNamespace("Siesta","Drivers","W3c","Formats","Rdfa");

/**
 * informs the client that if this parser is synchronous or asynchronous
 */
Siesta.Drivers.W3c.Formats.Rdfa.isParserAsynchronous = function() {
    return true;
}

/**
 *  Parses a HTML enconded RDFa document and returns a
 *  Siesta.Framework.Graph of Siesta.Framework.Triple objects
 *  with the RDF triples encoded in the Turtle document
 *
 *  @arguments
 *  - baseUri: the URI of the document to be parsed.
 *  - doc: a String containing the Turtle document.
 *
 *  @returns
 *  - Siesta.Framework.Graph
 */
Siesta.Drivers.W3c.Formats.Rdfa.parseDoc = function(baseUri, doc /* html with encoded RDFa document string */, callback) {
    RDFA.CALLBACK_DONE_PARSING = function() {
        RDFA.N3_GRAPH.baseUri = baseUri;

        callback(baseUri,doc,RDFA.N3_GRAPH);
    }

    RDFA.parse(Siesta.Utils.htmlParser(doc),baseUri);
};

Siesta.registerFramework("formats/rdfa");
Siesta.registerNamespace("Siesta","Drivers","jQuery","Network");

Siesta.Drivers.jQuery.Network.jsonpRequest = function(request,callbackParameterName,callbackName) {
    if(request.indexOf("?")!=-1) {
        request = request+"&"+callbackParameterName+"="+callbackName;
    } else {
        request = request+"?"+callbackParameterName+"="+callbackName;
    }

    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = request;

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(node);
};

Siesta.Drivers.jQuery.Network.jsonpRequestForFunction = function(request,callbackParameterName,callbackFunction) {

    var tmpIdentifier = "siesta_func_jsonp_callback_"+(new Date()).getTime();

    eval(tmpIdentifier+" = function(resp){ callbackFunction(resp); };");

    if(request.indexOf("?")!=-1) {
        request = request+"&"+callbackParameterName+"="+tmpIdentifier;
    } else {
        request = request+"?"+callbackParameterName+"="+tmpIdentifier;
    }

    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = request;

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(node);
};

Siesta.Drivers.jQuery.Network.jsonpRequestForMethod = function(request,callbackParameterName,callbackObject,callbackFunction) {

    var tmpIdentifier = "siesta_func_jsonp_callback_"+(new Date()).getTime();

    eval(tmpIdentifier+" = function(resp){ callbackFunction.call(callbackObject,resp); };");

    if(request.indexOf("?")!=-1) {
        request = request+"&"+callbackParameterName+"="+tmpIdentifier;
    } else {
        request = request+"?"+callbackParameterName+"="+tmpIdentifier;
    }

    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = request;

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(node);
};


Siesta.Drivers.jQuery.Network.ajaxRequestForFunction = function(request,httpMethod,headers,callbackFunction) {
    jQuery.ajax({
        url: request,
        type: method,
        dataType: "text",
        success: function(data){
            callbackFunction(data);
        },
        error: function(transport) {
            callbackFunction(Siesta.Constants.FAILURE);
        } });



};

Siesta.Drivers.jQuery.Network.ajaxRequestForMethod = function(request,method,headers,callbackObject,callbackFunction) {
    jQuery.ajax({
        url: request,
        type: method,
        dataType: "text",
        success: function(data){
            callbackFunction.call(callbackObject,data);
        },
        error: function(transport) {
            callbackFunction(Siesta.Constants.FAILURE);
        } });


};


Siesta.registerFramework("network");
