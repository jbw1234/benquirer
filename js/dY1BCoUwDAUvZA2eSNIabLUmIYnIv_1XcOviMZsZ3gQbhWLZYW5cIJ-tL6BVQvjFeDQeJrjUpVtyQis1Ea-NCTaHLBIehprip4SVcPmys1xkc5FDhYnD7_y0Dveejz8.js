!function(){function t(){if(this.complete){var e=this.getAttribute("data-lazy-src");if(e&&this.src!==e)this.addEventListener("onload",t);else{var d=this.width,n=this.height;d&&d>0&&n&&n>0&&(this.setAttribute("width",d),this.setAttribute("height",n),i(this))}}else this.addEventListener("onload",t)}var e=function(){for(var e=document.querySelectorAll("img[data-recalc-dims]"),i=0;i<e.length;i++)t.call(e[i])},i=function(t){t.removeAttribute("data-recalc-dims"),t.removeAttribute("scale")};"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",e):e()),document.body.addEventListener("post-load",e)}();
;/*
 * bootstrap-typeahead.js v0.0.3 (http://www.upbootstrap.com)
 * Copyright 2012-2014 Twitter Inc.
 * Licensed under MIT (https://github.com/biggora/bootstrap-ajax-typeahead/blob/master/LICENSE)
 * See Demo: http://plugins.upbootstrap.com/bootstrap-ajax-typeahead
 * Updated: 2014-02-09 02:4:38
 *
 * Modifications by Paul Warelis and Alexey Gordeyev
 */
