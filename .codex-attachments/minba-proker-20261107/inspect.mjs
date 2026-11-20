import { getCliClient } from 'sanity/cli';
import assert from 'node:assert/strict';
process.loadEnvFile('.env.local');
const client=getCliClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,apiVersion:'2024-01-01',useCdn:false}).withConfig({dataset:'development',perspective:'raw'});
assert.equal(client.config().projectId,'yzaa35ug');
assert.equal(client.config().dataset,'development');
const docs=await client.fetch('*[_type == "departemen" && slug.current == "minba"]');
console.log(JSON.stringify(docs.map(({_id,programKerja})=>({_id,programKerja})),null,2));
