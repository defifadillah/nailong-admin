const V="nailong-v6",SHELL=["./","index.html","manifest.webmanifest","config.js","icon.svg","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);
if(r.method!=="GET"||/supabase\.(co|in)$/.test(u.hostname)||u.pathname.includes("/rest/v1/")||u.pathname.includes("/auth/v1/"))return;
if(u.origin===location.origin&&(r.mode==="navigate"||/\/$/.test(u.pathname)||/\.(html|js)$/.test(u.pathname))){
e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(h=>h||caches.match("index.html"))));return}
e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>hit);return hit||net.then(x=>x||caches.match("index.html"))}))});
