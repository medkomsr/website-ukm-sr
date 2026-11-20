import { getCliClient } from 'sanity/cli';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
process.loadEnvFile('.env.local');
const client = getCliClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, apiVersion: '2024-01-01', useCdn: false }).withConfig({ dataset: 'development', perspective: 'raw' });
assert.equal(client.config().projectId, 'yzaa35ug');
assert.equal(client.config().dataset, 'development');
const base = '.codex-attachments/kq-gallery-20261105/';
const docs = await client.fetch('*[_type == "bidang" && slug.current == "khattil-quran"]');
const doc = docs.find(d => d._id === 'bidang-khattil-quran');
assert.ok(doc);
assert.equal(docs.length, 1, 'Inspect duplicate or draft before updating');
console.log(JSON.stringify({document:doc._id, gallery:doc.gallery?.map(i=>({key:i._key,caption:i.caption}))}));
assert.ok((doc.gallery ?? []).every(item => item.caption?.includes('ilustrasi demo')), 'Inspect existing real documentation before replacing');
const entries = [
  ['Photo from Luthfan(2).jpg', 'Dokumentasi pembinaan Khattil Quran', 'Empat peserta pembinaan Khattil Quran menunjukkan hasil latihan di buku.'],
  ['Photo from Luthfan(3).jpg', 'Pembinaan seni kaligrafi', 'Peserta dan pembina berdiskusi dengan contoh karya kaligrafi di atas tikar.'],
  ['Photo from Luthfan.jpg', 'Pendampingan latihan khat', 'Pembina mencontohkan tulisan khat di buku kepada peserta.'],
  ['Photo from Luthfan(1).jpg', 'Latihan menulis khat', 'Peserta pembinaan berlatih menulis khat pada buku dan kertas.'],
];
const prepared = [];
for (const [filename, caption, alt] of entries) {
  const buffer = readFileSync('C:/Users/Adam R/Downloads/dokumentasi_pembinaan_kq/' + filename);
  const metadata = await sharp(buffer).metadata();
  assert.equal(metadata.format, 'jpeg');
  assert.ok(buffer.length <= 5 * 1024 * 1024);
  assert.ok(metadata.width >= 128 && metadata.width <= 12000 && metadata.height >= 128 && metadata.height <= 12000);
  prepared.push({filename, caption, alt, buffer, sha1:createHash('sha1').update(buffer).digest('hex')});
}
writeFileSync(base + 'before.json', JSON.stringify(doc, null, 2), { flag: 'wx' });
const gallery = [];
const uploaded = [];
for (const [index, entry] of prepared.entries()) {
  let asset = await client.fetch('*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]', { sha1: entry.sha1 });
  if (!asset) asset = await client.assets.upload('image', entry.buffer, { filename: entry.filename, contentType: 'image/jpeg' });
  uploaded.push({ filename: entry.filename, id: asset._id, sha1: entry.sha1, url: asset.url });
  writeFileSync(base + 'uploaded.json', JSON.stringify(uploaded, null, 2));
  gallery.push({ _key: `kq-documentation-${index + 1}`, _type: 'object', image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }, showFullImage: true, caption: entry.caption, alt: entry.alt });
  console.log(`Foto ${index + 1}/4 siap.`);
}
await client.patch(doc._id).ifRevisionId(doc._rev).set({ gallery }).commit();
const after = await client.getDocument(doc._id);
assert.deepEqual(after.gallery, gallery);
const stable = ({ gallery, _rev, _updatedAt, ...rest }) => rest;
assert.deepEqual(stable(after), stable(doc));
for (const entry of uploaded) {
  const asset = await client.getDocument(entry.id);
  assert.equal(asset.sha1hash, entry.sha1);
  assert.ok((await fetch(asset.url, { method: 'HEAD' })).ok);
}
const result = { dataset: 'development', document: doc._id, photos: after.gallery.length, verified: true, onlyGalleryChanged: true };
writeFileSync(base + 'verified.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
