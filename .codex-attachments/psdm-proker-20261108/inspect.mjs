import {getCliClient} from 'sanity/cli';
import sharp from 'sharp';
process.loadEnvFile('.env.local');
const client=getCliClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,apiVersion:'2024-01-01',useCdn:false}).withConfig({dataset:'development',perspective:'raw'});
console.log(JSON.stringify(await client.fetch('*[_type=="departemen" && slug.current=="psdm"]{_id,_rev,programKerja}'),null,2));
const files=['e42eff3f-a7b4-43de-a6ea-3c04fd0285ff','5b420552-8107-42a8-a8a8-37b52d727a2c','87548e0e-2045-47be-8904-10e1d2aa5c15','5c3f918d-4eae-47a9-bf58-2d3c892bc139'];
for(const id of files){const m=await sharp(`C:/Users/ADAMR~1/AppData/Local/Temp/codex-clipboard-${id}.jpg`).metadata();console.log(JSON.stringify({id,width:m.width,height:m.height,orientation:m.orientation}));}
