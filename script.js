// App State
const state = {
   uploadedImage: null,
   dominantColors: [],
   matchingColors: {}
};

state.currentUser = null;

const loginOpenBtn = document.getElementById('loginOpenBtn');
const signupOpenBtn = document.getElementById('signupOpenBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userGreeting = document.getElementById('userGreeting');

const authModal = document.getElementById('authModal');
const modalOverlay = document.getElementById('modalOverlay');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');
const authCancelBtn = document.getElementById('authCancelBtn');
const authSwitchBtn = document.getElementById('authSwitchBtn');
const authSwitchText = document.getElementById('authSwitchText');

const saveMatchesBtn = document.getElementById('saveMatchesBtn');
const savedSection = document.getElementById('savedSection');
const savedGrid = document.getElementById('savedGrid');


// DOM Elements
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const resultsSection = document.getElementById('resultsSection');
const previewImage = document.getElementById('previewImage');
const clearBtn = document.getElementById('clearBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const newSearchBtn = document.getElementById('newSearchBtn');
const colorChips = document.getElementById('colorChips');


// Event Listeners
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
clearBtn.addEventListener('click', resetApp);
analyzeBtn.addEventListener('click', analyzeColors);
newSearchBtn.addEventListener('click', resetApp);


// Handle file selection
function handleFileSelect(event) {
   const file = event.target.files[0];
   if (!file) return;


   if (!file.type.match('image.*')) {
       alert('Please select an image file');
       return;
   }


   const reader = new FileReader();
   reader.onload = (e) => {
       state.uploadedImage = e.target.result;
       displayPreview();
   };
   reader.readAsDataURL(file);
}


// Display image preview and extract colors
function displayPreview() {
   previewImage.src = state.uploadedImage;
   uploadSection.classList.add('hidden');
   previewSection.classList.remove('hidden');
   resultsSection.classList.add('hidden');


   // Wait for image to load, then extract colors
   previewImage.onload = () => {
       extractDominantColors();
   };
}


// Extract dominant colors from image
function extractDominantColors() {
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');
  
   // Resize image for faster processing
   const maxSize = 200;
   let width = previewImage.width;
   let height = previewImage.height;
  
   if (width > height) {
       if (width > maxSize) {
           height *= maxSize / width;
           width = maxSize;
       }
   } else {
       if (height > maxSize) {
           width *= maxSize / height;
           height = maxSize;
       }
   }
  
   canvas.width = width;
   canvas.height = height;
   ctx.drawImage(previewImage, 0, 0, width, height);
  
   const imageData = ctx.getImageData(0, 0, width, height);
   const pixels = imageData.data;
  
   // Sample pixels (every 5th pixel for performance)
   const colorMap = {};
   for (let i = 0; i < pixels.length; i += 20) {
       const r = pixels[i];
       const g = pixels[i + 1];
       const b = pixels[i + 2];
       const a = pixels[i + 3];
      
       // Skip transparent pixels
       if (a < 125) continue;
      
       // Quantize colors to reduce variations
       const qr = Math.round(r / 10) * 10;
       const qg = Math.round(g / 10) * 10;
       const qb = Math.round(b / 10) * 10;
      
       const key = `${qr},${qg},${qb}`;
       colorMap[key] = (colorMap[key] || 0) + 1;
   }
  
   // Sort by frequency and get top colors
   const sortedColors = Object.entries(colorMap)
       .sort((a, b) => b[1] - a[1])
       .slice(0, 6)
       .map(([color]) => {
           const [r, g, b] = color.split(',').map(Number);
           return { r, g, b };
       });
  
   // Filter out very similar colors
   state.dominantColors = filterSimilarColors(sortedColors).slice(0, 5);
   displayDominantColors();
}


// Filter out similar colors
function filterSimilarColors(colors) {
   const filtered = [colors[0]];
  
   for (let i = 1; i < colors.length; i++) {
       let isDifferent = true;
       for (let j = 0; j < filtered.length; j++) {
           const distance = colorDistance(colors[i], filtered[j]);
           if (distance < 50) {
               isDifferent = false;
               break;
           }
       }
       if (isDifferent) {
           filtered.push(colors[i]);
       }
   }
  
   return filtered;
}


// Calculate color distance
function colorDistance(c1, c2) {
   return Math.sqrt(
       Math.pow(c1.r - c2.r, 2) +
       Math.pow(c1.g - c2.g, 2) +
       Math.pow(c1.b - c2.b, 2)
   );
}


// Display dominant colors
function displayDominantColors() {
   colorChips.innerHTML = '';
  
   state.dominantColors.forEach((color, index) => {
       const hex = rgbToHex(color.r, color.g, color.b);
       const chip = document.createElement('div');
       chip.className = 'color-chip';
       chip.style.backgroundColor = hex;
       chip.title = hex;
      
       colorChips.appendChild(chip);
   });
}


// Analyze colors and find matches
function analyzeColors() {
   const btnText = analyzeBtn.querySelector('.btn-text');
   const loader = analyzeBtn.querySelector('.loader');
  
   btnText.classList.add('hidden');
   loader.classList.remove('hidden');
   analyzeBtn.disabled = true;
  
   // Simulate processing time for better UX
   setTimeout(() => {
       generateMatchingColors();
      
       previewSection.classList.add('hidden');
       resultsSection.classList.remove('hidden');
      
       btnText.classList.remove('hidden');
       loader.classList.add('hidden');
       analyzeBtn.disabled = false;
      
       // Scroll to results
       resultsSection.scrollIntoView({ behavior: 'smooth' });
   }, 1000);
}


// Generate matching colors based on color theory
function generateMatchingColors() {
   const baseColor = state.dominantColors[0];
   const hsv = rgbToHsv(baseColor.r, baseColor.g, baseColor.b);
  
   // Complementary colors
   state.matchingColors.complementary = [
       hsvToRgb((hsv.h + 180) % 360, hsv.s, hsv.v),
       hsvToRgb((hsv.h + 180) % 360, Math.max(hsv.s - 0.2, 0.2), hsv.v),
       hsvToRgb((hsv.h + 180) % 360, Math.min(hsv.s + 0.2, 1), hsv.v * 0.8)
   ];
  
   // Analogous colors
   state.matchingColors.analogous = [
       hsvToRgb((hsv.h + 30) % 360, hsv.s, hsv.v),
       hsvToRgb((hsv.h - 30 + 360) % 360, hsv.s, hsv.v),
       hsvToRgb((hsv.h + 60) % 360, hsv.s * 0.8, hsv.v),
       hsvToRgb((hsv.h - 60 + 360) % 360, hsv.s * 0.8, hsv.v)
   ];


   // Contrasting colors (split-complementary)
   state.matchingColors.contrasting = [
   hsvToRgb((hsv.h + 150) % 360, hsv.s, hsv.v),
   hsvToRgb((hsv.h + 210) % 360, hsv.s, hsv.v),
   hsvToRgb((hsv.h + 180) % 360, Math.max(hsv.s * 0.9, 0.2), hsv.v * 0.85)
   ];
  
   // Neutral colors
   state.matchingColors.neutral = [
       { r: 255, g: 255, b: 255 }, // White
       { r: 240, g: 240, b: 240 }, // Light gray
       { r: 160, g: 160, b: 160 }, // Medium gray
       { r: 80, g: 80, b: 80 },    // Dark gray
       { r: 30, g: 30, b: 30 },    // Charcoal
       { r: 0, g: 0, b: 0 }        // Black
   ];
  
   displayMatchingColors();
}


// Display matching colors in the UI
function displayMatchingColors() {
   displayColorGrid('complementaryColors', state.matchingColors.complementary);
   displayColorGrid('analogousColors', state.matchingColors.analogous);
   displayColorGrid('contrastingColors', state.matchingColors.contrasting);
   displayColorGrid('neutralColors', state.matchingColors.neutral);
}


// Display a grid of colors
function displayColorGrid(containerId, colors) {
   const container = document.getElementById(containerId);
   container.innerHTML = '';
  
   colors.forEach(color => {
       const hex = rgbToHex(color.r, color.g, color.b);
       const colorName = getColorName(color);
      
       const card = document.createElement('div');
       card.className = 'color-card';
       card.innerHTML = `
           <div class="color-swatch" style="background-color: ${hex};"></div>
           <div class="color-name">${colorName}</div>
           <div class="color-hex">${hex}</div>
       `;
      
       card.addEventListener('click', () => {
           copyToClipboard(hex);
       });
      
       container.appendChild(card);
   });
}


// Get approximate color name
function getColorName(rgb) {
   const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
   const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  
   // Basic color names based on HSV
   if (hsv.s < 0.1) {
       if (hsv.v > 0.9) return 'White';
       if (hsv.v > 0.7) return 'Light Gray';
       if (hsv.v > 0.3) return 'Gray';
       if (hsv.v > 0.15) return 'Dark Gray';
       return 'Black';
   }
  
   const hue = hsv.h;
   if (hue < 15 || hue >= 345) return hsv.v > 0.5 ? 'Red' : 'Dark Red';
   if (hue < 45) return hsv.v > 0.6 ? 'Orange' : 'Brown';
   if (hue < 75) return hsv.v > 0.5 ? 'Yellow' : 'Olive';
   if (hue < 155) return hsv.v > 0.5 ? 'Green' : 'Dark Green';
   if (hue < 185) return hsv.v > 0.5 ? 'Cyan' : 'Teal';
   if (hue < 255) return hsv.v > 0.5 ? 'Blue' : 'Navy';
   if (hue < 285) return hsv.v > 0.5 ? 'Purple' : 'Violet';
   return hsv.v > 0.5 ? 'Magenta' : 'Maroon';
}


// Copy hex code to clipboard
function copyToClipboard(text) {
   if (navigator.clipboard) {
       navigator.clipboard.writeText(text).then(() => {
           showToast(`Copied ${text} to clipboard!`);
       });
   } else {
       // Fallback for older browsers
       const textarea = document.createElement('textarea');
       textarea.value = text;
       document.body.appendChild(textarea);
       textarea.select();
       document.execCommand('copy');
       document.body.removeChild(textarea);
       showToast(`Copied ${text} to clipboard!`);
   }
}


// Show toast notification
function showToast(message) {
   const toast = document.createElement('div');
   toast.style.cssText = `
       position: fixed;
       bottom: 20px;
       left: 50%;
       transform: translateX(-50%);
       background: #1f2937;
       color: white;
       padding: 12px 24px;
       border-radius: 8px;
       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
       z-index: 1000;
       animation: fadeIn 0.3s ease-in;
   `;
   toast.textContent = message;
   document.body.appendChild(toast);
  
   setTimeout(() => {
       toast.style.animation = 'fadeOut 0.3s ease-out';
       setTimeout(() => document.body.removeChild(toast), 300);
   }, 2000);
}


// Reset app
function resetApp() {
   state.uploadedImage = null;
   state.dominantColors = [];
   state.matchingColors = {};
  
   fileInput.value = '';
   uploadSection.classList.remove('hidden');
   previewSection.classList.add('hidden');
   resultsSection.classList.add('hidden');
  
   uploadSection.scrollIntoView({ behavior: 'smooth' });
}


// Color conversion utilities
function rgbToHex(r, g, b) {
   return '#' + [r, g, b].map(x => {
       const hex = Math.round(x).toString(16);
       return hex.length === 1 ? '0' + hex : hex;
   }).join('');
}


function rgbToHsv(r, g, b) {
   r /= 255;
   g /= 255;
   b /= 255;
  
   const max = Math.max(r, g, b);
   const min = Math.min(r, g, b);
   const delta = max - min;
  
   let h = 0;
   let s = max === 0 ? 0 : delta / max;
   let v = max;
  
   if (delta !== 0) {
       if (max === r) {
           h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
       } else if (max === g) {
           h = ((b - r) / delta + 2) / 6;
       } else {
           h = ((r - g) / delta + 4) / 6;
       }
   }
  
   return { h: h * 360, s: s, v: v };
}


function hsvToRgb(h, s, v) {
   h = h / 360;
  
   const i = Math.floor(h * 6);
   const f = h * 6 - i;
   const p = v * (1 - s);
   const q = v * (1 - f * s);
   const t = v * (1 - (1 - f) * s);
  
   let r, g, b;
  
   switch (i % 6) {
       case 0: r = v; g = t; b = p; break;
       case 1: r = q; g = v; b = p; break;
       case 2: r = p; g = v; b = t; break;
       case 3: r = p; g = q; b = v; break;
       case 4: r = t; g = p; b = v; break;
       case 5: r = v; g = p; b = q; break;
   }
  
   return {
       r: Math.round(r * 255),
       g: Math.round(g * 255),
       b: Math.round(b * 255)
   };
}

// --- Simple account storage (localStorage) ---
const ACCOUNTS_KEY = 'matchify_accounts';
const CURRENT_USER_KEY = 'matchify_current_user';

function loadAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {}; }
  catch { return {}; }
}
function saveAccounts(db) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(db));
}
function setCurrentUser(username) {
  state.currentUser = username;
  if (username) localStorage.setItem(CURRENT_USER_KEY, username);
  else localStorage.removeItem(CURRENT_USER_KEY);
  updateAuthUI();
  renderSavedPalettes();
}
function getCurrentUser() {
  return state.currentUser || localStorage.getItem(CURRENT_USER_KEY) || null;
}

