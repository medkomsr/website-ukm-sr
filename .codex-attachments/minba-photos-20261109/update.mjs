import {getCliClient} from 'sanity/cli';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
process.loadEnvFile('.env.local');
const client=getCliClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,apiVersion:'2024-01-01',useCdn:false}).withConfig({dataset:'development',perspective:'raw'});
assert.equal(client.config().projectId,'yzaa35ug');
assert.equal(client.config().dataset,'development');
const docs=await client.fetch('*[_type=="departemen" && slug.current=="minba"]');
assert.equal(docs.length,1);
const doc=docs[0];
const base='.codex-attachments/minba-photos-20261109/';
const entries=[
 ['SR Mini Shop','C:/Users/ADAMR~1/AppData/Local/Temp/codex-clipboard-7766dc01-f53a-4546-afb7-9048d2070621.png','minba-sr-mini-shop.png'],
 ['Kaderisasi Prestatif','C:/Users/ADAMR~1/AppData/Local/Temp/codex-clipboard-fde8c103-3465-4ffc-819d-a22a748a00ab.png','minba-kaderisasi-prestatif.png'],
 ['Pendelegasian','C:/Users/Adam R/Downloads/dokumentasi_pendelegasian.png','minba-pendelegasian.png'],
 ['Pembinaan Rutin','C:/Users/ADAMR~1/AppData/Local/Temp/codex-clipboard-b63e22b6-5414-45d1-afbc-a6e325eaee1f.png','minba-pembinaan-rutin.png'],
];
for(const [name,path] of entries){assert.equal(doc.programKerja.filter(p=>p.nama===name).length,1);readFileSync(path);}
writeFileSync(base+'before.json',JSON.stringify(doc,null,2),{flag:'wx'});
const changes={};
const assets=[];
for(const [name,path,filename] of entries){
 const bytes=readFileSync(path);
 const sha1=createHash('sha1').update(bytes).digest('hex');
 let asset=await client.fetch('*[_type=="sanity.imageAsset" && sha1hash==$sha1][0]',{sha1});
 if(!asset)asset=await client.assets.upload('image',bytes,{filename,contentType:'image/png'});
 const program=doc.programKerja.find(p=>p.nama===name);
 const foto={_type:'image',asset:{_type:'reference',_ref:asset._id}};
 changes[`programKerja[_key==${JSON.stringify(program._key)}].foto`]=foto;
 program.foto=foto;
 assets.push({name,id:asset._id,url:asset.url});
}
writeFileSync(base+'uploaded.json',JSON.stringify(assets,null,2));
await client.patch(doc._id).ifRevisionId(doc._rev).set(changes).commit();
const stable=({_rev,_updatedAt,...d})=>d;
assert.deepEqual(stable(await client.getDocument(doc._id)),stable(doc));
writeFileSync(base+'verified.json',JSON.stringify({dataset:'development',verified:true,programs:assets.map(a=>a.name)},null,2));
console.log(JSON.stringify({dataset:'development',verified:true,programs:assets.map(a=>a.name)}));
