<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { scheduleApi } from '../schedules'
import StudentIcon from './StudentIcon.vue'
const props = defineProps<{ admin?: boolean }>()
const emit = defineEmits<{ back: []; count: [value: number] }>()
type Request = { id: number; login_id: string; full_name: string; email: string; requested_at: string }
const login = ref(''), email = ref(''), password = ref(''), confirm = ref(''), verified = ref(false)
const requests = ref<Request[]>([]), selected = ref<Request | null>(null), busy = ref(false), error = ref(''), message = ref('')
async function load() {
  error.value = ''
  try { requests.value = (await scheduleApi('admin/password-reset-requests')).requests; emit('count', requests.value.length) }
  catch (e) { error.value = e instanceof Error ? e.message : 'Unable to load requests.' }
}
onMounted(() => { if (props.admin) void load() })
async function requestReset() {
  if (busy.value) return
  busy.value = true; error.value = ''; message.value = ''
  try { message.value = (await scheduleApi('auth/password-reset-requests', 'POST', { login_id: login.value, email: email.value })).message }
  catch (e) { error.value = e instanceof Error ? e.message : 'Unable to submit request.' }
  finally { busy.value = false }
}
function select(request: Request) { selected.value = request; password.value = ''; confirm.value = ''; verified.value = false; error.value = ''; message.value = '' }
async function resolve(action: 'reset' | 'reject') {
  if (!selected.value || busy.value) return
  if (action === 'reset' && password.value !== confirm.value) { error.value = 'The passwords do not match.'; return }
  busy.value = true; error.value = ''; message.value = ''
  try {
    message.value = (await scheduleApi('admin/password-reset-requests/' + selected.value.id + '/resolve', 'POST', { action, password: password.value, identity_verified: verified.value })).message
    selected.value = null; await load()
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to review request.' }
  finally { password.value = ''; confirm.value = ''; busy.value = false }
}
</script>
<template>
  <section class="card reset-panel">
    <template v-if="!admin">
      <p class="eyebrow">ACCOUNT HELP</p><h2>Forgot password?</h2>
      <p class="muted">Enter your student ID and the email saved in your profile. An administrator will review your request and verify your identity.</p>
      <form v-if="!message" @submit.prevent="requestReset">
        <label for="reset-login">Student ID<input id="reset-login" v-model="login" required maxlength="50" autocomplete="username" :disabled="busy"></label>
        <label for="reset-email">Registered email<input id="reset-email" v-model="email" type="email" required maxlength="254" autocomplete="email" :disabled="busy"></label>
        <button :disabled="busy"><StudentIcon name="save" />{{ busy ? 'Sending…' : 'Request password reset' }}</button>
      </form>
      <button type="button" class="secondary back" :disabled="busy" @click="emit('back')"><StudentIcon name="back" />Back to login</button>
    </template>
    <template v-else>
      <div class="reset-heading"><div><p class="eyebrow">ACCOUNT SUPPORT</p><h2>Password reset requests <span class="badge">{{ requests.length }}</span></h2></div><button type="button" class="secondary" :disabled="busy || !!selected" @click="load"><StudentIcon name="refresh" />Refresh</button></div>
      <p class="muted">Verify identity through a trusted university contact or in person. A matching email in a request alone is not proof of identity.</p>
      <p v-if="!requests.length && !error" class="muted">No pending requests.</p>
      <article v-for="request in requests" :key="request.id" class="request-row"><div><strong>{{ request.full_name }}</strong><p>{{ request.login_id }} · {{ request.email }}</p><small>{{ new Date(request.requested_at).toLocaleString() }}</small></div><button type="button" class="secondary" :disabled="busy || !!selected" @click="select(request)"><StudentIcon name="edit" />Review</button></article>
      <form v-if="selected" @submit.prevent="resolve('reset')">
        <h3>Review {{ selected.full_name }} ({{ selected.login_id }})</h3>
        <fieldset :disabled="busy">
          <label class="verification"><input v-model="verified" type="checkbox" required>I verified this student's identity independently.</label>
          <label>New password<input v-model="password" type="password" required minlength="12" maxlength="72" autocomplete="new-password"></label>
          <small>At least 12 characters; at most 72 UTF-8 bytes. Share privately after resetting.</small>
          <label>Confirm new password<input v-model="confirm" type="password" required minlength="12" maxlength="72" autocomplete="new-password"></label>
          <div class="reset-actions"><button :disabled="!verified || !password || password !== confirm"><StudentIcon name="save" />{{ busy ? 'Saving…' : 'Reset password' }}</button><button type="button" class="secondary" @click="resolve('reject')">Reject request</button><button type="button" class="secondary" @click="selected = null; password = ''; confirm = ''; error = ''"><StudentIcon name="cancel" />Cancel</button></div>
        </fieldset>
      </form>
    </template>
    <p v-if="error" class="error" role="alert">{{ error }}</p><p v-if="message" class="success" role="status">{{ message }}</p>
  </section>
</template>
<style scoped>
.reset-panel{margin-top:24px}.reset-heading,.request-row{display:flex;justify-content:space-between;align-items:center;gap:16px}.request-row{border-top:1px solid #dce5df;padding:18px 0}.request-row p{margin:6px 0}.request-row small{color:#60736e}.reset-actions{display:flex;flex-wrap:wrap;gap:10px}.reset-actions button{width:auto}.back{margin-top:20px}.verification{display:flex;align-items:center;gap:10px}.verification input{width:20px;height:20px;flex-shrink:0}fieldset{border:0;padding:0}small{color:#60736e}@media(max-width:600px){.request-row,.reset-heading{align-items:flex-start;flex-wrap:wrap}.reset-actions button{width:100%}}
</style>
