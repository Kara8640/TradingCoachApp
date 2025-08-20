
import { useEffect, useState } from 'react'
function gen(prev){ const body=(Math.random()-0.5)*6; const open=prev; const close=Math.max(10, open+body); const high=close+Math.random()*3+1; const low=Math.max(5, Math.min(open,close)-(Math.random()*3+1)); return {open,close,high,low} }
export default function AnimatedCandles(){
  const [cs,setCs]=useState(()=>{ let a=[],p=50; for(let i=0;i<24;i++){ const c=gen(p); a.push(c); p=c.close } return a })
  useEffect(()=>{ const id=setInterval(()=> setCs(cs=>{ const last=cs[cs.length-1].close; const c=gen(last); return [...cs.slice(1), c] }), 800); return ()=> clearInterval(id) },[])
  const W=640,H=220,pad=10,cw=(W-2*pad)/cs.length,scale=2,y=v=>H-pad-v*scale
  return (<svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-slate-900/60 rounded-xl border border-slate-700/40">
    {cs.map((c,i)=>{ const x=pad+i*cw+cw*0.15; const color=c.close>=c.open?'#22c55e':'#ef4444'; return (<g key={i} className="animate-pop">
      <line x1={x+cw*0.35} x2={x+cw*0.35} y1={y(c.high)} y2={y(c.low)} stroke={color} strokeWidth="2"/>
      <rect x={x} y={y(Math.max(c.open,c.close))} width={cw*0.7} height={Math.max(2,Math.abs((c.close-c.open))*scale)} fill={color} rx="3"/>
    </g>)})}
  </svg>)
}