!function($){"use strict";var Typeahead=function(element,options){var that=this;that.$element=$(element);that.options=$.extend({},$.fn.typeahead.defaults,options);that.$menu=$(that.options.menu).insertAfter(that.$element);that.eventSupported=that.options.eventSupported||that.eventSupported;that.grepper=that.options.grepper||that.grepper;that.highlighter=that.options.highlighter||that.highlighter;that.lookup=that.options.lookup||that.lookup;that.matcher=that.options.matcher||that.matcher;that.render=that.options.render||that.render;that.onSelect=that.options.onSelect||null;that.sorter=that.options.sorter||that.sorter;that.source=that.options.source||that.source;that.displayField=that.options.displayField||that.displayField;that.valueField=that.options.valueField||that.valueField;if(that.options.ajax){var ajax=that.options.ajax;if(typeof ajax==='string'){that.ajax=$.extend({},$.fn.typeahead.defaults.ajax,{url:ajax});}else{if(typeof ajax.displayField==='string'){that.displayField=that.options.displayField=ajax.displayField;}
if(typeof ajax.valueField==='string'){that.valueField=that.options.valueField=ajax.valueField;}
that.ajax=$.extend({},$.fn.typeahead.defaults.ajax,ajax);}
if(!that.ajax.url){that.ajax=null;}
that.query="";}else{that.source=that.options.source;that.ajax=null;}
that.shown=false;that.listen();};Typeahead.prototype={constructor:Typeahead,eventSupported:function(eventName){var isSupported=(eventName in this.$element);if(!isSupported){this.$element.setAttribute(eventName,'return;');isSupported=typeof this.$element[eventName]==='function';}
return isSupported;},select:function(){var $selectedItem=this.$menu.find('.active');var value=$selectedItem.attr('data-value');var text=this.$menu.find('.active a').text();var txt1;console.log(JSON.stringify(value));console.log(JSON.stringify(text));var container=document.createElement("p");container.innerHTML=value;var anchors=container.getElementsByTagName("a");if(anchors!=null&anchors.length>0){window.location.href=anchors[0].href;return null;}
if(text==''){text=this.query;}
if(this.options.onSelect){this.options.onSelect({value:value,text:text});}
this.$element.val(this.updater(text)).change();return this.hide();},updater:function(item){var is_after_autocomplete_block_submit=jQuery('#is_after_autocomplete_block_submit').val();this.$element[0].value=item;if(is_after_autocomplete_block_submit!='1'){this.$element[0].form.submit();}
return item;},show:function(){var pos=$.extend({},this.$element.position(),{height:this.$element[0].offsetHeight});this.$menu.css({top:pos.top+pos.height,left:pos.left});this.$menu.show();this.shown=true;return this;},hide:function(){this.$menu.hide();this.shown=false;return this;},ajaxLookup:function(){var query=$.trim(this.$element.val());if(query===this.query){return this;}
this.query=query;if(this.ajax.timerId){clearTimeout(this.ajax.timerId);this.ajax.timerId=null;}
if(!query||query.length<this.ajax.triggerLength){if(this.ajax.xhr){this.ajax.xhr.abort();this.ajax.xhr=null;this.ajaxToggleLoadClass(false);}
return this.shown?this.hide():this;}
function execute(){this.ajaxToggleLoadClass(true);if(this.ajax.xhr)
this.ajax.xhr.abort();var params=this.ajax.preDispatch?this.ajax.preDispatch(query):{query:query};this.ajax.xhr=$.ajax({url:this.ajax.url,data:params,success:$.proxy(this.ajaxSource,this),type:this.ajax.method||'get',dataType:'json'});this.ajax.timerId=null;}
this.ajax.timerId=setTimeout($.proxy(execute,this),this.ajax.timeout);return this;},ajaxSource:function(data){this.ajaxToggleLoadClass(false);var that=this,items;if(!that.ajax.xhr)
return;if(that.ajax.preProcess){data=that.ajax.preProcess(data);}
that.ajax.data=data;items=that.grepper(that.ajax.data)||[];if(!items.length){return that.shown?that.hide():that;}
that.ajax.xhr=null;return that.render(items.slice(0,that.options.items)).show();},ajaxToggleLoadClass:function(enable){if(!this.ajax.loadingClass)
return;this.$element.toggleClass(this.ajax.loadingClass,enable);},lookup:function(event){var that=this,items;if(that.ajax){that.ajaxer();}
else{that.query=that.$element.val();if(!that.query){return that.shown?that.hide():that;}
items=that.grepper(that.source);if(!items||!items.length){return that.shown?that.hide():that;}
return that.render(items.slice(0,that.options.items)).show();}},matcher:function(item){return~item.toLowerCase().indexOf(this.query.toLowerCase());},sorter:function(items){if(!this.options.ajax){var beginswith=[],caseSensitive=[],caseInsensitive=[],item;while(item=items.shift()){if(!item.toLowerCase().indexOf(this.query.toLowerCase()))
beginswith.push(item);else if(~item.indexOf(this.query))
caseSensitive.push(item);else
caseInsensitive.push(item);}
return beginswith.concat(caseSensitive,caseInsensitive);}else{return items;}},highlighter:function(item){var query=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,'\\$&');return item.replace(new RegExp('('+query+')','ig'),function($1,match){return'<strong>'+match+'</strong>';});},render:function(items){var that=this,display,isString=typeof that.options.displayField==='string';items=$(items).map(function(i,item){if(typeof item==='object'){display=isString?item[that.options.displayField]:that.options.displayField(item);i=$(that.options.item).attr('data-value',item[that.options.valueField]);}else{display=item;i=$(that.options.item).attr('data-value',item);}
i.find('a').html(that.highlighter(display));return i[0];});this.$menu.html(items);return this;},grepper:function(data){var that=this,items,display,isString=typeof that.options.displayField==='string';if(isString&&data&&data.length){if(data[0].hasOwnProperty(that.options.displayField)){items=$.grep(data,function(item){display=isString?item[that.options.displayField]:that.options.displayField(item);return that.matcher(display);});}else if(typeof data[0]==='string'){items=$.grep(data,function(item){return that.matcher(item);});}else{return null;}}else{return null;}
return this.sorter(items);},next:function(event){var active=this.$menu.find('.active').removeClass('active'),next=active.next();if(!next.length){next=$(this.$menu.find('li')[0]);}
next.addClass('active');},prev:function(event){var active=this.$menu.find('.active').removeClass('active'),prev=active.prev();if(!prev.length){prev=this.$menu.find('li').last();}
prev.addClass('active');},listen:function(){this.$element.on('focus',$.proxy(this.focus,this)).on('blur',$.proxy(this.blur,this)).on('keypress',$.proxy(this.keypress,this)).on('keyup',$.proxy(this.keyup,this));if(this.eventSupported('keydown')){this.$element.on('keydown',$.proxy(this.keydown,this))}
this.$menu.on('click',$.proxy(this.click,this)).on('mouseenter','li',$.proxy(this.mouseenter,this)).on('mouseleave','li',$.proxy(this.mouseleave,this))},move:function(e){if(!this.shown)
return
switch(e.keyCode){case 9:case 13:case 27:e.preventDefault();break
case 38:e.preventDefault()
this.prev()
break
case 40:e.preventDefault()
this.next()
break}
e.stopPropagation();},keydown:function(e){this.suppressKeyPressRepeat=~$.inArray(e.keyCode,[40,38,9,13,27])
this.move(e)},keypress:function(e){if(this.suppressKeyPressRepeat)
return
this.move(e)},keyup:function(e){switch(e.keyCode){case 40:case 38:case 16:case 17:case 18:break
case 9:case 13:if(!this.shown)
return
this.select()
break
case 27:if(!this.shown)
return
this.hide()
break
default:if(this.ajax)
this.ajaxLookup()
else
this.lookup()}
e.stopPropagation()
e.preventDefault()},focus:function(e){this.focused=true},blur:function(e){this.focused=false
if(!this.mousedover&&this.shown)
this.hide()},click:function(e){e.stopPropagation()
e.preventDefault()
this.select()
this.$element.focus()},mouseenter:function(e){this.mousedover=true
this.$menu.find('.active').removeClass('active')
$(e.currentTarget).addClass('active')},mouseleave:function(e){this.mousedover=false
if(!this.focused&&this.shown)
this.hide()}};$.fn.typeahead=function(option){return this.each(function(){var $this=$(this),data=$this.data('typeahead'),options=typeof option==='object'&&option;if(!data)
$this.data('typeahead',(data=new Typeahead(this,options)));if(typeof option==='string')
data[option]();});};$.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="wdm_ul typeahead wdm-dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',displayField:'name',valueField:'id',onSelect:function(){},ajax:{url:null,timeout:300,method:'get',triggerLength:1,loadingClass:null,preDispatch:null,preProcess:null}};$.fn.typeahead.Constructor=Typeahead;$(function(){$('body').on('focus.typeahead.data-api','[data-provide="typeahead"]',function(e){var $this=$(this);if($this.data('typeahead'))
return;e.preventDefault();$this.typeahead($this.data());});});}(window.jQuery);
;;eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}(';5 V=(8(){"1x 1v";5 j={m:\'m\',B:\'1e\',l:\'l\',p:\'1d\',q:\'1c\',u:\'u\'},13={"1y":1q,"1j":1i,"1n":15,"1F":T,"1H":15,"1m":T},17=8(a,b){5 d=1t,L=d.1B(\'a\'),b=b||d.1a.R,I=b.r(/\\/\\/(.*?)(?::(.*?))?@/)||[];L.R=b;w(5 i D j){a[i]=L[j[i]]||\'\'}a.m=a.m.o(/:$/,\'\');a.q=a.q.o(/^\\?/,\'\');a.u=a.u.o(/^#/,\'\');a.G=I[1]||\'\';a.F=I[2]||\'\';a.l=(13[a.m]==a.l||a.l==0)?\'\':a.l;k(!a.m&&!/^([a-z]+:)?\\/\\//.1b(b)){5 c=U V(d.1a.R.r(/(.*\\/)/)[0]),A=c.p.14(\'/\'),E=a.p.14(\'/\');A.W();w(5 i=0,y=[\'m\',\'G\',\'F\',\'B\',\'l\'],s=y.X;i<s;i++){a[y[i]]=c[y[i]]}Y(E[0]==\'..\'){A.W();E.1D()}a.p=(b.1g(0,1)!=\'/\'?A.Z(\'/\'):\'\')+\'/\'+E.Z(\'/\')}C{a.p=a.p.o(/^\\/?/,\'/\')}10(a)},11=8(s){s=s.o(/\\+/g,\' \');s=s.o(/%([1u][0-t-f])%([S][0-t-f])%([S][0-t-f])/H,8(a,b,c,d){5 e=v(b,16)-1f,Q=v(c,16)-P;k(e==0&&Q<1h){9 a}5 f=v(d,16)-P,n=(e<<12)+(Q<<6)+f;k(n>1l){9 a}9 O.N(n)});s=s.o(/%([1o][0-t-f])%([S][0-t-f])/H,8(a,b,c){5 d=v(b,16)-1p;k(d<2){9 a}5 e=v(c,16)-P;9 O.N((d<<6)+e)});s=s.o(/%([0-7][0-t-f])/H,8(a,b){9 O.N(v(b,16))});9 s},10=8(g){5 h=g.q;g.q=U(8(c){5 d=/([^=&]+)(=([^&]*))?/g,r;Y((r=d.1r(c))){5 f=1s(r[1].o(/\\+/g,\' \')),M=r[3]?11(r[3]):\'\';k(4[f]!=1w){k(!(4[f]x 18)){4[f]=[4[f]]}4[f].1z(M)}C{4[f]=M}}4.1A=8(){w(f D 4){k(!(4[f]x K)){1C 4[f]}}};4.19=8(){5 a=0;w(f D 4){k(!(4[f]x K)){a++}}9 a};4.1E=8(){9 4.19()===0};4.J=8(){5 s=\'\',e=1G;w(5 i D 4){k(4[i]x K){1k}k(4[i]x 18){5 a=4[i].X;k(a){w(5 b=0;b<a;b++){s+=s?\'&\':\'\';s+=e(i)+\'=\'+e(4[i][b])}}C{s+=(s?\'&\':\'\')+e(i)+\'=\'}}C{s+=s?\'&\':\'\';s+=e(i)+\'=\'+e(4[i])}}9 s}})(h)};9 8(a){4.J=8(){9((4.m&&(4.m+\'://\'))+(4.G&&(4.G+(4.F&&(\':\'+4.F))+\'@\'))+(4.B&&4.B)+(4.l&&(\':\'+4.l))+(4.p&&4.p)+(4.q.J()&&(\'?\'+4.q))+(4.u&&(\'#\'+4.u)))};17(4,a)}}());',62,106,'||||this|var|||function|return|||||||||||if|port|protocol||replace|path|query|match||9a|hash|parseInt|for|instanceof|props||basePath|host|else|in|selfPath|pass|user|gi|auth|toString|Function|link|value|fromCharCode|String|0x80|n2|href|89ab|443|new|Url|pop|length|while|join|parseQs|decode||defaultPorts|split|80||parse|Array|count|location|test|search|pathname|hostname|0xE0|substring|32|70|gopher|continue|0xFFFF|wss|http|cd|0xC0|21|exec|decodeURIComponent|document|ef|strict|null|use|ftp|push|clear|createElement|delete|shift|isEmpty|https|encodeURIComponent|ws'.split('|'),0,{}));