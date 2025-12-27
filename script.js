// ==========================
//  Matchify — Script.js
//  Safe cross-page version
// ==========================

// ---------- App State ----------
const state = {
  uploadedImage: null,
  dominantColors: [],
  matchingColors: {},
  currentUser: null
};

// ---------- Utility Selector ----------
function $(id) {
  return document.getElementById(id);
}

// ---------- DOM Elements ----------
const uploadBtn = $('uploadBtn');
const fileInput = $('fileInput');
const uploadArea = $('uploadArea');
const uploadSection = $('uploadSection');
const previewSection = $('previewSection');
const resultsSection = $('resultsSection');
const previewImage = $('previewImage');
const clearBtn = $('clearBtn');
const analyzeBtn = $('analyzeBtn');
const newSearchBtn = $('newSearchBtn');
const colorChips = $('colorChips');
const saveMatchesBtn = $('saveMatchesBtn');
const savedSection = $('savedSection');
const savedGrid = $('savedGrid');

// ---------- Auth Elements ----------
const loginOpenBtn = $('loginOpenBtn');
const signupOpenBtn = $('signupOpenBtn');
const logoutBtn = $('logoutBtn');
const userGreeting = $('userGreeting');

const authModal = $('authModal');
const modalOverlay = $('modalOverlay');
const authForm = $('authForm');
const authTitle = $('authTitle');
const authUsername = $('authUsername');
const authPassword = $('authPassword');
const authCancelBtn = $('authCancelBtn');
const authSwitchBtn = $('authSwitchBtn');
const authSwitchText = $('authSwitchText');

// ---------- Safe Helpers ----------
function safeClear(el) { if (el) el.innerHTML = ''; }
function safeHide(el) { if (el) el.classList.add('hidden'); }
function safeShow(el) { if (el) el.classList.remove('hidden'); }

