var V="mandal-v2",SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!=="GET")return;var u=new URL(r.url);
if(u.hostname==="www.gstatic.com"&&u.pathname.indexOf("/firebasejs/")===0){
e.respondWith(caches.open(V).then(function(c){return c.match(r).then(function(m){return m||fetch(r).then(function(res){if(res.ok)c.put(r,res.clone());return res})})}));return}
if(u.origin===location.origin){
e.respondWith(fetch(r,{cache:"no-cache"}).then(function(res){if(res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}return res}).catch(function(){return caches.match(r).then(function(m){return m||caches.match("index.html")})}))}});
self.addEventListener("message",function(e){if(e.data&&e.data.warm)e.waitUntil(Promise.all(e.data.warm.map(function(u){return warm(u,{})})))});
function warm(url,seen){if(seen[url])return Promise.resolve();seen[url]=1;
return caches.open(V).then(function(c){return c.match(url).then(function(res){return res||fetch(url).then(function(r){if(r.ok)c.put(url,r.clone());return r})})}).then(function(res){return res.clone().text()}).then(function(t){
var re=/(?:from|import)\s*["']([^"']+)["']/g,m,jobs=[];while((m=re.exec(t))){try{var n=new URL(m[1],url).href;if(n.indexOf("https://www.gstatic.com/firebasejs/")===0)jobs.push(warm(n,seen))}catch(x){}}
return Promise.all(jobs)}).catch(function(){})}
