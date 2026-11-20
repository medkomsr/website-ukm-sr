import { getCliClient } from 'sanity/cli';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
process.loadEnvFile('.env.local');
const client = getCliClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, apiVersion: '2024-01-01', useCdn: false }).withConfig({ dataset: 'development', perspective: 'raw' });
assert.equal(client.config().projectId, 'yzaa35ug');
assert.equal(client.config().dataset, 'development');
const base = '.codex-attachments/dia-gallery-20261105/';
const source = 'C:/Users/Adam R/Downloads/dokumentasi_pembinaan_debat_ilmiah/';
const id = 'bidang-dia';
const doc = await client.getDocument(id);
assert.ok(doc);
assert.equal(await client.getDocument(`drafts.${id}`), undefined);
assert.ok(doc.gallery.every(item => item.caption?.includes('ilustrasi demo')));
if (!existsSync(base + 'before.json')) writeFileSync(base + 'before.json', JSON.stringify(doc, null, 2), { flag: 'wx' });
const entries = [
  ['IMG-20250222-WA0092.jpg', 'Kebersamaan dalam pembinaan Debat Ilmiah Al-Qur’an', 'Lima peserta pembinaan Debat Ilmiah Al-Qur’an berkumpul di meja dengan buku catatan dan laptop.', 0.5, 0.65],
  ['IMG-20251102-WA0012.jpg', 'Pertemuan pembinaan Debat Ilmiah Al-Qur’an', 'Peserta pembinaan Debat Ilmiah Al-Qur’an berfoto bersama di sekitar meja panjang dalam ruangan.', 0.35, 0.5],
  ['IMG-20251205-WA0112.jpg', 'Momen bersama peserta pembinaan Debat Ilmiah Al-Qur’an', 'Tiga peserta pembinaan Debat Ilmiah Al-Qur’an berfoto bersama di meja luar ruangan pada malam hari.', 0.7, 0.5],
  ['20250215_183353.jpg', 'Dokumentasi pembinaan Debat Ilmiah Al-Qur’an', 'Empat peserta pembinaan Debat Ilmiah Al-Qur’an berfoto bersama di meja luar ruangan dengan buku catatan.', 0.65, 0.65],
  ['20251025_214016.jpg', 'Kebersamaan peserta Debat Ilmiah Al-Qur’an', 'Empat peserta pembinaan Debat Ilmiah Al-Qur’an berfoto bersama di meja pada malam hari.', 0.65, 0.5],
];
const gallery = [];
const uploaded = [];
for (const [index, [filename, caption, alt, x, y]] of entries.entries()) {
  const path = (filename === '20250215_183353.jpg' ? base : source) + filename;
  const buffer = readFileSync(path);
  const metadata = await sharp(buffer).metadata();
  assert.equal(metadata.format, 'jpeg');
  assert.ok(buffer.length <= 5 * 1024 * 1024);
  assert.ok(metadata.width >= 128 && metadata.width <= 12000 && metadata.height >= 128 && metadata.height <= 12000);
  const sha1 = createHash('sha1').update(buffer).digest('hex');
  let asset = await client.fetch('*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]', { sha1 });
  if (!asset) asset = await client.assets.upload('image', buffer, { filename, contentType: 'image/jpeg' });
  uploaded.push({ filename, id: asset._id, sha1, url: asset.url });
  writeFileSync(base + 'uploaded.json', JSON.stringify(uploaded, null, 2));
  gallery.push({ _key: `dia-documentation-${index + 1}`, _type: 'object', image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, hotspot: { _type: 'sanity.imageHotspot', x, y, width: 2 * Math.min(x, 1 - x), height: 2 * Math.min(y, 1 - y) } }, caption, alt });
  console.log(`Foto ${index + 1}/5 siap.`);
}
await client.patch(id).ifRevisionId(doc._rev).set({ gallery }).commit();
const after = await client.getDocument(id);
assert.deepEqual(after.gallery, gallery);
const stable = ({ gallery, _rev, _updatedAt, ...rest }) => rest;
assert.deepEqual(stable(after), stable(doc));
for (const entry of uploaded) {
  const asset = await client.getDocument(entry.id);
  assert.equal(asset.sha1hash, entry.sha1);
  assert.ok((await fetch(asset.url, { method: 'HEAD' })).ok);
}
const result = { dataset: 'development', document: id, photos: after.gallery.length, verified: true, onlyGalleryChanged: true };
writeFileSync(base + 'verified.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
