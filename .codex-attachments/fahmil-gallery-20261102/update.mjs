import { getCliClient } from 'sanity/cli';
import { createReadStream, existsSync, readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { basename } from 'node:path';

process.loadEnvFile('.env.local');
const client = getCliClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, apiVersion: '2024-01-01', useCdn: false }).withConfig({ dataset: 'development', perspective: 'raw' });
assert.equal(client.config().projectId, 'yzaa35ug');
assert.equal(client.config().dataset, 'development');
const dir = '.codex-attachments/fahmil-gallery-20261102';
const doc = await client.getDocument('bidang-fahmil-quran');
assert.ok(doc);
if (!existsSync(`${dir}/before.json`)) writeFileSync(`${dir}/before.json`, JSON.stringify(doc, null, 2));
const saved = existsSync(`${dir}/uploaded.json`) ? JSON.parse(readFileSync(`${dir}/uploaded.json`, 'utf8')) : {};
const entries = [
  ['dokumentasi_pembinaan_fahmil.jpg', 'Kebersamaan anggota Fahmil Qur’an', 'Anggota bidang Fahmil Qur’an duduk bersama di area kampus.'],
  ['dokumentasi_pembinaan_fahmil_4.jpg', 'Dokumentasi pembinaan Fahmil Qur’an', 'Anggota bidang Fahmil Qur’an berfoto bersama di dalam gedung.'],
  ['dokumentasi_pembinaan_fahmil_3.jpg', 'Kebersamaan di lingkungan kampus', 'Anggota bidang Fahmil Qur’an berfoto di taman kampus.'],
  ['dokumentasi_pembinaan_fahmil_2.jpg', 'Momen bersama anggota Fahmil Qur’an', 'Swafoto bersama anggota bidang Fahmil Qur’an di area luar gedung.'],
];
const gallery = [];
for (const [index, [file, caption, alt]] of entries.entries()) {
  if (!saved[file]) {
    const asset = await client.assets.upload('image', createReadStream(`C:/Users/Adam R/Downloads/${file}`), { filename: basename(file), contentType: 'image/jpeg' });
    saved[file] = asset._id;
    writeFileSync(`${dir}/uploaded.json`, JSON.stringify(saved, null, 2));
  }
  gallery.push({ _key: `fahmil-documentation-${index + 1}`, _type: 'object', image: { _type: 'image', asset: { _type: 'reference', _ref: saved[file] } }, caption, alt });
  console.log(`Foto ${index + 1}/4 siap.`);
}
await client.patch(doc._id).ifRevisionId(doc._rev).set({ gallery }).commit();
const after = await client.getDocument(doc._id);
assert.deepEqual(after.gallery, gallery);
const stable = ({ gallery, _rev, _updatedAt, ...rest }) => rest;
assert.deepEqual(stable(after), stable(doc));
console.log('VERIFIED: development, 4 foto, hanya gallery berubah.');
