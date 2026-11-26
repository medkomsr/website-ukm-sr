module.exports=[564048,e=>{"use strict";function a(e={}){let t=e&&"object"==typeof e&&!Array.isArray(e)?e:{},r=(e,a)=>"string"==typeof e&&e.slice(0,200)||a;return{page:"number"==typeof t.page&&Number.isSafeInteger(Math.floor(t.page))?Math.max(1,Math.floor(t.page)):1,pageSize:5===t.pageSize?5:9,search:r(t.search,"").trim().toLocaleLowerCase("id"),category:r(t.category,"all"),year:r(t.year,"all"),field:r(t.field,"all"),status:r(t.status,"all"),types:Array.isArray(t.types)?[...new Set(t.types.filter(e=>"article"===e||"event"===e))]:["article","event"]}}async function t(e,r,i,c=9){let s=a({pageSize:c}).pageSize,n=Math.max(1,Math.ceil(e/s)),l=Math.min(a({page:r}).page,n),d=(l-1)*s;return{total:e,page:l,pages:n,items:e?await i(d,d+s):[]}}e.s(["m",0,function(e){return a({page:Number(e.get("page")),pageSize:Number(e.get("pageSize")),search:e.get("search"),category:e.get("category"),year:e.get("year"),field:e.get("field"),status:e.get("status"),types:e.get("types")?.split(",")})},"E",0,a,"A",0,t,"p",0,function(e){return 1===e.page&&!e.search&&"all"===e.category&&"all"===e.year&&"all"===e.field&&"all"===e.status&&2===e.types.length}])},212754,880693,839322,e=>{"use strict";var a=e.i(745015),t=e.i(935661),r=e.i(347540),i=e.i(334185),c=e.i(46327),s=e.i(702745),n=e.i(575586),l=e.i(822236),d=e.i(665044),u=e.i(564048);let f=n.f`{
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
}`,o=new Intl.DateTimeFormat("id-ID",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});function g(e){let a=new Date(e.date);return Number.isNaN(a.getTime())?e:{...e,date:o.format(a)}}let p=n.f`{
  _id, "slug": slug.current, "type": select(jenis == "acara" => "event", "article"),
  title, description, "imageUrl": image.asset->url, category, date,
  "status": select(jenis == "acara" => status),
  "time": select(jenis == "acara" => time), "location": select(jenis == "acara" => location)
}`,y=async function(e){return(0,d.cacheLife)("hours"),(0,d.cacheTag)("aktivitas"),m((0,u.E)({pageSize:e}))};var h=(0,r.cache)(function(){return(0,t.cache)("default","c0950626ba573490f711b63d309366e44593bfe512",0,y,Array.prototype.slice.call(arguments,0,1))});(0,a.registerServerReference)(h,"c0950626ba573490f711b63d309366e44593bfe512",null),Object.defineProperty(h,"name",{value:"getFirstAktivitasPage"});async function m(e){let a={...e,validIds:await (0,s.R)("aktivitas")},t=await l.f.fetch(`count(*[${c.n} && _id in $validIds])`,a);return(0,u.A)(t,a.page,async(e,t)=>{let r=await l.f.fetch(`*[${c.n} && _id in $validIds] | order(date desc, _createdAt desc, _id asc) [$start...$end] ${p}`,{...a,start:e,end:t});return(0,i.I)(i.c).parse(r).map(g)},a.pageSize)}let b=async function(){(0,d.cacheLife)("hours"),(0,d.cacheTag)("aktivitas");let e=await (0,s.R)("aktivitas"),a=await l.f.fetch(n.f`{
    "categories": array::unique(*[_type == "beritaAcara" && _id in $validIds && defined(slug.current) && defined(category)].category),
    "featured": *[_type == "beritaAcara" && _id in $validIds && defined(slug.current)] | order(date desc, _createdAt desc, _id asc) [0...5] ${p}
  }`,{validIds:e}),t=i.j.parse(a??{});return{...t,featured:t.featured.map(g)}};var v=(0,r.cache)(function(){return(0,t.cache)("default","80c9f52917bd335a48d82755e300936c305df6701e",0,b,[])});(0,a.registerServerReference)(v,"80c9f52917bd335a48d82755e300936c305df6701e",null),Object.defineProperty(v,"name",{value:"getAktivitasMeta"});let _=async function(){(0,d.cacheLife)("hours"),(0,d.cacheTag)("aktivitas","homePage");let{picked:e,latest:a}=await l.f.fetch(n.f`{
      "picked": *[_type == "homePage" && _id == "homePage"][0].sorotanBerita[0...6]-> ${p},
      "latest": *[_type == "beritaAcara" && _id in $validIds] | order(date desc, _createdAt desc) [0...$limit] ${p}
    }`,{limit:6,validIds:await (0,s.R)("aktivitas")}),t=[];for(let r of[...e??[],...a])r?.slug&&!t.some(({_id:e})=>e===r._id)&&t.push(r);return(0,i.I)(i.c).parse(t).slice(0,3).map(g)};var $=(0,r.cache)(function(){return(0,t.cache)("default","80fc7b8dd1899cc769bcd551d230cf70eabdba90fb",0,_,[])});(0,a.registerServerReference)($,"80fc7b8dd1899cc769bcd551d230cf70eabdba90fb",null),Object.defineProperty($,"name",{value:"getBerandaAktivitas"});let w=async function(e){if((0,d.cacheLife)("hours"),!(0,i.W)(e))return null;(0,d.cacheTag)("aktivitas",`aktivitas-${e}`);let a=await l.f.fetch(n.f`*[_type == "beritaAcara" && slug.current == $slug][0] ${f}`,{slug:e}),t=(0,i.L)(i.c,a);return t&&g(t)};var A=(0,r.cache)(function(){return(0,t.cache)("default","c045771834e4178fa7d8432735016ffb2855c2f022",0,w,Array.prototype.slice.call(arguments,0,1))});(0,a.registerServerReference)(A,"c045771834e4178fa7d8432735016ffb2855c2f022",null),Object.defineProperty(A,"name",{value:"getAktivitasBySlug"}),e.s(["k",0,h,"_",0,v,"C",0,$,"P",0,A,"q",0,A,"e",0,v,"J",0,function(e={}){let a=(0,u.E)(e);return(0,u.p)(a)?h(a.pageSize):m(a)},"n",0,$],212754);let I=n.f`{
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
  "imageAspectRatio": image.asset->metadata.dimensions.aspectRatio,
  "imageHotspot": image.hotspot{x, y},
  "participants": participants[]{ _key, name, faculty, "imageUrl": image.asset->url }
}`,j=async function(e){(0,d.cacheTag)("prestasi");let a=await P((0,u.E)({pageSize:e}));return 0===a.total?(0,d.cacheLife)("seconds"):(0,d.cacheLife)("hours"),a};var k=(0,r.cache)(function(){return(0,t.cache)("default","c0d6c1135a63df1b810ec81f6b6b1989bd4e28d8db",0,j,Array.prototype.slice.call(arguments,0,1))});(0,a.registerServerReference)(k,"c0d6c1135a63df1b810ec81f6b6b1989bd4e28d8db",null),Object.defineProperty(k,"name",{value:"getFirstPrestasiPage"});async function P(e){let a={...e,validIds:await (0,s.R)("prestasi")},t=await l.f.fetch(`count(*[${c.D} && _id in $validIds])`,a);return(0,u.A)(t,a.page,(e,t)=>l.f.fetch(`*[${c.D} && _id in $validIds] | order(year desc, _createdAt desc, _id asc) [$start...$end] ${I}`,{...a,start:e,end:t}).then(e=>(0,i.I)(i.X).parse(e)),a.pageSize)}let S=async function(){(0,d.cacheTag)("prestasi");let e=await (0,s.R)("prestasi"),a=await l.f.fetch(n.f`{
    "total": count(*[_type == "prestasi" && _id in $validIds]),
    "years": array::unique(*[_type == "prestasi" && _id in $validIds && defined(year)].year),
    "fields": array::unique(*[_type == "prestasi" && _id in $validIds && defined(field)].field),
    "categories": array::unique(*[_type == "prestasi" && _id in $validIds && defined(category)].category)
  }`,{validIds:e}),t=i.h.parse(a??{});return 0===t.total?(0,d.cacheLife)("seconds"):(0,d.cacheLife)("hours"),t};var R=(0,r.cache)(function(){return(0,t.cache)("default","80e85e16ec2101c57c8d39985da8231615f1776170",0,S,[])});(0,a.registerServerReference)(R,"80e85e16ec2101c57c8d39985da8231615f1776170",null),Object.defineProperty(R,"name",{value:"getPrestasiMeta"});let L=async function(){(0,d.cacheLife)("hours"),(0,d.cacheTag)("prestasi","homePage");let{picked:e,latest:a}=await l.f.fetch(n.f`{
      "picked": *[_type == "homePage" && _id == "homePage"][0].sorotanPrestasi[0...10]-> ${I},
      "latest": *[_type == "prestasi" && _id in $validIds] | order(year desc, _createdAt desc) [0...$limit] ${I}
    }`,{limit:10,validIds:await (0,s.R)("prestasi")}),t=[];for(let r of[...e??[],...a])r&&!t.some(({_id:e})=>e===r._id)&&t.push(r);return(0,i.I)(i.X).parse(t).slice(0,5)};var T=(0,r.cache)(function(){return(0,t.cache)("default","80a131163c888b6abd48196f14bd306e4905d11022",0,L,[])});(0,a.registerServerReference)(T,"80a131163c888b6abd48196f14bd306e4905d11022",null),Object.defineProperty(T,"name",{value:"getBerandaPrestasi"}),e.s(["k",0,k,"_",0,R,"C",0,T,"e",0,T,"L",0,R,"w",0,function(e={}){let a=(0,u.E)(e);return(0,u.p)(a)?k(a.pageSize):P(a)}],880693);let U=`*[_type == "bidang" && defined(slug.current)] | order(_createdAt asc) {
  _id, "slug": slug.current, abbr, fullName, "imageUrl": image.asset->url
}`,B=n.f`{
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
}`,z=async function(){return(0,d.cacheLife)("hours"),(0,d.cacheTag)("bidang"),(0,i.I)(i.i).parse(await l.f.fetch(U))};var O=(0,r.cache)(function(){return(0,t.cache)("default","803fb59c7d1846cc5f4427481aa4140ea0749755ef",0,z,[])});(0,a.registerServerReference)(O,"803fb59c7d1846cc5f4427481aa4140ea0749755ef",null),Object.defineProperty(O,"name",{value:"getAllBidang"});let M=async function(e){return((0,d.cacheLife)("hours"),(0,i.W)(e))?((0,d.cacheTag)("bidang",`bidang-${e}`),(0,i.L)(i.g,await l.f.fetch(n.f`*[_type == "bidang" && slug.current == $slug][0] ${B}`,{slug:e}))):null};var N=(0,r.cache)(function(){return(0,t.cache)("default","c0bca07908edd9773f926e198775a5b20d6cb23e5a",0,M,Array.prototype.slice.call(arguments,0,1))});(0,a.registerServerReference)(N,"c0bca07908edd9773f926e198775a5b20d6cb23e5a",null),Object.defineProperty(N,"name",{value:"getBidangBySlug"}),e.s(["k",0,O,"_",0,N,"w",0,N],839322)},46327,702745,575586,e=>{"use strict";let a=`_type == "beritaAcara" && defined(slug.current) &&
  select(jenis == "acara" => "event", "article") in $types &&
  ($category == "all" || category == $category) &&
  ($status == "all" || (jenis == "acara" && status == $status)) &&
  ($search == "" || count(string::split(lower(coalesce(title, "") + " " + coalesce(description, "") + " " + coalesce(category, "")), $search)) > 1)`,t=`_type == "prestasi" &&
  ($year == "all" || string(year) == $year) &&
  ($field == "all" || field == $field) &&
  ($category == "all" || category == $category) &&
  ($search == "" || count(string::split(lower(coalesce(title, "") + " " + coalesce(description, "") + " " + coalesce(array::join(participants[].name, " "), "")), $search)) > 1)`;e.s(["D",0,t,"n",0,a],46327);var r=e.i(745015),i=e.i(935661),c=e.i(347540),s=e.i(665044),n=e.i(822236),l=e.i(334185);let d=async function(e){if((0,s.cacheTag)(e),"aktivitas"===e){(0,s.cacheLife)("hours");let e=await n.f.fetch(`*[_type == "beritaAcara"]{
      _id, "slug": slug.current, "type": select(jenis == "acara" => "event", "article"), title
    }`);return(0,l.I)(l.H,1/0).parse(e).map(e=>e._id)}let a=await n.f.fetch('*[_type == "prestasi"]{_id, title, year, category, level}'),t=(0,l.I)(l.w,1/0).parse(a).map(e=>e._id);return t.length?(0,s.cacheLife)("hours"):(0,s.cacheLife)("seconds"),t};var u=(0,c.cache)(function(){return(0,i.cache)("default","c02f1866721d4294d108fe757a49b738646f8a4852",0,d,Array.prototype.slice.call(arguments,0,1))});(0,r.registerServerReference)(u,"c02f1866721d4294d108fe757a49b738646f8a4852",null),Object.defineProperty(u,"name",{value:"getValidArchiveIds"}),e.s(["k",0,u,"R",0,u],702745),e.s(["f",0,function(e,...a){let t=e.length-1;return e.slice(0,t).reduce((e,t,r)=>e+t+a[r],"")+e[t]}],575586)}];

//# sourceMappingURL=_1vnyjc7ui8-x8._.js.map