
import { useState } from 'react'; import VoiceAssist from './VoiceAssist.jsx'
const MAP=[
 {k:['candle','candlestick','wick','body'],a:'Candles are the mood rings of price. Green buyers won; red sellers won. Body = open→close. Wicks show extremes.'},
 {k:['support','resistance','level','floor','ceiling'],a:'Support is a floor where price bounces. Resistance is a ceiling where it stalls. Look left for multiple reactions.'},
 {k:['trend','moving average','ma'],a:'Trend is a river current. A moving average shows the flow: above = bullish, below = bearish.'},
 {k:['futures','contract'],a:'Futures = agreements for later at a set price. Respect leverage. Start tiny.'},
 {k:['option','call','put','premium','strike'],a:'Options are rights, not obligations. Calls = right to buy; Puts = right to sell. Buyer risk = premium.'},
 {k:['risk','stop','r:r','reward'],a:'Risk first: stop where your idea is wrong. Aim for reward bigger than risk. Repeat small.'},
 {k:['theta','gamma','delta','greek'],a:'Delta = sensitivity, Gamma = speed of delta, Theta = time decay (melting candle).'},
]
export default function AskCoach(){
  const [q,setQ]=useState(''); const [ans,setAns]=useState('')
  const explain=()=>{ const s=q.toLowerCase(); for(const row of MAP){ if(row.k.some(k=> s.includes(k))){ setAns(row.a); return } } setAns('Simple version: find a good level, wait for a clear signal (candle), define risk (stop), aim for more reward than risk, practice small.') }
  return (<div className="card space-y-2">
    <div className="text-lg font-bold">Ask the Coach</div>
    <div className="text-sm text-slate-300">Type what you want explained. The coach will simplify and read it out.</div>
    <input className="w-full bg-slate-800 rounded-xl px-3 py-2" placeholder="Explain support vs resistance again with visuals" value={q} onChange={e=> setQ(e.target.value)}/>
    <div className="flex gap-2"><button className="btn btn-primary" onClick={explain}>Explain it</button><button className="btn btn-ghost" onClick={()=>{ setQ(''); setAns('') }}>Clear</button></div>
    {ans && <div className="space-y-2"><div className="bg-slate-800/60 rounded-xl p-3">{ans}</div><VoiceAssist text={ans}/></div>}
  </div>)
}
