
import { useEffect, useMemo, useState } from 'react'
import VoiceAssist from './components/VoiceAssist.jsx'
import ProgressHUD from './components/ProgressHUD.jsx'
import Quiz from './components/Quiz.jsx'
import Flashcards from './components/Flashcards.jsx'
import AnimatedCandles from './components/AnimatedCandles.jsx'
import DragSRTrainer from './components/DragSRTrainer.jsx'
import Simulator from './components/Simulator.jsx'
import AskCoach from './components/AskCoach.jsx'
import { lessons } from './data/lessons.js'
import { quizBank } from './data/quizzes.js'
import { flashcards as fc } from './data/flashcards.js'

export default function App(){
  const [tab,setTab]=useState('learn')
  const [profile,setProfile]=useState(()=> JSON.parse(localStorage.getItem('profile-v2')||'{"xp":0,"level":1,"stars":0,"quizzes":0,"flips":0,"finalPassed":false}') )
  const [dyslexia,setDyslexia]=useState(()=> localStorage.getItem('dyslexia')==='1')
  const [noNumbers,setNoNumbers]=useState(()=> localStorage.getItem('no-numbers')==='1')
  useEffect(()=>{ localStorage.setItem('profile-v2', JSON.stringify(profile)) }, [profile])
  useEffect(()=>{ document.documentElement.classList.toggle('dyslexia', dyslexia); localStorage.setItem('dyslexia', dyslexia?'1':'0') },[dyslexia])
  useEffect(()=>{ localStorage.setItem('no-numbers', noNumbers?'1':'0') },[noNumbers])

  const addXP=n=> setProfile(p=>{ let xp=p.xp+n, level=p.level; while(xp>=100*level){ xp-=100*level; level+=1 } return {...p, xp, level} })
  const addStar=(n=1)=> setProfile(p=> ({...p, stars: p.stars+n}))
  const q=useMemo(()=> quizBank[Math.floor(Math.random()*quizBank.length)], [tab, profile.quizzes])

  return (<div className="max-w-7xl mx-auto p-4 space-y-4">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-2xl font-extrabold">💹 Trading Coach</div>
      <nav className="flex flex-wrap items-center gap-2">
        {['learn','practice','quiz','flash','plan','ask','sim','final'].map(t=>(
          <button key={t} className={"btn "+(tab===t?'btn-primary':'btn-ghost')} onClick={()=> setTab(t)}>{label(t)}</button>
        ))}
      </nav>
    </header>

    <ProgressHUD profile={profile}/>

    <section className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        {tab==='learn'   && <LearnPanel noNumbers={noNumbers} addXP={addXP} addStar={addStar}/>}
        {tab==='practice'&& <PracticePanel addXP={addXP}/>}
        {tab==='quiz'    && <Quiz q={q} onCorrect={()=> { setProfile(p=>({...p,quizzes:p.quizzes+1})); addXP(20); if(profile.quizzes%3===2) addStar(1) }} onWrong={()=> addXP(3) }/>}
        {tab==='flash'   && <Flashcards cards={fc} onFlip={()=> { setProfile(p=>({...p,flips:p.flips+1})); addXP(5) }}/>}
        {tab==='plan'    && <PlanPanel addXP={addXP}/>}
        {tab==='ask'     && <AskCoach/>}
        {tab==='sim'     && <SimPanel addXP={addXP}/>}
        {tab==='final'   && <FinalBoss onPass={()=> setProfile(p=> ({...p, finalPassed:true}))} addXP={addXP}/>}
      </div>
      <aside className="space-y-4">
        <div className="card space-y-3">
          <div className="text-lg font-bold">Teacher Voice</div>
          <VoiceAssist text={tab==='learn' ? lessons.map(l=> l.title+': '+l.text).join('. ') : 'Use the tabs to learn, practice, quiz, flashcards, plan, ask, simulate, and take the final quiz.'}/>
          <div className="text-xs text-slate-300">Tip: tap once on mobile to enable audio.</div>
        </div>
        <div className="card">
          <div className="text-lg font-bold mb-2">Live Candles</div>
          <AnimatedCandles/>
        </div>
      </aside>
    </section>
  </div>)
}

function label(t){ return ({learn:'Learn', practice:'Practice', quiz:'Quiz', flash:'Flashcards', plan:'Plan', ask:'Ask', sim:'Simulator', final:'Final'})[t] }

