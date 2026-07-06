// ── Widget assistant IA — AtelierKids ────────────────────────────────────────
(function () {
  'use strict';
  const STANDALONE = window.location.pathname.endsWith('assistant.html')
    || new URLSearchParams(window.location.search).get('assistant') === '1';

  // ── Styles ────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
  /* ── Keyframes ── */
  @keyframes aiw-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes aiw-pulse  { 0%,100%{opacity:1} 50%{opacity:0.25} }
  @keyframes aiw-appear { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes aiw-dothop { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-6px);opacity:1} }
  @keyframes aiw-wiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-12deg)} 75%{transform:rotate(12deg)} }
  @keyframes aiw-bounce { 0%,100%{transform:scale(1)} 30%{transform:scale(1.18)} 65%{transform:scale(.94)} }
  @keyframes aiw-bob    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes aiw-enter  { from{opacity:0;transform:translateY(18px) scale(.9)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes aiw-bubble { 0%{transform:scale(0);opacity:0} 65%{transform:scale(1.06);opacity:1} 100%{transform:scale(1);opacity:1} }
  @keyframes aiw-qr-in  { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
  @keyframes aiw-wave-arm { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-70deg)} 50%{transform:rotate(-50deg)} 75%{transform:rotate(-70deg)} 90%{transform:rotate(-20deg)} }
  @keyframes aiw-cheer-l  { 0%,100%{transform:rotate(0)} 50%{transform:rotate(40deg)} }
  @keyframes aiw-cheer-r  { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-40deg)} }
  @keyframes aiw-think-bob{ 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-4px) rotate(-4deg)} }
  @keyframes aiw-star     { 0%{transform:scale(0) rotate(0);opacity:1} 100%{transform:scale(1.5) rotate(30deg);opacity:0} }
  @keyframes aiw-brow-up  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }

  /* ── Bouton ── */
  #aiw-btn {
    position:fixed; bottom:26px; right:26px; z-index:9998;
    width:66px; height:66px; border-radius:50%;
    background:linear-gradient(145deg,#7a69c2,#3d3270);
    border:none; cursor:pointer;
    box-shadow:0 4px 22px rgba(90,72,170,.55);
    display:flex; align-items:center; justify-content:center;
    transition:transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
    padding:0; overflow:hidden;
  }
  #aiw-btn:hover { transform:scale(1.12); box-shadow:0 7px 30px rgba(90,72,170,.7); }
  #aiw-btn:hover #aiw-btn-face { animation:aiw-wiggle .4s ease; }
  #aiw-btn-face { width:46px; height:46px; }
  #aiw-badge { position:absolute; top:-2px; right:-2px; width:18px; height:18px; border-radius:50%; background:#e53935; border:2.5px solid #fff; display:none; font-size:9px; color:#fff; align-items:center; justify-content:center; font-weight:800; }

  /* ── Panel ── */
  #aiw-panel { position:fixed; bottom:104px; right:26px; z-index:9999; width:362px; max-height:545px; background:#faf9fc; border-radius:24px; box-shadow:0 14px 52px rgba(0,0,0,.19); display:flex; flex-direction:column; overflow:hidden; transform:scale(.78) translateY(38px); opacity:0; pointer-events:none; transition:transform .3s cubic-bezier(.34,1.56,.64,1), opacity .22s; transform-origin:bottom right; }
  #aiw-panel.open { transform:scale(1) translateY(0); opacity:1; pointer-events:all; }

  /* ── Header ── */
  #aiw-header { background:linear-gradient(140deg,#7a69c2,#3d3270); padding:10px 14px 8px; display:flex; align-items:center; gap:10px; flex-shrink:0; position:relative; overflow:hidden; }
  #aiw-header::after { content:''; position:absolute; top:-26px; right:-26px; width:80px; height:80px; border-radius:50%; background:rgba(255,255,255,.05); pointer-events:none; }
  #aiw-hav { width:46px; height:46px; flex-shrink:0; animation:aiw-float 3s ease-in-out infinite; filter:drop-shadow(0 3px 8px rgba(0,0,0,.2)); }
  #aiw-hav[data-state="think"]  { animation:aiw-think-bob .9s ease-in-out infinite; }
  #aiw-hav[data-state="cheer"]  { animation:aiw-bounce .5s ease; }
  #aiw-header-name   { color:#fff; font-family:'Poppins',sans-serif; font-weight:700; font-size:14px; line-height:1.2; }
  #aiw-header-status { color:rgba(255,255,255,.72); font-family:'Poppins',sans-serif; font-size:11px; margin-top:1px; }
  #aiw-close { margin-left:auto; background:rgba(255,255,255,.14); border:none; color:#fff; border-radius:50%; width:30px; height:30px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; transition:background .15s; flex-shrink:0; }
  #aiw-close:hover { background:rgba(255,255,255,.28); }

  /* ── Thread ── */
  #aiw-thread { flex:1; overflow-y:auto; padding:14px 14px 8px; background:#faf9fc; display:flex; flex-direction:column; gap:10px; min-height:220px; }
  #aiw-thread::-webkit-scrollbar { width:4px; }
  #aiw-thread::-webkit-scrollbar-thumb { background:#ddd; border-radius:4px; }

  /* ── Welcome ── */
  #aiw-welcome { display:flex; flex-direction:column; align-items:center; padding:6px 8px 2px; animation:aiw-enter .5s cubic-bezier(.34,1.4,.64,1) both; }
  #aiw-speech { background:#fff; border:2px solid #ddd4f5; border-radius:20px; padding:10px 16px; margin-bottom:4px; max-width:230px; box-shadow:0 3px 14px rgba(90,72,170,.12); font-family:'Poppins',sans-serif; font-size:13px; color:#444; font-weight:500; text-align:center; line-height:1.45; transform-origin:bottom center; animation:aiw-bubble .42s cubic-bezier(.34,1.56,.64,1) .5s both; position:relative; }
  #aiw-speech::after  { content:''; position:absolute; bottom:-11px; left:50%; transform:translateX(-50%); border:7px solid transparent; border-top-color:#ddd4f5; }
  #aiw-speech::before { content:''; position:absolute; bottom:-8px; left:50%; transform:translateX(-50%); border:6px solid transparent; border-top-color:#fff; z-index:1; }
  #aiw-cursor { display:inline-block; width:2px; height:13px; background:#9b8cff; border-radius:2px; vertical-align:middle; animation:aiw-pulse .7s step-end infinite; margin-left:2px; }
  #aiw-char-wrap { width:130px; height:200px; animation:aiw-bob 2.8s ease-in-out infinite; filter:drop-shadow(0 10px 24px rgba(90,72,170,.24)); flex-shrink:0; }
  #aiw-char-wrap[data-state="think"] { animation:aiw-think-bob .9s ease-in-out infinite; }
  #aiw-char-wrap[data-state="cheer"] { animation:aiw-bounce .5s ease forwards; }
  #aiw-hint { font-family:'Poppins',sans-serif; font-size:11.5px; color:#bbb; text-align:center; margin-top:3px; }

  /* ── Character SVG classes ── */
  .ch-arm-r-wave { transform-box:fill-box; transform-origin:50% 0%; }
  .ch-arm-l-cheer { transform-box:fill-box; transform-origin:100% 0%; }
  .ch-arm-r-cheer { transform-box:fill-box; transform-origin:0% 0%; }
  [data-state="wave"] .ch-arm-r-wave { animation:aiw-wave-arm 1.1s ease-in-out infinite; }
  [data-state="cheer"] .ch-arm-l-cheer { animation:aiw-cheer-l .6s ease-in-out infinite; }
  [data-state="cheer"] .ch-arm-r-cheer { animation:aiw-cheer-r .6s ease-in-out 0.1s infinite; }
  /* Expressions */
  .ch-mouth-smile, .ch-mouth-cheer, .ch-mouth-hmm { transition: opacity .3s; }
  [data-state="cheer"] .ch-mouth-smile  { opacity:0; }
  [data-state="cheer"] .ch-mouth-cheer  { opacity:1; }
  [data-state="cheer"] .ch-mouth-hmm    { opacity:0; }
  [data-state="think"] .ch-mouth-smile  { opacity:0; }
  [data-state="think"] .ch-mouth-cheer  { opacity:0; }
  [data-state="think"] .ch-mouth-hmm    { opacity:1; }
  .ch-mouth-cheer { opacity:0; }
  .ch-mouth-hmm   { opacity:0; }
  /* Stars (cheer only) */
  .ch-star { opacity:0; transform-box:fill-box; transform-origin:center; }
  [data-state="cheer"] .ch-star-1 { animation:aiw-star .8s ease-out .1s forwards; }
  [data-state="cheer"] .ch-star-2 { animation:aiw-star .8s ease-out .25s forwards; }
  [data-state="cheer"] .ch-star-3 { animation:aiw-star .8s ease-out .4s forwards; }
  /* Think bubble */
  .ch-think-bubble { opacity:0; transition:opacity .3s; }
  [data-state="think"] .ch-think-bubble { opacity:1; }
  /* Eyebrows for think */
  .ch-brow-l, .ch-brow-r { transition: transform .3s; }
  [data-state="think"] .ch-brow-l { transform:rotate(8deg) translateY(-2px); transform-box:fill-box; transform-origin:right center; }
  [data-state="think"] .ch-brow-r { transform:rotate(-8deg) translateY(-2px); transform-box:fill-box; transform-origin:left center; }

  /* Avatar bulle */
  .aiw-av-sm { width:34px; height:34px; flex-shrink:0; animation:aiw-float 3.2s ease-in-out infinite; filter:drop-shadow(0 2px 5px rgba(90,72,170,.25)); }

  /* ── Chips départ ── */
  #aiw-chips { display:flex; flex-wrap:wrap; gap:5px; padding:0 14px 8px; }
  .aiw-chip { background:#f0edfb; border:1px solid #e0d8f0; border-radius:20px; padding:5px 12px; font-size:11.5px; color:#6d5ba8; font-weight:600; cursor:pointer; font-family:'Poppins',sans-serif; transition:background .15s,transform .12s; white-space:nowrap; }
  .aiw-chip:hover { background:#e3ddf5; transform:translateY(-1px); }

  /* ── Bulles ── */
  .aiw-row { display:flex; align-items:flex-end; gap:7px; }
  .aiw-row.out { flex-direction:row-reverse; }
  .aiw-bubble { max-width:78%; padding:10px 13px; border-radius:18px; font-size:13px; line-height:1.6; word-wrap:break-word; font-family:'Poppins',sans-serif; animation:aiw-appear .25s ease-out; }
  .aiw-bubble.out { background:linear-gradient(135deg,#7a69c2,#3d3270); color:#fff; border-bottom-right-radius:5px; white-space:pre-line; }
  .aiw-bubble.in  { background:#fff; color:#333; border:1px solid #ece8f5; border-bottom-left-radius:5px; box-shadow:0 1px 6px rgba(0,0,0,.06); }
  .aiw-bubble.in strong { color:#5c4ea0; font-weight:700; }
  .aiw-bubble.in em     { color:#7262b5; font-style:italic; }
  .aiw-bubble.in code   { background:#f0edf8; color:#5c4ea0; padding:1px 5px; border-radius:5px; font-size:12px; }
  .aiw-bubble.in ul     { margin:6px 0 2px 16px; padding:0; }
  .aiw-bubble.in li     { margin-bottom:3px; }
  .aiw-typing-row  { display:flex; align-items:flex-end; gap:7px; }
  .aiw-typing-bub  { background:#fff; border:1px solid #ece8f5; border-radius:18px; border-bottom-left-radius:5px; padding:13px 16px; display:flex; gap:5px; align-items:center; }
  .aiw-dot { width:7px; height:7px; border-radius:50%; background:#ccc; animation:aiw-dothop 1.2s infinite ease-in-out; }
  .aiw-dot:nth-child(2){animation-delay:.2s} .aiw-dot:nth-child(3){animation-delay:.4s}
  /* Quick replies */
  .aiw-qr { display:flex; flex-wrap:wrap; gap:5px; padding:2px 4px 4px 44px; animation:aiw-qr-in .25s ease-out; }
  .aiw-qr-btn { background:#f0edfb; border:1px solid #ddd4f5; border-radius:16px; padding:4px 11px; font-size:11.5px; color:#6d5ba8; font-weight:600; cursor:pointer; font-family:'Poppins',sans-serif; transition:background .15s,transform .12s; }
  .aiw-qr-btn:hover { background:#e3ddf5; transform:translateY(-1px); }

  /* ── Composer ── */
  #aiw-composer { display:flex; gap:8px; padding:10px 12px; border-top:1px solid #eee; background:#fff; flex-shrink:0; }
  #aiw-input { flex:1; resize:none; border:1.5px solid #e0d8f0; border-radius:14px; padding:9px 12px; font-family:'Poppins',sans-serif; font-size:13px; min-height:40px; max-height:96px; outline:none; line-height:1.4; transition:border-color .15s; background:#faf9fc; }
  #aiw-input:focus { border-color:#7a69c2; background:#fff; }
  #aiw-send { background:linear-gradient(135deg,#7a69c2,#3d3270); color:#fff; border:none; border-radius:14px; padding:0 14px; cursor:pointer; flex-shrink:0; display:flex; align-items:center; justify-content:center; min-width:46px; transition:transform .15s,opacity .15s; }
  #aiw-send:hover:not(:disabled){ transform:scale(1.09); }
  #aiw-send:disabled { opacity:.38; cursor:not-allowed; }
  #aiw-footer { text-align:center; padding:5px 0 9px; font-size:11px; color:#c5c5c5; background:#fff; flex-shrink:0; }
  #aiw-footer a { color:#7a69c2; text-decoration:none; font-weight:600; }
  #aiw-footer a:hover { text-decoration:underline; }
  @media(max-width:420px){ #aiw-panel{width:calc(100vw - 18px);right:9px;bottom:92px;} #aiw-btn{right:12px;bottom:12px;} }
  `;
  if (STANDALONE) {
    style.textContent += `
  body.aiw-standalone {
    margin: 0;
    min-height: 100vh;
    background: #faf9fc;
  }
  body.aiw-standalone #aiw-btn { display: none !important; }
  body.aiw-standalone #aiw-panel {
    inset: 0;
    width: 100vw;
    height: 100vh;
    max-height: none;
    border-radius: 0;
    bottom: 0;
    right: 0;
    transform: none;
    opacity: 1;
    pointer-events: all;
  }
  body.aiw-standalone #aiw-panel.open {
    transform: none;
    opacity: 1;
    pointer-events: all;
  }
  body.aiw-standalone #aiw-close { display: none; }
  body.aiw-standalone #aiw-thread { min-height: 0; }
  body.aiw-standalone #aiw-header { position: sticky; top: 0; z-index: 1; }
    `;
  }
  document.head.appendChild(style);

  // ── SVG Robot Milo — visage (button / header / bulles) ───────────────────
  // state: '' | 'think' | 'cheer'
  function svgFace(state) {
    return `<svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" data-state="${state}">
      <!-- Casque -->
      <rect x="14" y="12" width="62" height="56" rx="19" fill="#e8e4ff"/>
      <rect x="14" y="12" width="62" height="22" rx="15" fill="#f0eeff"/>
      <!-- Capteurs (oreilles) -->
      <circle cx="14" cy="43" r="8.5" fill="#c4bde8"/>
      <circle cx="14" cy="43" r="5.5" fill="#8e7ed4"/>
      <circle cx="76" cy="43" r="8.5" fill="#c4bde8"/>
      <circle cx="76" cy="43" r="5.5" fill="#8e7ed4"/>
      <!-- Antenne -->
      <rect x="42" y="5" width="6" height="9" rx="3" fill="#a090e0"/>
      <circle cx="45" cy="5" r="6" fill="#6b5acc"/>
      <circle cx="45" cy="5" r="3.5" fill="#8fcdff"/>
      <!-- Visière sombre -->
      <rect x="18" y="29" width="54" height="28" rx="9" fill="#1a1448"/>
      <rect x="19" y="30" width="52" height="26" rx="8" fill="none" stroke="#8fcdff" stroke-width=".5" opacity=".3"/>
      <!-- Œil gauche (LED bleu) -->
      <circle cx="34" cy="43" r="9.5" fill="#8fcdff" opacity=".15"/>
      <circle cx="34" cy="43" r="8"   fill="#0d1033"/>
      <circle cx="34" cy="43" r="6.5" fill="#8fcdff" opacity=".95"/>
      <circle cx="34" cy="43" r="4.5" fill="#c8eeff"/>
      <circle cx="32" cy="41" r="1.8" fill="white" opacity=".85"/>
      <!-- Œil droit (LED bleu) -->
      <circle cx="56" cy="43" r="9.5" fill="#8fcdff" opacity=".15"/>
      <circle cx="56" cy="43" r="8"   fill="#0d1033"/>
      <circle cx="56" cy="43" r="6.5" fill="#8fcdff" opacity=".95"/>
      <circle cx="56" cy="43" r="4.5" fill="#c8eeff"/>
      <circle cx="54" cy="41" r="1.8" fill="white" opacity=".85"/>
      <!-- Panneau LED bouche -->
      <rect x="23" y="59" width="44" height="9" rx="4.5" fill="#d4cef2"/>
      <path class="ch-mouth-smile" d="M29 62 Q45 70 61 62" stroke="#7262b5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path class="ch-mouth-cheer" d="M26 61 Q45 73 64 61" stroke="#5c4ea0" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      <path class="ch-mouth-hmm"   d="M30 64 Q45 62 60 64" stroke="#9080b8" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- Bulle pensée -->
      <g class="ch-think-bubble">
        <circle cx="70" cy="16" r="9" fill="white" stroke="#ddd4f5" stroke-width="1.5"/>
        <text x="70" y="21" text-anchor="middle" font-size="10" fill="#7262b5" font-family="Arial">?</text>
        <circle cx="62" cy="26" r="3" fill="white" stroke="#ddd4f5" stroke-width="1"/>
        <circle cx="58" cy="33" r="2" fill="white" stroke="#ddd4f5" stroke-width="1"/>
      </g>
      <!-- Étoiles cheer -->
      <g class="ch-star ch-star-1"><text x="6" y="22" font-size="10">⭐</text></g>
      <g class="ch-star ch-star-2"><text x="70" y="14" font-size="9">✨</text></g>
      <!-- Cou + épaules -->
      <rect x="38" y="68" width="14" height="7" rx="3.5" fill="#ddd8f8"/>
      <circle cx="10" cy="80" r="8" fill="#c4bde8"/>
      <circle cx="80" cy="80" r="8" fill="#c4bde8"/>
      <rect x="16" y="74" width="58" height="10" rx="5" fill="#ddd8f8"/>
    </svg>`;
  }

  // ── SVG Robot Milo — corps entier (welcome screen) ───────────────────────
  function svgBodyFull(state) {
    return `<svg id="aiw-char-wrap" data-state="${state}" viewBox="0 0 150 230" xmlns="http://www.w3.org/2000/svg">

      <!-- ══ TÊTE (casque) ══ -->
      <rect x="22" y="8" width="106" height="88" rx="28" fill="#e8e4ff"/>
      <rect x="22" y="8" width="106" height="34" rx="24" fill="#f0eeff"/>
      <!-- Capteurs latéraux -->
      <circle cx="22" cy="55" r="14" fill="#c4bde8"/>
      <circle cx="22" cy="55" r="9"  fill="#8e7ed4"/>
      <circle cx="128" cy="55" r="14" fill="#c4bde8"/>
      <circle cx="128" cy="55" r="9"  fill="#8e7ed4"/>
      <!-- Antenne -->
      <rect x="71" y="2" width="8" height="12" rx="4" fill="#a090e0"/>
      <circle cx="75" cy="2" r="9"  fill="#6b5acc"/>
      <circle cx="75" cy="2" r="5"  fill="#8fcdff"/>
      <!-- Visière sombre -->
      <rect x="30" y="38" width="90" height="42" rx="14" fill="#1a1448"/>
      <rect x="31" y="39" width="88" height="40" rx="13" fill="none" stroke="#8fcdff" stroke-width="1" opacity=".2"/>
      <!-- Œil gauche LED -->
      <circle cx="58" cy="59" r="14"  fill="#8fcdff" opacity=".15"/>
      <circle cx="58" cy="59" r="11.5" fill="#0d1033"/>
      <circle cx="58" cy="59" r="9.5" fill="#8fcdff" opacity=".95"/>
      <circle cx="58" cy="59" r="6.5" fill="#c8eeff"/>
      <circle cx="54.5" cy="55.5" r="2.5" fill="white" opacity=".85"/>
      <!-- Œil droit LED -->
      <circle cx="92" cy="59" r="14"  fill="#8fcdff" opacity=".15"/>
      <circle cx="92" cy="59" r="11.5" fill="#0d1033"/>
      <circle cx="92" cy="59" r="9.5" fill="#8fcdff" opacity=".95"/>
      <circle cx="92" cy="59" r="6.5" fill="#c8eeff"/>
      <circle cx="88.5" cy="55.5" r="2.5" fill="white" opacity=".85"/>
      <!-- Panneau bouche LED -->
      <rect x="36" y="84" width="78" height="14" rx="7" fill="#d4cef2"/>
      <path class="ch-mouth-smile" d="M44 89 Q75 101 106 89" stroke="#7262b5" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      <path class="ch-mouth-cheer" d="M40 88 Q75 106 110 88" stroke="#5c4ea0" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path class="ch-mouth-hmm"   d="M46 93 Q75 91 104 93" stroke="#9080b8" stroke-width="2.2" fill="none" stroke-linecap="round"/>

      <!-- ══ BULLE PENSÉE ══ -->
      <g class="ch-think-bubble">
        <circle cx="118" cy="20" r="14" fill="white" stroke="#ddd4f5" stroke-width="2"/>
        <text x="118" y="26" text-anchor="middle" font-size="16" fill="#7262b5" font-family="Arial" font-weight="bold">?</text>
        <circle cx="106" cy="34" r="5" fill="white" stroke="#ddd4f5" stroke-width="1.5"/>
        <circle cx="100" cy="42" r="3" fill="white" stroke="#ddd4f5" stroke-width="1"/>
      </g>

      <!-- ══ ÉTOILES CHEER ══ -->
      <g class="ch-star ch-star-1"><text x="10" y="26" font-size="16">⭐</text></g>
      <g class="ch-star ch-star-2"><text x="118" y="24" font-size="14">✨</text></g>
      <g class="ch-star ch-star-3"><text x="14" y="62" font-size="11">🌟</text></g>

      <!-- ══ COU ══ -->
      <rect x="63" y="96" width="24" height="16" rx="8" fill="#ddd8f8"/>

      <!-- ══ ARTICULATIONS ÉPAULES ══ -->
      <circle cx="26" cy="118" r="15" fill="#c4bde8"/>
      <circle cx="26" cy="118" r="9"  fill="#a090d8"/>
      <circle cx="124" cy="118" r="15" fill="#c4bde8"/>
      <circle cx="124" cy="118" r="9"  fill="#a090d8"/>

      <!-- ══ TORSE ══ -->
      <rect x="34" y="110" width="82" height="68" rx="22" fill="#c8c0f0"/>
      <rect x="40" y="116" width="70" height="56" rx="18" fill="#ddd8f8"/>
      <!-- Panneau poitrine -->
      <rect x="50" y="120" width="50" height="40" rx="10" fill="#1a1448"/>
      <!-- LEDs poitrine -->
      <circle cx="59" cy="132" r="4" fill="#8fcdff" opacity=".9"/>
      <circle cx="69" cy="132" r="4" fill="#8fcdff" opacity=".6"/>
      <circle cx="75" cy="132" r="3" fill="#8fcdff" opacity=".3"/>
      <circle cx="81" cy="132" r="4" fill="#8fcdff" opacity=".6"/>
      <circle cx="91" cy="132" r="4" fill="#8fcdff" opacity=".9"/>
      <!-- Logo AK -->
      <circle cx="75" cy="148" r="10" fill="#6252a5"/>
      <text x="75" y="152" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="Poppins,Arial,sans-serif">AK</text>

      <!-- ══ BRAS GAUCHE STATIQUE ══ -->
      <rect x="12" y="120" width="18" height="46" rx="9" fill="#c8c0f0"/>
      <circle cx="21" cy="153" r="9" fill="#c4bde8"/>
      <circle cx="21" cy="168" r="11" fill="#ddd8f8"/>

      <!-- ══ BRAS DROIT (wave) ══ -->
      <g class="ch-arm-r-wave">
        <rect x="120" y="120" width="18" height="46" rx="9" fill="#c8c0f0"/>
        <circle cx="129" cy="153" r="9" fill="#c4bde8"/>
        <circle cx="129" cy="168" r="11" fill="#ddd8f8"/>
      </g>

      <!-- ══ BRAS CHEER (masqués par défaut) ══ -->
      <g class="ch-arm-l-cheer" style="display:none">
        <rect x="12" y="100" width="18" height="46" rx="9" fill="#c8c0f0"/>
        <circle cx="21" cy="133" r="9" fill="#c4bde8"/>
        <circle cx="21" cy="148" r="11" fill="#ddd8f8"/>
      </g>
      <g class="ch-arm-r-cheer" style="display:none">
        <rect x="120" y="100" width="18" height="46" rx="9" fill="#c8c0f0"/>
        <circle cx="129" cy="133" r="9" fill="#c4bde8"/>
        <circle cx="129" cy="148" r="11" fill="#ddd8f8"/>
      </g>

      <!-- ══ ARTICULATIONS HANCHES ══ -->
      <circle cx="52" cy="178" r="13" fill="#c4bde8"/>
      <circle cx="52" cy="178" r="8"  fill="#a090d8"/>
      <circle cx="98" cy="178" r="13" fill="#c4bde8"/>
      <circle cx="98" cy="178" r="8"  fill="#a090d8"/>

      <!-- ══ JAMBES ══ -->
      <rect x="43" y="178" width="18" height="36" rx="9" fill="#c8c0f0"/>
      <rect x="89" y="178" width="18" height="36" rx="9" fill="#c8c0f0"/>
      <!-- Genoux -->
      <circle cx="52" cy="205" r="10" fill="#c4bde8"/>
      <circle cx="98" cy="205" r="10" fill="#c4bde8"/>

      <!-- ══ PIEDS ══ -->
      <ellipse cx="52" cy="222" rx="20" ry="8" fill="#9080d4"/>
      <ellipse cx="98" cy="222" rx="20" ry="8" fill="#9080d4"/>
    </svg>`;
  }

  // ── Gestion de l'état du personnage ────────────────────────────────────────
  let charState = 'wave';
  function setCharState(state, duration = 0) {
    charState = state;
    const wrap = document.getElementById('aiw-char-wrap');
    const hav  = document.getElementById('aiw-hav');
    if (wrap) {
      // Gère la visibilité des bras alternatifs
      const armWave    = wrap.querySelector('.ch-arm-r-wave');
      const armLCheer  = wrap.querySelector('.ch-arm-l-cheer');
      const armRCheer  = wrap.querySelector('.ch-arm-r-cheer');
      if (armWave)   armWave.style.display   = (state === 'cheer') ? 'none' : 'block';
      if (armLCheer) armLCheer.style.display = (state === 'cheer') ? 'block' : 'none';
      if (armRCheer) armRCheer.style.display = (state === 'cheer') ? 'block' : 'none';
      wrap.dataset.state = state;
    }
    if (hav) hav.dataset.state = state;
    if (duration > 0) setTimeout(() => setCharState('idle'), duration);
  }

  // ── DOM ────────────────────────────────────────────────────────────────────
  const btn = document.createElement('button');
  btn.id = 'aiw-btn'; btn.title = 'Mon ami Milo';
  btn.innerHTML = `<svg id="aiw-btn-face" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="12" width="62" height="56" rx="19" fill="#e8e4ff"/>
    <rect x="14" y="12" width="62" height="22" rx="15" fill="#f0eeff"/>
    <circle cx="14" cy="43" r="8.5" fill="#c4bde8"/>
    <circle cx="14" cy="43" r="5.5" fill="#8e7ed4"/>
    <circle cx="76" cy="43" r="8.5" fill="#c4bde8"/>
    <circle cx="76" cy="43" r="5.5" fill="#8e7ed4"/>
    <rect x="42" y="5" width="6" height="9" rx="3" fill="#a090e0"/>
    <circle cx="45" cy="5" r="6" fill="#6b5acc"/>
    <circle cx="45" cy="5" r="3.5" fill="#8fcdff"/>
    <rect x="18" y="29" width="54" height="28" rx="9" fill="#1a1448"/>
    <circle cx="34" cy="43" r="8"   fill="#0d1033"/>
    <circle cx="34" cy="43" r="6.5" fill="#8fcdff" opacity=".95"/>
    <circle cx="34" cy="43" r="4.5" fill="#c8eeff"/>
    <circle cx="32" cy="41" r="1.8" fill="white" opacity=".85"/>
    <circle cx="56" cy="43" r="8"   fill="#0d1033"/>
    <circle cx="56" cy="43" r="6.5" fill="#8fcdff" opacity=".95"/>
    <circle cx="56" cy="43" r="4.5" fill="#c8eeff"/>
    <circle cx="54" cy="41" r="1.8" fill="white" opacity=".85"/>
    <rect x="23" y="59" width="44" height="9" rx="4.5" fill="#d4cef2"/>
    <path d="M29 62 Q45 70 61 62" stroke="#7262b5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <rect x="16" y="74" width="58" height="10" rx="5" fill="#ddd8f8"/>
  </svg><span id="aiw-badge"></span>`;

  const panel = document.createElement('div');
  panel.id = 'aiw-panel';
  panel.innerHTML = `
    <div id="aiw-header">
      ${svgFace('wave').replace('<svg ', '<svg id="aiw-hav" ')}
      <div>
        <div id="aiw-header-name">Milo 🤖 — ton ami</div>
        <div id="aiw-header-status">Prêt à explorer ensemble !</div>
      </div>
      <button id="aiw-close">✕</button>
    </div>
    <div id="aiw-thread">
      <div id="aiw-welcome">
        <div id="aiw-speech"><span id="aiw-speech-text"></span><span id="aiw-cursor"></span></div>
        ${svgBodyFull('wave')}
        <div id="aiw-hint">Pose ta question — on cherche ensemble !</div>
      </div>
    </div>
    <div id="aiw-chips"></div>
    <div id="aiw-composer">
      <textarea id="aiw-input" placeholder="Dis-moi ce qui te bloque…" rows="1"></textarea>
      <button id="aiw-send"><svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
    </div>
    <div id="aiw-footer"><a href="/assistant.html">Ouvrir en plein écran ↗</a></div>`;

  document.body.appendChild(btn);
  document.body.appendChild(panel);
  if (STANDALONE) {
    document.body.classList.add('aiw-standalone');
    btn.hidden = true;
    panel.classList.add('open');
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function getUrlParam(k) { return new URLSearchParams(window.location.search).get(k) || null; }
  const MOD_LABELS = {lecture:'Lecture',numerique:'Numérique',robotique:'Robotique',anglais:'Anglais',civique:'Éd. civique',eco:'Éco-citoyenneté'};

  // ── Persistance sessionStorage ────────────────────────────────────────────
  // L'historique est sauvegardé par activité pour survivre aux navigations
  // entre pages du même quiz (ex : enfant ouvre la leçon puis revient au quiz).
  let open = STANDALONE, history = [], unread = 0, _pendingWrongMsg = null;
  function _sessionKey() {
    const id = getUrlParam('id') || getUrlParam('m') || window.location.pathname.split('/').pop();
    return `milo_h_${id}`;
  }
  function saveHistory() {
    try { sessionStorage.setItem(_sessionKey(), JSON.stringify(history.slice(-14))); } catch {}
  }
  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(_sessionKey());
      if (!raw) return;
      const parsed = JSON.parse(raw);
      history = Array.isArray(parsed)
        ? parsed.filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        : [];
    } catch {
      history = [];
    }
  }
  loadHistory();

  // ── Markdown léger ─────────────────────────────────────────────────────────
  function renderMd(raw) {
    let s = raw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    s = s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    s = s.replace(/\*([^*]+?)\*/g,'<em>$1</em>');
    s = s.replace(/`([^`]+?)`/g,'<code>$1</code>');
    s = s.replace(/^[-•]\s+(.+)$/gm,'<li>$1</li>');
    s = s.replace(/(<li>[^<]*<\/li>\n?)+/g, m => `<ul>${m}</ul>`);
    s = s.replace(/\n/g,'<br>');
    return s;
  }

  // ── Typewriter contextuel ─────────────────────────────────────────────────
  let twDone = false;
  function startTypewriter() {
    if (twDone) return; twDone = true;
    const el = document.getElementById('aiw-speech-text'), cur = document.getElementById('aiw-cursor');
    if (!el) return;
    const mod = getUrlParam('m'), lbl = mod ? MOD_LABELS[mod] : null;
    const path = window.location.pathname;
    let msg;
    if (lbl && (path.includes('quiz') || path.includes('exercice')))
      msg = `Salut ! Moi c'est Milo 👋\nMoi aussi j'adore ${lbl} !\nDis-moi ce qui te bloque !`;
    else if (lbl && path.includes('lecon'))
      msg = `Salut ! Moi c'est Milo 👋\nOn explore ${lbl} ensemble ?`;
    else
      msg = 'Salut ! Moi c\'est Milo 👋\nOn cherche ensemble !';
    let i = 0; cur.style.display = 'inline-block';
    const t = setInterval(() => {
      if (i <= msg.length) { el.textContent = msg.slice(0, i++); }
      else { clearInterval(t); setTimeout(() => cur.style.display='none', 1400); }
    }, 38);
  }

  // ── Chips contextuelles ───────────────────────────────────────────────────
  function getChips() {
    const path = window.location.pathname, mod = getUrlParam('m') || '', lbl = MOD_LABELS[mod] || 'ce module';
    if (path.includes('quiz'))     return ['Je comprends pas cette question', `C'est quoi ${lbl} exactement ?`, 'On cherche ensemble ?'];
    if (path.includes('exercice')) return ['Je bloque sur cet exercice', 'Par où on commence ?', 'C\'est quoi l\'idée ici ?'];
    if (path.includes('lecon'))    return ['Explique-moi ce point', 'Je comprends pas', 'Donne un exemple de la vraie vie'];
    if (path.includes('badges'))   return ['Comment gagner des badges ?', 'C\'est quoi le prochain ?'];
    return ['Je bloque sur un exercice', 'Comment je progresse ?', 'On cherche une solution ?'];
  }
  function renderChips() {
    const c = document.getElementById('aiw-chips');
    c.innerHTML = getChips().map(t=>`<div class="aiw-chip">${t}</div>`).join('');
    c.querySelectorAll('.aiw-chip').forEach(ch => ch.addEventListener('click', () => {
      document.getElementById('aiw-input').value = ch.textContent; sendMsg();
    }));
  }

  // ── Toggle panel ──────────────────────────────────────────────────────────
  function togglePanel() {
    open = !open; panel.classList.toggle('open', open);
    if (open) {
      unread = 0;
      const badge = document.getElementById('aiw-badge');
      badge.style.display = 'none'; badge.style.background = '#e53935';
      setCharState('wave');
      setTimeout(() => {
        document.getElementById('aiw-input').focus();
        startTypewriter();
        // Message en attente (enfant s'est trompé pendant que le widget était fermé)
        if (_pendingWrongMsg) {
          document.getElementById('aiw-input').value = _pendingWrongMsg;
          _pendingWrongMsg = null;
          setTimeout(sendMsg, 700);
        }
      }, 300);
      if (!document.getElementById('aiw-chips').children.length) renderChips();
    }
  }
  btn.addEventListener('click', togglePanel);
  document.getElementById('aiw-close').addEventListener('click', togglePanel);

  // ── Status ────────────────────────────────────────────────────────────────
  function setStatus(txt) { const el=document.getElementById('aiw-header-status'); if(el) el.textContent=txt; }

  // ── Thread ────────────────────────────────────────────────────────────────
  const thread = document.getElementById('aiw-thread');
  function clearWelcome() { const w=document.getElementById('aiw-welcome'); if(w) w.remove(); }

  function makeFaceSm() {
    const d = document.createElement('div');
    d.innerHTML = `<svg class="aiw-av-sm" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="12" width="62" height="56" rx="19" fill="#e8e4ff"/>
      <rect x="14" y="12" width="62" height="22" rx="15" fill="#f0eeff"/>
      <circle cx="14" cy="43" r="8.5" fill="#c4bde8"/>
      <circle cx="14" cy="43" r="5.5" fill="#8e7ed4"/>
      <circle cx="76" cy="43" r="8.5" fill="#c4bde8"/>
      <circle cx="76" cy="43" r="5.5" fill="#8e7ed4"/>
      <rect x="42" y="5" width="6" height="9" rx="3" fill="#a090e0"/>
      <circle cx="45" cy="5" r="6" fill="#6b5acc"/>
      <circle cx="45" cy="5" r="3.5" fill="#8fcdff"/>
      <rect x="18" y="29" width="54" height="28" rx="9" fill="#1a1448"/>
      <circle cx="34" cy="43" r="8"   fill="#0d1033"/>
      <circle cx="34" cy="43" r="6.5" fill="#8fcdff" opacity=".95"/>
      <circle cx="34" cy="43" r="4.5" fill="#c8eeff"/>
      <circle cx="32" cy="41" r="1.8" fill="white" opacity=".85"/>
      <circle cx="56" cy="43" r="8"   fill="#0d1033"/>
      <circle cx="56" cy="43" r="6.5" fill="#8fcdff" opacity=".95"/>
      <circle cx="56" cy="43" r="4.5" fill="#c8eeff"/>
      <circle cx="54" cy="41" r="1.8" fill="white" opacity=".85"/>
      <rect x="23" y="59" width="44" height="9" rx="4.5" fill="#d4cef2"/>
      <path d="M29 62 Q45 70 61 62" stroke="#7262b5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <rect x="16" y="74" width="58" height="10" rx="5" fill="#ddd8f8"/>
    </svg>`;
    return d;
  }

  function scrollBottom() {
    requestAnimationFrame(() => { thread.scrollTop = thread.scrollHeight; });
  }

  function addBubble(role, text) {
    clearWelcome();
    const row = document.createElement('div'); row.className='aiw-row '+(role==='user'?'out':'');
    if (role==='assistant') row.appendChild(makeFaceSm());
    const bub = document.createElement('div'); bub.className='aiw-bubble '+(role==='user'?'out':'in');
    if (role==='assistant') bub.innerHTML = renderMd(text);
    else bub.textContent = text;
    row.appendChild(bub); thread.appendChild(row); scrollBottom();
    return bub;
  }

  function addQuickReplies(reply) {
    const isCelebrate  = /bravo|félicit|génial|excellent|parfait|t['']as trouv|c['']est exact/i.test(reply);
    const isErrorExpl  = /pas tout à fait|mauvais|incorrect|c'?était faux|erreur|en réalité|en fait|c'?est pour [çca]a|parce que/i.test(reply);
    const isHint       = /pense|rappelle|essaie|réfléchi|imagine|as-tu|ensemble|qu['']est-ce/i.test(reply) || reply.length > 120;
    let opts;
    if (isCelebrate)  opts = ['🎉 Super merci !', '❓ Autre question'];
    else if (isErrorExpl) opts = ['Je comprends maintenant ✅', 'Encore un indice', '❓ Autre question'];
    else if (isHint)  opts = ['Encore un indice', '❓ Autre question'];
    else              opts = ['❓ Autre question'];

    const qr = document.createElement('div'); qr.className='aiw-qr';
    opts.forEach(label => {
      const b = document.createElement('button'); b.className='aiw-qr-btn'; b.textContent=label;
      b.addEventListener('click', () => {
        qr.remove();

        // Confirmation de compréhension → célébration locale, pas d'appel API
        if (label === 'Je comprends maintenant ✅') {
          const cheers = [
            '🎉 Trop bien ! L\'essentiel c\'est d\'avoir compris !',
            '💪 Parfait ! Maintenant essaie de répondre seul — tu vas y arriver !',
            '⭐ Top ! La prochaine question, tu l\'attaques en confiance !',
            '🚀 Super ! C\'est comme ça qu\'on progresse !',
          ];
          addBubble('assistant', cheers[Math.floor(Math.random() * cheers.length)]);
          setCharState('cheer', 2000);
          scrollBottom();
          return;
        }

        // "Encore un indice" : envoie la question courante pour que Milo ne se perde pas
        if (label === 'Encore un indice' && window.MILO_CURRENT_QUESTION) {
          const q = window.MILO_CURRENT_QUESTION;
          document.getElementById('aiw-input').value =
            `Encore un indice pour la question ${q.displayNumber} : "${q.text}"`;
        } else {
          document.getElementById('aiw-input').value = label;
        }
        sendMsg();
      });
      qr.appendChild(b);
    });
    thread.appendChild(qr); scrollBottom();
  }

  // Appelé quand l'enfant passe à la question suivante
  const _NEXT_MSGS = [
    'Passons à la suivante ! 🚀 Dis-moi si tu bloques.',
    'Question suivante ! 💡 Je suis là si t\'as besoin d\'un indice.',
    'On enchaîne ! 🎯 N\'hésite pas à me solliciter.',
    'C\'est parti pour la prochaine ! 🌟 Je t\'écoute si ça coince.',
    'Allez, on continue ! 🤖 Je reste disponible pour toi.',
  ];
  window.miloNewQuestion = function() {
    history = [];
    try { sessionStorage.removeItem(_sessionKey()); } catch {}
    thread.querySelectorAll('.aiw-qr').forEach(el => el.remove());
    const msg = _NEXT_MSGS[Math.floor(Math.random() * _NEXT_MSGS.length)];
    addBubble('assistant', msg);
    scrollBottom();
  };

  // Appelé quand l'enfant choisit la mauvaise réponse
  window.miloWrongAnswer = function(questionText, wrongChoice) {
    const msg = `J'ai répondu "${wrongChoice}" mais c'était faux… Tu peux m'expliquer pourquoi ?`;
    if (!open) {
      // Widget fermé → stocker le message + alerter visuellement sans forcer l'ouverture
      _pendingWrongMsg = msg;
      const badge = document.getElementById('aiw-badge');
      badge.textContent = '!'; badge.style.background = '#e53935'; badge.style.display = 'flex';
      // Petite vibration du bouton pour attirer l'attention
      btn.style.animation = 'aiw-wiggle .45s ease';
      setTimeout(() => { btn.style.animation = 'aiw-wiggle .45s ease .5s'; }, 500);
      setTimeout(() => { btn.style.animation = ''; }, 1100);
      return;
    }
    thread.querySelectorAll('.aiw-qr').forEach(el => el.remove());
    document.getElementById('aiw-input').value = msg;
    sendMsg();
  };

  // Appelé quand l'enfant trouve la bonne réponse
  window.miloCorrectAnswer = function() {
    if (!open) return;
    thread.querySelectorAll('.aiw-qr').forEach(el => el.remove());
    addBubble('assistant', '🎉 Bonne réponse ! Continue comme ça !');
    scrollBottom();
  };

  function addTyping() {
    clearWelcome();
    const row = document.createElement('div'); row.id='aiw-typing'; row.className='aiw-typing-row';
    row.appendChild(makeFaceSm());
    const bub = document.createElement('div'); bub.className='aiw-typing-bub'; bub.innerHTML='<span class="aiw-dot"></span><span class="aiw-dot"></span><span class="aiw-dot"></span>';
    row.appendChild(bub); thread.appendChild(row); scrollBottom(); return row;
  }

  // ── Envoi ─────────────────────────────────────────────────────────────────
  async function sendMsg() {
    const inp=document.getElementById('aiw-input'), snd=document.getElementById('aiw-send'), chp=document.getElementById('aiw-chips');
    const msg=inp.value.trim();
    if (!msg||snd.disabled) return;
    inp.value=''; inp.style.height=''; snd.disabled=true; chp.style.display='none';
    thread.querySelectorAll('.aiw-qr').forEach(el=>el.remove());
    addBubble('user', msg);
    const typing=addTyping();
    setCharState('think');
    setStatus('Milo réfléchit…');

    const currentModule = getUrlParam('m'), activityId = getUrlParam('id');
    let res;
    try {
      res = await (typeof askAssistant==='function'
        ? askAssistant(msg, history, currentModule, activityId)
        : fetch('/api/ai-chat',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({message:msg,history,currentModule,activityId,currentQuestion:window.MILO_CURRENT_QUESTION||null})}).then(r=>r.json()));
    } catch { res={error:'Serveur injoignable.'}; }

    typing.remove();

    if (res.error) {
      setCharState('idle');
      setStatus('Prêt à explorer ensemble !');
      addBubble('assistant','⚠️ '+res.error);
    } else {
      const isCelebrate = /bravo|félicit|génial|excellent|parfait|t['']as trouv|c['']est exact/i.test(res.reply);
      if (isCelebrate) { setCharState('cheer', 3000); setStatus('Trop bien ! 🎉'); }
      else { setCharState('idle'); setStatus('Prêt à explorer ensemble !'); }

      addBubble('assistant', res.reply);
      addQuickReplies(res.reply);
      history.push({role:'user',content:msg}); history.push({role:'assistant',content:res.reply});
      saveHistory();

      if (!open) {
        unread++; const b=document.getElementById('aiw-badge'); b.textContent=unread>9?'9+':unread; b.style.display='flex';
      }
    }
    snd.disabled=false; inp.focus();
  }

  document.getElementById('aiw-send').addEventListener('click', sendMsg);
  document.getElementById('aiw-input').addEventListener('keydown', e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();} });
  document.getElementById('aiw-input').addEventListener('input', function(){ this.style.height='auto'; this.style.height=Math.min(this.scrollHeight,96)+'px'; });

})();
