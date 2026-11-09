import {getCliClient} from 'sanity/cli';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
process.loadEnvFile('.env.local');
const client=getCliClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,apiVersion:'2024-01-01',useCdn:false}).withConfig({dataset:'development',perspective:'raw'});
assert.equal(client.config().projectId,'yzaa35ug');
assert.equal(client.config().dataset,'development');
const docs=await client.fetch('*[_type=="departemen" && slug.current in ["medkom","bkrt","psdm"]]');
assert.equal(docs.length,3);
const find=(slug,name)=>{const doc=docs.find(d=>d.slug.current===slug);assert.ok(doc);const ps=doc.programKerja.filter(p=>p.nama===name);assert.equal(ps.length,1);return {doc,p:ps[0]};};
const company=find('medkom','Company Profile');
const mtq=find('bkrt','MTQ UB 2026');
const threeN=find('psdm','3N');
assert.equal(company.p.detail,'Video profil UKM Seni Religi 2025.');
const base='.codex-attachments/site-corrections-20261109/';
writeFileSync(base+'before.json',JSON.stringify(docs,null,2),{flag:'wx'});
const bytes=readFileSync('C:/Users/ADAMR~1/AppData/Local/Temp/codex-clipboard-2636b13d-8cb8-4d3b-a5f2-7c0eba5b76f6.png');
const sha1=createHash('sha1').update(bytes).digest('hex');
let asset=await client.fetch('*[_type=="sanity.imageAsset" && sha1hash==$sha1][0]',{sha1});
if(!asset) asset=await client.assets.upload('image',bytes,{filename:'psdm-3n.png',contentType:'image/png'});
writeFileSync(base+'uploaded.json',JSON.stringify({id:asset._id,url:asset.url},null,2));
const foto={_type:'image',asset:{_type:'reference',_ref:asset._id},hotspot:{_type:'sanity.imageHotspot',x:0.5,y:0.8,width:1,height:0.35}};
const field=(p,name)=>`programKerja[_key==${JSON.stringify(p._key)}].${name}`;
await client.transaction()
 .patch(company.doc._id,p=>p.ifRevisionId(company.doc._rev).set({[field(company.p,'detail')]:'Video profil UKM Seni Religi.'}))
 .patch(mtq.doc._id,p=>p.ifRevisionId(mtq.doc._rev).set({[field(mtq.p,'nama')]:'MTQ UB'}))
 .patch(threeN.doc._id,p=>p.ifRevisionId(threeN.doc._rev).set({[field(threeN.p,'foto')]:foto}))
 .commit();
company.p.detail='Video profil UKM Seni Religi.';
mtq.p.nama='MTQ UB';
threeN.p.foto=foto;
const stable=({_rev,_updatedAt,...d})=>d;
for(const doc of docs)assert.deepEqual(stable(await client.getDocument(doc._id)),stable(doc));
writeFileSync(base+'verified.json',JSON.stringify({dataset:'development',verified:true,changes:['Company Profile year removed','MTQ UB year removed','3N photo added']},null,2));
console.log(JSON.stringify({dataset:'development',verified:true}));