// --- Auth modal handling ---
let authMode = 'login'; // 'login' | 'signup'
function openAuth(mode = 'login') {
  authMode = mode;
  authTitle.textContent = mode === 'login' ? 'Log in' : 'Sign up';
  authSwitchText.textContent = mode === 'login' ? "Don't have an account?" : "Already have an account?";
  authSwitchBtn.textContent = mode === 'login' ? 'Sign up' : 'Log in';
  authUsername.value = '';
  authPassword.value = '';
  authModal.classList.remove('hidden');
  modalOverlay.classList.remove('hidden');
}
function closeAuth() {
  authModal.classList.add('hidden');
  modalOverlay.classList.add('hidden');
}

function updateAuthUI() {
  const user = getCurrentUser();
  if (user) {
    userGreeting.textContent = `Hello, ${user}!`;
    userGreeting.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    loginOpenBtn.classList.add('hidden');
    signupOpenBtn.classList.add('hidden');
    savedSection.classList.remove('hidden');
  } else {
    userGreeting.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    loginOpenBtn.classList.remove('hidden');
    signupOpenBtn.classList.remove('hidden');
    // hide saved section if empty user
    savedSection.classList.add('hidden');
  }
}

// --- Signup / Login logic ---
authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = authUsername.value.trim();
  const pass = authPassword.value;
  if (!user || !pass) return;

  const db = loadAccounts();
  if (authMode === 'signup') {
    if (db[user]) { showToast('Username already exists.'); return; }
    db[user] = { password: pass, palettes: [] };
    saveAccounts(db);
    setCurrentUser(user);
    showToast('Account created. You are now logged in.');
  } else { // login
    if (!db[user] || db[user].password !== pass) { showToast('Invalid credentials.'); return; }
    setCurrentUser(user);
    showToast('Logged in.');
  }
  closeAuth();
});

