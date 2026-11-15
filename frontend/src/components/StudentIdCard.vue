<script setup lang="ts">
import {onMounted,ref} from 'vue'
import QRCode from 'qrcode'
import {apiFetch} from '../api'
import {cardClass,qrOptions,studentCardUrl,type StudentCard} from '../student-card'
const card=ref<StudentCard|null>(null),qr=ref(''),error=ref(''),loading=ref(false),downloading=ref(false)
async function load(){
 if(loading.value)return;loading.value=true;error.value='';card.value=null;qr.value=''
 try{const response=await apiFetch('/api/student/id-card');const data=await response.json();if(!response.ok)throw new Error(data.message||'Unable to load your student card.');const url=studentCardUrl(data.token,window.location.origin,import.meta.env.BASE_URL);qr.value=await QRCode.toDataURL(url,qrOptions);card.value=data.card}
 catch(e){error.value=e instanceof Error?e.message:'Unable to load your student card.'}finally{loading.value=false}
}
async function download(){
 if(!card.value||!qr.value||downloading.value)return;downloading.value=true;error.value=''
 try{
  const value=card.value,canvas=document.createElement('canvas');canvas.width=1000;canvas.height=600
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Your browser cannot download the card.');
  ctx.fillStyle='#ffffff';ctx.fillRect(0,0,1000,600);ctx.fillStyle='#315f4d';ctx.fillRect(0,0,1000,100)
  ctx.fillStyle='#ffffff';ctx.font='600 30px sans-serif';ctx.fillText(value.school,40,62,920)
  ctx.fillStyle='#64776c';ctx.font='20px sans-serif';ctx.fillText('STUDENT CARD',40,155)
  ctx.fillStyle='#243c30';ctx.font='600 36px sans-serif';ctx.fillText(value.full_name,40,225,540)
  ctx.font='26px sans-serif';ctx.fillText('Student ID: '+value.login_id,40,290,540)
  ctx.fillText(cardClass(value),40,350,540);ctx.font='22px sans-serif';ctx.fillText(value.membership?.academic_year??'',40,395,540)
  const image=new Image();image.src=qr.value;await image.decode();ctx.imageSmoothingEnabled=false;ctx.drawImage(image,640,160,300,300)
  ctx.fillStyle='#64776c';ctx.font='18px sans-serif';ctx.fillText('Staff login required to view the current student record.',40,510,920)
  ctx.fillText('Identification reference only. This card does not mark attendance.',40,550,920)
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('Unable to download the card.')
  const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='student-card-'+value.login_id.replace(/[^A-Za-z0-9_-]/g,'_')+'.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
 }catch(e){error.value=e instanceof Error?e.message:'Unable to download the card.'}finally{downloading.value=false}
}
onMounted(load)
</script>
<template>
 <section class="id-panel" aria-labelledby="student-card-heading">
  <div class="id-heading"><div><h2 id="student-card-heading">My student card</h2><p>Keep your school ID and QR code together.</p></div><button type="button" class="secondary" :disabled="loading||downloading" @click="load">Refresh card</button></div>
  <p v-if="loading" role="status">Loading your student card…</p><p v-if="error" class="error" role="alert">{{error}}</p>
  <template v-if="card&&qr"><div class="identity-card"><div class="card-details"><span class="card-school">{{card.school}}</span><h3>{{card.full_name}}</h3><p>Student ID <strong>{{card.login_id}}</strong></p><p>{{cardClass(card)}}</p><small v-if="card.membership">{{card.membership.academic_year}}</small></div><img :src="qr" width="240" height="240" alt="Student profile QR code for authorized school staff"></div><div class="id-footer"><p>Staff can scan this QR to view your current school record after signing in. Your contact details are not included in the code.</p><button type="button" :disabled="downloading" @click="download">{{downloading?'Downloading…':'Download student card'}}</button></div><small class="id-note">This card is for identification. Scanning it does not mark attendance.</small></template>
 </section>
</template>
<style scoped>
.id-panel{margin:0 0 18px;padding:18px;border:1px solid #d6e2d9;border-radius:12px;background:#fff}.id-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.id-heading h2{margin:0 0 6px;font-size:17px}.id-heading p,.id-footer p{margin:0;color:#63756b;font-size:13px;line-height:1.5}.id-panel button{min-height:44px;padding:10px 14px;font-size:13px;margin:0;width:auto}.identity-card{display:grid;grid-template-columns:minmax(0,1fr) 240px;align-items:center;gap:16px;margin:16px 0;padding:20px;border:1px solid #cadbcf;border-radius:12px;background:#f1f7f3}.card-details{min-width:0;overflow-wrap:anywhere}.card-school{display:block;color:#476b56;font-weight:600;font-size:13px;margin-bottom:16px}.card-details h3{font-size:20px;margin:0 0 12px}.card-details p{font-size:14px;margin:8px 0}.card-details strong{display:block;margin-top:4px}.card-details small{color:#63756b}.identity-card img{display:block;background:#fff;max-width:100%;height:auto;border-radius:4px}.id-footer{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.id-footer p{flex:1 1 220px}.id-footer button{flex-shrink:0}.id-note{display:block;font-size:12px;color:#63756b;margin-top:12px;line-height:1.5}@media(max-width:540px){.id-panel{padding:14px}.identity-card{grid-template-columns:1fr;padding:16px;gap:12px}.identity-card img{justify-self:center}.card-details h3{font-size:18px}.id-footer button{width:100%}}
</style>
