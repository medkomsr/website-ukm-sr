import { getCliClient } from 'sanity/cli';
import { mkdirSync, writeFileSync } from 'node:fs';
process.loadEnvFile('.env.local');
const base = getCliClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, apiVersion: '2024-01-01', useCdn: false });
for (const dataset of ['development', 'production']) {
 const client = base.withConfig({dataset});
 const docs = await client.fetch('*[_type in ["visiMisi", "faq", "departemen"]]');
 const folder = '.codex-attachments/content-update-20261101';
 mkdirSync(folder, {recursive:true});
 writeFileSync(`${folder}/${dataset}-before.json`, JSON.stringify(docs,null,2), {flag:'wx'});
 console.log(JSON.stringify({dataset, project:client.config().projectId, docs:docs.map(d=>({_id:d._id,_type:d._type,visi:d.visi,misi:d.misi,items:d.items,programKerja:d.programKerja?.map(p=>({_key:p._key,nama:p.nama,detail:p.detail}))}))},null,2));
}