authSwitchBtn.addEventListener('click', () => openAuth(authMode === 'login' ? 'signup' : 'login'));
authCancelBtn.addEventListener('click', closeAuth);
loginOpenBtn.addEventListener('click', () => openAuth('login'));
signupOpenBtn.addEventListener('click', () => openAuth('signup'));
logoutBtn.addEventListener('click', () => { setCurrentUser(null); showToast('Logged out.'); });

// Restore session on load
setCurrentUser(getCurrentUser());

// --- Palette saving ---
function currentPaletteToObject() {
  if (!state.dominantColors.length || !state.matchingColors || !state.matchingColors.complementary) return null;
  const toHexArr = (arr) => arr.map(c => rgbToHex(c.r, c.g, c.b));
  const baseHex = rgbToHex(state.dominantColors[0].r, state.dominantColors[0].g, state.dominantColors[0].b);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    createdAt: new Date().toISOString(),
    base: baseHex,
    complementary: toHexArr(state.matchingColors.complementary),
    analogous: toHexArr(state.matchingColors.analogous),
    triadic: toHexArr(state.matchingColors.triadic),
    neutral: toHexArr(state.matchingColors.neutral)
  };
}

function saveCurrentMatches(auto=false) {
  const user = getCurrentUser();
  if (!user) { if (!auto) showToast('Log in to save palettes.'); return; }
  const db = loadAccounts();
  if (!db[user]) return;
  const palette = currentPaletteToObject();
  if (!palette) return;
  db[user].palettes.unshift(palette);
  // keep last 50
  db[user].palettes = db[user].palettes.slice(0,50);
  saveAccounts(db);
  renderSavedPalettes();
  if (!auto) showToast('Palette saved!');
}

