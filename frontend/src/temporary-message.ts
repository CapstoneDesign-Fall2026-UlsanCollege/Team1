import {onScopeDispose,watch,type Ref} from 'vue'

// Only transient confirmations use this; errors and saved record contents stay visible.
export function dismissAfterFourSeconds(message:Ref<string>){
 let timer:ReturnType<typeof setTimeout>|undefined
 const stop=watch(message,value=>{
  clearTimeout(timer)
  if(value)timer=setTimeout(()=>{message.value=''},4000)
 },{flush:'sync'})
 onScopeDispose(()=>{stop();clearTimeout(timer)})
}
