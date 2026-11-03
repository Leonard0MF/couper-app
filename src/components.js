import { pad, esc, money, hm, WD } from './utils.js';
import { S } from './state.js';
import { svc, barber } from './rules.js';

/* ---------- UI ---------- */
export let tt;
export function toast(m, bad) { const el = document.getElementById('toast'); el.textContent = m; el.className = 'toast' + (bad ? ' bad' : ''); el.hidden = false; clearTimeout(tt); tt = setTimeout(() => el.hidden = true, 3600); }
export const secT = (title, script = '', link = '') => `<div class="sec-t"><h2>${title}${script ? `<span class="script">${script}</span>` : ''}</h2>${link}</div>`;
export const nextAppt = () => S.bookings.filter(b => b.me && b.status === 'agendado' && b.start > Date.now()).sort((a, b) => a.start - b.start);
export function apptHTML(b, actions = true) {
  const s = svc(b.sid), d = new Date(b.start);
  return `<div class="card appt"><div class="date"><span>${WD[d.getDay()]}</span><b>${pad(d.getDate())}</b></div><div style="flex:1;min-width:0"><h3>${esc(s.name)} · ${hm(b.start)}</h3><div class="muted small">com ${esc(barber(b.bid).name)} · ${b.covered ? '<span class="chip o">pelo Clube</span>' : money(s.price)}</div></div>${actions ? `<button class="btn sm ghost" data-act="cancel" data-v="${b.id}">Cancelar</button>` : ''}</div>`;
}

export function resizeImage(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 900 / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .74)); }; im.onerror = rej; im.src = fr.result; };
    fr.onerror = rej; fr.readAsDataURL(file);
  });
}
