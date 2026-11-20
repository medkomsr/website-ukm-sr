import {getCliClient} from 'sanity/cli';
process.loadEnvFile('.env.local');
const client=getCliClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,apiVersion:'2024-01-01',useCdn:false}).withConfig({dataset:'development',perspective:'raw'});
console.log(JSON.stringify(await client.fetch('*[_type=="departemen" && slug.current=="medkom"]{_id,_rev,nama,programKerja}'),null,2));
