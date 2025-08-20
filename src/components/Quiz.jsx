
export default function Quiz({ q, onCorrect, onWrong }){
  const choose=i=>{ if(i===q.correct){ onCorrect() } else { onWrong() } }
  return (<div className="card space-y-2">
    <div className="font-bold text-lg">{q.prompt}</div>
    <div className="grid sm:grid-cols-2 gap-2">{q.choices.map((c,i)=><button key={i} className="btn btn-ghost" onClick={()=> choose(i)}>{c}</button>)}</div>
  </div>)
}
