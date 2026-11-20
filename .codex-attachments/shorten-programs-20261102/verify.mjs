import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
process.loadEnvFile('.env.local');
for (const base of ['http://localhost:3000','https://website-ukm-sr.vercel.app']) {
  try {
    const body=JSON.stringify({_type:'departemen',_id:'departemen-bkrt'});
    const signature=await encodeSignatureHeader(body,Date.now(),process.env.SANITY_REVALIDATE_SECRET);
    const res=await fetch(base+'/api/sanity/revalidate',{method:'POST',headers:{'content-type':'application/json',[SIGNATURE_HEADER_NAME]:signature},body,signal:AbortSignal.timeout(20000)});
    console.log(base,'revalidation',res.status);
    for(const slug of ['bkrt','psdm']){
      const page=await fetch(base+'/tentang/'+slug,{signal:AbortSignal.timeout(20000)});
      const html=await page.text();
      console.log(slug,page.status,'short description visible:',html.includes('Kunjungan antar-UKM sejenis'));
    }
  } catch(err){console.log(base,err.name);}
}