function LearnPanel({ noNumbers, addXP, addStar }){
  return (<div className="space-y-4">
    {lessons.map((l,i)=>(<div key={l.id} className="card space-y-2">
      <div className="text-xl font-bold" style={{color:i%2? 'var(--neon)': 'var(--pink)'}}>{String(i+1).padStart(2,'0')}. {l.title}</div>
      <p className="text-slate-200 whitespace-pre-line">{l.text}</p>
      {l.id==='l04' && <div className="text-sm text-slate-300">{noNumbers? 'Use color cues: 🔵 bounce zones, 🔴 stall zones.' : 'Mark prior swing highs/lows; expect reactions there.'}</div>}
      <div className="flex gap-2">
        <button className="btn btn-success" onClick={()=> addXP(10)}>Mark Understood +10 XP</button>
        <button className="btn btn-ghost" onClick={()=> addStar(1)}>⭐ Star</button>
      </div>
    </div>))}
  </div>)
}

function PracticePanel({ addXP }){
  const [last,setLast]=useState(null)
  return (<div className="space-y-4">
    <DragSRTrainer onScore={s=>{ setLast(s); addXP(Math.round(s/5)) }}/>
    {last!==null && <div className="card">Score: <span className={last>70?'text-green-400':'text-amber-300'}>{last}</span>. Aim near past reaction zones.</div>}
  </div>)
}

function SimPanel({ addXP }){
  const [res,setRes]=useState(null)
  return (<div className="space-y-2">
    <Simulator onResult={r=>{ setRes(r); addXP(r.hit==='target'? 30 : 5) }}/>
    {res && <div className="card">
      <div className="font-semibold">Result</div>
      <div className="text-sm">Direction: {res.dir} • Outcome: {res.hit==='target'?'✅ Target first':'❌ Stop first'} • R: {res.R} • Bars: {res.bars}</div>
    </div>}
  </div>)
}

function PlanPanel({ addXP }){
  const [f,setF]=useState({market:'',setup:'',trigger:'',stop:'',target:'',notes:''})
  const exportPlan=()=>{
    const txt=['Trade Plan','Market: '+f.market,'Setup: '+f.setup,'Trigger: '+f.trigger,'Stop: '+f.stop,'Target: '+f.target,'Notes: '+f.notes,'Created: '+new Date().toISOString()].join('\n')
    const blob=new Blob([txt],{type:'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='trade_plan_'+Date.now()+'.txt'; a.click(); setTimeout(()=> URL.revokeObjectURL(a.href), 500); addXP(15)
  }
  return (<div className="card space-y-2">
    <div className="text-xl font-bold">Trade Plan</div>
    <div className="grid sm:grid-cols-2 gap-2">
      {['market','setup','trigger','stop','target'].map(k=> <input key={k} value={f[k]} onChange={e=> setF({...f,[k]:e.target.value})} placeholder={k==='market'?'e.g., MES, SPY': k==='setup'?'Trend + Level': k==='trigger'?'Candle/Indicator trigger': k==='stop'?'Where and why?': 'Next level or R multiple'} className="bg-slate-800 rounded-xl px-3 py-2"/>)}
    </div>
    <textarea rows={3} className="w-full bg-slate-800 rounded-xl px-3 py-2" placeholder="Notes" value={f.notes} onChange={e=> setF({...f, notes:e.target.value})}/>
    <button className="btn btn-primary" onClick={exportPlan}>Export</button>
  </div>)
}

function FinalBoss({ onPass, addXP }){
  const [i,setI]=useState(0); const [score,setScore]=useState(0)
  const sequence = [...quizBank].slice(0, 10)
  const q = sequence[i]
  if (!q) { onPass(); addXP(100); return (<div className="card text-center space-y-2"><div className="text-2xl font-extrabold">🎉 Final Passed!</div><div>Score: {score}/{sequence.length}</div></div>) }
  return (<div className="space-y-3">
    <Quiz q={q} onCorrect={()=>{ setScore(s=> s+1); setI(i+1) }} onWrong={()=> setI(i+1) }/>
    <div className="text-sm text-slate-300 text-center">Question {i+1} / {sequence.length}</div>
  </div>)
}
