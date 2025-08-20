
import { useState } from 'react'
export default function Flashcards({ cards, onFlip }){
  return (<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {cards.map((c,i)=><Card key={i} front={c.front} back={c.back} onFlip={onFlip}/>)}
  </div>)
}
function Card({ front, back, onFlip }){
  const [flip,setFlip]=useState(false)
  return (<div className="relative card h-40 cursor-pointer" onClick={()=>{ setFlip(!flip); onFlip() }}>
    <div className={"absolute inset-0 flex items-center justify-center text-2xl font-extrabold "+(!flip?'':'opacity-0')}>{front}</div>
    <div className={"absolute inset-0 flex items-center justify-center text-base text-slate-200 "+(flip?'':'opacity-0')}>{back}</div>
  </div>)
}
