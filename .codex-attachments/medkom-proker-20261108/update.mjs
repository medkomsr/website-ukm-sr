import {getCliClient} from 'sanity/cli';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
process.loadEnvFile('.env.local');
const client=getCliClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,apiVersion:'2024-01-01',useCdn:false}).withConfig({dataset:'development',perspective:'raw'});
assert.equal(client.config().projectId,'yzaa35ug');
assert.equal(client.config().dataset,'development');
const docs=await client.fetch('*[_type=="departemen" && slug.current=="medkom"]');
assert.equal(docs.length,1);
const doc=docs[0];
assert.deepEqual(doc.programKerja.map(p=>p.nama),['Kabar Seni Religi','Studio Kreatif','Arsip Cerita']);
const entries=[
 ['grand-launching-kabinet','Grand Launching Kabinet','Pengenalan pengurus baru UKM Seni Religi 2026 melalui Instagram.'],
 ['oprec-anggota-pembinaan','Oprec Anggota Pembinaan','Rangkaian kegiatan untuk menarik minat mahasiswa bergabung di UKM Seni Religi UB.'],
 ['moniq','MONIQ','Publikasi kata-kata mutiara di media sosial UKM Seni Religi.'],
 ['ulang-tahun-pengurus-harian','Ulang Tahun Pengurus Harian','Ucapan ulang tahun bagi pengurus harian UKM Seni Religi.'],
 ['kabar-prestasi','Kabar Prestasi','Publikasi prestasi anggota UKM Seni Religi.'],
 ['jadwal-publikasi-pembinaan','Jadwal Pembinaan dan Publikasi Pembinaan','Penyampaian jadwal dan informasi kegiatan pembinaan.'],
 ['konten-lpj','Konten LPJ','Rekap seluruh kegiatan pada pertengahan dan akhir masa kepengurusan.'],
 ['ucapan-hari-besar','Ucapan Hari Besar (PHBI & PHBN)','Ucapan peringatan hari besar Islam dan nasional.'],
 ['live-report-kegiatan','Live Report Kegiatan','Dokumentasi langsung kegiatan bersama UKM Seni Religi.'],
 ['ulang-tahun-ukm-lain','Ucapan Ulang Tahun UKM Lain','Ucapan ulang tahun untuk UKM Seni Religi di universitas lain.'],
 ['publikasi-karya-bidang','Publikasi Karya Bidang (OPERA SR)','Apresiasi karya anggota dari bidang pembinaan melalui publikasi di media sosial UKM Seni Religi.'],
 ['podcast','Podcast','Diskusi digital UKM Seni Religi.'],
 ['spesial-ramadhan','Spesial Ramadhan','Konten selama bulan Ramadhan hingga menjelang Hari Raya Idul Fitri.'],
 ['company-profile','Company Profile','Video profil UKM Seni Religi 2025.'],
 ['grand-launching-website','Grand Launching & Sosialisasi Website','Peluncuran website kepada publik dan demo fitur inventaris bagi pengurus.'],
 ['sr-digital-information-center','SR Digital Information Center','Penghimpunan, pengelolaan, dan unggah berita kegiatan, press release, serta prestasi ke website.'],
];
const programKerja=entries.map(([_key,nama,detail])=>({_type:'programKerja',_key,nama,detail}));
assert.equal(programKerja.length,16);
assert.ok(programKerja.every(p=>p.nama.length<=100 && p.detail.length<=500));
const base='.codex-attachments/medkom-proker-20261108/';
writeFileSync(base+'before.json',JSON.stringify(doc,null,2),{flag:'wx'});
await client.patch(doc._id).ifRevisionId(doc._rev).set({programKerja}).commit();
const after=await client.getDocument(doc._id);
assert.deepEqual(after.programKerja,programKerja);
const stable=({programKerja,_rev,_updatedAt,...d})=>d;
assert.deepEqual(stable(after),stable(doc));
writeFileSync(base+'verified.json',JSON.stringify({dataset:'development',document:doc._id,programKerja,onlyProgramsChanged:true},null,2));
console.log(JSON.stringify({dataset:'development',count:programKerja.length,verified:true}));
