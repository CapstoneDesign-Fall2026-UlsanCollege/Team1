type Point={x:number;y:number}
type Bounds={left:number;top:number;right:number;bottom:number}
type Surface={bounds:Bounds;scroll:(x:number,y:number)=>void}
export type DragScrollEnvironment={
  viewport:()=>Bounds
  scrollPage:(y:number)=>boolean
  surfaceAt:(point:Point)=>Surface|null
  frame:(callback:(time:number)=>void)=>number
  cancel:(id:number)=>void
}

// Pixels per nominal 60 Hz frame; accelerate as the cursor approaches an edge.
export function edgeScrollSpeed(position:number,start:number,end:number){
  if(!Number.isFinite(position)||end<=start||position<start||position>end)return 0
  const band=Math.min(72,(end-start)/3)
  if(position<start+band)return -14*(1-(position-start)/band)
  if(position>end-band)return 14*(1-(end-position)/band)
  return 0
}

export function createDragScroller(env:DragScrollEnvironment){
  let running=false,frame=0,previous:number|null=null,point:()=>Point=()=>({x:0,y:0})
  function stop(){running=false;env.cancel(frame);frame=0;previous=null}
  function tick(time:number){
    if(!running)return
    const scale=previous===null?1:Math.min(32,Math.max(0,time-previous))/(1000/60)
    previous=time
    const p=point(),v=env.viewport()
    if(p.x>=v.left&&p.x<=v.right&&p.y>=v.top&&p.y<=v.bottom){
      const vertical=edgeScrollSpeed(p.y,v.top,v.bottom)*scale
      const pageMoved=vertical!==0&&env.scrollPage(vertical)
      const surface=env.surfaceAt(p)
      if(surface){
        const b={left:Math.max(v.left,surface.bounds.left),right:Math.min(v.right,surface.bounds.right),top:Math.max(v.top,surface.bounds.top),bottom:Math.min(v.bottom,surface.bounds.bottom)}
        const dx=edgeScrollSpeed(p.x,b.left,b.right)*scale
        const dy=pageMoved?0:edgeScrollSpeed(p.y,b.top,b.bottom)*scale
        if(dx||dy)surface.scroll(dx,dy)
      }
    }
    if(running)frame=env.frame(tick)
  }
  return {start(read:()=>Point){stop();point=read;running=true;frame=env.frame(tick)},stop}
}

export function browserDragScroller(root:()=>HTMLElement|null){
  return createDragScroller({
    viewport:()=>({left:0,top:0,right:window.innerWidth,bottom:window.innerHeight}),
    scrollPage:dy=>{const page=document.scrollingElement;if(!page)return false;const before=page.scrollTop;page.scrollTop+=dy;return page.scrollTop!==before},
    surfaceAt:p=>{
      const element=document.elementFromPoint(p.x,p.y)?.closest<HTMLElement>('.grid-scroll')
      if(!element||!root()?.contains(element))return null
      const bounds=element.getBoundingClientRect()
      return {bounds,scroll:(x,y)=>{element.scrollLeft+=x;element.scrollTop+=y}}
    },
    frame:callback=>window.requestAnimationFrame(callback),cancel:id=>window.cancelAnimationFrame(id),
  })
}
