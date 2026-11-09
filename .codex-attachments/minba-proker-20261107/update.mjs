import { getCliClient } from 'sanity/cli';
import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
process.loadEnvFile('.env.local');
const client=getCliClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,apiVersion:'2024-01-01',useCdn:false}).withConfig({dataset:'development',perspective:'raw'});
assert.equal(client.config().projectId,'yzaa35ug');
assert.equal(client.config().dataset,'development');
const docs=await client.fetch('*[_type == "departemen" && slug.current == "minba"]');
assert.equal(docs.length,1);
const doc=docs[0];
assert.deepEqual(doc.programKerja.map(p=>p.nama),['Peta Potensi Anggota','Panggung Apresiasi','Kelas Persiapan Delegasi']);
const entries=[
 ['pembinaan-rutin','Pembinaan Rutin','Kegiatan pembinaan rutin adalah inti kegiatan dalam pengembangan potensi minat dan bakat anggota UKM Seni Religi yang dikoordinir dan diawasi oleh Departemen Minat Bakat. Pelaksanaan pembinaan rutin dilakukan oleh pengurus harian di setiap bidang.'],
 ['kaderisasi-prestatif','Kaderisasi Prestatif','Pembentukan tim dan seleksi talent dari anggota UKM Seni Religi yang memiliki keahlian di bidangnya untuk diutus dalam lomba.'],
 ['pendelegasian','Pendelegasian','Program Pendelegasian merupakan program yang kami sediakan untuk menjaring anggota UKM Seni Religi dalam lomba yang sesuai dengan bidang pembinaan.'],
 ['info-lomba','Info Lomba','Info Lomba merupakan program informasi-informasi terkait lomba yang relevan dengan bidang pembinaan yang ada di UKM Seni Religi.'],
 ['consulting-center','Consulting Center','Merupakan program persiapan dan pendampingan road to lomba anggota UKM Seni Religi dalam pendelegasian lomba yang sesuai dengan bidang yang dilombakan.'],
 ['sr-talent-management','SR Talent Management','Merupakan program yang berfokus pada pemberdayaan dan optimalisasi potensi anggota UKM Seni Religi dengan menjembatani talenta internal kepada pihak eksternal yang membutuhkan secara profesional dan terstruktur.'],
 ['peminjaman-inventaris','Peminjaman Inventaris','Merupakan program penyediaan layanan berupa barang inventaris milik UKM Seni Religi untuk mendukung kelengkapan kebutuhan barang suatu acara baik internal maupun eksternal.'],
 ['sr-mini-shop','SR Mini Shop','Merupakan program penjualan karya atau inventaris milik UKM Seni Religi yang memiliki daya jual, baik dari inventaris umum maupun inventaris bidang.'],
];
const programKerja=entries.map(([_key,nama,detail])=>({_type:'programKerja',_key,nama,detail}));
assert.ok(programKerja.every(p=>p.nama.length<=100 && p.detail.length<=500));
const base='.codex-attachments/minba-proker-20261107/';
writeFileSync(base+'before.json',JSON.stringify(doc,null,2),{flag:'wx'});
await client.patch(doc._id).ifRevisionId(doc._rev).set({programKerja}).commit();
const after=await client.getDocument(doc._id);
assert.deepEqual(after.programKerja,programKerja);
const stable=({programKerja,_rev,_updatedAt,...d})=>d;
assert.deepEqual(stable(after),stable(doc));
writeFileSync(base+'verified.json',JSON.stringify({dataset:'development',document:doc._id,programKerja,onlyProgramsChanged:true},null,2));
console.log(JSON.stringify({dataset:'development',programs:after.programKerja.map(p=>p.nama),verified:true}));
