// ================================
//  FitBuddy — app.js
//  All JavaScript for every page
// ================================

// ---------- RIPPLE EFFECT ----------
// This adds a cool click wave animation to every button
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.ripple');
  if (!btn) return;
  const wave = document.createElement('span');
  wave.className = 'ripple-wave';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  wave.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
  btn.appendChild(wave);
  setTimeout(() => wave.remove(), 600);
});

// ---------- TOAST NOTIFICATION ----------
// Shows a small popup message at the bottom of the screen
function showToast(msg, type = 'success') {
  const old = document.getElementById('fb-toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.id = 'fb-toast';
  t.style.cssText = `position:fixed;bottom:110px;left:50%;transform:translateX(-50%);
    background:${type==='error'?'#ef4444':'linear-gradient(135deg,#0ea27a,#0b8a68)'};
    color:#fff;padding:12px 22px;border-radius:999px;font-size:14px;
    font-family:'DM Sans',sans-serif;font-weight:500;z-index:999;
    box-shadow:0 4px 24px rgba(0,0,0,0.4);white-space:nowrap;
    animation:slideUp .3s ease`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(()=>t.remove(),300); }, 2500);
}

// ---------- HELPER: go to a page ----------
function go(page) { window.location.href = page; }

// ---------- HELPER: current time ----------
function getTime() {
  const n = new Date();
  let h = n.getHours(), m = String(n.getMinutes()).padStart(2,'0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

// ---------- HELPER: greeting ----------
function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

// ================================
//  LOGIN PAGE  (index.html)
// ================================
function doLogin() {
  const email = document.getElementById('loginEmail');
  const pass  = document.getElementById('loginPass');
  if (!email || !pass) { go('dashboard.html'); return; }
  if (!email.value.includes('@')) { showToast('Enter a valid email', 'error'); email.focus(); return; }
  if (pass.value.length < 6)      { showToast('Password too short', 'error');  pass.focus();  return; }
  showToast('Signing in... ✓');
  setTimeout(() => go('dashboard.html'), 900);
}

// ================================
//  REGISTER PAGE (register.html)
// ================================
let curStep = 1;

function goStep(to) {
  const from = curStep;
  document.getElementById('step-'+from).classList.remove('active');
  document.getElementById('c'+from).classList.remove('active');
  document.getElementById('l'+from).classList.remove('active');

  if (to > from) {
    document.getElementById('c'+from).classList.add('done');
    document.getElementById('c'+from).textContent = '✓';
    const ln = document.getElementById('ln'+from);
    if (ln) ln.classList.add('done');
  }

  curStep = to;
  document.getElementById('step-'+to).classList.add('active');
  document.getElementById('c'+to).classList.add('active');
  document.getElementById('l'+to).classList.add('active');

  const pct = to === 1 ? 33 : to === 2 ? 66 : 100;
  const pb = document.getElementById('progBar');
  if (pb) pb.style.width = pct + '%';
}

function pickLevel(el) {
  document.querySelectorAll('.lvl-opt').forEach(e => e.classList.remove('on'));
  el.classList.add('on');
}

function finish() {
  showToast('Account created! Welcome 🎉');
  setTimeout(() => go('dashboard.html'), 1000);
}

// ================================
//  DASHBOARD PAGE (dashboard.html)
// ================================
const greet = document.getElementById('greetTxt');
if (greet) greet.textContent = getGreeting() + ',';

// ================================
//  MATCHING PAGE (matching.html)
// ================================
function setFilter(el, val) {
  document.querySelectorAll('.filter-row .tag').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.mc').forEach(c => {
    c.style.display = (val === 'All' || c.innerText.toLowerCase().includes(val.toLowerCase())) ? 'block' : 'none';
  });
}

function filterCards(val) {
  document.querySelectorAll('.mc').forEach(c => {
    c.style.display = c.innerText.toLowerCase().includes(val.toLowerCase()) ? 'block' : 'none';
  });
}

