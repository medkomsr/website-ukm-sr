import { getCliClient } from 'sanity/cli';
process.loadEnvFile('.env.local');
const client = getCliClient({projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, apiVersion:'2024-01-01',useCdn:false}).withConfig({dataset:'development',perspective:'raw'});
const docs = await client.fetch('*[_type == "bidang" && slug.current == "syarhil-quran"]');
console.log(JSON.stringify(docs,null,2));
