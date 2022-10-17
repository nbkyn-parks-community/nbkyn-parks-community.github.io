(()=>{"use strict";var e={913:()=>{try{self["workbox:core:6.5.2"]&&_()}catch(e){}},977:()=>{try{self["workbox:precaching:6.5.2"]&&_()}catch(e){}},80:()=>{try{self["workbox:routing:6.5.2"]&&_()}catch(e){}},873:()=>{try{self["workbox:strategies:6.5.2"]&&_()}catch(e){}}},t={};function s(a){var n=t[a];if(void 0!==n)return n.exports;var i=t[a]={exports:{}};return e[a](i,i.exports,s),i.exports}(()=>{s(913);const e=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}const a={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},n=e=>[a.prefix,e,a.suffix].filter((e=>e&&e.length>0)).join("-"),i=e=>e||n(a.precache),r=e=>e||n(a.runtime);function c(e,t){const s=t();return e.waitUntil(s),s}s(977);function o(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:a}=e;if(!a)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(a,location.href),i=new URL(a,location.href);return n.searchParams.set("__WB_REVISION__",s),{cacheKey:n.href,url:i.href}}class h{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class l{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}let u;async function f(e,s){let a=null;if(e.url){a=new URL(e.url).origin}if(a!==self.location.origin)throw new t("cross-origin-copy-response",{origin:a});const n=e.clone(),i={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},r=s?s(i):i,c=function(){if(void 0===u){const e=new Response("");if("body"in e)try{new Response(e.body),u=!0}catch(e){u=!1}u=!1}return u}()?n.body:await n.blob();return new Response(c,r)}function d(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class p{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const g=new Set;s(873);function y(e){return"string"==typeof e?new Request(e):e}class w{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new p,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:s}=this;let a=y(e);if("navigate"===a.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?a.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:s})}catch(e){if(e instanceof Error)throw new t("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}const i=a.clone();try{let e;e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:i,response:e});return e}catch(e){throw n&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:n.clone(),request:i.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=y(e);let s;const{cacheName:a,matchOptions:n}=this._strategy,i=await this.getCacheKey(t,"read"),r=Object.assign(Object.assign({},n),{cacheName:a});s=await caches.match(i,r);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:a,matchOptions:n,cachedResponse:s,request:i,event:this.event})||void 0;return s}async cachePut(e,s){const a=y(e);var n;await(n=0,new Promise((e=>setTimeout(e,n))));const i=await this.getCacheKey(a,"write");if(!s)throw new t("cache-put-with-no-response",{url:(r=i.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const c=await this._ensureResponseSafeToCache(s);if(!c)return!1;const{cacheName:o,matchOptions:h}=this._strategy,l=await self.caches.open(o),u=this.hasCallback("cacheDidUpdate"),f=u?await async function(e,t,s,a){const n=d(t.url,s);if(t.url===n)return e.match(t,a);const i=Object.assign(Object.assign({},a),{ignoreSearch:!0}),r=await e.keys(t,i);for(const t of r)if(n===d(t.url,s))return e.match(t,a)}(l,i.clone(),["__WB_REVISION__"],h):null;try{await l.put(i,u?c.clone():c)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of g)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:o,oldResponse:f,newResponse:c.clone(),request:i,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=y(await e({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),a=a=>{const n=Object.assign(Object.assign({},a),{state:s});return t[e](n)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class _ extends class{constructor(e={}){this.cacheName=r(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,n=new w(this,{event:t,request:s,params:a}),i=this._getResponse(n,s,t);return[i,this._awaitComplete(i,n,s,t)]}async _getResponse(e,s,a){let n;await e.runCallbacks("handlerWillStart",{event:a,request:s});try{if(n=await this._handle(s,e),!n||"error"===n.type)throw new t("no-response",{url:s.url})}catch(t){if(t instanceof Error)for(const i of e.iterateCallbacks("handlerDidError"))if(n=await i({error:t,event:a,request:s}),n)break;if(!n)throw t}for(const t of e.iterateCallbacks("handlerWillRespond"))n=await t({event:a,request:s,response:n});return n}async _awaitComplete(e,t,s,a){let n,i;try{n=await e}catch(i){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:n}),await t.doneWaiting()}catch(e){e instanceof Error&&(i=e)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:n,error:i}),t.destroy(),i)throw i}}{constructor(e={}){e.cacheName=i(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(_.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,s){let a;const n=s.params||{};if(!this._fallbackToNetwork)throw new t("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{0;const t=n.integrity,i=e.integrity,r=!i||i===t;if(a=await s.fetch(new Request(e,{integrity:i||t})),t&&r){this._useDefaultCacheabilityPluginIfNeeded();await s.cachePut(e,a.clone());0}}return a}async _handleInstall(e,s){this._useDefaultCacheabilityPluginIfNeeded();const a=await s.fetch(e);if(!await s.cachePut(e,a.clone()))throw new t("bad-precaching-response",{url:e.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==_.copyRedirectedCacheableResponsesPlugin&&(a===_.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(_.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}_.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},_.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await f(e):e};class v{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new _({cacheName:i(e),plugins:[...t,new l({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const s=[];for(const a of e){"string"==typeof a?s.push(a):a&&void 0===a.revision&&s.push(a.url);const{cacheKey:e,url:n}=o(a),i="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:e});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==a.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(e,a.integrity)}if(this._urlsToCacheKeys.set(n,e),this._urlsToCacheModes.set(n,i),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return c(e,(async()=>{const t=new h;this.strategy.plugins.push(t);for(const[t,s]of this._urlsToCacheKeys){const a=this._cacheKeysToIntegrities.get(s),n=this._urlsToCacheModes.get(t),i=new Request(t,{integrity:a,cache:n,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:i,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}}))}activate(e){return c(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(const n of t)s.has(n.url)||(await e.delete(n),a.push(n.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(e){const s=this.getCacheKeyForURL(e);if(!s)throw new t("non-precached-url",{url:e});return t=>(t.request=new Request(e),t.params=Object.assign({cacheKey:s},t.params),this.strategy.handle(t))}}s(80);(async()=>{const e=function(){const e=JSON.parse(new URLSearchParams(self.location.search).get("params"));return e.debug&&console.log("[Docusaurus-PWA][SW]: Service Worker params:",e),e}(),t=[{"revision":"cf6985d7020c0a5258fabdfa0debc582","url":"404.html"},{"revision":"3d9724c96885b31a522de811657b7a49","url":"assets/css/styles.addcdd1c.css"},{"revision":"881133f86eed172596508fc28035d86c","url":"assets/js/068e142e.8f4a8a29.js"},{"revision":"891bab810ffa557c17fb2371227a35d8","url":"assets/js/078b638b.353cf156.js"},{"revision":"a57cbeaaddd45e494cb1b6a0b01ff150","url":"assets/js/1521bd3b.82f4166f.js"},{"revision":"88f19f308c4346ec2d47ffcda6c81add","url":"assets/js/1753747f.20e9d33b.js"},{"revision":"bb400c7268dcfe58e0caba6a5c669c94","url":"assets/js/17896441.9b1b81e6.js"},{"revision":"ae67cedc98fff7317495eb373204a89b","url":"assets/js/190256f2.748d80bb.js"},{"revision":"504573a0c97c7b125b6c6eb4dfde1e12","url":"assets/js/19b6a548.9029b656.js"},{"revision":"a13b083d53e7fdfb1e261804e7b92d89","url":"assets/js/1b770963.609da26e.js"},{"revision":"82e3dcd15f2a34c086b6c9e5e2744ca2","url":"assets/js/1be78505.0913f000.js"},{"revision":"be802bd19ea3dc3f5413e88a49e70bcb","url":"assets/js/1eb08314.7c0dc8d8.js"},{"revision":"9d1261c1931319bfce4a5330aaeacc39","url":"assets/js/1ec1a0db.53f0c333.js"},{"revision":"5b186cf1d3624fa86ef07c11dc8dc0a2","url":"assets/js/1f391b9e.b74257d1.js"},{"revision":"2271ec2ad7992e27d29ccf0257131fb7","url":"assets/js/1fd6871f.405edbda.js"},{"revision":"193b0a3f2cafc0f9d64acdae0f57e8b1","url":"assets/js/227cec60.5f32c37e.js"},{"revision":"c2c45cc5613ab9d19ea363d46ae198c6","url":"assets/js/230.9164cd38.js"},{"revision":"6ee3ccba85a0d17efa95824f8eae3881","url":"assets/js/2724aeed.e7e7fd80.js"},{"revision":"cf6bf4d6d604e75a73807fb65da63bea","url":"assets/js/31fca81d.f3154338.js"},{"revision":"cf318eab722b72c55835711a13011364","url":"assets/js/3548.2b95b3d0.js"},{"revision":"df0eca3c4bd542a274bc74fa6646e981","url":"assets/js/3720c009.68eb815e.js"},{"revision":"3343ca31084347cb0b2598065517cf57","url":"assets/js/38610ff3.59a693c8.js"},{"revision":"7e8edd8e731d600428d6df1036040e70","url":"assets/js/39376223.8a1e0de4.js"},{"revision":"d8f708fc31f9e6c0c0eea7ddc25abb01","url":"assets/js/393be207.1e082ff5.js"},{"revision":"2a3ad13728b923810d0f884c1b3a136a","url":"assets/js/3a22bc9a.098a28ca.js"},{"revision":"796d812962621bdf6edc68e6ff124000","url":"assets/js/3a31eef8.138aa782.js"},{"revision":"780d6673aa1283bd6bc5165482f305ad","url":"assets/js/3d1a9ca8.4a471937.js"},{"revision":"00a13dc9f781d5e1ad1e1884b81a35a8","url":"assets/js/41ce5ed0.e09235b7.js"},{"revision":"f7137834005f85027967f1a3d3e760ca","url":"assets/js/47651883.b56cfee6.js"},{"revision":"317faa0f73bb98e5fe4bc2dcb8eca952","url":"assets/js/48e0a347.aded0118.js"},{"revision":"077cc69da0891c1fee32d5f17070482b","url":"assets/js/4972.869e7d7a.js"},{"revision":"f06bce049fe7edbf633a5c7534d29d97","url":"assets/js/4c3cde04.5e2bb033.js"},{"revision":"9e92e99a1db5f6f8382440d74a148979","url":"assets/js/4f831626.9b415eec.js"},{"revision":"951e4c233e456b8e2f5f49cc951e95be","url":"assets/js/501add24.0aed0283.js"},{"revision":"0c7dc442645fa543ec75bae80c9b72f6","url":"assets/js/5131.37209ac5.js"},{"revision":"20b60f6e2c6e48f7056ff175e0430d9c","url":"assets/js/5283.bd55f846.js"},{"revision":"58993c21e7ab52a23d172a22a76b051d","url":"assets/js/53e0a087.4bae4782.js"},{"revision":"aa28f566e011cef06f513b5c5a11875b","url":"assets/js/550ed89b.9227163c.js"},{"revision":"9563f72a49574e35be00b275f2f5d1d8","url":"assets/js/57fc973c.779c578a.js"},{"revision":"8a4d84984b8ce5665a8ba74969e5da31","url":"assets/js/58250553.b98edb19.js"},{"revision":"3f4d170fb69ebb24ecdf0a70c00a6bc2","url":"assets/js/59e6257f.d6a6c399.js"},{"revision":"20bcb990e9cc10072dc27636b9ec5b8e","url":"assets/js/70ba0b48.854811a3.js"},{"revision":"fa01a347e0afb5c672545d971d00d5ea","url":"assets/js/78acfc31.8c142959.js"},{"revision":"6aaf3f17d205e0572769169351005cd9","url":"assets/js/7a09604b.c0c5e706.js"},{"revision":"8e6d2f82a63e916f9ba7ee03be181bd5","url":"assets/js/810c1731.bf5645a1.js"},{"revision":"34f0a07ffa6f566042e86a734e6e0899","url":"assets/js/814f3328.85e4e232.js"},{"revision":"5917e86e4598d93291781f4a5b638eeb","url":"assets/js/89cfe0af.978ff314.js"},{"revision":"15afedc82ffb6c1e78aebb826c6ba42b","url":"assets/js/8d120e59.54edabeb.js"},{"revision":"47e771ec98e2f672e3f1948252a98876","url":"assets/js/935f2afb.2103d4e8.js"},{"revision":"57bb95085734ee816334e4983b6c8ea0","url":"assets/js/941b72f3.bc89a096.js"},{"revision":"713e0b951a65182e9d0aacad7313e662","url":"assets/js/9535aee6.a8f6e0cc.js"},{"revision":"3bf89df30db3d410735eef2ee045942d","url":"assets/js/9e4087bc.c5446ff6.js"},{"revision":"d0c6252144267905581bdb52b13063ad","url":"assets/js/a424efa6.11398abb.js"},{"revision":"0a749c26ca8d944f95b25a396c70cfea","url":"assets/js/a5d0ea05.a42bae6b.js"},{"revision":"5baee14164e1169067aa90ea12b902d2","url":"assets/js/a6aa9e1f.b5c80b20.js"},{"revision":"489b1071ec26108f9a9caf076135d4ee","url":"assets/js/a7075ab6.a11a6456.js"},{"revision":"0371f7c54eee27700306f04498525f3f","url":"assets/js/a85364fe.71636793.js"},{"revision":"d310e73d49e4c5f32107c57289232a45","url":"assets/js/a88b361a.ec416e7a.js"},{"revision":"3df9cdf172a7b55c35c00f644a961cba","url":"assets/js/b2b675dd.012b82c1.js"},{"revision":"75ac634e056d2608dfb2fc2f8f39ddc2","url":"assets/js/b2f554cd.2671ec72.js"},{"revision":"164c20aadb0f8ae1cf2796d991c4a1af","url":"assets/js/bd9a2117.955bb112.js"},{"revision":"1eb96e41225cd21ea7c9b51bfdc774ea","url":"assets/js/c4f5d8e4.53679371.js"},{"revision":"e21d9ca7ac3f8088aa136c8c29033cce","url":"assets/js/ccc49370.a2148690.js"},{"revision":"3bd566920a77be3c176d273d14708f0a","url":"assets/js/d2e69c3d.32863a15.js"},{"revision":"a480bcbc7cf45e002d46577d394ad7f9","url":"assets/js/d537b4b7.17953ec4.js"},{"revision":"8ee4f3231a184e4aa9c8f7b708abcca1","url":"assets/js/d68cff99.f0680746.js"},{"revision":"4a4bdbdfbe3ef09e02e6c4ef2e1748c7","url":"assets/js/dc016e2d.d5c8dbe2.js"},{"revision":"4f35563dfca88029714f86c44069f416","url":"assets/js/df203c0f.a34912aa.js"},{"revision":"e4406cfb96df57b16354173371d39d47","url":"assets/js/main.07c2574f.js"},{"revision":"ce70d8b231a9d829e8acb96b288283e1","url":"assets/js/runtime~main.fde597fc.js"},{"revision":"2cfaecd854d4d0366ffcbc4548450d75","url":"blog/archive/index.html"},{"revision":"eedbd8d5e865529f65f077f63e9ffcb4","url":"blog/index.html"},{"revision":"1bb46f03f06deba13d20725ab609acb8","url":"blog/index/index.html"},{"revision":"2155b2e4ec984aed2f0454986039891e","url":"events/Halloween2022/index.html"},{"revision":"3fb62cce82711110d788d6838de42d92","url":"events/intro/index.html"},{"revision":"6984927289a7a588a299073bdfa0a46e","url":"events/OpenGardenDay2019/index.html"},{"revision":"3821dabfe485d9e9191f3f001ffbe0c3","url":"events/OpenGardenDay2022/61Franklin/index.html"},{"revision":"dddb3d226fda50140dad2a49da443c34","url":"events/OpenGardenDay2022/BikeTour/BikeTourRecap/index.html"},{"revision":"823e8b300777516b1f06ebd3b3976f78","url":"events/OpenGardenDay2022/BikeTour/index.html"},{"revision":"bfe60929edf7843b67cb819290488468","url":"events/OpenGardenDay2022/BikeTour/Map/index.html"},{"revision":"3ec07e79594906c0ecb8f7777d8e6e78","url":"events/OpenGardenDay2022/index.html"},{"revision":"11aa545d84e351834df8dfe4f9d711c7","url":"events/OpenGardenDay2022/RedShedOpenGardenDay/index.html"},{"revision":"34c17cc07f7506f375b06c0ba35f1e34","url":"events/OpenGardenDay2022/UrbanGardenWorkshop/index.html"},{"revision":"a449ccd6ad855009b90479f12057d927","url":"gardens/Berry-St/index.html"},{"revision":"ce61a65adaeaab790ee6b8f25aea875d","url":"gardens/BrooklynGreenway/index.html"},{"revision":"bfa3dbbf06888e77cd21c7b4cc49b528","url":"gardens/BushwickInlet/index.html"},{"revision":"e32f0db285c1eacb3f58feb7641c1a4d","url":"gardens/Cooperpark/index.html"},{"revision":"4d1342f936f9f8dd0c135c34cf0c95a0","url":"gardens/El_Puente/index.html"},{"revision":"c744c289d06c55381de08e568535d9bf","url":"gardens/Franklin/index.html"},{"revision":"81d9333da04a970732ea8a2d858d672b","url":"gardens/GrandStreet/index.html"},{"revision":"feda575ba87eef22925ce546e731a632","url":"gardens/Green-Dome/index.html"},{"revision":"17b97491e95cea1f628f3e8a51899510","url":"gardens/HooperGrove/index.html"},{"revision":"ca9cd6f6202fa6fd83a11d24a9e554ae","url":"gardens/index.html"},{"revision":"df76d9daeb0113656a272a7a66aea7b9","url":"gardens/Java-st/index.html"},{"revision":"6f00adbc0903a9a9452f5429bc516ec6","url":"gardens/Keap-fourth/index.html"},{"revision":"bc22c67ef2bdeed4f5c80eea9a979ac0","url":"gardens/LaCasitaVerde/index.html"},{"revision":"4fa7fa36d92b3df8ca16103159b20ac1","url":"gardens/Lentol/index.html"},{"revision":"bdeb483c5e6ccf7aefaca59f54e2841a","url":"gardens/NorthsideCommunityGarden/index.html"},{"revision":"8bbda66d48da485176e065d11062a356","url":"gardens/OliveSt/index.html"},{"revision":"02b8cc28884ed4bc0f150ded8385f831","url":"gardens/PowersSt/index.html"},{"revision":"59f8639ce9419d4fab96ab4262df6063","url":"gardens/Red-Shed/index.html"},{"revision":"1305bbe0d91c67ffb623b03ff80c1015","url":"gardens/Scholes-st/index.html"},{"revision":"654323cf374bc5b9439a9f62330cd4f6","url":"gardens/SouthsideCommunityGarden/index.html"},{"revision":"4bdafe8671ebfa0778ace2d709296283","url":"gardens/Sunshine-Community/index.html"},{"revision":"a83d4686b1e8396baab0ea7ff295615f","url":"gardens/tags/brooklyn/index.html"},{"revision":"21890d0e934bc5e1e9d00844e1279827","url":"gardens/tags/index.html"},{"revision":"d9333a122f1179ae5055ff4fe73ebac8","url":"gardens/TenEyck/index.html"},{"revision":"64b2a5369b1cf6ecd1000407cdb05813","url":"getting-started/archive/index.html"},{"revision":"e8041c20a5a280637b5502553c63b75d","url":"getting-started/create-a-blog-post/index.html"},{"revision":"50ceabb38b3d844414fdc3e384ed0e38","url":"getting-started/index.html"},{"revision":"82217df4e33150b5e8753591a7784dee","url":"index.html"},{"revision":"9fa871559229e3f9e666ea94f4715a49","url":"manifest.json"},{"revision":"23bdcc72c77de1da173220efec980b54","url":"markdown-page/index.html"},{"revision":"161f5f414185e9d2606d445df796531c","url":"assets/images/0-67d0238d169d1fddabb280a0fd4300ef.png"},{"revision":"f0503eee7a3f532957150c802ace0b79","url":"assets/images/1-d548b036f63fb644d8ca22550210ce2a.png"},{"revision":"2d40be662f1e07d73fc86627f8179e47","url":"assets/images/10-89c47a8bfe514716491c582930bf802a.png"},{"revision":"dd5005f6025e3138441c3269bffe0a06","url":"assets/images/11-5a59a345936e7ce01627584883d4f7a7.png"},{"revision":"a5fd7030970634800beb30d21771829e","url":"assets/images/2-b60e8cc61eb143ad8961f5462b34beb4.png"},{"revision":"e5e17d1b37665d6d3292838e52c2217f","url":"assets/images/3-f044f4c61d336b7127c9ebc41a971b4c.png"},{"revision":"117244db0fb4ee96e5aad77a3322b5fd","url":"assets/images/4-0943b32d5bd6e7daf57e0f4460c1861d.png"},{"revision":"3d898695c2b14a605cd512ef02af6c61","url":"assets/images/5-131781f5c82d2bf9d9ea0b5863d5660f.png"},{"revision":"e523dde5c7bc42d438c281e3c17f3e67","url":"assets/images/6-56f7004b31d32d6d6c762e1147ec8531.png"},{"revision":"b3414c8dfcb822b9bc98e54bfe05f8dc","url":"assets/images/7-e62f11c6ecd839da2505e7f02c558235.png"},{"revision":"b30034217edfc049cd7a2cb5c023b532","url":"assets/images/8-ed947e5e77c9230286f92f26b559cfb1.png"},{"revision":"795071941c73dce2b5218dbf6d38beba","url":"assets/images/9-81b9c34b357cdfd080233dd5ab8cf827.png"},{"revision":"80b813135c6d46a80857272c0902b098","url":"icon-192x192.png"},{"revision":"9322c4a1acdbf0d88c426e42980e50a3","url":"icon-256x256.png"},{"revision":"ea3392d7375dc9aa0b5bf7ec3233f89e","url":"icon-384x384.png"},{"revision":"7f8bea500178ce6ad96daebc51b8f6af","url":"icon-512x512.png"},{"revision":"7fa1a026116afe175cae818030d4ffc4","url":"img/docusaurus.png"},{"revision":"4343e07bf942aefb5f334501958fbc0e","url":"img/favicon.ico"},{"revision":"f24c3984a41ab80d80b12c177afac523","url":"img/logo.svg"},{"revision":"b9d9189ed8f8dd58e70d9f8b3f693b3e","url":"img/tutorial/docsVersionDropdown.png"},{"revision":"c14bff79aafafca0957ccc34ee026e2c","url":"img/tutorial/localeDropdown.png"},{"revision":"8d04d316f4d1777793ee773fcbf16cea","url":"img/undraw_docusaurus_mountain.svg"},{"revision":"3d3d63efa464a74e2befd1569465ed21","url":"img/undraw_docusaurus_react.svg"},{"revision":"932b535fc71feb29877bc4b9d708b1d0","url":"img/undraw_docusaurus_tree.svg"},{"revision":"1b73c3364fc806bcfe5b0aa5d6805db3","url":"logo.png"},{"revision":"0ffcbc4e97f36a97a3b3820b4127d3f9","url":"map-2022.svg"},{"revision":"1a629f7b3050c586804aef8e23f328fa","url":"Open Garden Flier (Green).png"},{"revision":"477dbe2629c7fe8a67b41daa3eb60000","url":"open-garden-day-2022/IG_Story.gif"},{"revision":"a570be2de03f21306739b0b030d7e67a","url":"open-garden-day-2022/opg-bike.png"},{"revision":"faa399ea54deb40c87a45f91dcd950b2","url":"OpenGarden-Day2022.gif"},{"revision":"ab1a63f290294630d313a987ea94d6c7","url":"Screenshot2022-02-26.png"},{"revision":"efcf3e6dd5f92b3b169965bddccbbd9d","url":"ShareQR2022.png"},{"revision":"161f5f414185e9d2606d445df796531c","url":"urban-gardener/0.png"},{"revision":"f0503eee7a3f532957150c802ace0b79","url":"urban-gardener/1.png"},{"revision":"2d40be662f1e07d73fc86627f8179e47","url":"urban-gardener/10.png"},{"revision":"dd5005f6025e3138441c3269bffe0a06","url":"urban-gardener/11.png"},{"revision":"a5fd7030970634800beb30d21771829e","url":"urban-gardener/2.png"},{"revision":"e5e17d1b37665d6d3292838e52c2217f","url":"urban-gardener/3.png"},{"revision":"117244db0fb4ee96e5aad77a3322b5fd","url":"urban-gardener/4.png"},{"revision":"3d898695c2b14a605cd512ef02af6c61","url":"urban-gardener/5.png"},{"revision":"e523dde5c7bc42d438c281e3c17f3e67","url":"urban-gardener/6.png"},{"revision":"b3414c8dfcb822b9bc98e54bfe05f8dc","url":"urban-gardener/7.png"},{"revision":"b30034217edfc049cd7a2cb5c023b532","url":"urban-gardener/8.png"},{"revision":"795071941c73dce2b5218dbf6d38beba","url":"urban-gardener/9.png"}],s=new v({fallbackToNetwork:!0});e.offlineMode&&(s.addToCacheList(t),e.debug&&console.log("[Docusaurus-PWA][SW]: addToCacheList",{precacheManifest:t})),await async function(e){}(),self.addEventListener("install",(t=>{e.debug&&console.log("[Docusaurus-PWA][SW]: install event",{event:t}),t.waitUntil(s.install(t))})),self.addEventListener("activate",(t=>{e.debug&&console.log("[Docusaurus-PWA][SW]: activate event",{event:t}),t.waitUntil(s.activate(t))})),self.addEventListener("fetch",(async t=>{if(e.offlineMode){const a=t.request.url,n=function(e){const t=new URL(e,self.location.href);return t.origin!==self.location.origin?[]:(t.search="",t.hash="",[t.href,`${t.href}${t.pathname.endsWith("/")?"":"/"}index.html`])}(a);for(const i of n){const r=s.getCacheKeyForURL(i);if(r){const s=caches.match(r);e.debug&&console.log("[Docusaurus-PWA][SW]: serving cached asset",{requestURL:a,possibleURL:i,possibleURLs:n,cacheKey:r,cachedResponse:s}),t.respondWith(s);break}}}})),self.addEventListener("message",(async t=>{e.debug&&console.log("[Docusaurus-PWA][SW]: message event",{event:t});const s=t.data?.type;"SKIP_WAITING"===s&&self.skipWaiting()}))})()})()})();