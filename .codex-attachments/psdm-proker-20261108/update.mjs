import {getCliClient} from 'sanity/cli';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
process.loadEnvFile('.env.local');
const client=getCliClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,apiVersion:'2024-01-01',useCdn:false}).withConfig({dataset:'development',perspective:'raw'});
assert.equal(client.config().projectId,'yzaa35ug');
assert.equal(client.config().dataset,'development');
const docs=await client.fetch('*[_type=="departemen" && slug.current=="psdm"]');
assert.equal(docs.length,1);
const doc=docs[0];
assert.equal(doc.programKerja.length,5);
const entries=[
 ['harlah','Harlah','Peringatan tahunan untuk mengenang hari berdirinya UKM Seni Religi.','e42eff3f-a7b4-43de-a6ea-3c04fd0285ff',1],
 ['awarding','Awarding','Apresiasi bagi anggota terpilih yang paling aktif dalam pembinaan dan kegiatan UKM Seni Religi.','5b420552-8107-42a8-a8a8-37b52d727a2c',0.5],
 ['oprec-anggota','Oprec Anggota','Rangkaian rekrutmen bagi mahasiswa yang ingin bergabung menjadi anggota UKM Seni Religi UB.','87548e0e-2045-47be-8904-10e1d2aa5c15',0.6],
 ['mentoring','Mentoring','Kegiatan futsal bersama untuk mempererat hubungan keluarga besar UKM Seni Religi.','5c3f918d-4eae-47a9-bf58-2d3c892bc139',0.8],
];
const base='.codex-attachments/psdm-proker-20261108/';
writeFileSync(base+'before.json',JSON.stringify(doc,null,2),{flag:'wx'});
const additions=[];
const uploaded=[];
for(const [key,nama,detail,file,y] of entries){
 assert.ok(!doc.programKerja.some(p=>p.nama.toLowerCase()===nama.toLowerCase()));
 let bytes=readFileSync(`C:/Users/ADAMR~1/AppData/Local/Temp/codex-clipboard-${file}.jpg`);
 if(key==='harlah') bytes=await sharp(bytes).rotate(270).jpeg({quality:95}).toBuffer();
 writeFileSync(base+key+'.jpg',bytes,{flag:'wx'});
 const sha1=createHash('sha1').update(bytes).digest('hex');
 let asset=await client.fetch('*[_type=="sanity.imageAsset" && sha1hash==$sha1][0]',{sha1});
 if(!asset) asset=await client.assets.upload('image',bytes,{filename:`psdm-${key}.jpg`,contentType:'image/jpeg'});
 uploaded.push({key,id:asset._id,url:asset.url});
 writeFileSync(base+'uploaded.json',JSON.stringify(uploaded,null,2));
 additions.push({_type:'programKerja',_key:`psdm-${key}`,nama,detail,foto:{_type:'image',asset:{_type:'reference',_ref:asset._id},hotspot:{_type:'sanity.imageHotspot',x:0.5,y,width:1,height:0.4}}});
}
const programKerja=[...doc.programKerja,...additions];
await client.patch(doc._id).ifRevisionId(doc._rev).set({programKerja}).commit();
const after=await client.getDocument(doc._id);
assert.deepEqual(after.programKerja,programKerja);
const stable=({programKerja,_rev,_updatedAt,...d})=>d;
assert.deepEqual(stable(after),stable(doc));
writeFileSync(base+'verified.json',JSON.stringify({dataset:'development',programKerja,existingProgramsPreserved:true},null,2));
console.log(JSON.stringify({dataset:'development',total:programKerja.length,added:additions.map(p=>p.nama),verified:true}));
