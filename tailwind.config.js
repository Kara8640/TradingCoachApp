
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: { glow: "0 0 0 3px rgba(99,102,241,.5), 0 0 40px rgba(168,85,247,.35)" },
      keyframes: { pop:{'0%':{transform:'scale(.9)'},'60%':{transform:'scale(1.04)'},'100%':{transform:'scale(1)'}} },
      animation: { pop:'pop .3s ease' }
    }
  },
  plugins: []
}
