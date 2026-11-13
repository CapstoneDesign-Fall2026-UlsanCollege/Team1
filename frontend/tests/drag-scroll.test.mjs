import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=readFileSync(new URL('../src/drag-scroll.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {edgeScrollSpeed,createDragScroller}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));

test('drag scrolling is neutral in the middle/outside and accelerates towards either edge',()=>{
 assert.equal(edgeScrollSpeed(400,0,800),0);assert.equal(edgeScrollSpeed(-1,0,800),0);assert.equal(edgeScrollSpeed(801,0,800),0);
 assert.ok(edgeScrollSpeed(799,0,800)>edgeScrollSpeed(750,0,800));assert.ok(edgeScrollSpeed(1,0,800)<edgeScrollSpeed(50,0,800));
 assert.equal(edgeScrollSpeed(100,100,100),0);assert.equal(edgeScrollSpeed(NaN,0,800),0);
});
function fixture(){
 const frames=new Map();let next=0,scroll=0,pageAvailable=true,surface=null,p={x:200,y:795};
 const movements=[];const scroller=createDragScroller({viewport:()=>({left:0,top:0,right:400,bottom:800}),scrollPage:dy=>{if(!pageAvailable)return false;scroll+=dy;return true},surfaceAt:()=>surface,frame:f=>{frames.set(++next,f);return next},cancel:id=>frames.delete(id)});
 function step(time){const callbacks=[...frames.values()];frames.clear();callbacks.forEach(f=>f(time))}
 return {scroller,step,frames,movements,position:()=>p,setPosition:v=>p=v,setPageAvailable:v=>pageAvailable=v,setSurface:b=>surface={bounds:b,scroll:(x,y)=>movements.push({x,y})},get scroll(){return scroll}};
}
test('holding the cursor still at the bottom keeps scrolling until drop/cancel stops all frames',()=>{
 const f=fixture();f.scroller.start(f.position);f.step(0);const first=f.scroll;f.step(16);f.step(32);assert.ok(f.scroll>first*2);
 f.scroller.stop();const stopped=f.scroll;f.step(48);assert.equal(f.scroll,stopped);assert.equal(f.frames.size,0);
});
test('page scrolling takes priority, then the timetable scrolls vertically and sideways at its limits',()=>{
 const f=fixture();f.setSurface({left:20,top:200,right:400,bottom:800});f.setPosition({x:399,y:795});f.scroller.start(f.position);f.step(0);
 assert.ok(f.scroll>0);assert.ok(f.movements[0].x>0);assert.equal(f.movements[0].y,0);
 f.setPageAvailable(false);f.step(16);assert.ok(f.movements.at(-1).y>0);
 f.setPosition({x:21,y:201});f.step(32);assert.ok(f.movements.at(-1).x<0);assert.ok(f.movements.at(-1).y<0);f.scroller.stop();
});
test('leaving the edge stops movement, outside pointers do nothing, and restarting does not duplicate loops',()=>{
 const f=fixture();f.scroller.start(f.position);f.step(0);f.setPosition({x:200,y:400});const initial=f.scroll;f.step(16);assert.equal(f.scroll,initial);
 f.setPosition({x:450,y:795});f.step(32);assert.equal(f.scroll,initial);
 f.scroller.start(f.position);f.scroller.start(f.position);assert.equal(f.frames.size,1);f.scroller.stop();
});
