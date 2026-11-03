import { DAY, pad, esc, money, hm, ddmm, sod, WD, WDL } from '../utils.js';
import { S, ui } from '../state.js';
import { svc, barber, coverage, slotsFor } from '../rules.js';
import { secT, nextAppt, apptHTML } from '../components.js';

export function agendar() {
  const a = ui.ag, s = a.sid && svc(a.sid), today = sod(Date.now());
  if (!a.day) { for (let i = 0; i < 14; i++) { const d = today + i * DAY; if (S.shop.hours[new Date(d).getDay()]) { a.day = d; break; } } }
  const days = Array.from({length:14}, (_, i) => today + i * DAY);
  const slots = s && a.bid ? slotsFor(a.bid, a.day, s.min) : [];
  const covered = s && coverage(a.sid, a.t || a.day + 12 * 36e5);
  const mine = nextAppt();
  return `<div class="view">
    ${mine.length ? secT('Seus', 'horários') + `<div class="stack">${mine.map(b => apptHTML(b)).join('')}</div>` : ''}
    ${secT('1 · Serviço')}
    <div class="opts">${S.services.map(x => { const cov = coverage(x.id); return `<button class="opt" data-act="pickS" data-v="${x.id}" aria-pressed="${a.sid === x.id}"><span><b>${esc(x.name)}</b><br><span class="muted small">${x.min} min${cov ? ' · <span class="orange">incluso no seu Clube</span>' : ''}</span></span><span class="p">${cov ? '<span class="chip o">Clube</span>' : money(x.price)}</span></button>`; }).join('')}</div>
    ${a.note ? `<p class="small muted" style="margin:8px 0 0">Referência: <b class="orange">${esc(a.note)}</b> <button class="link" data-act="clearNote" style="background:none;border:0;color:var(--dim);text-decoration:underline;cursor:pointer;font-size:12px">tirar</button></p>` : ''}
    ${secT('2 · Barbeiro')}
    <div class="barbers">${S.barbers.map(b => `<button class="barber" data-act="pickB" data-v="${b.id}" aria-pressed="${a.bid === b.id}"><div class="avatar">${b.name[0]}</div><b>${esc(b.name)}</b><div class="dim" style="font-size:11.5px;line-height:1.3;margin-top:2px">${esc(b.role)}</div></button>`).join('')}</div>
    ${secT('3 · Dia')}
    <div class="days">${days.map(d => { const dd = new Date(d), open = !!S.shop.hours[dd.getDay()]; return `<button class="day" data-act="pickD" data-v="${d}" aria-pressed="${a.day === d}" ${open ? '' : 'disabled'}><span>${i18nDay(d, today)}</span><b>${pad(dd.getDate())}</b><span>${open ? ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][dd.getMonth()] : 'fechado'}</span></button>`; }).join('')}</div>
    ${secT('4 · Horário')}
    ${!s || !a.bid ? '<p class="muted small" style="margin:0">Escolha o serviço e o barbeiro para ver os horários livres.</p>' : slots.length ? `<div class="slots">${slots.map(t => `<button class="slot" data-act="pickT" data-v="${t}" aria-pressed="${a.t === t}">${hm(t)}</button>`).join('')}</div>` : `<p class="muted small" style="margin:0">${esc(barber(a.bid).name)} não tem horário livre nesse dia. Tente outro dia ou outro barbeiro.</p>`}
    ${s && a.bid && a.t ? `<div class="summary" style="margin-top:18px">
      <div class="row between"><span class="caps" style="font-size:18px">Confirmar</span>${covered ? '<span class="chip o">Usa 1 crédito do Clube</span>' : ''}</div>
      <div><h3>${esc(s.name)} com ${esc(barber(a.bid).name)}</h3><div class="muted small">${WDL[new Date(a.t).getDay()]}, ${ddmm(a.t)} às ${hm(a.t)} · ${s.min} min · ${covered ? 'incluso no Clube' : money(s.price) + ' no local'}</div></div>
      <button class="btn block" data-act="book">Confirmar agendamento</button>
      <div class="dim small">Cancelamento grátis até 2 h antes. ${covered ? 'Se cancelar, o crédito volta para o Clube.' : ''}</div>
    </div>` : ''}
  </div>`;
}
export function i18nDay(d, today) { return d === today ? 'Hoje' : d === today + DAY ? 'Amanhã' : WD[new Date(d).getDay()]; }
