// ── Constants ──
const MAX = 200;
const WARN_THRESHOLD = 20; // show warning when ≤ 20 chars remain
const CIRCUMFERENCE = 2 * Math.PI * 18; // SVG circle r=18 → ~113.1

// ── Element References ──
const area        = document.getElementById('msgArea');
const counterMain = document.getElementById('counterMain');
const counterSub  = document.getElementById('counterSub');
const ringFill    = document.getElementById('ringFill');
const ringPct     = document.getElementById('ringPct');
const warnBanner  = document.getElementById('warnBanner');
const dangerBanner= document.getElementById('dangerBanner');
const warnRem     = document.getElementById('warnRemaining');
const watermark   = document.getElementById('watermarkNum');
const clearBtn    = document.getElementById('clearBtn');
const sendBtn     = document.getElementById('sendBtn');
const toast       = document.getElementById('toast');

// ── Update UI on every input ──
function update() {
  const len       = area.value.length;
  const remaining = MAX - len;
  const pct       = Math.min(len / MAX, 1);

  // Counter text
  counterMain.textContent = `${len} / ${MAX}`;
  counterSub.textContent  = remaining === 0
    ? 'No characters remaining'
    : `${remaining} character${remaining !== 1 ? 's' : ''} remaining`;

  // Countdown watermark
  watermark.textContent = remaining;

  // Progress ring
  ringFill.style.strokeDashoffset = CIRCUMFERENCE * (1 - pct);
  ringPct.textContent = Math.round(pct * 100) + '%';

  // Body state classes
  document.body.classList.toggle('warn-mode',   remaining > 0 && remaining <= WARN_THRESHOLD);
  document.body.classList.toggle('danger-mode', remaining === 0);

  // Warning / danger banners
  warnBanner.classList.toggle('show',    remaining > 0 && remaining <= WARN_THRESHOLD);
  dangerBanner.classList.toggle('show',  remaining === 0);
  if (remaining > 0 && remaining <= WARN_THRESHOLD) {
    warnRem.textContent = remaining;
  }

  // Enforce hard limit (belt-and-suspenders alongside maxlength attr)
  if (len > MAX) area.value = area.value.slice(0, MAX);

  // Send button state
  sendBtn.disabled = len === 0;
}

// ── Event Listeners ──
area.addEventListener('input', update);

clearBtn.addEventListener('click', () => {
  area.value = '';
  update();
  area.focus();
});

sendBtn.addEventListener('click', () => {
  if (!area.value.trim()) return;
  // Show success toast, then reset
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    area.value = '';
    update();
  }, 2200);
});

// ── Initialise ──
update();