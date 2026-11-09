import {getCliClient} from 'sanity/cli';
process.loadEnvFile('.env.local');
const c=getCliClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,apiVersion:'2024-01-01',useCdn:false}).withConfig({dataset:'development',perspective:'raw'});
const docs=await c.fetch('*[_type=="bidang" && slug.current=="fahmil-quran"]');
console.log(JSON.stringify({project:c.config().projectId,dataset:c.config().dataset,docs},null,2));
