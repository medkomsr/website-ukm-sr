import { getCliClient } from 'sanity/cli';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';

process.loadEnvFile('.env.local');
const client = getCliClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, apiVersion: '2024-01-01', useCdn: false }).withConfig({ dataset: 'development', perspective: 'raw' });
assert.equal(client.config().projectId, 'yzaa35ug');
assert.equal(client.config().dataset, 'development');
const base = '.codex-attachments/banjari-gallery-20261105/';
const id = 'bidang-banjari-nasyid';
const doc = await client.getDocument(id);
assert.ok(doc);
assert.equal(await client.getDocument(`drafts.${id}`), undefined, 'Draft exists; inspect before updating');
assert.ok(doc.gallery.every(item => item.caption?.includes('ilustrasi demo')), 'Unexpected existing documentation');
writeFileSync(base + 'before.json', JSON.stringify(doc, null, 2), { flag: 'wx' });
const entries = [
  ['Kebersamaan anggota dalam pembinaan Banjari', 'Anggota Banjari berfoto bersama dengan rebana di ruang yang menampilkan koleksi piala.'],
  ['Suasana latihan pembinaan Banjari', 'Anggota Banjari duduk melingkar di dalam ruangan dengan rebana saat pembinaan.'],
  ['Foto bersama peserta pembinaan Banjari', 'Peserta pembinaan Banjari berfoto bersama di selasar, beberapa memegang rebana.'],
  ['Kebersamaan peserta pembinaan Banjari', 'Peserta pembinaan Banjari berfoto bersama sambil duduk di dalam gedung.'],
];
const gallery = [];
const uploaded = [];
for (const [index, [caption, alt]] of entries.entries()) {
  const filename = `dokumentasi_pembinaan_banjari_${index + 1}.jpg`;
  const buffer = readFileSync(`C:/Users/Adam R/Downloads/${filename}`);
  const metadata = await sharp(buffer).metadata();
  assert.equal(metadata.format, 'jpeg');
  assert.ok(buffer.length <= 5 * 1024 * 1024);
  assert.ok(metadata.width >= 128 && metadata.width <= 12000 && metadata.height >= 128 && metadata.height <= 12000);
  const sha1 = createHash('sha1').update(buffer).digest('hex');
  let asset = await client.fetch('*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]', { sha1 });
  if (!asset) asset = await client.assets.upload('image', buffer, { filename, contentType: 'image/jpeg' });
  uploaded.push({ filename, id: asset._id, sha1, url: asset.url });
  writeFileSync(base + 'uploaded.json', JSON.stringify(uploaded, null, 2));
  gallery.push({ _key: `banjari-documentation-${index + 1}`, _type: 'object', image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }, caption, alt });
  console.log(`Foto ${index + 1}/4 siap.`);
}
await client.patch(id).ifRevisionId(doc._rev).set({ gallery }).commit();
const after = await client.getDocument(id);
assert.deepEqual(after.gallery, gallery);
const stable = ({ gallery, _rev, _updatedAt, ...rest }) => rest;
assert.deepEqual(stable(after), stable(doc));
for (const entry of uploaded) {
  const asset = await client.getDocument(entry.id);
  assert.equal(asset.sha1hash, entry.sha1);
  const response = await fetch(asset.url, { method: 'HEAD' });
  assert.ok(response.ok, 'Uploaded photo must be reachable');
}
const result = { dataset: client.config().dataset, document: id, photos: after.gallery.length, verified: true, onlyGalleryChanged: true, files: uploaded.map(item => item.filename) };
writeFileSync(base + 'verified.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
