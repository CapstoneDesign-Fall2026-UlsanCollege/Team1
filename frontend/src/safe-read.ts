export async function fetchWithReadDeadline(fetcher:typeof fetch,input:RequestInfo|URL,options:RequestInit={},timeoutMs=20000):Promise<Response>{
 if((options.method??'GET').toUpperCase()!=='GET')return fetcher(input,options)
 const controller=new AbortController();let timedOut=false
 const abort=()=>controller.abort(options.signal?.reason)
 if(options.signal?.aborted)abort();else options.signal?.addEventListener('abort',abort,{once:true})
 const timer=setTimeout(()=>{timedOut=true;controller.abort()},timeoutMs)
 try{return await fetcher(input,{...options,signal:controller.signal})}
 catch(error){if(timedOut)throw new Error('The server is taking too long. Check your connection and try again.');throw error}
 finally{clearTimeout(timer);options.signal?.removeEventListener('abort',abort)}
}
