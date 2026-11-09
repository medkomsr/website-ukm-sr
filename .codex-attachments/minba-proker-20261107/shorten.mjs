import {getCliClient} from 'sanity/cli';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
process.loadEnvFile('.env.local');
const client=getCliClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,apiVersion:'2024-01-01',useCdn:false}).withConfig({dataset:'development',perspective:'raw'});
assert.equal(client.config().projectId,'yzaa35ug');
assert.equal(client.config().dataset,'development');
const docs=await client.fetch('*[_type=="departemen" && slug.current=="minba"]');
assert.equal(docs.length,1);
const doc=docs[0];
const summaries={
 'pembinaan-rutin':'Pembinaan minat dan bakat oleh pengurus tiap bidang, di bawah koordinasi dan pengawasan Minba.',
 'kaderisasi-prestatif':'Seleksi talenta dan pembentukan tim anggota untuk mewakili UKM Seni Religi dalam lomba.',
 'pendelegasian':'Penjaringan dan pengutusan anggota ke lomba yang sesuai dengan bidang pembinaan.',
 'info-lomba':'Penyampaian informasi lomba yang relevan dengan bidang pembinaan UKM Seni Religi.',
 'consulting-center':'Persiapan dan pendampingan anggota dalam mengikuti lomba sesuai bidangnya.',
 'sr-talent-management':'Menghubungkan talenta anggota dengan kebutuhan pihak eksternal secara profesional dan terstruktur.',
 'peminjaman-inventaris':'Layanan peminjaman inventaris UKM Seni Religi untuk kebutuhan acara internal maupun eksternal.',
 'sr-mini-shop':'Penjualan karya dan inventaris UKM Seni Religi yang bernilai jual, baik umum maupun bidang.',
};
assert.equal(doc.programKerja.length,8);
const programKerja=doc.programKerja.map(p=>{assert.ok(summaries[p._key]);return {...p,detail:summaries[p._key]};});
const base='.codex-attachments/minba-proker-20261107/';
writeFileSync(base+'before-shorten.json',JSON.stringify(doc,null,2),{flag:'wx'});
await client.patch(doc._id).ifRevisionId(doc._rev).set({programKerja}).commit();
const after=await client.getDocument(doc._id);
assert.deepEqual(after.programKerja,programKerja);
const stable=({programKerja,_rev,_updatedAt,...d})=>d;
assert.deepEqual(stable(after),stable(doc));
writeFileSync(base+'shortened.json',JSON.stringify(programKerja,null,2));
console.log(JSON.stringify({dataset:'development',count:programKerja.length,verified:true}));
