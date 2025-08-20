
import { useEffect, useRef, useState } from 'react'
export default function Simulator({ onResult }){
  const gen=(n=120)=>{ const a=[]; let p=100; for(let i=0;i<n;i++){ p += (Math.random()-0.5)*2.4; a.push(Number(p.toFixed(2))) } return a }
  const [data,setData]=useState(gen()); const [marks,setMarks]=useState([])
  const H=260,W=720,pad=16; const mn=Math.min(...data)-3,mx=Math.max(...data)+3
  const sx=i=> pad + i*(W-2*pad)/(data.length-1); const py=v=> H - pad - (v-mn)/(mx-mn)*(H-2*pad); const inv=pyx=> ((H - pad - pyx)/(H-2*pad))*(mx-mn)+mn
  const path=data.map((v,i)=> `${sx(i)},${py(v)}`).join(' '); const ref=useRef(null)
  const step=marks.length; const inst=["Click to set ENTRY","Click to set STOP","Click to set TARGET"]
  useEffect(()=>{ const el=ref.current; const click=e=>{ const r=el.getBoundingClientRect(); const x=e.clientX-r.left; const y=e.clientY-r.top
      const idx=Math.max(0,Math.min(data.length-1,Math.round((x-pad)/((W-2*pad)/(data.length-1))))); const val=inv(y)
      if(marks.length<3){ const type=marks.length===0?'entry':marks.length===1?'stop':'target'; setMarks(m=>[...m,{type,y:val,idx}]) } }
    el.addEventListener('click',click); return ()=> el.removeEventListener('click',click) },[marks,data])
  const reset=()=>{ setMarks([]); setData(gen()) }
  const evaluate=()=>{
    if(marks.length<3) return
    const [entry,stop,target]=marks; const dir=target.y>entry.y?'long':'short'; const slice=data.slice(entry.idx)
    let hit='none',bars=0; for(let i=0;i<slice.length;i++){ const price=slice[i]; if(dir==='long'){ if(price<=stop.y){hit='stop';bars=i;break} if(price>=target.y){hit='target';bars=i;break} } else { if(price>=stop.y){hit='stop';bars=i;break} if(price<=target.y){hit='target';bars=i;break} } }
    const R=Math.abs(target.y-entry.y)/Math.max(0.01,Math.abs(entry.y-stop.y)); onResult({dir,hit,R:Number(R.toFixed(2)),bars})
  }
  return (<div className="card space-y-2">
    <div className="font-bold">Paper Trading Simulator</div>
    <div className="text-sm text-slate-300">{step<3?inst[step]:"Press Evaluate."}</div>
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full bg-slate-900/70 rounded-xl border border-slate-700/40">
      <polyline fill="none" stroke="#22d3ee" strokeWidth="2" points={path}/>
      {marks.map((m,i)=><g key={i}>
        <line x1="0" x2={W} y1={py(m.y)} y2={py(m.y)} stroke={m.type==='stop'?'#ef4444': m.type==='target'?'#22c55e':'#a78bfa'} strokeDasharray="6,6" strokeWidth="2"/>
        <circle cx={sx(m.idx)} cy={py(m.y)} r="4" fill="#fff"/>
      </g>)}
    </svg>
    <div className="flex gap-2">
      <button className="btn btn-primary" onClick={evaluate} disabled={marks.length<3}>Evaluate</button>
      <button className="btn btn-ghost" onClick={reset}>Reset</button>
    </div>
  </div>)
}
