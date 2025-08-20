
export default function ProgressHUD({ profile }){
  const need=100*profile.level; const pct=Math.min(100,Math.round(profile.xp/need*100));
  return (<div className="card flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="jar"><div className="jar-fill" style={{height:pct+'%'}}/></div>
      <div><div className="text-xl font-extrabold">Lvl {profile.level}</div><div className="text-xs text-slate-300">XP {profile.xp} / {need}</div></div>
    </div>
    <div className="text-xl font-extrabold">⭐ {profile.stars}</div>
    <div className="flex-1"><div className="h-3 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400" style={{width:pct+'%'}}/></div></div>
    <div className="text-xs bg-yellow-300/20 text-yellow-200 px-2 py-1 rounded">Keep going!</div>
  </div>)
}
