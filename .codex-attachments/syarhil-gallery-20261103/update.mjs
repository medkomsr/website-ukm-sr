import { getCliClient } from 'sanity/cli';
import { createReadStream, existsSync, readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
process.loadEnvFile('.env.local');
const client = getCliClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, apiVersion: '2024-01-01', useCdn: false }).withConfig({ dataset: 'development', perspective: 'raw' });
assert.equal(client.config().projectId, 'yzaa35ug');
assert.equal(client.config().dataset, 'development');
const dir = '.codex-attachments/syarhil-gallery-20261103';
const doc = await client.getDocument('bidang-syarhil-quran');
assert.ok(doc);
if (!existsSync(`${dir}/before.json`)) writeFileSync(`${dir}/before.json`, JSON.stringify(doc, null, 2));
const saved = existsSync(`${dir}/uploaded.json`) ? JSON.parse(readFileSync(`${dir}/uploaded.json`, 'utf8')) : {};
const entries = [
 ['dokumentasi_pembinaan_syarhil_1.jpg', 'Kebersamaan anggota Syarhil Qur’an', 'Lima anggota bidang Syarhil Qur’an berfoto bersama di dalam ruangan.'],
 ['dokumentasi_pembinaan_syarhil_2.jpg', 'Latihan Syarhil Qur’an', 'Tiga anggota berlatih menyampaikan Syarhil Qur’an di ruang ibadah.'],
 ['dokumentasi_pembinaan_syarhil_3.jpg', 'Momen bersama anggota Syarhil Qur’an', 'Swafoto anggota bidang Syarhil Qur’an yang duduk bersama di dalam gedung.'],
];
const gallery = [];
for (const [index, [file, caption, alt]] of entries.entries()) {
 if (!saved[file]) {
  const asset = await client.assets.upload('image', createReadStream(`C:/Users/Adam R/Downloads/${file}`), { filename: file, contentType: 'image/jpeg' });
  saved[file] = asset._id;
  writeFileSync(`${dir}/uploaded.json`, JSON.stringify(saved, null, 2));
 }
 gallery.push({ _key: `syarhil-documentation-${index + 1}`, _type: 'object', image: { _type: 'image', asset: { _type: 'reference', _ref: saved[file] } }, caption, alt });
 console.log(`Foto ${index + 1}/3 siap.`);
}
await client.patch(doc._id).ifRevisionId(doc._rev).set({ gallery }).commit();
const after = await client.getDocument(doc._id);
assert.deepEqual(after.gallery, gallery);
const stable = ({ gallery, _rev, _updatedAt, ...rest }) => rest;
assert.deepEqual(stable(after), stable(doc));
for (const ref of Object.values(saved)) {
 const asset = await client.getDocument(ref);
 const response = await fetch(asset.url, { method: 'HEAD' });
 assert.ok(response.ok, `Asset unavailable: ${ref}`);
}
console.log('VERIFIED: development, 3 foto dapat diakses, hanya gallery berubah.');
