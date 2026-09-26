// ============================================================
// ASTRE — Coming Soon
// Vanilla JS: countdown timer + notify form (no backend)
// ============================================================

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------- Countdown ----------------
   Set your real launch date/time below (local time).
   Format: new Date('YYYY-MM-DDTHH:MM:SS')
*/
const LAUNCH_DATE = new Date('2026-12-25T00:00:00');

const els = {
  days:  document.getElementById('cd-days'),
  hours: document.getElementById('cd-hours'),
  mins:  document.getElementById('cd-mins'),
  secs:  document.getElementById('cd-secs'),
};

function pad(n){ return String(n).padStart(2, '0'); }

function updateCountdown(){
  const now = new Date();
  let diff = LAUNCH_DATE - now;

  if (diff <= 0){
    els.days.textContent = '00';
    els.hours.textContent = '00';
    els.mins.textContent = '00';
    els.secs.textContent = '00';
    return;
  }

  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= day * (1000 * 60 * 60 * 24);
  const hour = Math.floor(diff / (1000 * 60 * 60));
  diff -= hour * (1000 * 60 * 60);
  const min = Math.floor(diff / (1000 * 60));
  diff -= min * (1000 * 60);
  const sec = Math.floor(diff / 1000);

  els.days.textContent  = pad(day);
  els.hours.textContent = pad(hour);
  els.mins.textContent  = pad(min);
  els.secs.textContent  = pad(sec);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------------- Notify form ----------------
   Static site — no backend. Stores the email locally
   and shows a confirmation message. Swap the TODO block
   for a real request to your email/CRM provider when ready.
*/
const form = document.getElementById('notify-form');
const note = document.getElementById('form-note');

form.addEventListener('submit', function (e){
  e.preventDefault();
  const emailInput = document.getElementById('email');
  const email = emailInput.value.trim();

  if (!email || !emailInput.checkValidity()){
    note.textContent = 'Please enter a valid email address.';
    note.classList.remove('success');
    return;
  }

  // TODO: replace with a real request to your email provider
  // (e.g. Mailchimp, Klaviyo, Formspree, a serverless function, etc.)
  try {
    const saved = JSON.parse(localStorage.getItem('astre_notify_list') || '[]');
    saved.push({ email, date: new Date().toISOString() });
    localStorage.setItem('astre_notify_list', JSON.stringify(saved));
  } catch (err) {
    /* localStorage unavailable — safe to ignore */
  }

  form.classList.add('success');
  note.textContent = "You're on the list. Thank you.";
  note.classList.add('success');
  emailInput.value = '';
});
