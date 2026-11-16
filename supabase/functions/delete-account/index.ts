// GearEx account deletion Edge Function.
// Deploy inside your OWN Supabase project with server-only environment secrets.
// Required: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.
// Never copy the service-role key to the GearEx frontend.
import { createClient } from 'npm:@supabase/supabase-js@2';

const allowedOrigins = new Set(
  (Deno.env.get('GEAREX_ALLOWED_ORIGINS') ||
    'https://nittinchughani.github.io,http://localhost:8000,http://127.0.0.1:8000')
  .split(',').map(x=>x.trim()).filter(Boolean)
);
function response(origin:string, status:number, body:Record<string,unknown>){
  return new Response(JSON.stringify(body),{
    status,headers:{
      'Content-Type':'application/json',
      'Access-Control-Allow-Origin':origin,
      'Access-Control-Allow-Headers':'authorization,x-client-info,apikey,content-type',
      'Access-Control-Allow-Methods':'POST, OPTIONS',
      'Vary':'Origin',
      'Cache-Control':'no-store'
    }
  });
}
Deno.serve(async(request)=>{
  const origin=request.headers.get('Origin')||'';
  if(!allowedOrigins.has(origin))return new Response('Origin not allowed',{status:403});
  if(request.method==='OPTIONS')return response(origin,200,{ok:true});
  if(request.method!=='POST')return response(origin,405,{error:'Method not allowed'});
  if(request.headers.get('Content-Type')?.split(';')[0]!=='application/json')
    return response(origin,415,{error:'JSON request required'});

  let body:{confirmation?:string};
  try{body=await request.json();}catch{return response(origin,400,{error:'Invalid request'});}
  if(body?.confirmation!=='DELETE')return response(origin,400,{error:'Confirmation required'});
  const authorization=request.headers.get('Authorization')||'';
  if(!authorization.startsWith('Bearer '))return response(origin,401,{error:'Login required'});
  const token=authorization.slice(7);
  const url=Deno.env.get('SUPABASE_URL')||'';
  const anon=Deno.env.get('SUPABASE_ANON_KEY')||'';
  const adminKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
  if(!url||!anon||!adminKey)return response(origin,503,{error:'Deletion service not configured'});
  const publicClient=createClient(url,anon,{auth:{persistSession:false}});
  // Do not trust an ID in the browser request. Verify the caller with Supabase Auth.
  const {data:{user},error:authError}=await publicClient.auth.getUser(token);
  if(authError||!user)return response(origin,401,{error:'Session invalid. Please sign in again.'});
  const admin=createClient(url,adminKey,{auth:{persistSession:false}});
  const path=user.id+'/avatar.webp';
  const {error:photoError}=await admin.storage.from('gearex-avatars').remove([path]);
  if(photoError)return response(origin,503,{error:'Could not remove private profile photo. Please retry.'});
  // Profiles and progress have user_id foreign keys with ON DELETE CASCADE.
  const {error:deleteError}=await admin.auth.admin.deleteUser(user.id);
  if(deleteError)return response(origin,503,{error:'Account deletion failed. Please retry.'});
  return response(origin,200,{ok:true});
});