<script setup lang="ts">
import {computed} from 'vue'
const props=defineProps<{kind:'homework'|'attendance'}>()
const items=computed(()=>props.kind==='attendance'?[['O','Present','positive'],['X','Absent','negative'],['–','Late','late'],['E','Excused','excused'],['·','Unmarked','neutral']]:[['O','Done','positive'],['X','Not done','negative'],['–','Late submission','late'],['·','Unmarked','neutral'],['O ✓','Reviewed','positive']])
</script>
<template><section class="mark-key" :aria-label="kind==='attendance'?'Attendance symbols':'Homework symbols'"><strong class="key-title">Symbol key</strong><ul><li v-for="[symbol,meaning,tone] in items" :key="meaning"><span class="key-symbol" :class="tone">{{symbol}}</span><span>= {{meaning}}</span></li></ul><p v-if="kind==='attendance'">Blank grey cell = outside enrollment, a future date, or outside your homeroom scope.</p></section></template>
<style scoped>
.mark-key{margin:12px 0 16px;padding:12px 14px;border:1px solid #d4e1d8;border-radius:8px;background:#f6f9f7;color:#243e33}.key-title{display:block;font-size:13px;margin-bottom:9px}.mark-key ul{display:flex;flex-wrap:wrap;gap:10px 20px;margin:0;padding:0;list-style:none}.mark-key li{display:flex;align-items:center;gap:7px;font-size:13px;line-height:1.5}.key-symbol{display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:28px;padding:0 4px;box-sizing:border-box;border:1px solid #cad9cf;border-radius:5px;background:white;font-size:16px;font-weight:700}.positive{color:#286e44}.negative{color:#ad3d3d}.late{color:#9a690b}.excused{color:#526b9a}.neutral{color:#60736e}.mark-key p{margin:10px 0 0;font-size:12px;line-height:1.5;color:#60736e}@media(max-width:500px){.mark-key{padding:10px}.mark-key ul{gap:8px 14px}}
</style>
