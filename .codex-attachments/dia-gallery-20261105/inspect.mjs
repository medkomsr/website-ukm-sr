import { getCliClient } from 'sanity/cli';
import assert from 'node:assert/strict';
process.loadEnvFile('.env.local');
const client = getCliClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, apiVersion: '2024-01-01', useCdn: false }).withConfig({ dataset: 'development', perspective: 'raw' });
assert.equal(client.config().projectId, 'yzaa35ug');
console.log(JSON.stringify(await client.fetch('*[_type == "bidang" && slug.current == "dia"]{_id, abbr, gallery[]{_key, caption, "filename": image.asset->originalFilename}}'), null, 2));
