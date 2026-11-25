module.exports=[564048,e=>{"use strict";function a(e={}){let t=e&&"object"==typeof e&&!Array.isArray(e)?e:{},r=(e,a)=>"string"==typeof e&&e.slice(0,200)||a;return{page:"number"==typeof t.page&&Number.isSafeInteger(Math.floor(t.page))?Math.max(1,Math.floor(t.page)):1,pageSize:5===t.pageSize?5:9,search:r(t.search,"").trim().toLocaleLowerCase("id"),category:r(t.category,"all"),year:r(t.year,"all"),field:r(t.field,"all"),status:r(t.status,"all"),types:Array.isArray(t.types)?[...new Set(t.types.filter(e=>"article"===e||"event"===e))]:["article","event"]}}async function t(e,r,i,c=9){let s=a({pageSize:c}).pageSize,l=Math.max(1,Math.ceil(e/s)),n=Math.min(a({page:r}).page,l),d=(n-1)*s;return{total:e,page:n,pages:l,items:e?await i(d,d+s):[]}}e.s(["m",0,function(e){return a({page:Number(e.get("page")),pageSize:Number(e.get("pageSize")),search:e.get("search"),category:e.get("category"),year:e.get("year"),field:e.get("field"),status:e.get("status"),types:e.get("types")?.split(",")})},"E",0,a,"A",0,t,"p",0,function(e){return 1===e.page&&!e.search&&"all"===e.category&&"all"===e.year&&"all"===e.field&&"all"===e.status&&2===e.types.length}])},212754,880693,839322,e=>{"use strict";var a=e.i(745015),t=e.i(935661),r=e.i(347540),i=e.i(334185),c=e.i(46327),s=e.i(702745),l=e.i(575586),n=e.i(822236),d=e.i(665044),u=e.i(564048);let f=l.f`{
  _id,
  "slug": slug.current,
  "type": select(jenis == "acara" => "event", "article"),
  title,
  description,
  "imageUrl": image.asset->url,
  "gallery": gallery[]{ _key, "imageUrl": asset->url, alt, caption },
  category,
  date,
  "status": select(jenis == "acara" => status),
  "time": select(jenis == "acara" => time),
  "location": select(jenis == "acara" => location),
  "agenda": select(jenis == "acara" => agenda),
  tags,
  body
}`,o=new Intl.DateTimeFormat("id-ID",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});function g(e){let a=new Date(e.date);return Number.isNaN(a.getTime())?e:{...e,date:o.format(a)}}let p=l.f`{
  _id, "slug": slug.current, "type": select(jenis == "acara" => "event", "article"),
  title, description, "imageUrl": image.asset->url, category, date,
  "status": select(jenis == "acara" => status),
  "time": select(jenis == "acara" => time), "location": select(jenis == "acara" => location)
}`,y=async function(e){return(0,d.cacheLife)("hours"),(0,d.cacheTag)("aktivitas"),h((0,u.E)({pageSize:e}))};var b=(0,r.cache)(function(){return(0,t.cache)("default","c0e9ba617473bf5da05f739c134f0732d8c5d13e1a",0,y,Array.prototype.slice.call(arguments,0,1))});(0,a.registerServerReference)(b,"c0e9ba617473bf5da05f739c134f0732d8c5d13e1a",null),Object.defineProperty(b,"name",{value:"getFirstAktivitasPage"});async function h(e){let a={...e,validIds:await (0,s.R)("aktivitas")},t=await n.f.fetch(`count(*[${c.n} && _id in $validIds])`,a);return(0,u.A)(t,a.page,async(e,t)=>{let r=await n.f.fetch(`*[${c.n} && _id in $validIds] | order(date desc, _createdAt desc, _id asc) [$start...$end] ${p}`,{...a,start:e,end:t});return(0,i.I)(i.c).parse(r).map(g)},a.pageSize)}let m=async function(){(0,d.cacheLife)("hours"),(0,d.cacheTag)("aktivitas");let e=await (0,s.R)("aktivitas"),a=await n.f.fetch(l.f`{
    "categories": array::unique(*[_type == "beritaAcara" && _id in $validIds && defined(slug.current) && defined(category)].category),
    "featured": *[_type == "beritaAcara" && _id in $validIds && defined(slug.current)] | order(date desc, _createdAt desc, _id asc) [0...5] ${p}
  }`,{validIds:e}),t=i.j.parse(a??{});return{...t,featured:t.featured.map(g)}};var v=(0,r.cache)(function(){return(0,t.cache)("default","804f3c1a57bb03a44ded0e047fbd6f0ee8beedc02c",0,m,[])});(0,a.registerServerReference)(v,"804f3c1a57bb03a44ded0e047fbd6f0ee8beedc02c",null),Object.defineProperty(v,"name",{value:"getAktivitasMeta"});let _=async function(){(0,d.cacheLife)("hours"),(0,d.cacheTag)("aktivitas","homePage");let{picked:e,latest:a}=await n.f.fetch(l.f`{
      "picked": *[_type == "homePage" && _id == "homePage"][0].sorotanBerita[0...6]-> ${p},
      "latest": *[_type == "beritaAcara" && _id in $validIds] | order(date desc, _createdAt desc) [0...$limit] ${p}
    }`,{limit:6,validIds:await (0,s.R)("aktivitas")}),t=[];for(let r of[...e??[],...a])r?.slug&&!t.some(({_id:e})=>e===r._id)&&t.push(r);return(0,i.I)(i.c).parse(t).slice(0,3).map(g)};var $=(0,r.cache)(function(){return(0,t.cache)("default","809569b9074b292fee0e30c198ce9da78655e731db",0,_,[])});(0,a.registerServerReference)($,"809569b9074b292fee0e30c198ce9da78655e731db",null),Object.defineProperty($,"name",{value:"getBerandaAktivitas"});let w=async function(e){if((0,d.cacheLife)("hours"),!(0,i.W)(e))return null;(0,d.cacheTag)("aktivitas",`aktivitas-${e}`);let a=await n.f.fetch(l.f`*[_type == "beritaAcara" && slug.current == $slug][0] ${f}`,{slug:e}),t=(0,i.L)(i.c,a);return t&&g(t)};var A=(0,r.cache)(function(){return(0,t.cache)("default","c0a88ad0e2bc9e7a35a221e15491586c121c4088c0",0,w,Array.prototype.slice.call(arguments,0,1))});(0,a.registerServerReference)(A,"c0a88ad0e2bc9e7a35a221e15491586c121c4088c0",null),Object.defineProperty(A,"name",{value:"getAktivitasBySlug"}),e.s(["k",0,b,"_",0,v,"C",0,$,"P",0,A,"q",0,A,"e",0,v,"J",0,function(e={}){let a=(0,u.E)(e);return(0,u.p)(a)?b(a.pageSize):h(a)},"n",0,$],212754);let I=l.f`{
  _id,
  title,
  description,
  year,
  category,
  level,
  position,
  field,
  organizer,
  location,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  "participants": participants[]{ _key, name, faculty, "imageUrl": image.asset->url }
}`,j=async function(e){(0,d.cacheTag)("prestasi");let a=await P((0,u.E)({pageSize:e}));return 0===a.total?(0,d.cacheLife)("seconds"):(0,d.cacheLife)("hours"),a};var k=(0,r.cache)(function(){return(0,t.cache)("default","c005d88bcda073df5c73467335dab7eb834adbb2ce",0,j,Array.prototype.slice.call(arguments,0,1))});(0,a.registerServerReference)(k,"c005d88bcda073df5c73467335dab7eb834adbb2ce",null),Object.defineProperty(k,"name",{value:"getFirstPrestasiPage"});async function P(e){let a={...e,validIds:await (0,s.R)("prestasi")},t=await n.f.fetch(`count(*[${c.D} && _id in $validIds])`,a);return(0,u.A)(t,a.page,(e,t)=>n.f.fetch(`*[${c.D} && _id in $validIds] | order(year desc, _createdAt desc, _id asc) [$start...$end] ${I}`,{...a,start:e,end:t}).then(e=>(0,i.I)(i.X).parse(e)),a.pageSize)}let S=async function(){(0,d.cacheTag)("prestasi");let e=await (0,s.R)("prestasi"),a=await n.f.fetch(l.f`{
    "total": count(*[_type == "prestasi" && _id in $validIds]),
    "years": array::unique(*[_type == "prestasi" && _id in $validIds && defined(year)].year),
    "fields": array::unique(*[_type == "prestasi" && _id in $validIds && defined(field)].field),
    "categories": array::unique(*[_type == "prestasi" && _id in $validIds && defined(category)].category)
  }`,{validIds:e}),t=i.h.parse(a??{});return 0===t.total?(0,d.cacheLife)("seconds"):(0,d.cacheLife)("hours"),t};var L=(0,r.cache)(function(){return(0,t.cache)("default","80a539252d3f246398a914f27bf8925947296bceb3",0,S,[])});(0,a.registerServerReference)(L,"80a539252d3f246398a914f27bf8925947296bceb3",null),Object.defineProperty(L,"name",{value:"getPrestasiMeta"});let R=async function(){(0,d.cacheLife)("hours"),(0,d.cacheTag)("prestasi","homePage");let{picked:e,latest:a}=await n.f.fetch(l.f`{
      "picked": *[_type == "homePage" && _id == "homePage"][0].sorotanPrestasi[0...10]-> ${I},
      "latest": *[_type == "prestasi" && _id in $validIds] | order(year desc, _createdAt desc) [0...$limit] ${I}
    }`,{limit:10,validIds:await (0,s.R)("prestasi")}),t=[];for(let r of[...e??[],...a])r&&!t.some(({_id:e})=>e===r._id)&&t.push(r);return(0,i.I)(i.X).parse(t).slice(0,5)};var T=(0,r.cache)(function(){return(0,t.cache)("default","80cb96f63fcfb44b08d9d732dc8423bf94fcb43a60",0,R,[])});(0,a.registerServerReference)(T,"80cb96f63fcfb44b08d9d732dc8423bf94fcb43a60",null),Object.defineProperty(T,"name",{value:"getBerandaPrestasi"}),e.s(["k",0,k,"_",0,L,"C",0,T,"e",0,T,"L",0,L,"w",0,function(e={}){let a=(0,u.E)(e);return(0,u.p)(a)?k(a.pageSize):P(a)}],880693);let U=`*[_type == "bidang" && defined(slug.current)] | order(_createdAt asc) {
  _id, "slug": slug.current, abbr, fullName, "imageUrl": image.asset->url
}`,B=l.f`{
  _id,
  "slug": slug.current,
  abbr,
  fullName,
  "imageUrl": image.asset->url,
  description,
  "gallery": gallery[]{
    "imageUrl": image.asset->url,
    "aspectRatio": image.asset->metadata.dimensions.aspectRatio,
    "hotspot": image.hotspot{x, y},
    showFullImage,
    alt,
    caption
  },
  ketuaBidang{ name, role, "imageUrl": image.asset->url },
  wakilKetuaBidang{ name, role, "imageUrl": image.asset->url },
  "wakilKetuaBidangTambahan": select(slug.current == "banjari-nasyid" =>
    wakilKetuaBidangTambahan{ name, role, "imageUrl": image.asset->url }
  )
}`,z=async function(){return(0,d.cacheLife)("hours"),(0,d.cacheTag)("bidang"),(0,i.I)(i.i).parse(await n.f.fetch(U))};var O=(0,r.cache)(function(){return(0,t.cache)("default","8082356bdb0b2cb53f88e5a03b5eaab4055eeaef6d",0,z,[])});(0,a.registerServerReference)(O,"8082356bdb0b2cb53f88e5a03b5eaab4055eeaef6d",null),Object.defineProperty(O,"name",{value:"getAllBidang"});let M=async function(e){return((0,d.cacheLife)("hours"),(0,i.W)(e))?((0,d.cacheTag)("bidang",`bidang-${e}`),(0,i.L)(i.g,await n.f.fetch(l.f`*[_type == "bidang" && slug.current == $slug][0] ${B}`,{slug:e}))):null};var N=(0,r.cache)(function(){return(0,t.cache)("default","c0b248f1c3768abd59c0ac29d594da31bcd02c7fdc",0,M,Array.prototype.slice.call(arguments,0,1))});(0,a.registerServerReference)(N,"c0b248f1c3768abd59c0ac29d594da31bcd02c7fdc",null),Object.defineProperty(N,"name",{value:"getBidangBySlug"}),e.s(["k",0,O,"_",0,N,"w",0,N],839322)},46327,702745,575586,e=>{"use strict";let a=`_type == "beritaAcara" && defined(slug.current) &&
  select(jenis == "acara" => "event", "article") in $types &&
  ($category == "all" || category == $category) &&
  ($status == "all" || (jenis == "acara" && status == $status)) &&
  ($search == "" || count(string::split(lower(coalesce(title, "") + " " + coalesce(description, "") + " " + coalesce(category, "")), $search)) > 1)`,t=`_type == "prestasi" &&
  ($year == "all" || string(year) == $year) &&
  ($field == "all" || field == $field) &&
  ($category == "all" || category == $category) &&
  ($search == "" || count(string::split(lower(coalesce(title, "") + " " + coalesce(description, "") + " " + coalesce(array::join(participants[].name, " "), "")), $search)) > 1)`;e.s(["D",0,t,"n",0,a],46327);var r=e.i(745015),i=e.i(935661),c=e.i(347540),s=e.i(665044),l=e.i(822236),n=e.i(334185);let d=async function(e){if((0,s.cacheTag)(e),"aktivitas"===e){(0,s.cacheLife)("hours");let e=await l.f.fetch(`*[_type == "beritaAcara"]{
      _id, "slug": slug.current, "type": select(jenis == "acara" => "event", "article"), title
    }`);return(0,n.I)(n.H,1/0).parse(e).map(e=>e._id)}let a=await l.f.fetch('*[_type == "prestasi"]{_id, title, year, category, level}'),t=(0,n.I)(n.w,1/0).parse(a).map(e=>e._id);return t.length?(0,s.cacheLife)("hours"):(0,s.cacheLife)("seconds"),t};var u=(0,c.cache)(function(){return(0,i.cache)("default","c0f56dae69290217b4556da994ecf3a373a92b414a",0,d,Array.prototype.slice.call(arguments,0,1))});(0,r.registerServerReference)(u,"c0f56dae69290217b4556da994ecf3a373a92b414a",null),Object.defineProperty(u,"name",{value:"getValidArchiveIds"}),e.s(["k",0,u,"R",0,u],702745),e.s(["f",0,function(e,...a){let t=e.length-1;return e.slice(0,t).reduce((e,t,r)=>e+t+a[r],"")+e[t]}],575586)}];

//# sourceMappingURL=_1vnyjc7ui8-x8._.js.map