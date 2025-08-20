
import { useEffect, useState } from 'react'
export default function VoiceAssist({ text, rate=1.05, pitch=1 }){
  const [voices,setVoices]=useState([]); const [idx,setIdx]=useState(0); const [speaking,setSpeaking]=useState(false);
  useEffect(()=>{ const load=()=> setVoices(window.speechSynthesis.getVoices()); load(); window.speechSynthesis.onvoiceschanged=load },[]);
  const speak=()=>{ if(!text) return; if(window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text); if(voices[idx]) u.voice=voices[idx]; u.rate=rate; u.pitch=pitch; u.onend=()=>setSpeaking(false);
    setSpeaking(true); window.speechSynthesis.speak(u);
  }
  const stop=()=>{ window.speechSynthesis.cancel(); setSpeaking(false) }
  return (<div className="flex gap-2 flex-wrap items-center">
    <button className={"btn "+(speaking?'btn-success':'btn-primary')} onClick={speaking?stop:speak}>{speaking?'⏹ Stop':'🔊 Read Aloud'}</button>
    <select className="bg-slate-800 rounded-lg px-2 py-1" value={idx} onChange={e=> setIdx(parseInt(e.target.value))}>
      {voices.map((v,i)=><option key={i} value={i}>{v.name} ({v.lang})</option>)}
    </select>
  </div>)
}
