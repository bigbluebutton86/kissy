/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 11 14:17
*/
KISSY.add("editor/plugin/drag-upload",function(g,p){function h(g){this.config=g||{}}var r=g.Node,l=g.Event,s=p.Utils,k=g.DOM;g.augment(h,{pluginRenderUI:function(h){function q(b){b=b.originalEvent.target;"img"==k.nodeName(b)&&b.src.match(/^file:\/\//)&&(m[b.src]=b)}function t(b,d){var f=new window.FileReader;f.onload=function(e){var a=b.name,e=e.target.result,c=new XMLHttpRequest;c.open("POST",u,!0);c.onreadystatechange=function(){if(4==c.readyState){if(200==c.status||304==c.status){if(""!=c.responseText){var a=
g.parseJson(c.responseText);d[0].src=a.imgUrl}}else alert("\u670d\u52a1\u5668\u7aef\u51fa\u9519\uff01"),d.remove();c.onreadystatechange=null}};a="\r\n------kissy-editor-yiminghe\r\n"+('Content-Disposition: form-data; name="'+v+'"; filename="'+encodeURIComponent(a)+'"\r\n');a+="Content-Type: "+(b.type||"application/octet-stream")+"\r\n\r\n";a+=e+"\r\n";n=p.Utils.normParams(n);for(var j in n)a+="------kissy-editor-yiminghe\r\n",a+='Content-Disposition: form-data; name="'+j+'"\r\n\r\n',a+=n[j]+"\r\n";a+="------kissy-editor-yiminghe--";
c.setRequestHeader("Content-Type","multipart/form-data, boundary=----kissy-editor-yiminghe");c.sendAsBinary("Content-Type: multipart/form-data; boundary=----kissy-editor-yiminghe\r\nContent-Length: "+a.length+"\r\n"+a+"\r\n");f.onload=null};f.readAsBinaryString(b)}var i=this.config,v=i.fileInput||"Filedata",w=i.sizeLimit||Number.MAX_VALUE,n=i.serverParams||{},u=i.serverUrl||"",x=RegExp((i.suffix||"png,jpg,jpeg,gif").split(/,/).join("|")+"$","i"),m={},o=!1;h.docReady(function(){var b=h.get("document")[0];
l.on(b,"dragenter",function(){o||(l.on(b,"DOMNodeInserted",q),o=!0)});l.on(b,"drop",function(d){l.remove(b,"DOMNodeInserted",q);o=!1;d.halt();var d=d.originalEvent,f,e;g.isEmptyObject(m)?(e=b.elementFromPoint(d.clientX,d.clientY),f=e.lastChild):(g.each(m,function(a){"img"==k.nodeName(a)&&(f=a.nextSibling,e=a.parentNode,k.remove(a))}),m={});d=d.dataTransfer;d.dropEffect="copy";if(d=d.files)for(var a=0;a<d.length;a++){var c=d[a],j=c.size;if(c.name.match(x)&&!(j/1E3>w)){var j=new r("<img src='"+s.debugUrl("theme/tao-loading.gif")+
"'/>"),h=j[0];e.insertBefore(h,f);var i=k.nodeName(h.parentNode);("head"==i||"html"==i)&&k.insertBefore(h,b.body.firstChild);t(c,j)}}})});window.XMLHttpRequest&&!XMLHttpRequest.prototype.sendAsBinary&&(XMLHttpRequest.prototype.sendAsBinary=function(b,d){for(var f=new (window.BlobBuilder||window.WebKitBlobBuilder),e=b.length,a=new window.Uint8Array(e),c=0;c<e;c++)a[c]=b.charCodeAt(c);f.append(a.buffer);this.send(f.getBlob(d))})}});return h},{requires:["editor"]});