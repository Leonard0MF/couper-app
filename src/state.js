import { DAY, MIN, KEY, sod, uid } from './utils.js';
import { svc, barber, overlaps } from './rules.js';
import mock from './data/mock.json';

export let S, ui = {mode:'cliente', tab:'inicio', ag:{sid:null, bid:null, day:null, t:null, note:''}, pday:null, busy:false};

/* ---------- dados de exemplo ----------
   Todo o conteúdo mockado fica em src/data/mock.json.
   Ao editar o JSON, o app percebe a mudança e recria os dados sozinho. */
const MOCK_VERSION = JSON.stringify(mock);
const clone = o => JSON.parse(JSON.stringify(o));

export function seed() {
  const m = clone(mock), ag = m.randomAgenda;
  let s = ag.seed; const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const now = Date.now();
  S = {
    shop:m.shop, services:m.services, barbers:m.barbers, styles:m.styles, plans:m.plans, rewards:m.rewards,
    photos:[], stylePhotos:{},
    me:{...m.me, sub:null},
    members:m.members.map((x, i) => ({...x, since:now - (12 + i * 17) * DAY})),
    bookings:[], txs:[], vouchers:[]};
  const today = sod(now), [minN, maxN] = ag.perBarberPerDay;
  const agSvcs = ag.services.map(svc).filter(Boolean);
  for (let i = -ag.daysBefore; i <= ag.daysAfter; i++) {
    const day = today + i * DAY, h = S.shop.hours[new Date(day).getDay()]; if (!h) continue;
    S.barbers.forEach(b => {
      const n = minN + Math.floor(rnd() * (maxN - minN + 1));
      for (let k = 0; k < n; k++) {
        const sv = agSvcs[Math.floor(rnd() * agSvcs.length)], start = day + h[0] * 36e5 + Math.floor(rnd() * ((h[1] - h[0]) * 4 - 4)) * 15 * MIN;
        if (start + sv.min * MIN > day + h[1] * 36e5 || overlaps(b.id, start, sv.min)) continue;
        S.bookings.push({id:uid(), who:ag.clients[Math.floor(rnd() * ag.clients.length)], me:false, sid:sv.id, bid:b.id, start, min:sv.min, status:start + sv.min * MIN < now ? 'concluido' : 'agendado', covered:false});
      }
    });
  }
  m.myHistory.forEach(({daysAgo, sid, bid}) => {
    const start = today - daysAgo * DAY + 15 * 36e5, sv = svc(sid);
    if (!sv || !barber(bid)) return console.warn('mock.json: myHistory com serviço/barbeiro inexistente', {sid, bid});
    const b = {id:uid(), who:S.me.name, me:true, sid, bid, start, min:sv.min, status:'concluido', covered:false};
    S.bookings.push(b); S.txs.push({at:start + sv.min * MIN, points:sv.pts, desc:sv.name + ' com ' + barber(bid).name});
  });
  S.mockVersion = MOCK_VERSION;
}

export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch (e) { return false; } }
export function load() {
  try {
    const r = localStorage.getItem(KEY);
    if (r) {
      const saved = JSON.parse(r);
      if (saved.mockVersion === MOCK_VERSION) { S = saved; return; }
      // mock.json mudou: recria os dados, mas mantém as fotos já enviadas
      seed(); S.photos = saved.photos || []; S.stylePhotos = saved.stylePhotos || {}; save(); return;
    }
  } catch (e) {}
  seed();
}
