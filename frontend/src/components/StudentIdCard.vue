<script setup lang="ts">
import {computed,nextTick,onMounted,ref} from 'vue'
import StudentIcon from './StudentIcon.vue'
import QRCode from 'qrcode'
import {apiFetch} from '../api'
import {cardClass,qrOptions,studentCardUrl,type StudentCard} from '../student-card'
const props=defineProps<{fullName:string;school:string;loginId:string;major?:string|null}>()
const qrDialog=ref<HTMLDialogElement|null>(null)
const identity=computed(()=>({name:card.value?.full_name??props.fullName,school:card.value?.school??props.school,login:card.value?.login_id??props.loginId}))
async function showQr(){if(!qr.value)return;await nextTick();qrDialog.value?.showModal()}
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
  const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='student-card-'+value.login_id.replace(/[^A-Za-z0-9_-]/g,'_')+'.png';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)
 }catch(e){error.value=e instanceof Error?e.message:'Unable to download the card.'}finally{downloading.value=false}
}
onMounted(load)
</script>
<template>
 <section class="profile-identity" aria-label="Student identity">
  <div class="identity-main"><div class="identity-avatar" aria-hidden="true"><StudentIcon name="profile" /></div><div class="identity-copy"><p class="identity-school">{{identity.school}}</p><h2>{{identity.name}}</h2><p class="identity-id">Student ID <strong>{{identity.login}}</strong></p><p v-if="card?.membership" class="identity-class">{{cardClass(card)}}<span aria-hidden="true"> · </span>{{card.membership.academic_year}}</p><p v-else-if="major" class="identity-class">{{major}}</p></div></div>
  <div class="identity-actions"><button type="button" :disabled="loading||!qr" @click="showQr">Show QR</button><button type="button" class="secondary" :disabled="loading||downloading||!qr" @click="download">{{downloading?'Downloading…':'Download card'}}</button></div>
  <p v-if="loading" class="identity-status" role="status">Loading your school ID…</p><div v-if="error" class="identity-error"><p class="error" role="alert">{{error}}</p><button type="button" class="secondary" :disabled="loading||downloading" @click="load">Try again</button></div>
  <dialog ref="qrDialog" class="qr-dialog" aria-labelledby="profile-qr-title"><div class="qr-heading"><h2 id="profile-qr-title">Student QR</h2><button type="button" class="secondary" aria-label="Close student QR" @click="qrDialog?.close()">Close</button></div><p class="qr-caption">Student ID {{identity.login}}</p><div class="qr-image"><img v-if="qr" :src="qr" width="180" height="180" alt="Student profile QR code for authorized school staff"><p v-else role="status">Refreshing QR…</p></div><p class="qr-instruction">Scan to view · Staff login required</p><div class="qr-actions"><button type="button" :disabled="loading||downloading||!qr" @click="download">{{downloading?'Downloading…':'Download card'}}</button><button type="button" class="qr-refresh secondary" :disabled="loading||downloading" @click="load"><StudentIcon name="refresh" />Refresh QR</button></div><details class="qr-help"><summary>About this QR</summary><p>Your contact details are not included in this code. Authorized staff see your current school record after signing in. Scanning does not mark attendance.</p></details><p v-if="error" class="error" role="alert">{{error}}</p></dialog>
 </section>
</template>
<style scoped>
.profile-identity{padding:0 0 20px;margin:0 0 20px;border-bottom:1px solid #dce6df}.identity-main{display:flex;align-items:center;gap:16px}.identity-avatar{display:grid;place-items:center;width:60px;height:60px;flex-shrink:0;border-radius:50%;background:#eaf2ec;color:#416b53}.identity-avatar svg{width:34px;height:34px}.identity-copy{min-width:0;overflow-wrap:anywhere}.identity-school{margin:0 0 6px;color:#63796a;font-size:13px}.identity-copy h2{font-size:22px;margin:0 0 8px;line-height:1.25}.identity-id{font-size:14px;margin:0}.identity-id strong{margin-left:6px;font-weight:600}.identity-class{font-size:13px;color:#63796a;line-height:1.5;margin:6px 0 0}.identity-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.profile-identity button{width:auto;min-height:44px;padding:10px 14px;font-size:13px;margin:0}.identity-status{font-size:12px;color:#63796a;margin:12px 0 0}.identity-error{margin-top:12px}.identity-error .error{margin:0 0 8px}.qr-dialog{width:min(360px,calc(100vw - 24px));max-height:calc(100dvh - 24px);padding:20px;border:1px solid #d4e2d8;border-radius:16px;color:#243e33;overflow:auto;overscroll-behavior:contain;box-shadow:0 18px 60px #173d2d26}.qr-dialog::backdrop{background:#173d2d70}.qr-heading{display:flex;justify-content:space-between;align-items:center;gap:12px}.qr-heading h2{font-size:19px;margin:0}.qr-heading button{flex-shrink:0}.qr-caption{text-align:center;font-size:13px;color:#63796a;margin:20px 0 12px}.qr-image{width:180px;min-height:180px;display:grid;place-items:center;margin:auto;background:#fff}.qr-image img{display:block;width:180px;max-width:100%;height:auto}.qr-image p{font-size:13px}.qr-instruction{text-align:center;font-size:12px;line-height:1.5;margin:12px 0 20px;color:#63796a}.qr-actions{display:grid;gap:8px}.qr-actions button{width:100%}.qr-refresh{display:flex;align-items:center;justify-content:center;gap:6px}.qr-refresh>svg{width:16px;height:16px;margin:0}.qr-help{border-top:1px solid #dce6df;margin-top:16px;padding-top:12px;color:#63796a;font-size:12px;line-height:1.6}.qr-help summary{cursor:pointer;min-height:44px;display:list-item}.qr-help p{margin:8px 0 0}@media(max-width:400px){.identity-main{gap:12px}.identity-avatar{width:48px;height:48px}.identity-avatar svg{width:28px;height:28px}.identity-copy h2{font-size:19px}.identity-actions>button{flex:1 1 auto}.qr-dialog{padding:16px}}
</style>