// ============================================================
//  UPLOAD PAGE LOGIC (runs only on upload.html)
// ============================================================
if (uploadSection) {

  // ---- Event Listeners ----
  if (uploadBtn) uploadBtn.addEventListener('click', () => fileInput?.click());
  if (fileInput) fileInput.addEventListener('change', handleFileSelect);
  if (clearBtn) clearBtn.addEventListener('click', resetApp);
  if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeColors);
  if (newSearchBtn) newSearchBtn.addEventListener('click', resetApp);

  // ---- File Handling ----
  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) { alert('Please select an image file'); return; }

    const reader = new FileReader();
    reader.onload = e => {
      state.uploadedImage = e.target.result;
      displayPreview();
    };
    reader.readAsDataURL(file);
  }

  function displayPreview() {
    if (!previewImage) return;
    previewImage.src = state.uploadedImage;
    safeHide(uploadSection);
    safeShow(previewSection);
    safeHide(resultsSection);
    previewImage.onload = extractDominantColors;
  }

  function extractDominantColors() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const maxSize = 200;
    let width = previewImage.width;
    let height = previewImage.height;
    if (width > height && width > maxSize) { height *= maxSize / width; width = maxSize; }
    else if (height > maxSize) { width *= maxSize / height; height = maxSize; }

    canvas.width = width; canvas.height = height;
    ctx.drawImage(previewImage, 0, 0, width, height);

    const pixels = ctx.getImageData(0, 0, width, height).data;
    const colorMap = {};
    for (let i = 0; i < pixels.length; i += 20) {
      const [r, g, b, a] = [pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]];
      if (a < 125) continue;
      const qr = Math.round(r/10)*10, qg = Math.round(g/10)*10, qb = Math.round(b/10)*10;
      const key = `${qr},${qg},${qb}`;
      colorMap[key] = (colorMap[key] || 0) + 1;
    }
    const sortedColors = Object.entries(colorMap)
      .sort((a,b)=>b[1]-a[1])
      .slice(0,6)
      .map(([color]) => {
        const [r,g,b] = color.split(',').map(Number);
        return {r,g,b};
      });

    state.dominantColors = filterSimilarColors(sortedColors).slice(0,5);
    displayDominantColors();
  }

  function filterSimilarColors(colors) {
    const filtered = [colors[0]];
    for (let i=1;i<colors.length;i++){
      let isDifferent = true;
      for (let j=0;j<filtered.length;j++){
        const d = colorDistance(colors[i],filtered[j]);
        if (d<50){isDifferent=false;break;}
      }
      if(isDifferent) filtered.push(colors[i]);
    }
    return filtered;
  }

  const colorDistance = (c1,c2) =>
    Math.sqrt((c1.r-c2.r)**2+(c1.g-c2.g)**2+(c1.b-c2.b)**2);

  function displayDominantColors() {
    safeClear(colorChips);
    state.dominantColors.forEach(c=>{
      const hex = rgbToHex(c.r,c.g,c.b);
      const chip = document.createElement('div');
      chip.className='color-chip';
      chip.style.backgroundColor=hex;
      chip.title=hex;
      colorChips.appendChild(chip);
    });
  }

  function analyzeColors() {
    const btnText = analyzeBtn?.querySelector('.btn-text');
    const loader = analyzeBtn?.querySelector('.loader');
    btnText?.classList.add('hidden');
    loader?.classList.remove('hidden');
    analyzeBtn.disabled = true;
    setTimeout(()=>{
      generateMatchingColors();
      safeHide(previewSection);
      safeShow(resultsSection);
      btnText?.classList.remove('hidden');
      loader?.classList.add('hidden');
      analyzeBtn.disabled=false;
      resultsSection?.scrollIntoView({behavior:'smooth'});
    },1000);
  }

  function generateMatchingColors() {
    const base = state.dominantColors[0];
    if (!base) return;
    const hsv = rgbToHsv(base.r,base.g,base.b);

    state.matchingColors.complementary = [
      hsvToRgb((hsv.h+180)%360,hsv.s,hsv.v),
      hsvToRgb((hsv.h+180)%360,Math.max(hsv.s-0.2,0.2),hsv.v),
      hsvToRgb((hsv.h+180)%360,Math.min(hsv.s+0.2,1),hsv.v*0.8)
    ];
    state.matchingColors.analogous = [
      hsvToRgb((hsv.h+30)%360,hsv.s,hsv.v),
      hsvToRgb((hsv.h-30+360)%360,hsv.s,hsv.v),
      hsvToRgb((hsv.h+60)%360,hsv.s*0.8,hsv.v),
      hsvToRgb((hsv.h-60+360)%360,hsv.s*0.8,hsv.v)
    ];
    state.matchingColors.contrasting = [
      hsvToRgb((hsv.h+150)%360,hsv.s,hsv.v),
      hsvToRgb((hsv.h+210)%360,hsv.s,hsv.v),
      hsvToRgb((hsv.h+180)%360,Math.max(hsv.s*0.9,0.2),hsv.v*0.85)
    ];
    state.matchingColors.neutral = [
      {r:255,g:255,b:255},{r:240,g:240,b:240},{r:160,g:160,b:160},
      {r:80,g:80,b:80},{r:30,g:30,b:30},{r:0,g:0,b:0}
    ];
    displayMatchingColors();
  }

  function displayMatchingColors() {
    ['complementaryColors','analogousColors','contrastingColors','neutralColors']
      .forEach(id=>{
        const grid=document.getElementById(id);
        if(!grid) return;
        safeClear(grid);
        const arr = state.matchingColors[id.replace('Colors','')];
        if(!arr) return;
        arr.forEach(color=>{
          const hex = rgbToHex(color.r,color.g,color.b);
          const card=document.createElement('div');
          card.className='color-card';
          card.innerHTML=`
            <div class="color-swatch" style="background:${hex}"></div>
            <div class="color-hex">${hex}</div>`;
          card.addEventListener('click',()=>copyToClipboard(hex));
          grid.appendChild(card);
        });
      });
    mountCategoryStars();
  }

  function resetApp() {
    state.uploadedImage=null;
    state.dominantColors=[];
    state.matchingColors={};
    if(fileInput) fileInput.value='';
    safeShow(uploadSection);
    safeHide(previewSection);
    safeHide(resultsSection);
  }
}

// ---------- Color Utils ----------
function rgbToHex(r,g,b){
  return '#'+[r,g,b].map(x=>{
    const hex=Math.round(x).toString(16);
    return hex.length===1?'0'+hex:hex;
  }).join('');
}

function rgbToHsv(r,g,b){
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  const d=max-min;
  let h=0,s=max===0?0:d/max,v=max;
  if(d!==0){
    if(max===r) h=(g-b)/d+(g<b?6:0);
    else if(max===g) h=(b-r)/d+2;
    else h=(r-g)/d+4;
    h/=6;
  }
  return {h:h*360,s,v};
}

function hsvToRgb(h,s,v){
  h/=360;
  const i=Math.floor(h*6);
  const f=h*6-i;
  const p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);
  const arr=[
    [v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]
  ][i%6];
  return {r:Math.round(arr[0]*255),g:Math.round(arr[1]*255),b:Math.round(arr[2]*255)};
}

// ---------- Auth & Account Logic ----------
const ACCOUNTS_KEY='matchify_accounts';
const CURRENT_USER_KEY='matchify_current_user';

function loadAccounts(){ try{return JSON.parse(localStorage.getItem(ACCOUNTS_KEY))||{};}catch{return{};} }
function saveAccounts(db){ localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(db)); }
function setCurrentUser(username){
  state.currentUser=username;
  if(username) localStorage.setItem(CURRENT_USER_KEY,username);
  else localStorage.removeItem(CURRENT_USER_KEY);
  updateAuthUI();
  renderSavedPalettes();
}
function getCurrentUser(){ return state.currentUser||localStorage.getItem(CURRENT_USER_KEY)||null; }

