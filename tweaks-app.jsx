// dPTM Brand Book — Tweaks app
// Drives the deck via CSS-variable + injected-style overrides (deck is plain HTML).
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#E8501E",
  "displayFont": "Archivo Expanded",
  "grain": true,
  "frame": true
}/*EDITMODE-END*/;

// accent value -> matching deeper "ember" shade
const EMBER = {
  "#E8501E": "#B83A12", // Signature
  "#D2431C": "#A22F0E", // Ember (deeper, more premium)
  "#E2673A": "#B84A22", // Terracotta (warmer, softer)
  "#F26A1B": "#C24E0C"  // Solar (brighter pop)
};

const FONT_STACK = {
  "Archivo Expanded": "'Archivo Expanded','Archivo',sans-serif",
  "Anton":            "'Anton','Archivo',sans-serif",
  "Bricolage":        "'Bricolage Grotesque','Archivo',sans-serif"
};

function applyTweaks(t){
  const root = document.documentElement;
  root.style.setProperty('--orange', t.accent);
  root.style.setProperty('--ember', EMBER[t.accent] || '#B83A12');

  let css = '';
  // display font: override the inline 'Archivo Expanded' usages + the display classes
  const stack = FONT_STACK[t.displayFont] || FONT_STACK['Archivo Expanded'];
  if (t.displayFont !== 'Archivo Expanded'){
    css += `.hero,.title,.display,[style*="Archivo Expanded"]{font-family:${stack} !important;}`;
    // Anton is all-caps display; keep it tighter
    if (t.displayFont === 'Anton'){
      css += `.hero,.title,.display,[style*="Archivo Expanded"]{font-weight:400 !important;letter-spacing:-.01em !important;}`;
    }
  }
  if (!t.grain){ css += `.grain::before{display:none !important;}`; }
  if (!t.frame){ css += `.kf,.kf-l,.kf-r{display:none !important;}`; }

  let tag = document.getElementById('tweak-overrides');
  if (!tag){ tag = document.createElement('style'); tag.id = 'tweak-overrides'; document.head.appendChild(tag); }
  tag.textContent = css;
}

function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => { applyTweaks(t); }, [t]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Signature accent" />
      <TweakColor label="Accent" value={t.accent}
        options={["#E8501E","#D2431C","#E2673A","#F26A1B"]}
        onChange={(v)=>setTweak('accent', v)} />
      <TweakSection label="Display type" />
      <TweakRadio label="Headline font" value={t.displayFont}
        options={["Archivo Expanded","Anton","Bricolage"]}
        onChange={(v)=>setTweak('displayFont', v)} />
      <TweakSection label="Texture" />
      <TweakToggle label="Risograph grain" value={t.grain}
        onChange={(v)=>setTweak('grain', v)} />
      <TweakToggle label="Keyline frame" value={t.frame}
        onChange={(v)=>setTweak('frame', v)} />
    </TweaksPanel>
  );
}

const mount = document.getElementById('tweaks-root');
ReactDOM.createRoot(mount).render(<App />);
