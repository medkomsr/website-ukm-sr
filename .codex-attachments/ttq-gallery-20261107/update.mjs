import { getCliClient } from 'sanity/cli';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
process.loadEnvFile('.env.local');
const client = getCliClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, apiVersion: '2024-01-01', useCdn: false }).withConfig({ dataset: 'development', perspective: 'raw' });
assert.equal(client.config().projectId, 'yzaa35ug');
assert.equal(client.config().dataset, 'development');
const base = '.codex-attachments/ttq-gallery-20261107/';
const source = 'C:/Users/Adam R/Downloads/';
const docs = await client.fetch('*[_type == "bidang" && slug.current == "ttq"]');
console.log(JSON.stringify(docs.map(d => ({ id: d._id, gallery: d.gallery?.map(i => ({ key: i._key, caption: i.caption })) }))));
const doc = docs.find(d => d._id === 'bidang-ttq');
assert.ok(doc);
assert.equal(docs.length, 1, 'Inspect duplicate or draft before updating');
assert.equal(doc.gallery.length, 2, 'Inspect gallery before appending');
const entries = [
  ['WhatsApp Image 2026-11-07 at 10.10.21.jpeg', 'Pembinaan daring Tilawah dan Tartil Al-Quran', 'Tangkapan layar pembinaan TTQ melalui Google Meet dengan enam kotak peserta.'],
  ['WhatsApp Image 2026-11-07 at 10.11.49.jpeg', 'Sesi latihan daring TTQ', 'Tangkapan layar sesi pembinaan TTQ melalui Google Meet dengan tiga peserta.'],
];
const prepared = [];
for (const [filename, caption, alt] of entries) {
  const buffer = readFileSync(source + filename);
  const metadata = await sharp(buffer).metadata();
  assert.equal(metadata.format, 'jpeg');
  assert.ok(buffer.length <= 5 * 1024 * 1024, 'Photo exceeds upload size limit');
  assert.ok(metadata.width >= 128 && metadata.width <= 12000 && metadata.height >= 128 && metadata.height <= 12000);
  prepared.push({filename, caption, alt, buffer, sha1:createHash('sha1').update(buffer).digest('hex')});
}
writeFileSync(base + 'before.json', JSON.stringify(doc, null, 2), { flag: 'wx' });
const gallery = structuredClone(doc.gallery);
const uploaded = [];
for (const [index, entry] of prepared.entries()) {
  let asset = await client.fetch('*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]', { sha1: entry.sha1 });
  if (!asset) asset = await client.assets.upload('image', entry.buffer, { filename: entry.filename, contentType: 'image/jpeg' });
  uploaded.push({ filename: entry.filename, id: asset._id, sha1: entry.sha1, url: asset.url });
  writeFileSync(base + 'uploaded.json', JSON.stringify(uploaded, null, 2));
  gallery.push({ _key: `ttq-online-20261107-${index + 1}`, _type: 'object', image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }, showFullImage: true, caption: entry.caption, alt: entry.alt });
  console.log(`Foto ${index + 1}/2 siap.`);
}
await client.patch(doc._id).ifRevisionId(doc._rev).set({ gallery }).commit();
const after = await client.getDocument(doc._id);
assert.deepEqual(after.gallery, gallery);
assert.deepEqual(after.gallery.slice(0, doc.gallery.length), doc.gallery);
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
