var V=Object.defineProperty;var W=(u,o,t)=>o in u?V(u,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):u[o]=t;var l=(u,o,t)=>(W(u,typeof o!="symbol"?o+"":o,t),t);(function(){"use strict";const u=(n,e)=>Math.sqrt((n.x-e.x)**2+(n.y-e.y)**2);class o{constructor(e){l(this,"cities");l(this,"distance");if(this.cities=e,e.length<2)throw new Error("Trips must be at least 2 cities long");this.distance=this.calculateDistance()}calculateDistance(e=u){const s=e(this.cities[0],this.cities[this.cities.length-1]);return this.cities.slice(0,-1).reduce((i,c,w)=>{const p=this.cities[w+1],y=e(c,p);return i+y},s)}objectiveFunction(){return this.distance}}class t{constructor(e,s){l(this,"x");l(this,"y");this.x=e,this.y=s}}const v=[new t(6734,1453),new t(2233,10),new t(5530,1424),new t(401,841),new t(3082,1644),new t(7608,4458),new t(7573,3716),new t(7265,1268),new t(6898,1885),new t(1112,2049),new t(5468,2606),new t(5989,2873),new t(4706,2674),new t(4612,2035),new t(6347,2683),new t(6107,669),new t(7611,5184),new t(7462,3590),new t(7732,4723),new t(5900,3561),new t(4483,3369),new t(6101,1110),new t(5199,2182),new t(1633,2809),new t(4307,2322),new t(675,1006),new t(7555,4819),new t(7541,3981),new t(3177,756),new t(7352,4506),new t(7545,2801),new t(3245,3305),new t(6426,3173),new t(4608,1198),new t(23,2216),new t(7248,3779),new t(7762,4595),new t(7392,2244),new t(3484,2829),new t(6271,2135),new t(4985,140),new t(1916,1569),new t(7280,4899),new t(7509,3239),new t(10,2676),new t(6807,2993),new t(5185,3258),new t(3023,1942)];class a{constructor(e,s){l(this,"cities");l(this,"trip");this.cities=e,this.trip=s}static default(e){return new a(e,new o(e))}copy(){const e=new o([...this.trip.cities]);return new a(this.cities,e)}cost(){return this.trip.objectiveFunction()}swap(e,s){const i=[...this.trip.cities];[i[s],i[e]]=[i[e],i[s]];const c=new o(i);return new a(this.cities,c)}moveSubRoute(e,s,i){let c=[...this.trip.cities];c.splice(s,0,...c.splice(e,i));const w=new o(c);return new a(this.cities,w)}}const R=n=>{const e=[...n];let s=n.length,i=0;for(;s!=0;)i=Math.floor(Math.random()*s),s--,[e[s],e[i]]=[e[i],e[s]];return e},f={apply:n=>{const e=new o(R(n.cities));return new a(n.cities,e)}},d=(n,e=Math.random)=>Math.floor(e()*n),I={apply(n){const e=d(n.cities.length),s=d(n.cities.length);return n.moveSubRoute(e,s,1)}},C=[I,{apply(n){const e=d(n.cities.length),s=d(n.cities.length);return n.swap(e,s)}}],D=()=>C[d(C.length)],U={apply:n=>D().apply(n)};class A{run(e=v,s=f,i,c,w,p=()=>{}){const y=a.default(e);let h=w||s.apply(y);for(;!i();){const x=c.apply(h);x.cost()<h.cost()&&(h=x,p(h))}return h}}const G=n=>{let e=0;return()=>n===e++},S=(n,e=()=>new Date)=>{const s=e();return s.setSeconds(s.getSeconds()+n),()=>e()>=s},L={random:f},M={random:f,randomMover:U,moveCity:I},O=1e3/60;let m,T="IDLE",g;const E=()=>{g=setTimeout(j,O)},P=()=>{E(),T="RUNNING"},F=()=>{!g||(clearTimeout(g),g=void 0)},N=()=>{F(),T="IDLE"};let r={cities:v,singleLoop:!1,construction:L.random,stoppingCriterion:()=>S(O*.9),mover:M.randomMover,debug:!1},b=0;const _=100,j=()=>{if(T==="IDLE")return;const n=new A().run(r.cities,r.construction,r.stoppingCriterion(),r.mover,m,e=>{m=e,postMessage({type:"SOLUTION",solution:e}),b=0});if(r.singleLoop||b++>_){postMessage({type:"STOPPING",solution:n}),N();return}E()},k=n=>{switch(r.debug&&console.log(`received message ${n.data.type}`),n.data.type){case"SET_SOLUTION":{n.data.solution?m=new a(n.data.solution.cities,new o(n.data.solution.trip.cities)):m=void 0;return}case"START":{P();return}case"STOP":{N();return}case"CONFIGURE":{const{data:{construction:e,move:s,numIterations:i,timeout:c,singleLoop:w,debug:p}}=n;e&&(r.construction=L[e]),s&&(r.mover=M[s]),i&&(r.stoppingCriterion=()=>G(i)),c&&(r.stoppingCriterion=()=>S(c)),w!==void 0&&(r.singleLoop=w),p!==void 0&&(r.debug=p);return}default:console.error(n)}};addEventListener("message",k)})();