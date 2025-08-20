
export const SFX = {
  ctx: null,
  _ensure(){ if(!this.ctx) this.ctx = new (window.AudioContext||window.webkitAudioContext)() },
  beep(freq=880,dur=.12,type='sine',vol=.15){
    this._ensure(); const o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.value=freq; g.gain.value=vol; o.connect(g); g.connect(this.ctx.destination);
    o.start(); setTimeout(()=>o.stop(), dur*1000);
  },
  click(){ this.beep(660,.06,'triangle',.12) },
  correct(){ this.beep(740,.08,'sine',.2); setTimeout(()=>this.beep(980,.12,'sine',.2), 90) },
  wrong(){ this.beep(200,.12,'sine',.25); setTimeout(()=>this.beep(140,.12,'sine',.2), 110) },
  level(){ this.beep(520,.07,'triangle',.25); setTimeout(()=>this.beep(660,.07),80); setTimeout(()=>this.beep(820,.09),160) }
}
