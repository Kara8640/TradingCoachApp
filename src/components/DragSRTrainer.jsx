
import { useEffect, useMemo, useRef, useState } from 'react'
export default function DragSRTrainer({ onScore }){
  const [data]=useState(()=>{ const a=[]; let p=50; for(let i=0;i<60;i++){ p+=(Math.random()-0.5)*4; a.push(Number(p.toFixed(2))) } return a })
  const levels=useMemo(()=>{ const highs=[...data].map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v).slice(0,3).map(x=>x.v); const lows=[...data].map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v).slice(0,3).map(x=>x.v); return [...highs,...lows] },[data])
  const [y,setY]=useState(50); const H=220,W=640,pad=14; const min=Math.min(...data)-5,max=Math.max(...data)+5
  const scaleX=i=> pad + i*(W-2*pad)/(data.length-1); const py=v=> H - pad - (v-min)/(max-min)*(H-2*pad); const invPY=py=> ((H - pad - py)/(H-2*pad))*(max-min)+min
  const ref=useRef(null)
  useEffect(()=>{ const el=ref.current; let drag=false; const down=()=>drag=true; const move=e=>{ if(!drag) return; const r=el.getBoundingClientRect(); setY(invPY(e.clientY-r.top)) }; const up=()=>drag=false
    el.addEventListener('mousedown',down); window.addEventListener('mousemove',move); window.addEventListener('mouseup',up)
    return ()=>{ el.removeEventListener('mousedown',down); window.removeEventListener('mousemove',move); window.removeEventListener('mouseup',up) }
  },[])
  const score=useMemo(()=>{ const nearest=levels.reduce((a,b)=> Math.abs(b-y)<Math.abs(a-y)? b : a, levels[0]); const spread=Math.max(...levels)-Math.min(...levels); const pct=Math.max(0, 100 - Math.abs(nearest-y)/spread*100*2); return Math.round(pct) },[y,levels])
  const path=data.map((v,i)=> `${scaleX(i)},${py(v)}`).join(' ')
  return (<div className="card">
    <div className="mb-2 font-semibold">Drag the green line to mark Support/Resistance. Aim near past reactions.</div>
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full bg-slate-900/70 rounded-xl border border-slate-700/40">
      <polyline fill="none" stroke="#60a5fa" strokeWidth="2" points={path}/>
      <line x1="0" x2={W} y1={py(y)} y2={py(y)} stroke="#22c55e" strokeDasharray="6,6" strokeWidth="2"/>
    </svg>
    <div className="mt-2 flex items-center gap-3">
      <div className="text-sm">Score: <span className={score>70?'text-green-400':'text-amber-300'}>{score}</span></div>
      <button className="btn btn-primary" onClick={()=> onScore(score)}>Check</button>
    </div>
  </div>)
}