function renderSavedPalettes() {
  const user = getCurrentUser();
  savedGrid.innerHTML = '';
  if (!user) return;

  const db = loadAccounts();
  const palettes = (db[user]?.palettes) || [];
  if (!palettes.length) return;

  palettes.forEach(p => {
    const card = document.createElement('div');
    card.className = 'palette-card';
    card.innerHTML = `
      <div class="palette-row" title="Base">
        <div class="palette-swatch" style="background:${p.base}"></div>
      </div>
      <div class="palette-row" title="Complementary">
        ${p.complementary.map(h => `<div class="palette-swatch" style="background:${h}"></div>`).join('')}
      </div>
      <div class="palette-row" title="Analogous">
        ${p.analogous.map(h => `<div class="palette-swatch" style="background:${h}"></div>`).join('')}
      </div>
      <div class="palette-row" title="Triadic">
        ${p.triadic.map(h => `<div class="palette-swatch" style="background:${h}"></div>`).join('')}
      </div>
      <div class="palette-row" title="Neutral">
        ${p.neutral.map(h => `<div class="palette-swatch" style="background:${h}"></div>`).join('')}
      </div>
      <div class="palette-meta">
        <span>${new Date(p.createdAt).toLocaleString()}</span>
        <button class="palette-delete" data-id="${p.id}" aria-label="Delete palette">✕</button>
      </div>
    `;
    savedGrid.appendChild(card);
  });

  // delete handlers
  savedGrid.querySelectorAll('.palette-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const db2 = loadAccounts();
      db2[user].palettes = db2[user].palettes.filter(x => x.id !== id);
      saveAccounts(db2);
      renderSavedPalettes();
      showToast('Deleted.');
    });
  });
}

