const settings = {
  "showPronouns": true,
  "showFrogEmotes": true
};
const overrides = {
  "ffz": {
    // "emote_id": "other_emote_id", // replace emote
    // "emote_id": null, // remove emote
  },
  "bttv": {
    // "emote_id": "other_emote_id", // replace emote
    // "emote_id": null, // remove emote
  },
  "7tv": {
    // "emote_id": "other_emote_id", // replace emote
    // "emote_id": null, // remove emote
  }
};
/* version 2.1.2 */
"use strict";(()=>{var Ge=Object.create;var le=Object.defineProperty;var Xe=Object.getOwnPropertyDescriptor;var Je=Object.getOwnPropertyNames;var Ye=Object.getPrototypeOf,Ze=Object.prototype.hasOwnProperty;var Qe=(u,e)=>()=>(e||u((e={exports:{}}).exports,e),e.exports);var ed=(u,e,d,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Je(e))!Ze.call(u,r)&&r!==d&&le(u,r,{get:()=>e[r],enumerable:!(t=Xe(e,r))||t.enumerable});return u};var V=(u,e,d)=>(d=u!=null?Ge(Ye(u)):{},ed(e||!u||!u.__esModule?le(d,"default",{value:u,enumerable:!0}):d,u));var D=Qe((Wd,ie)=>{"use strict";var j=typeof Reflect=="object"?Reflect:null,_e=j&&typeof j.apply=="function"?j.apply:function(e,d,t){return Function.prototype.apply.call(e,d,t)},Z;j&&typeof j.ownKeys=="function"?Z=j.ownKeys:Object.getOwnPropertySymbols?Z=function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:Z=function(e){return Object.getOwnPropertyNames(e)};function bd(u){console&&console.warn&&console.warn(u)}var we=Number.isNaN||function(e){return e!==e};function h(){h.init.call(this)}ie.exports=h;ie.exports.once=Ed;h.EventEmitter=h;h.prototype._events=void 0;h.prototype._eventsCount=0;h.prototype._maxListeners=void 0;var Ae=10;function Q(u){if(typeof u!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof u)}Object.defineProperty(h,"defaultMaxListeners",{enumerable:!0,get:function(){return Ae},set:function(u){if(typeof u!="number"||u<0||we(u))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+u+".");Ae=u}});h.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0};h.prototype.setMaxListeners=function(e){if(typeof e!="number"||e<0||we(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this};function Ce(u){return u._maxListeners===void 0?h.defaultMaxListeners:u._maxListeners}h.prototype.getMaxListeners=function(){return Ce(this)};h.prototype.emit=function(e){for(var d=[],t=1;t<arguments.length;t++)d.push(arguments[t]);var r=e==="error",n=this._events;if(n!==void 0)r=r&&n.error===void 0;else if(!r)return!1;if(r){var f;if(d.length>0&&(f=d[0]),f instanceof Error)throw f;var s=new Error("Unhandled error."+(f?" ("+f.message+")":""));throw s.context=f,s}var i=n[e];if(i===void 0)return!1;if(typeof i=="function")_e(i,this,d);else for(var a=i.length,m=Te(i,a),t=0;t<a;++t)_e(m[t],this,d);return!0};function Le(u,e,d,t){var r,n,f;if(Q(d),n=u._events,n===void 0?(n=u._events=Object.create(null),u._eventsCount=0):(n.newListener!==void 0&&(u.emit("newListener",e,d.listener?d.listener:d),n=u._events),f=n[e]),f===void 0)f=n[e]=d,++u._eventsCount;else if(typeof f=="function"?f=n[e]=t?[d,f]:[f,d]:t?f.unshift(d):f.push(d),r=Ce(u),r>0&&f.length>r&&!f.warned){f.warned=!0;var s=new Error("Possible EventEmitter memory leak detected. "+f.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");s.name="MaxListenersExceededWarning",s.emitter=u,s.type=e,s.count=f.length,bd(s)}return u}h.prototype.addListener=function(e,d){return Le(this,e,d,!1)};h.prototype.on=h.prototype.addListener;h.prototype.prependListener=function(e,d){return Le(this,e,d,!0)};function vd(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function Pe(u,e,d){var t={fired:!1,wrapFn:void 0,target:u,type:e,listener:d},r=vd.bind(t);return r.listener=d,t.wrapFn=r,r}h.prototype.once=function(e,d){return Q(d),this.on(e,Pe(this,e,d)),this};h.prototype.prependOnceListener=function(e,d){return Q(d),this.prependListener(e,Pe(this,e,d)),this};h.prototype.removeListener=function(e,d){var t,r,n,f,s;if(Q(d),r=this._events,r===void 0)return this;if(t=r[e],t===void 0)return this;if(t===d||t.listener===d)--this._eventsCount===0?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,t.listener||d));else if(typeof t!="function"){for(n=-1,f=t.length-1;f>=0;f--)if(t[f]===d||t[f].listener===d){s=t[f].listener,n=f;break}if(n<0)return this;n===0?t.shift():xd(t,n),t.length===1&&(r[e]=t[0]),r.removeListener!==void 0&&this.emit("removeListener",e,s||d)}return this};h.prototype.off=h.prototype.removeListener;h.prototype.removeAllListeners=function(e){var d,t,r;if(t=this._events,t===void 0)return this;if(t.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):t[e]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete t[e]),this;if(arguments.length===0){var n=Object.keys(t),f;for(r=0;r<n.length;++r)f=n[r],f!=="removeListener"&&this.removeAllListeners(f);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(d=t[e],typeof d=="function")this.removeListener(e,d);else if(d!==void 0)for(r=d.length-1;r>=0;r--)this.removeListener(e,d[r]);return this};function Me(u,e,d){var t=u._events;if(t===void 0)return[];var r=t[e];return r===void 0?[]:typeof r=="function"?d?[r.listener||r]:[r]:d?yd(r):Te(r,r.length)}h.prototype.listeners=function(e){return Me(this,e,!0)};h.prototype.rawListeners=function(e){return Me(this,e,!1)};h.listenerCount=function(u,e){return typeof u.listenerCount=="function"?u.listenerCount(e):Ie.call(u,e)};h.prototype.listenerCount=Ie;function Ie(u){var e=this._events;if(e!==void 0){var d=e[u];if(typeof d=="function")return 1;if(d!==void 0)return d.length}return 0}h.prototype.eventNames=function(){return this._eventsCount>0?Z(this._events):[]};function Te(u,e){for(var d=new Array(e),t=0;t<e;++t)d[t]=u[t];return d}function xd(u,e){for(;e+1<u.length;e++)u[e]=u[e+1];u.pop()}function yd(u){for(var e=new Array(u.length),d=0;d<e.length;++d)e[d]=u[d].listener||u[d];return e}function Ed(u,e){return new Promise(function(d,t){function r(f){u.removeListener(e,n),t(f)}function n(){typeof u.removeListener=="function"&&u.removeListener("error",r),d([].slice.call(arguments))}ze(u,e,n,{once:!0}),e!=="error"&&_d(u,r,{once:!0})})}function _d(u,e,d){typeof u.on=="function"&&ze(u,"error",e,d)}function ze(u,e,d,t){if(typeof u.on=="function")t.once?u.once(e,d):u.on(e,d);else if(typeof u.addEventListener=="function")u.addEventListener(e,function r(n){t.once&&u.removeEventListener(e,r),d(n)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof u)}});var K=class{constructor(){this.command="CLEARCHAT"}handleCommand(e){let d=e.tags["target-user-id"],t=e.body;d==null&&t==null&&this.removeAllLogs(),d!=null&&this.removeAllBySelector('[data-user-id="'+d+'"]'),t!=null&&this.removeAllBySelector('[data-from="'+t+'" i]')}removeAllBySelector(e){document.querySelectorAll(e).forEach(t=>t.remove())}removeAllLogs(){let e=document.getElementById("log");e!=null&&e.replaceChildren()}};var O=class{constructor(e){this.elements=[...document.querySelectorAll(e)]}get length(){return this.elements.length}forEach(e,d){this.elements.forEach(t=>{(d==null||t instanceof d)&&e(t)})}get(e,d){let t=this.elements.flatMap(r=>[...r.getElementsByClassName(e)]);return d==null?t:t.filter(r=>r instanceof d)}};var G=class{constructor(){this.command="PRIVMSG";this.validUsername=/^[a-z0-9_]{2,}$/;this.actions=[];this.actionsWithContext=[]}addAction(e){this.actions.push(e)}addActionWithContext(e){this.actionsWithContext.push(e)}elements(e,d){return e.flatMap(t=>[...t.getElementsByClassName(d)])}logError(e,d){console.error(e+" for message id "+d.messageId+" and username "+d.from)}handleCommand(e){let d=new O('[data-id="'+e.messageId+'"]');if(d.length==0&&(d=new O('[data-from="'+e.tags["display-name"]+'"]:last-child'),d.length==0)){this.logError("message div not found",e);return}this.actions.forEach(n=>n(d,e));let t=e.tags["user-id"];if(t==null){this.logError("unknown user id",e);return}d.forEach(n=>n.dataset.userId=t,HTMLElement);let r=this.extractUsername(e);if(r==null){this.logError("unknown username",e);return}this.actionsWithContext.forEach(n=>n(d,{userId:t,username:r}))}extractUsername(e){if(e.from.match(this.validUsername))return e.from;let d=e.payload.prefix,t=d.indexOf("!");if(t!=-1){if(d=d.substring(0,t),d.match(this.validUsername))return d;d=d.substring(t+1)}return t=d.indexOf("@"),t!=-1&&(d=d.substring(0,t)),d.match(this.validUsername)?d:null}};var X=class{constructor(e){this.map={};this.features=e}eventReceived(e){if(e instanceof CustomEvent){let d=this.map[e.detail.command];if(d!=null)return d.handleCommand(e.detail)}}register(e){this.map[e.command]=e}async load(){let e=new G,d={forClass(t,r,n){e.addAction((f,s)=>{f.get(t,r).forEach(i=>n(i,s))})},forClassWithContext(t,r,n){e.addActionWithContext((f,s)=>{f.get(t,r).forEach(i=>n(i,s))})}};await Promise.all(this.features.map(t=>t.load(d))),this.register(e),console.log("ready to meow!")}async run(){this.register(new K),document.addEventListener("onEventReceived",e=>this.eventReceived(e)),await this.load()}};function k(u,e,d){return Math.min(Math.max(u,d),e)}var se=class extends Error{constructor(e){super(`Failed to parse color: "${e}"`)}},R=se;function ge(u){if(typeof u!="string")throw new R(u);if(u.trim().toLowerCase()==="transparent")return[0,0,0,0];let e=u.trim();e=id.test(u)?td(u):u;let d=rd.exec(e);if(d){let f=Array.from(d).slice(1);return[...f.slice(0,3).map(s=>parseInt($(s,2),16)),parseInt($(f[3]||"f",2),16)/255]}let t=nd.exec(e);if(t){let f=Array.from(t).slice(1);return[...f.slice(0,3).map(s=>parseInt(s,16)),parseInt(f[3]||"ff",16)/255]}let r=fd.exec(e);if(r){let f=Array.from(r).slice(1);return[...f.slice(0,3).map(s=>parseInt(s,10)),parseFloat(f[3]||"1")]}let n=sd.exec(e);if(n){let[f,s,i,a]=Array.from(n).slice(1).map(parseFloat);if(k(0,100,s)!==s)throw new R(u);if(k(0,100,i)!==i)throw new R(u);return[...cd(f,s,i),Number.isNaN(a)?1:a]}throw new R(u)}function dd(u){let e=5381,d=u.length;for(;d;)e=e*33^u.charCodeAt(--d);return(e>>>0)%2341}var he=u=>parseInt(u.replace(/_/g,""),36),ud="1q29ehhb 1n09sgk7 1kl1ekf_ _yl4zsno 16z9eiv3 1p29lhp8 _bd9zg04 17u0____ _iw9zhe5 _to73___ _r45e31e _7l6g016 _jh8ouiv _zn3qba8 1jy4zshs 11u87k0u 1ro9yvyo 1aj3xael 1gz9zjz0 _3w8l4xo 1bf1ekf_ _ke3v___ _4rrkb__ 13j776yz _646mbhl _nrjr4__ _le6mbhl 1n37ehkb _m75f91n _qj3bzfz 1939yygw 11i5z6x8 _1k5f8xs 1509441m 15t5lwgf _ae2th1n _tg1ugcv 1lp1ugcv 16e14up_ _h55rw7n _ny9yavn _7a11xb_ 1ih442g9 _pv442g9 1mv16xof 14e6y7tu 1oo9zkds 17d1cisi _4v9y70f _y98m8kc 1019pq0v 12o9zda8 _348j4f4 1et50i2o _8epa8__ _ts6senj 1o350i2o 1mi9eiuo 1259yrp0 1ln80gnw _632xcoy 1cn9zldc _f29edu4 1n490c8q _9f9ziet 1b94vk74 _m49zkct 1kz6s73a 1eu9dtog _q58s1rz 1dy9sjiq __u89jo3 _aj5nkwg _ld89jo3 13h9z6wx _qa9z2ii _l119xgq _bs5arju 1hj4nwk9 1qt4nwk9 1ge6wau6 14j9zlcw 11p1edc_ _ms1zcxe _439shk6 _jt9y70f _754zsow 1la40eju _oq5p___ _x279qkz 1fa5r3rv _yd2d9ip _424tcku _8y1di2_ _zi2uabw _yy7rn9h 12yz980_ __39ljp6 1b59zg0x _n39zfzp 1fy9zest _b33k___ _hp9wq92 1il50hz4 _io472ub _lj9z3eo 19z9ykg0 _8t8iu3a 12b9bl4a 1ak5yw0o _896v4ku _tb8k8lv _s59zi6t _c09ze0p 1lg80oqn 1id9z8wb _238nba5 1kq6wgdi _154zssg _tn3zk49 _da9y6tc 1sg7cv4f _r12jvtt 1gq5fmkz 1cs9rvci _lp9jn1c _xw1tdnb 13f9zje6 16f6973h _vo7ir40 _bt5arjf _rc45e4t _hr4e100 10v4e100 _hc9zke2 _w91egv_ _sj2r1kk 13c87yx8 _vqpds__ _ni8ggk8 _tj9yqfb 1ia2j4r4 _7x9b10u 1fc9ld4j 1eq9zldr _5j9lhpx _ez9zl6o _md61fzm".split(" ").reduce((u,e)=>{let d=he(e.substring(0,3)),t=he(e.substring(3)).toString(16),r="";for(let n=0;n<6-t.length;n++)r+="0";return u[d]=`${r}${t}`,u},{});function td(u){let e=u.toLowerCase().trim(),d=ud[dd(e)];if(!d)throw new R(u);return`#${d}`}var $=(u,e)=>Array.from(Array(e)).map(()=>u).join(""),rd=new RegExp(`^#${$("([a-f0-9])",3)}([a-f0-9])?$`,"i"),nd=new RegExp(`^#${$("([a-f0-9]{2})",3)}([a-f0-9]{2})?$`,"i"),fd=new RegExp(`^rgba?\\(\\s*(\\d+)\\s*${$(",\\s*(\\d+)\\s*",2)}(?:,\\s*([\\d.]+))?\\s*\\)$`,"i"),sd=/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i,id=/^[a-z]+$/i,me=u=>Math.round(u*255),cd=(u,e,d)=>{let t=d/100;if(e===0)return[t,t,t].map(me);let r=(u%360+360)%360/60,n=(1-Math.abs(2*t-1))*(e/100),f=n*(1-Math.abs(r%2-1)),s=0,i=0,a=0;r>=0&&r<1?(s=n,i=f):r>=1&&r<2?(s=f,i=n):r>=2&&r<3?(i=n,a=f):r>=3&&r<4?(i=f,a=n):r>=4&&r<5?(s=f,a=n):r>=5&&r<6&&(s=n,a=f);let m=t-n/2,A=s+m,y=i+m,M=a+m;return[A,y,M].map(me)};function od(u){let[e,d,t,r]=ge(u).map((A,y)=>y===3?A:A/255),n=Math.max(e,d,t),f=Math.min(e,d,t),s=(n+f)/2;if(n===f)return[0,0,s,r];let i=n-f,a=s>.5?i/(2-n-f):i/(n+f);return[60*(e===n?(d-t)/i+(d<t?6:0):d===n?(t-e)/i+2:(e-d)/i+4),a,s,r]}function ad(u,e,d,t){return`hsla(${(u%360).toFixed()}, ${k(0,100,e*100).toFixed()}%, ${k(0,100,d*100).toFixed()}%, ${parseFloat(k(0,1,t).toFixed(3))})`}function ld(u,e){let[d,t,r,n]=od(u);return ad(d,t,r-e,n)}function pe(u){if(u==="transparent")return 0;function e(n){let f=n/255;return f<=.03928?f/12.92:Math.pow((f+.055)/1.055,2.4)}let[d,t,r]=ge(u);return .2126*e(d)+.7152*e(t)+.0722*e(r)}function hd(u,e){let d=pe(u),t=pe(e);return d>t?(d+.05)/(t+.05):(t+.05)/(d+.05)}var md={decorative:1.5,readable:3,aa:4.5,aaa:7};function be(u,e="aa",d="#fff"){return hd(u,d)<md[e]}function ve(u,e){return ld(u,-e)}var xe={setNameColor(u){if(u.dataset.color!=null){let e=u.dataset.color,d=0;for(;be(e,"readable","black")&&(e=ve(e,.1),d++,!(d>=5)););u.style.color=e}},async load(u){u.forClass("name",HTMLElement,this.setNameColor.bind(this))}};var J={bttv:{"55b6524154eefd53777b2580":"FeelsBirthdayMan","56e9f494fff3cc5c35e5287e":"monkaS","566c9fc265dbbdab32ec053b":"FeelsBadMan","566c9fde65dbbdab32ec053e":"FeelsGoodMan","5733ff12e72c3c0814233e20":"FeelsAmazingMan"},"7tv":{"60e5d610a69fc8d27f2737b7":"Stare","62f9c69136c62011a8c3cb80":"PepePls","647c81cdd4b5d6083e9200fc":"peepoPls","6297ed14d1b61557a52b21cb":"Gayge","63018e81f7723932b45bff60":"peepoHappy","63019cd97f31c2c757a21162":"peepoSad","63045f7dd9bf10a26e1a1d02":"knaDyppaHopeep","63065b00b7e5a120600a2df6":"FeelsStrongMan","63065b70be8c19d70f9d6633":"ppL","63071b80942ffb69e13d700f":"EZ","63071bb9464de28875c52531":"FeelsDankMan","6306606b28f42e96cc0df332":"FeelsWeirdMan","62589908caeec18915c90a9b":"ApuApustaja","630660200e929d2fde44db5b":"FeelsOkayMan"}};function F(u){return u}var S=class extends Error{constructor(d,t){super(d);Object.setPrototypeOf(this,new.target.prototype),this.replaceWith=t}};function ye(u){if(u==null)throw new S;return u}function Y(u){if(!(!settings.showFrogEmotes&&u in J)&&!(overrides!=null&&u in overrides&&overrides[u]!=null&&Object.keys(overrides[u]).length>0))return F;let e=overrides[u];return d=>{if(d in e)return ye(e[d]);if("*"in e)return ye(e["*"]);if(!settings.showFrogEmotes&&u in J&&d in J[u])throw new S("frog",J[u][d]);return d}}function pd(u){return u.split(/(,|\/)/).flatMap(e=>{let d=/^(?<emoteID>.*):(?<startPosition>[0-9]+)-(?<endPosition>[0-9]+)$/.exec(e.trim());if(d==null||d.groups==null)return[];let{emoteID:t,startPosition:r,endPosition:n}=d.groups,f=t,s=parseInt(r,10),i=parseInt(n,10);return isNaN(s)||isNaN(i)?[]:[{id:f,start:s,end:i}]}).sort((e,d)=>e.start-d.start)}function gd(u){let e=`https://static-cdn.jtvnw.net/emoticons/v2/${u}/default/dark/3.0`,d=document.createElement("span");d.className="emote",d.style.backgroundImage=`url(${e})`;let t=document.createElement("img");return t.src=e,d.append(t),d}var Ee={ffz:F,twitch:F,bttv:F,"7tv":F,fixEmote(u){u.style.backgroundImage=this.fixEmoteUrl(u.style.backgroundImage),[...u.getElementsByTagName("img")].forEach(e=>this.fixEmoteImg(e))},fixEmoteImg(u){u.src=this.fixEmoteUrl(u.src)},fixEmoteUrl(u){return u.replace(/(^|")(https:\/\/cdn.frankerfacez.com\/emote\/)([^/]+)\/(1|2|4)("|$)/g,(e,d,t,r,n,f)=>`${d}${t}${this.ffz(r)}/4${f}`).replace(/(^|")(https:\/\/static-cdn.jtvnw.net\/emoticons\/v1\/)([^/]+)\/(1|2|3).0("|$)/g,(e,d,t,r,n,f)=>`${d}${t}${this.twitch(r)}/3.0${f}`).replace(/(^|")(https:\/\/static-cdn.jtvnw.net\/emoticons\/v2\/)([^/]+)(\/(?:default|static|animated)\/(?:dark|light))\/(1|2|3).0("|$)/g,(e,d,t,r,n,f,s)=>`${d}${t}${this.twitch(r)}${n}/3.0${s}`).replace(/(^|")(https:\/\/cdn.betterttv.net\/emote\/)([^/]+)\/(1|2|3)x(\.webp|\.gif)?("|$)/g,(e,d,t,r,n,f,s)=>`${d}${t}${this.bttv(r)}/3x${f!=null?f:""}${s}`).replace(/(^|")(https:\/\/cdn.7tv.app\/emote\/)([^/]+)\/(1|2|3|4)x.webp("|$)/g,(e,d,t,r,n,f)=>`${d}${t}${this["7tv"](r)}/4x.webp${f}`)},renderMessage(u){let e=[],d=0;if("emotes"in u.tags){let t=pd(u.tags.emotes);for(let r of t){r.start>d&&e.push(document.createTextNode(u.body.substring(d,r.start))),d=r.end+1;try{let n=this.twitch(r.id);e.push(gd(n))}catch(n){if(n instanceof S)e.push(document.createTextNode(u.body.substring(r.start,d)));else throw n}}}return u.body.length>d&&e.push(document.createTextNode(u.body.substring(d,u.body.length))),e},fixMessage(u,e){var f,s;if(e.body.includes("<")&&e.body.includes(">")){u.replaceChildren(...this.renderMessage(e));return}let t=0,r=e.body.trim().split(/\s+/),n=null;for(let i of u.childNodes){if(i instanceof HTMLElement&&i.classList.contains("emote")||i instanceof HTMLImageElement){let a=null;try{this.fixEmote(i)}catch(m){if(m instanceof S)a=document.createTextNode((s=(f=m.replaceWith)!=null?f:r[t])!=null?s:""),i.replaceWith(a);else throw m}t++,n=a}if(i instanceof Text&&i.textContent!=null){let a=i.textContent.trim();if(a!=""){let m=a.split(/\s+/);(m[0].startsWith("!")||m[0].startsWith(".")||m[0].startsWith(","))&&n!=null&&n.textContent!=null&&n.textContent.endsWith(m[0])&&(n.textContent=n.textContent.substring(0,n.textContent.length-m[0].length)),t+=m.length,n=null}}}},async load(u){u.forClass("message",HTMLElement,this.fixMessage.bind(this)),this["7tv"]=Y("7tv"),this.bttv=Y("bttv"),this.ffz=Y("ffz"),this.twitch=Y("twitch")}};var je=V(D());var Se=V(D());var b=class u{static forward(e,d){u.ALL.forEach(t=>{e.on(t,(...r)=>d.emit(t,...r))})}};b.EXPIRE="expire";b.STAT="stat";b.ERROR="error";b.ALL=[b.EXPIRE,b.STAT,b.ERROR];var l=class extends Se.EventEmitter{constructor(){super(...arguments),this.map=new Map}inc(e,d=1){if(d===0)return;let t=this.get(e);this.map.set(e,t+d);try{this.emit(b.STAT,e,d,t)}catch(r){console.error(r)}}get(e){return this.map.get(e)||0}reset(){this.map.clear()}toString(){return JSON.stringify(this.map,null,2)}};l.HIT="hit";l.MISS="miss";l.LOAD_SUCCESS="load_success";l.LOAD_FAIL="load_failure";l.EXPIRE="expire";l.ALL=[l.HIT,l.MISS,l.LOAD_SUCCESS,l.LOAD_FAIL,l.EXPIRE];function I(u){return u instanceof Array?u:Array.from(u)}function H(u){return new Promise(e=>{let d=u.keys(),t=I(u.values());Promise.all(t.map(r=>r.promise)).then(r=>{let n=new Map,f=0;for(let s of d){let i=r[f++];n.set(s,i)}e(n)})})}var C=class u{constructor(){this._resolved=!1,this._promise=new Promise((e,d)=>{this._resolve=e,this._reject=d})}static of(e){let d=new u;return e.then(t=>d.resolve(t)).catch(t=>d.reject(t)),d}static completedPromise(e){let d=new u;return d.resolve(e),d}get promise(){return this._promise}get resolved(){return this._resolved}resolve(e){this._resolved||(this._resolve(e),this._resolved=!0)}reject(e){this._resolved||(this._reject(e),this._resolved=!0)}then(e,d){return this._promise.then(t=>e(t),t=>d(t))}catch(e){return this._promise.catch(d=>e(d))}};var _=class{static millis(e){return e}static seconds(e){return this.millis(e*1e3)}static minutes(e){return this.seconds(e*60)}static hours(e){return this.minutes(e*60)}static days(e){return this.hours(e*24)}static get now(){return Date.now()}};var Ad={expireAfterAccess:0,expireAfterWrite:0,deleteOnExpiration:!0,expirationInterval:_.minutes(5),recordStats:!0},ee=class extends je.EventEmitter{constructor(e){super({}),this.data=new Map,this._stats=new l,this._options=Object.assign(Object.assign({},Ad),e),this.runCleanup(),b.forward(this._stats,this)}get options(){return this._options}get stats(){return this._stats}runCleanup(){this.options.deleteOnExpiration&&(this.deleteExpiredEntries(),this.options.expirationInterval>0&&(this._cleanupTimeout=setTimeout(()=>this.runCleanup(),this.options.expirationInterval)))}stopCleanupTimer(){clearTimeout(this._cleanupTimeout)}deleteExpiredEntries(e=this.options.recordStats){let d=[];this.data.forEach(t=>{if(t.isExpired(this.options)){d.push(t.getKey());try{this.emit(b.EXPIRE,t.getKey(),t.getValue())}catch(r){console.error(r)}}}),d.forEach(t=>this.data.delete(t)),e&&this.stats.inc(l.EXPIRE,d.length)}getEntryDirect(e){return this.data.get(e)}getEntryIfPresent(e,d=this.options.recordStats){let t=this.getEntryDirect(e);if(typeof t=="undefined"){d&&this.stats.inc(l.MISS);return}if(t.isExpired(this.options)){this.options.deleteOnExpiration&&(this.invalidateEntry(e),d&&this.stats.inc(l.EXPIRE)),d&&this.stats.inc(l.MISS);return}return d&&this.stats.inc(l.HIT),t}putEntry(e,d){this.data.set(e,d)}invalidateEntry(e){return this.data.delete(e)}keys(){return I(this.data.keys())}has(e){return this.data.has(e)}end(){this.stopCleanupTimer(),this.data.clear()}},W=class u{constructor(e){this.key=e}static fromJson(e,d){let t=new u(e);return t.value=d.value,t.accessTime=d.accessTime,t.writeTime=d.writeTime,t}getKey(){return this.accessTime=_.now,this.key}getValue(){return this.accessTime=_.now,this.value}setValue(e){return this.accessTime=_.now,this.writeTime=_.now,this.value=e}isExpired(e){return e.expireAfterAccess!==0&&_.now-this.accessTime>e.expireAfterAccess||e.expireAfterWrite!==0&&_.now-this.writeTime>e.expireAfterWrite}};var L=class extends ee{constructor(e){super(e)}getIfPresent(e){let d=this.getEntryIfPresent(e);if(typeof d!="undefined")return d.getValue()}get(e,d){return this._get(e,d)}_get(e,d,t=!1){if(!t){let r=this.getEntryIfPresent(e);if(r)return r.getValue()}if(d){let r=d(e);return r&&this.put(e,r),this.options.recordStats&&(r?this.stats.inc(l.LOAD_SUCCESS):this.stats.inc(l.LOAD_FAIL)),r}}getAllPresentEntries(e){let d=new Map;for(let t of e){let r=this.getEntryIfPresent(t);typeof r!="undefined"&&d.set(t,r)}return d}getAllEntries(e){return this.getAllPresentEntries(e)}getAllPresent(e){let d=this.getAllPresentEntries(e),t=new Map;return d.forEach((r,n)=>t.set(n,r.getValue())),t}getAll(e,d){let t=I(e),r=this.getAllPresent(e);if(d&&r.size<t.length){let n=t.filter(f=>!r.has(f));if(n.length>0){let f=d(n);this.putAll(f);let s=new Map;return r.forEach((i,a)=>s.set(a,i)),f.forEach((i,a)=>s.set(a,i)),this.options.recordStats&&(this.stats.inc(l.LOAD_SUCCESS,f.size),this.stats.inc(l.LOAD_FAIL,n.length-f.size)),s}}return r}put(e,d){let t=this.getEntryIfPresent(e,!1);typeof t=="undefined"&&(t=new W(e)),t.setValue(d),this.putEntry(e,t)}putAll(e){e.forEach((d,t)=>this.put(t,d))}invalidate(e){super.invalidateEntry(e)}invalidateAll(e){e||(e=this.keys());for(let d of e)this.invalidate(d)}refresh(e){return this.getIfPresent(e)}};var Ne=V(D());var de=class extends Ne.EventEmitter{constructor(e,d,t,r){super({}),r?this._cache=r(e):this._cache=new L(e),this.loader=d,this.multiLoader=t,b.forward(this._cache,this)}get cache(){return this._cache}get options(){return this.cache.options}get stats(){return this.cache.stats}getIfPresent(e){return this.cache.getIfPresent(e)}get(e,d,t=!1){return this._get(e,d,t)}_get(e,d,t=!1){if(!t){let r=this.getIfPresent(e);if(r)return r}if(d)return this.cache._get(e,d,!0);if(this.loader)return this._get(e,this.loader,!0)}getAllPresent(e){return this.cache.getAllPresent(e)}getAll(e,d){return this._getAll(e,d)}_getAll(e,d){if(d)return this.cache.getAll(e,d);if(this.multiLoader)return this.cache.getAll(e,this.multiLoader);let t=this.cache.getAllPresent(e);if(this.loader)for(let r of e)t.has(r)||t.set(r,this.get(r,this.loader));return t}put(e,d){this.cache.put(e,d)}putAll(e){this.cache.putAll(e)}invalidate(e){this.cache.invalidate(e)}invalidateAll(e){this.cache.invalidateAll(e)}refresh(e){return this._get(e,null,!0)}keys(){return this.cache.keys()}has(e){return this.cache.has(e)}end(){this.cache.end()}};var Oe=V(D());var ue=class extends Oe.EventEmitter{constructor(e,d,t,r){super({}),typeof r!="undefined"?this._cache=r(e):this._cache=new L(e),this.loader=d,this.multiLoader=t,b.forward(this._cache,this)}get options(){return this.cache.options}get cache(){return this._cache}get stats(){return this.cache.stats}getIfPresent(e){var d;return(d=this.cache.getIfPresent(e))===null||d===void 0?void 0:d.promise}get(e,d,t=!1){return this._get(e,d,t)}_get(e,d,t=!1){if(!t){let r=this.getIfPresent(e);if(r)return r}if(d){let r=d(e),n;return r instanceof Promise?n=r:n=Promise.resolve(r),this.cache.put(e,C.of(n)),this.options.recordStats&&(r?this.stats.inc(l.LOAD_SUCCESS):this.stats.inc(l.LOAD_FAIL)),n}if(this.loader)return this._get(e,this.loader,!0)}getAllPresent(e){let d=this.cache.getAllPresent(e);return H(d)}getAll(e,d){return this._getAll(e,d)}_getAll(e,d){let t=I(e),r=this.cache.getAllPresent(e);if(d){if(r.size<t.length){let n=t.filter(f=>!r.has(f));if(n.length>0){let f=d(e),s;f instanceof Promise?s=f:s=Promise.resolve(f);for(let i of n)this.cache.put(i,new C);return Promise.all([H(r),s]).then(([i,a])=>{var m;for(let y of n)(m=this.cache.getIfPresent(y))===null||m===void 0||m.resolve(a.get(y));let A=new Map;return i.forEach((y,M)=>A.set(M,y)),a.forEach((y,M)=>A.set(M,y)),this.options.recordStats&&(this.stats.inc(l.LOAD_SUCCESS,a.size),this.stats.inc(l.LOAD_FAIL,n.length-a.size)),A})}}return H(r)}if(this.multiLoader)return this.getAll(e,this.multiLoader);if(this.loader)for(let n of e)r.has(n)||r.set(n,C.of(this.get(n)));return H(r)}put(e,d){d instanceof Promise?this.cache.put(e,C.of(d)):this.cache.put(e,C.completedPromise(Promise.resolve(d)))}putAll(e){e.forEach((d,t)=>{this.cache.put(t,C.completedPromise(Promise.resolve(d)))})}invalidate(e){this.cache.invalidate(e)}invalidateAll(e){this.cache.invalidateAll(e)}refresh(e){return this._get(e,null,!0)}keys(){return this.cache.keys()}has(e){return this.cache.has(e)}end(){this.cache.end()}};var te=class{constructor(){this.options={}}expireAfterAccess(e){return this.options.expireAfterAccess=e,this}expireAfterWrite(e){return this.options.expireAfterWrite=e,this}deleteOnExpiration(e){return this.options.deleteOnExpiration=e,this}expirationInterval(e){return this.options.expirationInterval=e,this}recordStats(e){return this.options.recordStats=e,this}build(e,d,t){return typeof e=="undefined"?t?t(this.options):new L(this.options):new de(this.options,e,d,t)}buildAsync(e,d,t){return new ue(this.options,e,d,t)}},re=class extends te{constructor(){super()}static builder(){return new te}};var wd={getCachedImage(u){return document.createTextNode(u)}},Re={pronounsApi:"https://pronouns.alejo.io/api/",map:null,cache:null,async replacePronouns(u,e,d){if(!await this.loadPronounsMap()||this.cache==null||this.map==null)return;let t=this.map,r="users/"+d,n=await this.cache.get(r);n!=null&&n.filter(f=>f.id==e).map(f=>t[f.pronoun_id]).filter(f=>f!=null&&f!="").forEach(f=>u.replaceChildren(wd.getCachedImage(f)))},async loadPronounsMap(){if(this.map==null){let u=await this.createPronounsMap();if(u==null)return!1;this.map=u}return!0},async createPronounsMap(){if(this.cache==null)return null;let u=await this.cache.get("pronouns");if(u==null)return null;let e=Object.fromEntries(u.map(d=>[d.name,d.display]));return console.log("pronouns loaded"),e},async fetchPronouns(u){console.log("loading pronouns: "+u);try{let e=await fetch(this.pronounsApi+u).then(d=>d.json());return Array.isArray(e)?e:null}catch(e){return console.error(e),null}},async load(u){settings.showPronouns&&(u.forClassWithContext("pronouns",Element,(e,d)=>this.replacePronouns(e,d.userId,d.username)),this.map=null,this.cache=re.builder().expireAfterWrite(_.minutes(5)).buildAsync(e=>this.fetchPronouns(e)),this.loadPronounsMap())}};var ce=class{constructor(){this.className="modified-emote";this.datasetName="effects";this.modifiers={720507:12289,720508:3,720509:5,720510:2049,720729:16385,720730:32769,721137:65537};this.effects={3:e=>{e.transform.push("scaleX(-1)")},5:e=>{e.transform.push("scaleY(-1)")},2049:e=>{e.animation.push(d=>d.filter.length?"ffz-effect-rainbow-filter 2s linear infinite":"ffz-effect-rainbow 2s linear infinite")},4097:e=>{e.filter.push("brightness(0.2) sepia(1) brightness(2.2) contrast(3) saturate(8)"),e.animation.push(d=>d.transform.length?"ffz-effect-shake-transform 0.1s linear infinite":"ffz-effect-shake 0.1s linear infinite")},16385:e=>{e.filter.push("grayscale(1) brightness(0.7) contrast(2.5)")},32769:e=>{e.animation.push(d=>d.transform.length?"ffz-effect-jam-transform 0.6s linear infinite":"ffz-effect-jam 0.6s linear infinite")},65537:e=>{e.transformOrigin="bottom center",e.animation.push(d=>d.transform.length?"ffz-effect-bounce-transform 0.5s linear infinite":"ffz-effect-bounce 0.5s linear infinite")},65541:e=>{e.transform.push("translateY(100%)")}}}getEffect(e){let d=e.style.backgroundImage.match(/(^|")https:\/\/cdn.frankerfacez.com\/emote\/(?<modifiers>[^/]+)\/[^/]+("|$)/);return d&&d.groups&&d.groups.modifiers in this.modifiers?this.modifiers[d.groups.modifiers]:0}createEffects(e){let d={transformOrigin:null,filter:[],transform:[],animation:[],applyEffects(t){this.filter.length&&(t.style.setProperty("--ffz-effect-filters",this.filter.join(" ")),t.style.filter="var(--ffz-effect-filters)"),this.transformOrigin!=null&&(t.style.transformOrigin=this.transformOrigin),this.transform.length&&(t.style.setProperty("--ffz-effect-transforms",this.transform.join(" ")),t.style.transform="var(--ffz-effect-transforms)"),this.animation.length&&(t.style.setProperty("--ffz-effect-animations",this.animation.map(r=>r(this)).join(", ")),t.style.animation="var(--ffz-effect-animations)")}};for(let[t,r]of Object.entries(this.effects)){let n=parseInt(t);(n&e)==n&&r(d)}return d}applyEffects(e,d){e.classList.add(this.className),e.dataset[this.datasetName]=String(d);let t=this.createEffects(d);[...e.getElementsByTagName("img")].forEach(r=>t.applyEffects(r))}applyModifiers(e){var t;let d=[];for(let r of e.children)if(r instanceof HTMLElement&&(r.className=="emote"||r.className=="emoji")){let n=[],f=0;for(let s=r.nextSibling;s!=null&&s!=null;s=(t=s==null?void 0:s.nextSibling)!=null?t:null)if(s instanceof HTMLElement){if(s.nodeType==Node.TEXT_NODE){if(s.nodeValue==null||s.nodeValue.trim()==""){n.push(s);continue}}else if("className"in s&&s.className=="emote"){let i=this.getEffect(s);if(i){f|=i,n.forEach(a=>d.push(a)),d.push(s);continue}}break}if(f!=0)if(r.className=="emoji"){let s=document.createElement("span");r.replaceWith(s),s.append(r),this.applyEffects(s,f)}else this.applyEffects(r,f)}d.forEach(r=>r.replaceWith())}},ke={emoteModifiers:new ce,replaceMessage(u){this.emoteModifiers.applyModifiers(u)},async load(u){u.forClass("message",HTMLElement,this.replaceMessage.bind(this))}};var $e={fixBadge(u){u.src=this.fixBadgeUrl(u.src)},fixBadgeUrl(u){return u.replace(/(^|")(https:\/\/static-cdn.jtvnw.net\/badges\/v1\/[^/]+)\/1("|$)/g,"$1$2/3$3")},async load(u){u.forClass("badge",HTMLImageElement,this.fixBadge.bind(this))}};var Cd=function(){"use strict";var u={base:"https://cdn.jsdelivr.net/gh/jdecked/twemoji@14.1.2/assets/",ext:".png",size:"72x72",className:"emoji",convert:{fromCodePoint:Be,toCodePoint:ae},onerror:function(){this.parentNode&&this.parentNode.replaceChild(i(this.alt,!1),this)},parse:Ve,replace:oe,test:Ke},e={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},d=/(?:\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83e\udef1\ud83c\udffb\u200d\ud83e\udef2\ud83c[\udffc-\udfff]|\ud83e\udef1\ud83c\udffc\u200d\ud83e\udef2\ud83c[\udffb\udffd-\udfff]|\ud83e\udef1\ud83c\udffd\u200d\ud83e\udef2\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\udef1\ud83c\udffe\u200d\ud83e\udef2\ud83c[\udffb-\udffd\udfff]|\ud83e\udef1\ud83c\udfff\u200d\ud83e\udef2\ud83c[\udffb-\udffe]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d\udc8f\ud83c[\udffb-\udfff]|\ud83d\udc91\ud83c[\udffb-\udfff]|\ud83e\udd1d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d\udc8f\udc91]|\ud83e\udd1d)|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd4\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83d\ude36\u200d\ud83c\udf2b\ufe0f|\u2764\ufe0f\u200d\ud83d\udd25|\u2764\ufe0f\u200d\ud83e\ude79|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83d\ude2e\u200d\ud83d\udca8|\ud83d\ude35\u200d\ud83d\udcab|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd\udec3-\udec5\udef0-\udef6]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udc8e\udc90\udc92-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udedd-\udedf\udeeb\udeec\udef4-\udefc\udfe0-\udfeb\udff0]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78-\uddb4\uddb7\uddba\uddbc-\uddcc\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7c\ude80-\ude86\ude90-\udeac\udeb0-\udeba\udec0-\udec2\uded0-\uded9\udee0-\udee7]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,t=/\uFE0F/g,r=String.fromCharCode(8205),n=/[&<>'"]/g,f=/^(?:iframe|noframes|noscript|script|select|style|textarea)$/,s=String.fromCharCode;return u;function i(o,c){return document.createTextNode(c?o.replace(t,""):o)}function a(o){return o.replace(n,We)}function m(o,c){return"".concat(c.base,c.size,"/",o,c.ext)}function A(o,c){for(var x=o.childNodes,p=x.length,g,v;p--;)g=x[p],v=g.nodeType,v===3?c.push(g):v===1&&!("ownerSVGElement"in g)&&!f.test(g.nodeName.toLowerCase())&&A(g,c);return c}function y(o){return ae(o.indexOf(r)<0?o.replace(t,""):o)}function M(o,c){for(var x=A(o,[]),p=x.length,g,v,P,E,q,N,ne,T,U,w,z,B,fe;p--;){for(P=!1,E=document.createDocumentFragment(),q=x[p],N=q.nodeValue,T=0;ne=d.exec(N);){if(U=ne.index,U!==T&&E.appendChild(i(N.slice(T,U),!0)),z=ne[0],B=y(z),T=U+z.length,fe=c.callback(B,c),B&&fe){w=new Image,w.onerror=c.onerror,w.setAttribute("draggable","false"),g=c.attributes(z,B);for(v in g)g.hasOwnProperty(v)&&v.indexOf("on")!==0&&!w.hasAttribute(v)&&w.setAttribute(v,g[v]);w.className=c.className,w.alt=z,w.src=fe,P=!0,E.appendChild(w)}w||E.appendChild(i(z,!1)),w=null}P&&(T<N.length&&E.appendChild(i(N.slice(T),!0)),q.parentNode.replaceChild(E,q))}return o}function He(o,c){return oe(o,function(x){var p=x,g=y(x),v=c.callback(g,c),P,E;if(g&&v){p="<img ".concat('class="',c.className,'" ','draggable="false" ','alt="',x,'"',' src="',v,'"'),P=c.attributes(x,g);for(E in P)P.hasOwnProperty(E)&&E.indexOf("on")!==0&&p.indexOf(" "+E+"=")===-1&&(p=p.concat(" ",E,'="',a(P[E]),'"'));p=p.concat("/>")}return p})}function We(o){return e[o]}function qe(){return null}function Ue(o){return typeof o=="number"?o+"x"+o:o}function Be(o){var c=typeof o=="string"?parseInt(o,16):o;return c<65536?s(c):(c-=65536,s(55296+(c>>10),56320+(c&1023)))}function Ve(o,c){return(!c||typeof c=="function")&&(c={callback:c}),(typeof o=="string"?He:M)(o,{callback:c.callback||m,attributes:typeof c.attributes=="function"?c.attributes:qe,base:typeof c.base=="string"?c.base:u.base,ext:c.ext||u.ext,size:c.folder||Ue(c.size||u.size),className:c.className||u.className,onerror:c.onerror||u.onerror})}function oe(o,c){return String(o).replace(d,c)}function Ke(o){d.lastIndex=0;var c=d.test(o);return d.lastIndex=0,c}function ae(o,c){for(var x=[],p=0,g=0,v=0;v<o.length;)p=o.charCodeAt(v++),g?(x.push((65536+(g-55296<<10)+(p-56320)).toString(16)),g=0):55296<=p&&p<=56319?g=p:x.push(p.toString(16));return x.join(c||"-")}}(),Fe=Cd;var De={replaceMessage(u){Fe.parse(u)},async load(u){u.forClass("message",HTMLElement,this.replaceMessage.bind(this))}};var Ld=new X([xe,Ee,De,ke,$e,Re]);Ld.run();})();
/*! modified code of FFZ emote modifiers implementation */
/*! https://github.com/FrankerFaceZ/FrankerFaceZ/blob/daa193aa030cc29fd5706351677ddeb9079741ae/src/modules/chat/emotes.js */
/*!
Copyright 2016 Dan Salvato LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*! Bundled license information:

@twemoji/api/dist/twemoji.esm.js:
  (*! Copyright Twitter Inc. and other contributors. Licensed under MIT *)
*/
/*!
Bundled license information:
- @inventivetalent/loading-cache@0.6.9:
Published by Haylee Schäfer and licensed under MIT.
Repository: https://github.com/InventivetalentDev/loading-cache
MIT License

Copyright (c) 2020 Haylee Schäfer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- @inventivetalent/time@1.0.3:
Published by Haylee Schäfer and licensed under MIT.

MIT License

Copyright (c) 2021 Haylee Schäfer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- @twemoji/api@14.1.2:
Licensed under MIT AND CC-BY-4.0.
Repository: https://github.com/jdecked/twemoji
MIT License

Copyright (c) 2021 Twitter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- arg@4.1.3:
Published by Josh Junon and licensed under MIT.
Repository: https://github.com/zeit/arg
MIT License

Copyright (c) 2017-2019 Zeit, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- buffer-from@1.1.2:
Licensed under MIT.
Repository: https://github.com/LinusU/buffer-from
MIT License

Copyright (c) 2016, 2018 Linus Unnebäck

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- clone@2.1.2:
Published by Paul Vorbach and licensed under MIT.
Repository: https://github.com/pvorb/node-clone
Copyright © 2011-2015 Paul Vorbach <paul@vorba.ch>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

- color2k@2.0.2:
Published by Rico Kahler and licensed under MIT.
Repository: https://github.com/ricokahler/color2k
MIT License

Copyright (c) 2020 Rico Kahler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- create-require@1.1.1:
Licensed under MIT.
Repository: https://github.com/nuxt-contrib/create-require
MIT License

Copyright (c) 2020

Maël Nison <nison.mael@gmail.com>
Paul Soporan <paul.soporan@gmail.com>
Pooya Parsa <pyapar@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- diff@4.0.2:
Licensed under BSD-3-Clause.
Repository: https://github.com/kpdecker/jsdiff
Software License Agreement (BSD License)

Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>

All rights reserved.

Redistribution and use of this software in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above
  copyright notice, this list of conditions and the
  following disclaimer.

* Redistributions in binary form must reproduce the above
  copyright notice, this list of conditions and the
  following disclaimer in the documentation and/or other
  materials provided with the distribution.

* Neither the name of Kevin Decker nor the names of its
  contributors may be used to endorse or promote products
  derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
- events@3.3.0:
Published by Irakli Gozalishvili and licensed under MIT.
Repository: https://github.com/Gozala/events
MIT

Copyright Joyent, Inc. and other Node contributors.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.

- fs-extra@8.1.0:
Published by JP Richardson and licensed under MIT.
Repository: https://github.com/jprichardson/node-fs-extra
(The MIT License)

Copyright (c) 2011-2017 JP Richardson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
 merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

- graceful-fs@4.2.11:
Licensed under ISC.
Repository: https://github.com/isaacs/node-graceful-fs
The ISC License

Copyright (c) 2011-2022 Isaac Z. Schlueter, Ben Noordhuis, and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

- jsonfile@4.0.0:
Published by JP Richardson and licensed under MIT.
Repository: https://github.com/jprichardson/node-jsonfile
(The MIT License)

Copyright (c) 2012-2015, JP Richardson <jprichardson@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
 merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

- jsonfile@5.0.0:
Published by JP Richardson and licensed under MIT.
Repository: https://github.com/jprichardson/node-jsonfile
(The MIT License)

Copyright (c) 2012-2015, JP Richardson <jprichardson@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
 merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

- make-error@1.3.6:
Published by Julien Fontanet and licensed under ISC.
Repository: https://github.com/JsCommunity/make-error
Copyright 2014 Julien Fontanet

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

- node-cache@5.1.2:
Published by mpneuried and licensed under MIT.
Repository: https://github.com/node-cache/node-cache
The MIT License (MIT)

Copyright (c) 2019 mpneuried

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- pronouns-chat@2.1.2:
Licensed under MIT*.

The following files have their license information within the file itself:
- dist/custom.js
- dist/custom.css
- src/features/ffz.ts
- src/features/ffz.css

All other fies are distributed under the following license:

MIT License

Copyright (c) 2023 Nya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- source-map-support@0.5.21:
Licensed under MIT.
Repository: https://github.com/evanw/node-source-map-support
The MIT License (MIT)

Copyright (c) 2014 Evan Wallace

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- source-map@0.6.1:
Published by Nick Fitzgerald and licensed under BSD-3-Clause.
Repository: https://github.com/mozilla/source-map

Copyright (c) 2009-2011, Mozilla Foundation and contributors
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the names of the Mozilla Foundation nor the names of project
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

- ts-node@9.1.1:
Published by Blake Embrey and licensed under MIT.
Repository: https://github.com/TypeStrong/ts-node
The MIT License (MIT)

Copyright (c) 2014 Blake Embrey (hello@blakeembrey.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

- twemoji-parser@14.0.0:
Licensed under MIT.

Copyright (c) 2018 Twitter, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

- typescript@4.9.5:
Published by Microsoft Corp. and licensed under Apache-2.0.
Repository: https://github.com/Microsoft/TypeScript
Apache License

Version 2.0, January 2004

http://www.apache.org/licenses/ 

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.

"License" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.

"Licensor" shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.

"Legal Entity" shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, "control" means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity.

"You" (or "Your") shall mean an individual or Legal Entity exercising permissions granted by this License.

"Source" form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files.

"Object" form shall mean any form resulting from mechanical transformation or translation of a Source form, including but not limited to compiled object code, generated documentation, and conversions to other media types.

"Work" shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below).

"Derivative Works" shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof.

"Contribution" shall mean any work of authorship, including the original version of the Work and any modifications or additions to that Work or Derivative Works thereof, that is intentionally submitted to Licensor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner. For the purposes of this definition, "submitted" means any form of electronic, verbal, or written communication sent to the Licensor or its representatives, including but not limited to communication on electronic mailing lists, source code control systems, and issue tracking systems that are managed by, or on behalf of, the Licensor for the purpose of discussing and improving the Work, but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as "Not a Contribution."

"Contributor" shall mean Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received by Licensor and subsequently incorporated within the Work.

2. Grant of Copyright License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.

3. Grant of Patent License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims licensable by such Contributor that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted. If You institute patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated within the Work constitutes direct or contributory patent infringement, then any patent licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed.

4. Redistribution. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:

You must give any other recipients of the Work or Derivative Works a copy of this License; and

You must cause any modified files to carry prominent notices stating that You changed the files; and

You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and

If the Work includes a "NOTICE" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works, in at least one of the following places: within a NOTICE text file distributed as part of the Derivative Works; within the Source form or documentation, if provided along with the Derivative Works; or, within a display generated by the Derivative Works, if and wherever such third-party notices normally appear. The contents of the NOTICE file are for informational purposes only and do not modify the License. You may add Your own attribution notices within Derivative Works that You distribute, alongside or as an addendum to the NOTICE text from the Work, provided that such additional attribution notices cannot be construed as modifying the License. You may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License.

5. Submission of Contributions. Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor shall be under the terms and conditions of this License, without any additional terms or conditions. Notwithstanding the above, nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with Licensor regarding such Contributions.

6. Trademarks. This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file.

7. Disclaimer of Warranty. Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.

8. Limitation of Liability. In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if such Contributor has been advised of the possibility of such damages.

9. Accepting Warranty or Additional Liability. While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of any other Contributor, and only if You agree to indemnify, defend, and hold each Contributor harmless for any liability incurred by, or claims asserted against, such Contributor by reason of your accepting any such warranty or additional liability.

END OF TERMS AND CONDITIONS

- typescript@5.0.4:
Published by Microsoft Corp. and licensed under Apache-2.0.
Repository: https://github.com/Microsoft/TypeScript
Apache License

Version 2.0, January 2004

http://www.apache.org/licenses/ 

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.

"License" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.

"Licensor" shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.

"Legal Entity" shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, "control" means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity.

"You" (or "Your") shall mean an individual or Legal Entity exercising permissions granted by this License.

"Source" form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files.

"Object" form shall mean any form resulting from mechanical transformation or translation of a Source form, including but not limited to compiled object code, generated documentation, and conversions to other media types.

"Work" shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below).

"Derivative Works" shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof.

"Contribution" shall mean any work of authorship, including the original version of the Work and any modifications or additions to that Work or Derivative Works thereof, that is intentionally submitted to Licensor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner. For the purposes of this definition, "submitted" means any form of electronic, verbal, or written communication sent to the Licensor or its representatives, including but not limited to communication on electronic mailing lists, source code control systems, and issue tracking systems that are managed by, or on behalf of, the Licensor for the purpose of discussing and improving the Work, but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as "Not a Contribution."

"Contributor" shall mean Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received by Licensor and subsequently incorporated within the Work.

2. Grant of Copyright License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.

3. Grant of Patent License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims licensable by such Contributor that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted. If You institute patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated within the Work constitutes direct or contributory patent infringement, then any patent licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed.

4. Redistribution. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:

You must give any other recipients of the Work or Derivative Works a copy of this License; and

You must cause any modified files to carry prominent notices stating that You changed the files; and

You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and

If the Work includes a "NOTICE" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works, in at least one of the following places: within a NOTICE text file distributed as part of the Derivative Works; within the Source form or documentation, if provided along with the Derivative Works; or, within a display generated by the Derivative Works, if and wherever such third-party notices normally appear. The contents of the NOTICE file are for informational purposes only and do not modify the License. You may add Your own attribution notices within Derivative Works that You distribute, alongside or as an addendum to the NOTICE text from the Work, provided that such additional attribution notices cannot be construed as modifying the License. You may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License.

5. Submission of Contributions. Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor shall be under the terms and conditions of this License, without any additional terms or conditions. Notwithstanding the above, nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with Licensor regarding such Contributions.

6. Trademarks. This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file.

7. Disclaimer of Warranty. Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.

8. Limitation of Liability. In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if such Contributor has been advised of the possibility of such damages.

9. Accepting Warranty or Additional Liability. While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of any other Contributor, and only if You agree to indemnify, defend, and hold each Contributor harmless for any liability incurred by, or claims asserted against, such Contributor by reason of your accepting any such warranty or additional liability.

END OF TERMS AND CONDITIONS

- universalify@0.1.2:
Published by Ryan Zimmerman and licensed under MIT.
Repository: https://github.com/RyanZim/universalify
(The MIT License)

Copyright (c) 2017, Ryan Zimmerman <opensrc@ryanzim.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

- yn@3.1.1:
Published by Sindre Sorhus and licensed under MIT.
Repository: https://github.com/sindresorhus/yn
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