// Auth Modal Logic (guarded)
if (authForm) {
  let authMode='login';
  const openAuth=(mode='login')=>{
    authMode=mode;
    authTitle.textContent=mode==='login'?'Log in':'Sign up';
    authSwitchText.textContent=mode==='login'?"Don't have an account?":"Already have an account?";
    authSwitchBtn.textContent=mode==='login'?'Sign up':'Log in';
    authUsername.value=''; authPassword.value='';
    safeShow(authModal); safeShow(modalOverlay);
  };
  const closeAuth=()=>{ safeHide(authModal); safeHide(modalOverlay); };

  function updateAuthUI(){
    const user=getCurrentUser();
    if(user){
      if(userGreeting){ userGreeting.textContent=`Hello, ${user}!`; safeShow(userGreeting); }
      safeShow(logoutBtn); safeHide(loginOpenBtn); safeHide(signupOpenBtn); safeShow(savedSection);
    } else {
      safeHide(userGreeting); safeHide(logoutBtn); safeShow(loginOpenBtn); safeShow(signupOpenBtn); safeHide(savedSection);
    }
  }

  authForm.addEventListener('submit',e=>{
    e.preventDefault();
    const u=authUsername.value.trim(),p=authPassword.value;
    if(!u||!p) return;
    const db=loadAccounts();
    if(authMode==='signup'){
      if(db[u]) return showToast('Username exists.');
      db[u]={password:p,palettes:[]}; saveAccounts(db);
      setCurrentUser(u); showToast('Account created.');
    } else {
      if(!db[u]||db[u].password!==p) return showToast('Invalid credentials.');
      setCurrentUser(u); showToast('Logged in.');
    }
    closeAuth();
  });

  authSwitchBtn.addEventListener('click',()=>openAuth(authMode==='login'?'signup':'login'));
  authCancelBtn.addEventListener('click',closeAuth);
  loginOpenBtn?.addEventListener('click',()=>openAuth('login'));
  signupOpenBtn?.addEventListener('click',()=>openAuth('signup'));
  logoutBtn?.addEventListener('click',()=>{setCurrentUser(null);showToast('Logged out.');});
  setCurrentUser(getCurrentUser());
}

// ---------- Palette Saving ----------
function renderSavedPalettes(){
  if(!savedGrid) return;
  safeClear(savedGrid);
  const user=getCurrentUser(); if(!user) return;
  const db=loadAccounts(); const palettes=db[user]?.palettes||[];
  palettes.forEach(p=>{
    const card=document.createElement('div');
    card.className='palette-card';
    card.innerHTML=`
      <div class="palette-row"><div class="palette-swatch" style="background:${p.base}"></div></div>
      <div class="palette-meta"><span>${new Date(p.createdAt).toLocaleString()}</span></div>`;
    savedGrid.appendChild(card);
  });
}

// ---------- UI Enhancements ----------
function showToast(msg){
  const toast=document.createElement('div');
  toast.textContent=msg;
  toast.style.cssText=`position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
  background:#1f2937;color:#fff;padding:12px 24px;border-radius:8px;z-index:1000;`;
  document.body.appendChild(toast);
  setTimeout(()=>toast.remove(),2000);
}

// ---------- Hamburger Menu ----------
const hamburgerBtn=$('hamburgerBtn'),menuPanel=$('menuPanel'),menuOverlay=$('menuOverlay');
if(hamburgerBtn&&menuPanel){
  const openMenu=()=>{menuPanel.classList.add('open');menuOverlay?.classList.remove('hidden');hamburgerBtn.classList.add('is-open');};
  const closeMenu=()=>{menuPanel.classList.remove('open');menuOverlay?.classList.add('hidden');hamburgerBtn.classList.remove('is-open');};
  hamburgerBtn.addEventListener('click',()=>menuPanel.classList.contains('open')?closeMenu():openMenu());
  menuOverlay?.addEventListener('click',closeMenu);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuPanel.classList.contains('open'))closeMenu();});
  menuPanel.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
}

// ---------- Scroll Reveal ----------
(function initScrollReveal(){
  const revealables=[...document.querySelectorAll('.reveal,[data-reveal],.reveal-stagger')];
  if(!('IntersectionObserver'in window)||!revealables.length){
    revealables.forEach(el=>el.classList.add('in-view'));return;
  }
  const io=new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('in-view');obs.unobserve(entry.target);}
    });
  },{threshold:0.12});
  revealables.forEach((el,i)=>{
    if(!el.style.getPropertyValue('--reveal-delay'))
      el.style.setProperty('--reveal-delay',`${(i%6)*70}ms`);
    io.observe(el);
  });
})();