// ================================
//  CHAT PAGE (chat.html)
// ================================
function sendMsg() {
  const inp = document.getElementById('msgInp');
  if (!inp) return;
  const txt = inp.value.trim();
  if (!txt) return;

  const msgs = document.getElementById('msgs');
  inp.value = '';

  // Add user message
  const m = document.createElement('div');
  m.className = 'msg sent';
  m.innerHTML = `<div class="bubble">${txt.replace(/</g,'&lt;')}</div><div class="msg-time">${getTime()}</div>`;
  msgs.appendChild(m);
  msgs.scrollTop = msgs.scrollHeight;

  // Show typing dots
  setTimeout(() => {
    const td = document.createElement('div');
    td.className = 'msg recv'; td.id = 'typing';
    td.innerHTML = `<div class="typing"><div class="td"></div><div class="td"></div><div class="td"></div></div>`;
    msgs.appendChild(td);
    msgs.scrollTop = msgs.scrollHeight;
  }, 600);

  // Auto reply
  const replies = ['Sounds great! 💪','See you there! 🏋️','Let\'s crush it 🔥','Perfect!','Roger that 👍','Can\'t wait 😄'];
  setTimeout(() => {
    const td = document.getElementById('typing');
    if (td) td.remove();
    const r = document.createElement('div');
    r.className = 'msg recv';
    r.innerHTML = `<div class="bubble">${replies[Math.floor(Math.random()*replies.length)]}</div><div class="msg-time">${getTime()}</div>`;
    msgs.appendChild(r);
    msgs.scrollTop = msgs.scrollHeight;
  }, 2000);
}

// Scroll chat to bottom on load
const msgsEl = document.getElementById('msgs');
if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight;

// ================================
//  PROGRESS PAGE (progress.html)
// ================================
function openModal()  { const o = document.getElementById('modalOv'); if(o) o.classList.add('open'); }
function closeModal(e){ const o = document.getElementById('modalOv'); if(o && (!e || e.target===o)) o.classList.remove('open'); }

function logSession() {
  const o = document.getElementById('modalOv');
  if (o) o.classList.remove('open');
  const list = document.getElementById('sessionList');
  if (!list) return;
  const el = document.createElement('div');
  el.className = 'si';
  el.style.animation = 'slideUp .3s ease';
  el.innerHTML = `<div class="si-icon">⚡</div><div style="flex:1"><div class="si-title">New Session</div><div class="si-meta">Just now</div></div><div class="si-dur">— min</div>`;
  list.prepend(el);
  showToast('Session logged! Keep it up 🔥');
}

// ================================
//  MAP PAGE (map.html)
// ================================
const tips = {
  jamie:{ name:'Jamie Lee', meta:'0.5 km away · Gym & Strength' },
  sara :{ name:'Sara M.',   meta:'0.8 km away · Running & Yoga' },
  ravi :{ name:'Ravi K.',   meta:'1.2 km away · Gym & Cardio'  }
};

function showTip(id, lPct, tPct) {
  const tip = document.getElementById('tip');
  const map = document.getElementById('mapArea');
  if (!tip || !map) return;
  const b = tips[id];
  document.getElementById('tipName').textContent = b.name;
  document.getElementById('tipMeta').textContent = b.meta;
  let l = (lPct/100)*map.offsetWidth;
  let t = (tPct/100)*map.offsetHeight;
  if (l+175 > map.offsetWidth)  l -= 175;
  if (t+130 > map.offsetHeight) t -= 130;
  tip.style.left = l+'px';
  tip.style.top  = t+'px';
  tip.classList.add('show');
}

const mapArea = document.getElementById('mapArea');
if (mapArea) {
  mapArea.addEventListener('click', e => {
    if (!e.target.closest('.bpin') && !e.target.closest('.tooltip')) {
      const tip = document.getElementById('tip');
      if (tip) tip.classList.remove('show');
    }
  });
}

console.log('FitBuddy app.js loaded ✓');
