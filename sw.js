(()=>{"use strict";var e={913:()=>{try{self["workbox:core:6.5.2"]&&_()}catch(e){}},977:()=>{try{self["workbox:precaching:6.5.2"]&&_()}catch(e){}},80:()=>{try{self["workbox:routing:6.5.2"]&&_()}catch(e){}},873:()=>{try{self["workbox:strategies:6.5.2"]&&_()}catch(e){}}},t={};function s(a){var n=t[a];if(void 0!==n)return n.exports;var i=t[a]={exports:{}};return e[a](i,i.exports,s),i.exports}(()=>{s(913);const e=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}const a={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},n=e=>[a.prefix,e,a.suffix].filter((e=>e&&e.length>0)).join("-"),i=e=>e||n(a.precache),r=e=>e||n(a.runtime);function c(e,t){const s=t();return e.waitUntil(s),s}s(977);function o(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:a}=e;if(!a)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(a,location.href),i=new URL(a,location.href);return n.searchParams.set("__WB_REVISION__",s),{cacheKey:n.href,url:i.href}}class h{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class l{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}let u;async function f(e,s){let a=null;if(e.url){a=new URL(e.url).origin}if(a!==self.location.origin)throw new t("cross-origin-copy-response",{origin:a});const n=e.clone(),i={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},r=s?s(i):i,c=function(){if(void 0===u){const e=new Response("");if("body"in e)try{new Response(e.body),u=!0}catch(e){u=!1}u=!1}return u}()?n.body:await n.blob();return new Response(c,r)}function d(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class p{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const g=new Set;s(873);function y(e){return"string"==typeof e?new Request(e):e}class w{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new p,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:s}=this;let a=y(e);if("navigate"===a.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?a.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:s})}catch(e){if(e instanceof Error)throw new t("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}const i=a.clone();try{let e;e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:i,response:e});return e}catch(e){throw n&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:n.clone(),request:i.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=y(e);let s;const{cacheName:a,matchOptions:n}=this._strategy,i=await this.getCacheKey(t,"read"),r=Object.assign(Object.assign({},n),{cacheName:a});s=await caches.match(i,r);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:a,matchOptions:n,cachedResponse:s,request:i,event:this.event})||void 0;return s}async cachePut(e,s){const a=y(e);var n;await(n=0,new Promise((e=>setTimeout(e,n))));const i=await this.getCacheKey(a,"write");if(!s)throw new t("cache-put-with-no-response",{url:(r=i.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const c=await this._ensureResponseSafeToCache(s);if(!c)return!1;const{cacheName:o,matchOptions:h}=this._strategy,l=await self.caches.open(o),u=this.hasCallback("cacheDidUpdate"),f=u?await async function(e,t,s,a){const n=d(t.url,s);if(t.url===n)return e.match(t,a);const i=Object.assign(Object.assign({},a),{ignoreSearch:!0}),r=await e.keys(t,i);for(const t of r)if(n===d(t.url,s))return e.match(t,a)}(l,i.clone(),["__WB_REVISION__"],h):null;try{await l.put(i,u?c.clone():c)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of g)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:o,oldResponse:f,newResponse:c.clone(),request:i,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=y(await e({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),a=a=>{const n=Object.assign(Object.assign({},a),{state:s});return t[e](n)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class _ extends class{constructor(e={}){this.cacheName=r(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,n=new w(this,{event:t,request:s,params:a}),i=this._getResponse(n,s,t);return[i,this._awaitComplete(i,n,s,t)]}async _getResponse(e,s,a){let n;await e.runCallbacks("handlerWillStart",{event:a,request:s});try{if(n=await this._handle(s,e),!n||"error"===n.type)throw new t("no-response",{url:s.url})}catch(t){if(t instanceof Error)for(const i of e.iterateCallbacks("handlerDidError"))if(n=await i({error:t,event:a,request:s}),n)break;if(!n)throw t}for(const t of e.iterateCallbacks("handlerWillRespond"))n=await t({event:a,request:s,response:n});return n}async _awaitComplete(e,t,s,a){let n,i;try{n=await e}catch(i){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:n}),await t.doneWaiting()}catch(e){e instanceof Error&&(i=e)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:n,error:i}),t.destroy(),i)throw i}}{constructor(e={}){e.cacheName=i(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(_.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,s){let a;const n=s.params||{};if(!this._fallbackToNetwork)throw new t("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{0;const t=n.integrity,i=e.integrity,r=!i||i===t;if(a=await s.fetch(new Request(e,{integrity:i||t})),t&&r){this._useDefaultCacheabilityPluginIfNeeded();await s.cachePut(e,a.clone());0}}return a}async _handleInstall(e,s){this._useDefaultCacheabilityPluginIfNeeded();const a=await s.fetch(e);if(!await s.cachePut(e,a.clone()))throw new t("bad-precaching-response",{url:e.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==_.copyRedirectedCacheableResponsesPlugin&&(a===_.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(_.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}_.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},_.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await f(e):e};class v{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new _({cacheName:i(e),plugins:[...t,new l({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const s=[];for(const a of e){"string"==typeof a?s.push(a):a&&void 0===a.revision&&s.push(a.url);const{cacheKey:e,url:n}=o(a),i="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:e});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==a.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(e,a.integrity)}if(this._urlsToCacheKeys.set(n,e),this._urlsToCacheModes.set(n,i),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return c(e,(async()=>{const t=new h;this.strategy.plugins.push(t);for(const[t,s]of this._urlsToCacheKeys){const a=this._cacheKeysToIntegrities.get(s),n=this._urlsToCacheModes.get(t),i=new Request(t,{integrity:a,cache:n,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:i,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}}))}activate(e){return c(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(const n of t)s.has(n.url)||(await e.delete(n),a.push(n.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(e){const s=this.getCacheKeyForURL(e);if(!s)throw new t("non-precached-url",{url:e});return t=>(t.request=new Request(e),t.params=Object.assign({cacheKey:s},t.params),this.strategy.handle(t))}}s(80);(async()=>{const e=function(){const e=JSON.parse(new URLSearchParams(self.location.search).get("params"));return e.debug&&console.log("[Docusaurus-PWA][SW]: Service Worker params:",e),e}(),t=[{"revision":"4c16aac7c6cb3130ab7aef2e09090606","url":"404.html"},{"revision":"723295248f36e1af2192fcb062b1dbdf","url":"assets/css/styles.ddb5cb53.css"},{"revision":"69b7be617b24e7a8afbe6589839a22e6","url":"assets/js/01a85c17.274d5cac.js"},{"revision":"881133f86eed172596508fc28035d86c","url":"assets/js/068e142e.8f4a8a29.js"},{"revision":"891bab810ffa557c17fb2371227a35d8","url":"assets/js/078b638b.353cf156.js"},{"revision":"2d15c8f4387d5d03ff37f027596b5219","url":"assets/js/088296af.4f01a394.js"},{"revision":"946aee74a45a2e7284f6dafeeb1ace35","url":"assets/js/1465.a69ac96c.js"},{"revision":"a57cbeaaddd45e494cb1b6a0b01ff150","url":"assets/js/1521bd3b.82f4166f.js"},{"revision":"88f19f308c4346ec2d47ffcda6c81add","url":"assets/js/1753747f.20e9d33b.js"},{"revision":"d47e9d614652b74c057487edadb44ec9","url":"assets/js/17896441.1b6ec33e.js"},{"revision":"ae67cedc98fff7317495eb373204a89b","url":"assets/js/190256f2.748d80bb.js"},{"revision":"8f67406c84332fc659054a1d5f030de4","url":"assets/js/19b6a548.f2fbcf90.js"},{"revision":"bfaf4cfd24ee5eb427c398edfbb83ede","url":"assets/js/1be78505.5b1d7eb7.js"},{"revision":"8c2c6d2015a3ff175fe6d295ea1841af","url":"assets/js/1eb08314.61dc87cc.js"},{"revision":"18e646f87a5a8bc40b9c9c246b78756e","url":"assets/js/1ec1a0db.3f14dda1.js"},{"revision":"0b7f1d2dfe07e06ad0ff7057285c5da7","url":"assets/js/1f391b9e.3700b272.js"},{"revision":"2271ec2ad7992e27d29ccf0257131fb7","url":"assets/js/1fd6871f.405edbda.js"},{"revision":"193b0a3f2cafc0f9d64acdae0f57e8b1","url":"assets/js/227cec60.5f32c37e.js"},{"revision":"c2c45cc5613ab9d19ea363d46ae198c6","url":"assets/js/230.9164cd38.js"},{"revision":"45a892a7b3be47b246af0e7c78690156","url":"assets/js/23bae58c.3386fba2.js"},{"revision":"25a0cb73f9e82b3a7f5375ba58d1ef49","url":"assets/js/24ad2b7a.9442ef52.js"},{"revision":"6ee3ccba85a0d17efa95824f8eae3881","url":"assets/js/2724aeed.e7e7fd80.js"},{"revision":"ec892dbf5a8ce71a08034fa43dd5b1c1","url":"assets/js/2746f482.a5fb6990.js"},{"revision":"0535e68a30a906c4c20cb86ebbe54058","url":"assets/js/2d763354.a4ef1201.js"},{"revision":"cf6bf4d6d604e75a73807fb65da63bea","url":"assets/js/31fca81d.f3154338.js"},{"revision":"41c9efc9169ef9bf33723f2a38ebf6c8","url":"assets/js/3720c009.80bcd22e.js"},{"revision":"3343ca31084347cb0b2598065517cf57","url":"assets/js/38610ff3.59a693c8.js"},{"revision":"d8f708fc31f9e6c0c0eea7ddc25abb01","url":"assets/js/393be207.1e082ff5.js"},{"revision":"2a3ad13728b923810d0f884c1b3a136a","url":"assets/js/3a22bc9a.098a28ca.js"},{"revision":"277087cb3179602b69450303e772f97b","url":"assets/js/40309127.e4610532.js"},{"revision":"00a13dc9f781d5e1ad1e1884b81a35a8","url":"assets/js/41ce5ed0.e09235b7.js"},{"revision":"ccc94cfca4cc1e93fe59838a10bef008","url":"assets/js/4608.de8767de.js"},{"revision":"f06bce049fe7edbf633a5c7534d29d97","url":"assets/js/4c3cde04.5e2bb033.js"},{"revision":"9e92e99a1db5f6f8382440d74a148979","url":"assets/js/4f831626.9b415eec.js"},{"revision":"951e4c233e456b8e2f5f49cc951e95be","url":"assets/js/501add24.0aed0283.js"},{"revision":"0c7dc442645fa543ec75bae80c9b72f6","url":"assets/js/5131.37209ac5.js"},{"revision":"05055e974ed7951563c8adf9ed972267","url":"assets/js/5283.58e6bc88.js"},{"revision":"d20b216c66ba561efe4499622b926446","url":"assets/js/5290.468550d0.js"},{"revision":"58993c21e7ab52a23d172a22a76b051d","url":"assets/js/53e0a087.4bae4782.js"},{"revision":"aa28f566e011cef06f513b5c5a11875b","url":"assets/js/550ed89b.9227163c.js"},{"revision":"2d01bf7ec550d66303ae694ede694b38","url":"assets/js/57fc973c.79dd2b73.js"},{"revision":"8a4d84984b8ce5665a8ba74969e5da31","url":"assets/js/58250553.b98edb19.js"},{"revision":"92759d8649733133f2f70f0dfc5cbe6c","url":"assets/js/5986c9ad.b2800fbd.js"},{"revision":"3f4d170fb69ebb24ecdf0a70c00a6bc2","url":"assets/js/59e6257f.d6a6c399.js"},{"revision":"b0095c296f31c8c8d4ba6278f09eeebf","url":"assets/js/6539df70.88231a88.js"},{"revision":"2905a20fcd9a052d099db73098f21abb","url":"assets/js/6875c492.53430f10.js"},{"revision":"9dc745b42d944dbd1d27d02b5e9dda80","url":"assets/js/69b09ea9.4ea7f21f.js"},{"revision":"20bcb990e9cc10072dc27636b9ec5b8e","url":"assets/js/70ba0b48.854811a3.js"},{"revision":"5b48a8ed974dc868149961d6a0521b2d","url":"assets/js/78acfc31.4b1394b9.js"},{"revision":"6aaf3f17d205e0572769169351005cd9","url":"assets/js/7a09604b.c0c5e706.js"},{"revision":"8e6d2f82a63e916f9ba7ee03be181bd5","url":"assets/js/810c1731.bf5645a1.js"},{"revision":"7f8a9246c2ab0c192cfd888fa26b4f2a","url":"assets/js/814f3328.0fa3b343.js"},{"revision":"5917e86e4598d93291781f4a5b638eeb","url":"assets/js/89cfe0af.978ff314.js"},{"revision":"15afedc82ffb6c1e78aebb826c6ba42b","url":"assets/js/8d120e59.54edabeb.js"},{"revision":"c8e74e8ab0e1855071b18a45ed4c6101","url":"assets/js/935f2afb.d9c64594.js"},{"revision":"713e0b951a65182e9d0aacad7313e662","url":"assets/js/9535aee6.a8f6e0cc.js"},{"revision":"948e1a063f7ea9aceef780a5607d3192","url":"assets/js/9e4087bc.e3faca61.js"},{"revision":"0a749c26ca8d944f95b25a396c70cfea","url":"assets/js/a5d0ea05.a42bae6b.js"},{"revision":"b778c348a7a530675b33af9f17841ac5","url":"assets/js/a6aa9e1f.302eb6c5.js"},{"revision":"3988669403773d90b5000d6f60bd1b2c","url":"assets/js/a7023ddc.29687867.js"},{"revision":"489b1071ec26108f9a9caf076135d4ee","url":"assets/js/a7075ab6.a11a6456.js"},{"revision":"0371f7c54eee27700306f04498525f3f","url":"assets/js/a85364fe.71636793.js"},{"revision":"d310e73d49e4c5f32107c57289232a45","url":"assets/js/a88b361a.ec416e7a.js"},{"revision":"284bbc9c58a9e01a4e68c4a5efcad5aa","url":"assets/js/afaff11a.430c071b.js"},{"revision":"00f34d3661f15a5eb6937866b3664692","url":"assets/js/b2b675dd.83490820.js"},{"revision":"c3295387525342e41480c74048f09540","url":"assets/js/b2f554cd.5e226faa.js"},{"revision":"466d52b4b5ebd335d47127ccdfe54063","url":"assets/js/bca61705.b17d0e49.js"},{"revision":"164c20aadb0f8ae1cf2796d991c4a1af","url":"assets/js/bd9a2117.955bb112.js"},{"revision":"7df3694a31ec9cc8eed28f505a148cb6","url":"assets/js/c288d9fd.503d1bef.js"},{"revision":"5e392b7cbd8e8aff2e49d7ab525f5019","url":"assets/js/c4f5d8e4.64e84807.js"},{"revision":"020e80352719aa9010e163051668d494","url":"assets/js/c8b16e43.ee776823.js"},{"revision":"5930e24e68c2666856cadbe015762b1d","url":"assets/js/ccc49370.3c92ac08.js"},{"revision":"5107d47000a430705883d627f5dcfbe1","url":"assets/js/d39bc86f.c78969cd.js"},{"revision":"a480bcbc7cf45e002d46577d394ad7f9","url":"assets/js/d537b4b7.17953ec4.js"},{"revision":"8ee4f3231a184e4aa9c8f7b708abcca1","url":"assets/js/d68cff99.f0680746.js"},{"revision":"8ca0d407d0aa53e07a211fb3c8e18092","url":"assets/js/df203c0f.392b8600.js"},{"revision":"25d656aafbbaa8f4497a974accecb071","url":"assets/js/ef5817d4.746cea9d.js"},{"revision":"3ba89c7b14129b2e918f1b6c4727ea95","url":"assets/js/main.e3a2db7e.js"},{"revision":"88ded9f8ed57d3d4111833b201e51c46","url":"assets/js/runtime~main.3514d961.js"},{"revision":"7dc8797a7b7db416f9faba59d39ba6f8","url":"blog/archive/index.html"},{"revision":"39deda3d0c24620e8499487a7b9d035e","url":"blog/index.html"},{"revision":"8fdf753eec7a1674cbac62f6a35d9585","url":"blog/notes-3-2-2022/index.html"},{"revision":"b0c6e72ef04f7ee4cd9477f4819e82e5","url":"blog/Open-Garden-Day-Planning Session-3-2-2022/index.html"},{"revision":"1771253174461155d95ac81ae09047f2","url":"blog/tags/bike/index.html"},{"revision":"3bbf38a74d4635dc394dd38d221736af","url":"blog/tags/community/index.html"},{"revision":"db566b5a4a74594c8599d212e4d30a4f","url":"blog/tags/index.html"},{"revision":"07a27e5bc6a17111afff1adf01e160a8","url":"blog/tags/open-garden-day/index.html"},{"revision":"64533995aeeb49cd27fd1d936e330810","url":"events/61Franklin/index.html"},{"revision":"3668fe32c0f6b8fa52d0bdf2e358ebe5","url":"events/intro/index.html"},{"revision":"637ff73ab93c5d80890aeddf105a50f3","url":"events/OpenGardenDay2019/index.html"},{"revision":"aeb3183e6f46fa66a3a59924a6f2c656","url":"events/OpenGardenDay2022/index.html"},{"revision":"d1dcd55a800fa0f037326a0e087fa6cf","url":"events/OpenGardenDay2022/Map/index.html"},{"revision":"dfdb0dd61ee1ef66271e81f0f0820a16","url":"events/RedShedOpenGardenDay/index.html"},{"revision":"1a00b82c60043f1806c08e71ee522fff","url":"events/UrbanGardenWorkshop/index.html"},{"revision":"ab334097c991dc1ee567422ef55e6d86","url":"gardens/Berry-St/index.html"},{"revision":"ebfdec922ab8b53248a9bec94835299c","url":"gardens/BrooklynGreenway/index.html"},{"revision":"133aa167811ad41e467d8250c2847dc9","url":"gardens/BushwickInlet/index.html"},{"revision":"ef3c3420f88322b5ca5b8ddf46230a6f","url":"gardens/Cooperpark/index.html"},{"revision":"1c64cf0d45b5ad398351e4f2cc97ac18","url":"gardens/El_Puente/index.html"},{"revision":"b3b31825d3f0feaec0d12a33e2e99575","url":"gardens/Franklin/index.html"},{"revision":"18254715e712d660d4e804e0fe897fe9","url":"gardens/GrandStreet/index.html"},{"revision":"b588e19f41da7b938a78ba27efa709e0","url":"gardens/Green-Dome/index.html"},{"revision":"d28ccc368f7180a9607befd4ed788a98","url":"gardens/HooperGrove/index.html"},{"revision":"2af358b97c2f55bd43c6d1eb990b8004","url":"gardens/index.html"},{"revision":"b8583cb43b69d9a956188ceb9a391e9a","url":"gardens/Java-st/index.html"},{"revision":"62399d58a803f1b49e1692ca097214af","url":"gardens/Keap-fourth/index.html"},{"revision":"0db9e84c6a808c38c2d02e5e00b8f1af","url":"gardens/LaCasitaVerde/index.html"},{"revision":"b2e4fc323b11260ac51fefd2e09d3a4d","url":"gardens/Lentol/index.html"},{"revision":"00629af3c90712602fb3d1d5738da4fc","url":"gardens/NorthsideCommunityGarden/index.html"},{"revision":"c1d3244bcbf7cf3bf0a2fc30a32be764","url":"gardens/OliveSt/index.html"},{"revision":"08b6a90a3572d259203ef8e3fa08e8b6","url":"gardens/PowersSt/index.html"},{"revision":"087a374e68ff4e5fbfc5665004d7f637","url":"gardens/Red-Shed/index.html"},{"revision":"acd54d7210cabf4d9a621c030cdd0230","url":"gardens/Scholes-st/index.html"},{"revision":"c92aa86ff6f62d977ce72a240b342eef","url":"gardens/SouthsideCommunityGarden/index.html"},{"revision":"0a1fca1595cf9451a394d2c9787e4f2e","url":"gardens/Sunshine-Community/index.html"},{"revision":"e9b7eccf8bb80348f3be4035ab2ccd0d","url":"gardens/tags/brooklyn/index.html"},{"revision":"928ecd6466ea679b22a064b726973099","url":"gardens/tags/index.html"},{"revision":"b0f9f001b9a2dac01abaaea2ecf504ac","url":"gardens/TenEyck/index.html"},{"revision":"06778429415150ae8b7b4aa3d3111500","url":"getting-started/archive/index.html"},{"revision":"776e061aedb2ec8169bc571f838a4e51","url":"getting-started/create-a-blog-post/index.html"},{"revision":"c8cd44add0e72902daf3e20c2e15dfd4","url":"getting-started/index.html"},{"revision":"ff4e476430b7fbbfba47765c36125a29","url":"index.html"},{"revision":"9fa871559229e3f9e666ea94f4715a49","url":"manifest.json"},{"revision":"91b658d59c9b06bcf35d6d8a86c21a92","url":"markdown-page/index.html"},{"revision":"161f5f414185e9d2606d445df796531c","url":"assets/images/0-67d0238d169d1fddabb280a0fd4300ef.png"},{"revision":"f0503eee7a3f532957150c802ace0b79","url":"assets/images/1-d548b036f63fb644d8ca22550210ce2a.png"},{"revision":"2d40be662f1e07d73fc86627f8179e47","url":"assets/images/10-89c47a8bfe514716491c582930bf802a.png"},{"revision":"dd5005f6025e3138441c3269bffe0a06","url":"assets/images/11-5a59a345936e7ce01627584883d4f7a7.png"},{"revision":"a5fd7030970634800beb30d21771829e","url":"assets/images/2-b60e8cc61eb143ad8961f5462b34beb4.png"},{"revision":"e5e17d1b37665d6d3292838e52c2217f","url":"assets/images/3-f044f4c61d336b7127c9ebc41a971b4c.png"},{"revision":"117244db0fb4ee96e5aad77a3322b5fd","url":"assets/images/4-0943b32d5bd6e7daf57e0f4460c1861d.png"},{"revision":"3d898695c2b14a605cd512ef02af6c61","url":"assets/images/5-131781f5c82d2bf9d9ea0b5863d5660f.png"},{"revision":"e523dde5c7bc42d438c281e3c17f3e67","url":"assets/images/6-56f7004b31d32d6d6c762e1147ec8531.png"},{"revision":"b3414c8dfcb822b9bc98e54bfe05f8dc","url":"assets/images/7-e62f11c6ecd839da2505e7f02c558235.png"},{"revision":"b30034217edfc049cd7a2cb5c023b532","url":"assets/images/8-ed947e5e77c9230286f92f26b559cfb1.png"},{"revision":"795071941c73dce2b5218dbf6d38beba","url":"assets/images/9-81b9c34b357cdfd080233dd5ab8cf827.png"},{"revision":"80b813135c6d46a80857272c0902b098","url":"icon-192x192.png"},{"revision":"9322c4a1acdbf0d88c426e42980e50a3","url":"icon-256x256.png"},{"revision":"ea3392d7375dc9aa0b5bf7ec3233f89e","url":"icon-384x384.png"},{"revision":"7f8bea500178ce6ad96daebc51b8f6af","url":"icon-512x512.png"},{"revision":"7fa1a026116afe175cae818030d4ffc4","url":"img/docusaurus.png"},{"revision":"4343e07bf942aefb5f334501958fbc0e","url":"img/favicon.ico"},{"revision":"f24c3984a41ab80d80b12c177afac523","url":"img/logo.svg"},{"revision":"b9d9189ed8f8dd58e70d9f8b3f693b3e","url":"img/tutorial/docsVersionDropdown.png"},{"revision":"c14bff79aafafca0957ccc34ee026e2c","url":"img/tutorial/localeDropdown.png"},{"revision":"8d04d316f4d1777793ee773fcbf16cea","url":"img/undraw_docusaurus_mountain.svg"},{"revision":"3d3d63efa464a74e2befd1569465ed21","url":"img/undraw_docusaurus_react.svg"},{"revision":"932b535fc71feb29877bc4b9d708b1d0","url":"img/undraw_docusaurus_tree.svg"},{"revision":"1b73c3364fc806bcfe5b0aa5d6805db3","url":"logo.png"},{"revision":"0ffcbc4e97f36a97a3b3820b4127d3f9","url":"map-2022.svg"},{"revision":"1a629f7b3050c586804aef8e23f328fa","url":"Open Garden Flier (Green).png"},{"revision":"477dbe2629c7fe8a67b41daa3eb60000","url":"open-garden-day-2022/IG_Story.gif"},{"revision":"a570be2de03f21306739b0b030d7e67a","url":"open-garden-day-2022/opg-bike.png"},{"revision":"faa399ea54deb40c87a45f91dcd950b2","url":"OpenGarden-Day2022.gif"},{"revision":"ab1a63f290294630d313a987ea94d6c7","url":"Screenshot2022-02-26.png"},{"revision":"efcf3e6dd5f92b3b169965bddccbbd9d","url":"ShareQR2022.png"},{"revision":"161f5f414185e9d2606d445df796531c","url":"urban-gardener/0.png"},{"revision":"f0503eee7a3f532957150c802ace0b79","url":"urban-gardener/1.png"},{"revision":"2d40be662f1e07d73fc86627f8179e47","url":"urban-gardener/10.png"},{"revision":"dd5005f6025e3138441c3269bffe0a06","url":"urban-gardener/11.png"},{"revision":"a5fd7030970634800beb30d21771829e","url":"urban-gardener/2.png"},{"revision":"e5e17d1b37665d6d3292838e52c2217f","url":"urban-gardener/3.png"},{"revision":"117244db0fb4ee96e5aad77a3322b5fd","url":"urban-gardener/4.png"},{"revision":"3d898695c2b14a605cd512ef02af6c61","url":"urban-gardener/5.png"},{"revision":"e523dde5c7bc42d438c281e3c17f3e67","url":"urban-gardener/6.png"},{"revision":"b3414c8dfcb822b9bc98e54bfe05f8dc","url":"urban-gardener/7.png"},{"revision":"b30034217edfc049cd7a2cb5c023b532","url":"urban-gardener/8.png"},{"revision":"795071941c73dce2b5218dbf6d38beba","url":"urban-gardener/9.png"}],s=new v({fallbackToNetwork:!0});e.offlineMode&&(s.addToCacheList(t),e.debug&&console.log("[Docusaurus-PWA][SW]: addToCacheList",{precacheManifest:t})),await async function(e){}(),self.addEventListener("install",(t=>{e.debug&&console.log("[Docusaurus-PWA][SW]: install event",{event:t}),t.waitUntil(s.install(t))})),self.addEventListener("activate",(t=>{e.debug&&console.log("[Docusaurus-PWA][SW]: activate event",{event:t}),t.waitUntil(s.activate(t))})),self.addEventListener("fetch",(async t=>{if(e.offlineMode){const a=t.request.url,n=function(e){const t=[],s=new URL(e,self.location.href);return s.origin!==self.location.origin||(s.search="",s.hash="",t.push(s.href),s.pathname.endsWith("/")?t.push(`${s.href}index.html`):t.push(`${s.href}/index.html`)),t}(a);for(let i=0;i<n.length;i+=1){const r=n[i],c=s.getCacheKeyForURL(r);if(c){const s=caches.match(c);e.debug&&console.log("[Docusaurus-PWA][SW]: serving cached asset",{requestURL:a,possibleURL:r,possibleURLs:n,cacheKey:c,cachedResponse:s}),t.respondWith(s);break}}}})),self.addEventListener("message",(async t=>{e.debug&&console.log("[Docusaurus-PWA][SW]: message event",{event:t});const s=t.data?.type;"SKIP_WAITING"===s&&self.skipWaiting()}))})()})()})();