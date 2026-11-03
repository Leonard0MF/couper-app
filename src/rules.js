import { MIN, uid } from './utils.js';
import { S, ui } from './state.js';

export const svc = id => S.services.find(s => s.id === id);
export const barber = id => S.barbers.find(b => b.id === id);
export const plan = id => S.plans.find(p => p.id === id);
export function overlaps(bid, start, min, ignore) {
  const end = start + min * MIN;
  return S.bookings.some(b => b.bid === bid && b.id !== ignore && b.status !== 'cancelado' && b.status !== 'faltou' && b.start < end && start < b.start + b.min * MIN);
}

/* ---------- regras ---------- */
export const balance = () => S.txs.reduce((a, t) => a + t.points, 0);
export function cycle(sub) { // ciclo mensal a partir da data de adesão
  let start = sub.since; const d = new Date(start); let n = 0;
  while (true) { const nx = new Date(d); nx.setMonth(d.getMonth() + n + 1); if (nx.getTime() > Date.now()) { const st = new Date(d); st.setMonth(d.getMonth() + n); return {start:st.getTime(), end:nx.getTime()}; } n++; }
}
export function usage() {
  const sub = S.me.sub; if (!sub) return null;
  const c = cycle(sub), p = plan(sub.planId);
  const used = S.bookings.filter(b => b.me && b.covered && b.status !== 'cancelado' && b.start >= c.start && b.start < c.end);
  const cuts = used.reduce((a, b) => a + svc(b.sid).cut, 0), beards = used.reduce((a, b) => a + svc(b.sid).beard, 0);
  return {p, c, cuts, beards, cutsLeft:p.cuts - cuts, beardsLeft:p.beards - beards};
}
export function coverage(sid, when) {
  const u = usage(), s = svc(sid); if (!u || (!s.cut && !s.beard)) return false;
  if (when && (when < u.c.start || when >= u.c.end)) return false;
  return u.cutsLeft >= s.cut && u.beardsLeft >= s.beard;
}
export function slotsFor(bid, day, min) {
  const h = S.shop.hours[new Date(day).getDay()]; if (!h) return [];
  const out = [], now = Date.now();
  for (let t = day + h[0] * 36e5; t + min * MIN <= day + h[1] * 36e5; t += 15 * MIN) {
    if (t <= now + 30 * MIN) continue;
    if (!overlaps(bid, t, min)) out.push(t);
  }
  return out;
}
export function book() {
  const a = ui.ag, s = svc(a.sid);
  if (!a.sid || !a.bid || !a.t) return {err:'Escolha serviço, barbeiro e horário.'};
  if (overlaps(a.bid, a.t, s.min)) return {err:'Esse horário acabou de ser ocupado. Escolha outro.'};
  if (S.bookings.some(b => b.me && b.status === 'agendado' && Math.abs(b.start - a.t) < 60 * MIN)) return {err:'Você já tem um horário muito próximo desse.'};
  const covered = coverage(a.sid, a.t);
  const b = {id:uid(), who:S.me.name, me:true, sid:a.sid, bid:a.bid, start:a.t, min:s.min, status:'agendado', covered, note:a.note};
  S.bookings.push(b); return {b};
}
export function conclude(id) {
  const b = S.bookings.find(x => x.id === id); if (!b || b.status !== 'agendado') return;
  b.status = 'concluido';
  if (b.me) {
    const s = svc(b.sid), u = usage(), dbl = !b.covered && u && u.p.double;
    const p = b.covered ? 0 : s.pts * (dbl ? 2 : 1);
    if (p) S.txs.push({at:Date.now(), points:p, desc:s.name + ' com ' + barber(b.bid).name + (dbl ? ' · pontos em dobro' : '')});
    return p;
  }
}