// Manual save button
if (saveMatchesBtn) {
  saveMatchesBtn.addEventListener('click', () => saveCurrentMatches(false));
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
   @keyframes fadeOut {
       from {
           opacity: 1;
           transform: translateX(-50%) translateY(0);
       }
       to {
           opacity: 0;
           transform: translateX(-50%) translateY(10px);
       }
   }
`;
document.head.appendChild(style);

// Auto-save if logged in
saveCurrentMatches(true);
if (getCurrentUser()) savedSection.classList.remove('hidden');

const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuPanel = document.getElementById('menuPanel');
const menuOverlay = document.getElementById('menuOverlay');

function openMenu() {
  menuPanel.classList.add('open');
  menuOverlay.classList.remove('hidden');
  hamburgerBtn.classList.add('is-open');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  menuPanel.setAttribute('aria-hidden', 'false');
}

function closeMenu() {
  menuPanel.classList.remove('open');
  menuOverlay.classList.add('hidden');
  hamburgerBtn.classList.remove('is-open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  menuPanel.setAttribute('aria-hidden', 'true');
}

hamburgerBtn?.addEventListener('click', () => {
  const isOpen = menuPanel.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
});

menuOverlay?.addEventListener('click', closeMenu);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuPanel.classList.contains('open')) closeMenu();
});

// close when a link is clicked
menuPanel?.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (a) closeMenu();
});
