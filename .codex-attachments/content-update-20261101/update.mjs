import { getCliClient } from 'sanity/cli';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
process.loadEnvFile('.env.local');
const folder = '.codex-attachments/content-update-20261101';
const dataset = process.argv.find(a => a === 'development' || a === 'production');
assert(dataset, 'Specify dataset');
const base = getCliClient({projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, apiVersion:'2024-01-01',useCdn:false});
assert.equal(base.config().projectId, 'yzaa35ug');
const client = base.withConfig({dataset});
const visi = 'Mewujudkan UKM Seni Religi sebagai pilar utama pengembangan kreativitas dan prestasi dalam bidang seni religi, yang berlandaskan nilai kekeluargaan, tanggung jawab, serta sinergi antar anggota.';
const misi = [
 'Menumbuhkan dan memperkuat spiritualitas anggota melalui penciptaan lingkungan organisasi yang menjunjung tinggi nilai-nilai keagamaan.',
 'Membangun hubungan yang harmonis, sinergis, dan berkelanjutan baik secara internal maupun eksternal UKM Seni Religi.',
 'Menanamkan nilai kepedulian dalam setiap program kegiatan sebagai upaya mempererat ikatan persahabatan, solidaritas, dan kekeluargaan.',
 'Mengembangkan potensi seni religi yang inovatif dan berdaya saing serta memperkuat citra dan branding seni religi di lingkungan Universitas Brawijaya.',
];
const studi = 'Kegiatan kunjungan atau menerima kunjungan dari UKM yang sejenis atau linear dengan UKM Seni Religi Universitas Brawijaya untuk menjalin silaturahmi, berdiskusi tentang pengembangan minat dan bakat, serta bertukar ilmu atau informasi mengenai manajemen organisasi.';
const details = {
 'gbqn-ub': "GBQN (Gebyar Brawijaya Qur'ani Nasional) adalah kompetisi seni dan syiar Al-Qur'an tingkat nasional yang diselenggarakan oleh UKM Seni Religi Universitas Brawijaya. Kegiatan ini menjadi wadah bagi pelajar dan mahasiswa dari berbagai daerah di Indonesia untuk berkompetisi, mengembangkan bakat Qur'ani, serta mempererat silaturahmi antar generasi Qur'ani.",
 'mtq-ub': 'MTQ UB (Musabaqah Tilawatil Qur’an Universitas Brawijaya) merupakan kompetisi internal antar-fakultas di Universitas Brawijaya yang juga difungsikan sebagai ajang seleksi untuk menjaring delegasi terbaik kafilah MTQMN.',
 'studi-banding': studi,
 'wisata-religi': 'Wisata religi merupakan agenda ziarah wali bagi seluruh anggota UKM Seni Religi Universitas Brawijaya, mahasiswa, dan masyarakat umum. Kegiatan ini merupakan program kerja tahunan UKM Seni Religi yang dilaksanakan di akhir tahun.',
 'festival-qurban': 'Festival Qurban merupakan program dalam memperingati Hari Raya Idul Adha dengan rangkaian acara penyembelihan hewan qurban serta menyalurkannya kepada yang membutuhkan.',
 'safari-khotmil': 'Merupakan program kerja dalam rangka menyambut bulan suci Ramadhan dengan agenda khataman Al-Qur’an selama 17 hari dengan bekerja sama dengan LDF (Lembaga Dakwah Fakultas) di Universitas Brawijaya.',
 'diklat-ph': 'Kegiatan pendidikan dan latihan dasar kepengurusan serta bonding antar Pengurus Harian.',
 'halal-bihalal': 'Kegiatan yang diselenggarakan dengan tujuan untuk mempererat tali silaturahmi keseluruhan keluarga UKM Seni Religi yang terdiri dari seluruh anggota, pengurus harian, dan alumni.',
 'muktamar': 'Merupakan agenda akhir tahun kepengurusan dalam rangka pertanggungjawaban selama 1 tahun kepengurusan serta agenda pemilihan ketua umum periode selanjutnya.',
 'psdm-yks': 'Pembacaan maulid diba’ yang dilakukan setiap hari Kamis malam Jumat ba’da Isya. Kegiatan ini dilaksanakan di masjid-masjid Universitas Brawijaya secara bergiliran dan juga berkolaborasi dengan LDF (Lembaga Dakwah Fakultas) atau universitas lain.',
 'psdm-3n': 'Kegiatan rutin untuk mempererat ukhuwah insaniyah antar anggota dan Pengurus Harian UKM Seni Religi Universitas Brawijaya melalui rangkaian kegiatan khataman Al-Qur’an dan diskusi santai bersama.',
 'psdm-stuban': studi,
};
const items = [
 { _key:'tentang-seni-religi', _type:'faqItem', pertanyaan:'Apa sih UKM Seni Religi itu?', jawaban:'Seni Religi merupakan salah satu Unit Kegiatan Mahasiswa (UKM) di Universitas Brawijaya yang menjadi wadah bagi mahasiswa untuk mengembangkan minat dan bakat di bidang seni Islami dan Qur’ani. UKM ini didirikan pada 10 Muharram 1433 H, bertepatan dengan tahun 2012, sebagai bentuk komitmen dalam mewadahi kreativitas mahasiswa yang bernilai religius di lingkungan Universitas Brawijaya.' },
 { _key:'program-prioritas', _type:'faqItem', pertanyaan:'Apa Program Prioritas UKM Seni Religi?', jawaban:'Pertama, Musabaqah Tilawatil Qur’an Mahasiswa Nasional (MTQMN) merupakan ajang kompetisi tingkat nasional yang diselenggarakan oleh Kementerian Pendidikan Tinggi dengan siklus penyelenggaraan dua tahun sekali.\n\nKedua, Gebyar Brawijaya Qur’ani Nasional (GBQN) diselenggarakan pada tahun ketika MTQMN tidak berlangsung. GBQN merupakan kompetisi Al-Qur’an tingkat nasional yang juga menjadi sarana pengenalan Universitas Brawijaya kepada siswa SMA/sederajat sekaligus menjaring calon mahasiswa berprestasi di bidang Al-Qur’an.\n\nKetiga, MTQ Universitas Brawijaya (MTQ UB) merupakan kompetisi internal tingkat Universitas yang diselenggarakan setiap tahun. Kegiatan ini berfungsi sebagai wadah penjaringan dan pembinaan mahasiswa berprestasi untuk mempersiapkan kafilah Universitas Brawijaya yang akan berlaga di MTQMN.' },
 { _key:'kegiatan-lain', _type:'faqItem', pertanyaan:'Apakah UKM Seni Religi hanya berfokus pada pembinaan prestasi, atau juga memiliki kegiatan lainnya?', jawaban:'Tentu tidak. UKM Seni Religi tidak hanya berfokus pada pembinaan prestasi dan kompetisi Al-Qur’an, tetapi juga memiliki banyak kegiatan keagamaan, kebersamaan, dan pengembangan organisasi.\n\nBeberapa di antaranya adalah YKS (Yuk Kita Sholawatan) yang dilaksanakan setiap malam Jumat secara bergiliran di masjid-masjid fakultas, 3N (Ngaji, Ngopi, Njagong) berupa kegiatan khotmil Qur’an di masjid fakultas, Safari Khotmil, Wisata Religi, Muktamar, Harlah, serta kegiatan sowan kepada pembina.' },
];
assert(visi.length <= 500 && misi.every(x=>x.length<=250));
assert(Object.values(details).every(x=>x.length<=500));
assert(items.every(x=>x.pertanyaan.length<=150 && x.jawaban.length<=1500));
const before = await client.fetch('*[_type in ["visiMisi","faq","departemen"]]');
writeFileSync(`${folder}/${dataset}-preapply.json`,JSON.stringify(before,null,2),{flag:'wx'});
const original = JSON.parse(readFileSync(`${folder}/${dataset}-before.json`,'utf8'));
for (const id of ['visiMisi','drafts.visiMisi','departemen-bkrt','departemen-psdm']) {
 assert.equal(before.find(d=>d._id===id)?._rev,original.find(d=>d._id===id)?._rev,`Changed since inspection: ${id}`);
}
assert(!before.some(d=>d._type==='faq'), 'FAQ appeared since inspection');
const changed = new Map();
for(const id of ['visiMisi','drafts.visiMisi']) {
 const d=before.find(d=>d._id===id); if(d) changed.set(id,{visi,misi});
}
const bkrt=before.find(d=>d._id==='departemen-bkrt');
for(const key of Object.keys(details).filter(k=>!k.startsWith('psdm-'))) assert(bkrt.programKerja.some(p=>p._key===key),key);
changed.set(bkrt._id,{programKerja:bkrt.programKerja.map(p=>details[p._key]?{...p,detail:details[p._key]}:p)});
let psdm=before.find(d=>d._id==='departemen-psdm').programKerja;
if(dataset==='production') {
 const verified=JSON.parse(readFileSync(`${folder}/development-verified.json`,'utf8'));
 const dev=base.withConfig({dataset:'development'});
 const current=await dev.fetch('*[_id=="departemen-psdm"][0]');
 assert.deepEqual(current.programKerja,verified.find(d=>d._id===current._id).programKerja);
 psdm=structuredClone(current.programKerja);
 for(const p of psdm) {
  const ref=p.foto?.asset?._ref; if(!ref)continue;
  if(await client.getDocument(ref))continue;
  const asset=await dev.getDocument(ref);
  assert(asset?.url?.startsWith('https://cdn.sanity.io/images/yzaa35ug/development/'));
  const response=await fetch(asset.url); assert(response.ok);
  const uploaded=await client.assets.upload('image',Buffer.from(await response.arrayBuffer()),{filename:asset.originalFilename,contentType:asset.mimeType});
  p.foto.asset._ref=uploaded._id;
  console.log(`Copied documentation asset: ${p.nama}`);
 }
}
for(const key of ['psdm-3n','psdm-stuban','psdm-yks'])assert(psdm.some(p=>p._key===key),key);
changed.set('departemen-psdm',{programKerja:psdm.map(p=>details[p._key]?{...p,detail:details[p._key]}:p)});
let tx=client.transaction();
for(const [id,fields] of changed)tx=tx.patch(id,p=>p.ifRevisionId(before.find(d=>d._id===id)._rev).set(fields));
tx=tx.create({_id:'faq',_type:'faq',items});
await tx.commit();
const after=await client.fetch('*[_type in ["visiMisi","faq","departemen"]]');
const strip=d=>{const {_rev,_updatedAt,...rest}=d;return rest;};
for(const old of before){const expected={...strip(old),...changed.get(old._id)};assert.deepEqual(strip(after.find(d=>d._id===old._id)),expected,old._id);}
assert.deepEqual(after.find(d=>d._id==='faq').items,items);
assert.equal(after.length,before.length+1);
writeFileSync(`${folder}/${dataset}-verified.json`,JSON.stringify(after,null,2),{flag:'wx'});
console.log(JSON.stringify({dataset,verified:true,vision:1,missions:4,programDescriptions:12,faq:3,psdmPrograms:5,unrelatedFieldsPreserved:true}));
