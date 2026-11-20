import {getCliClient} from 'sanity/cli';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
process.loadEnvFile('.env.local');
const base=getCliClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,apiVersion:'2024-01-01',useCdn:false});
assert.equal(base.config().projectId,'yzaa35ug');
const studi='Kunjungan antar-UKM sejenis untuk mempererat silaturahmi, berbagi pengalaman pengembangan minat dan bakat, serta pengelolaan organisasi.';
const changes={
 'departemen-bkrt':{
  'gbqn-ub':'Kompetisi seni dan syiar Al-Qur’an tingkat nasional bagi pelajar dan mahasiswa untuk mengembangkan bakat Qur’ani serta mempererat silaturahmi.',
  'studi-banding':studi,
  'mtq-ub':'Kompetisi Al-Qur’an antar-fakultas di Universitas Brawijaya untuk menjaring dan mempersiapkan delegasi terbaik kafilah MTQMN.',
  'safari-khotmil':'Khataman Al-Qur’an selama 17 hari untuk menyambut Ramadan, bekerja sama dengan Lembaga Dakwah Fakultas di Universitas Brawijaya.',
  'wisata-religi':'Agenda tahunan ziarah wali pada akhir tahun bagi anggota UKM Seni Religi, mahasiswa, dan masyarakat umum.'
 },
 'departemen-psdm':{
  'psdm-stuban':studi,
  'psdm-3n':'Ngaji, Ngopi, Njagong: khataman Al-Qur’an dan diskusi santai untuk mempererat kebersamaan anggota dan Pengurus Harian.',
  'psdm-yks':'Pembacaan maulid diba’ setiap Kamis malam selepas Isya, bergiliran di masjid UB bersama Lembaga Dakwah Fakultas atau universitas lain.',
  'psdm-diklat':'Pembekalan nilai organisasi dan kerja sama untuk mempersiapkan anggota agar aktif berkegiatan di UKM Seni Religi.'
 }
};
const ids=Object.keys(changes).flatMap(id=>[id,`drafts.${id}`]);
const clean=d=>{const x=structuredClone(d);delete x._rev;delete x._updatedAt;return x;};
for(const dataset of ['development','production']){
 const client=base.withConfig({dataset});
 const docs=await client.fetch('*[_id in $ids]',{ids});
 for(const id of Object.keys(changes))assert(docs.some(d=>d._id===id),`Missing ${dataset}/${id}`);
 writeFileSync(`.codex-attachments/shorten-programs-20261102/${dataset}-${Date.now()}.json`,JSON.stringify(docs,null,2),{flag:'wx'});
 let tx=client.transaction();const expected=[];
 for(const doc of docs){
  const updates=changes[doc._id.replace(/^drafts\./,'')];const set={};const next=structuredClone(doc);
  for(const [key,detail] of Object.entries(updates)){
   const item=next.programKerja.find(p=>p._key===key);
   assert(item,`Missing key ${dataset}/${doc._id}/${key}`);
   item.detail=detail;set[`programKerja[_key=="${key}"].detail`]=detail;
  }
  tx=tx.patch(doc._id,p=>p.ifRevisionId(doc._rev).set(set));expected.push(next);
 }
 await tx.commit();
 const actual=await client.fetch('*[_id in $ids]',{ids});
 for(const doc of expected)assert.deepEqual(clean(actual.find(d=>d._id===doc._id)),clean(doc));
 console.log(`${dataset}: updated and verified ${expected.length} documents; unrelated fields preserved`);
}
