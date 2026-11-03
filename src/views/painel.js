import { DAY, pad, esc, money, hm, sod, LOGO } from '../utils.js';
import { S, ui } from '../state.js';
import { svc, plan } from '../rules.js';
import { i18nDay } from './agendar.js';

/* ---------- painel da barbearia ---------- */
export function painel() {
  if (!ui.pday) ui.pday = sod(Date.now());
  const day = ui.pday, today = sod(Date.now());
  const dayB = S.bookings.filter(b => b.start >= day && b.start < day + DAY && b.status !== 'cancelado').sort((a, b) => a.start - b.start);
  const members = S.members.concat(S.me.sub ? [{name:S.me.name + ' (você)', planId:S.me.sub.planId, since:S.me.sub.since}] : []);
  const mrr = members.reduce((a, m) => a + plan(m.planId).price, 0);
  const todays = S.bookings.filter(b => b.start >= today && b.start < today + DAY && b.status !== 'cancelado');
  const fat = todays.filter(b => b.status === 'concluido' && !b.covered).reduce((a, b) => a + svc(b.sid).price, 0);
  const days = Array.from({length:8}, (_, i) => today + (i - 1) * DAY);
  return `<div class="panel view">
    <div class="panel-head"><img src="${LOGO}" alt="Barbearia Couper"><div><div class="caps muted" style="font-size:16px">Painel da barbearia</div><div class="small dim">Visão do dono e dos barbeiros</div></div></div>
    <div class="kpis">
      <div class="kpi"><div class="l">Hoje</div><div class="v">${todays.length}</div><div class="d">horários marcados</div></div>
      <div class="kpi"><div class="l">Caixa de hoje</div><div class="v">${money(fat).replace('R$', '').trim()}</div><div class="d">serviços avulsos concluídos (R$)</div></div>
      <div class="kpi"><div class="l">Membros do Clube</div><div class="v">${members.length}</div><div class="d">assinaturas ativas</div></div>
      <div class="kpi"><div class="l">Receita recorrente</div><div class="v">${money(mrr).replace('R$', '').trim()}</div><div class="d">por mês, em R$</div></div>
    </div>
    <div class="pgrid">
      <div class="card">
        <div class="row between" style="margin-bottom:10px"><h3 class="ptitle" style="margin:0">Agenda</h3>
          <div class="days" style="padding:0">${days.map(d => `<button class="day" style="width:54px;padding:4px 0" data-act="pday" data-v="${d}" aria-pressed="${d === day}" ${S.shop.hours[new Date(d).getDay()] ? '' : 'disabled'}><span>${i18nDay(d, today)}</span><b style="font-size:20px">${pad(new Date(d).getDate())}</b></button>`).join('')}</div></div>
        ${S.shop.hours[new Date(day).getDay()] ? `<div class="cols">${S.barbers.map(br => { const list = dayB.filter(b => b.bid === br.id); return `<div class="ag"><div class="row" style="gap:8px"><div class="avatar" style="width:30px;height:30px;font-size:15px;margin:0">${br.name[0]}</div><b>${esc(br.name)}</b><span class="dim small">${list.length}</span></div>${list.map(b => `<div class="it ${b.status === 'concluido' ? 'done' : b.status === 'faltou' ? 'miss' : ''} ${b.me ? 'me' : ''}"><div class="row between"><b class="num">${hm(b.start)}</b>${b.covered ? '<span class="chip o">Clube</span>' : ''}${b.status === 'concluido' ? '<span class="chip g">feito</span>' : b.status === 'faltou' ? '<span class="chip b">faltou</span>' : ''}</div>${esc(b.who)} · ${esc(svc(b.sid).name)}${b.note ? `<div class="dim small">ref.: ${esc(b.note)}</div>` : ''}${b.status === 'agendado' ? `<div class="row" style="margin-top:6px;gap:6px"><button class="btn sm" data-act="done" data-v="${b.id}">Concluir</button><button class="btn sm ghost" data-act="miss" data-v="${b.id}">Faltou</button></div>` : ''}</div>`).join('') || '<div class="dim small">Livre o dia todo</div>'}</div>`; }).join('')}</div>` : '<p class="dim">Fechado neste dia.</p>'}
      </div>
      <div class="stack">
        <div class="card stack"><h3 class="ptitle" style="margin:0">Validar vale</h3><div class="row" style="flex-wrap:nowrap"><input id="vcode" placeholder="Código" maxlength="5" style="text-transform:uppercase;letter-spacing:.2em;font-weight:700"><button class="btn sm" data-act="vcode">Validar</button></div><div class="dim small">Troque pontos na aba Pontos (visão Cliente) para gerar um código.</div></div>
        <div class="card"><h3 class="ptitle">Membros do Clube</h3><div class="tbl"><table><tr><th>Cliente</th><th>Plano</th><th class="r">Mês</th></tr>${members.slice().reverse().map(m => `<tr><td>${esc(m.name)}</td><td>${esc(plan(m.planId).name.replace('Clube ', ''))}</td><td class="r">${money(plan(m.planId).price)}</td></tr>`).join('')}</table></div></div>
      </div>
    </div>
    <div class="card stack" style="margin-top:16px">
      <h3 class="ptitle" style="margin:0">Vitrine</h3>
      <p class="muted small" style="margin:0">O que aparece no app do cliente. As fotos ficam só neste navegador durante a demonstração.</p>
      <div class="row" style="align-items:flex-end"><label class="f" for="addr" style="flex:2;min-width:220px">Endereço<input id="addr" value="${esc(S.shop.address)}"></label><label class="f" for="city" style="flex:1;min-width:160px">Cidade<input id="city" value="${esc(S.shop.city)}"></label><button class="btn sm" data-act="saveAddr">Salvar</button></div>
      <div class="row between"><b>Fotos da barbearia</b><label class="btn sm filebtn">Adicionar fotos<input type="file" accept="image/*" multiple id="upShop"></label></div>
      <div class="upl">${S.photos.map((p, i) => `<div class="t"><img src="${p}" alt=""><button class="x" data-act="delPhoto" data-v="${i}">remover</button></div>`).join('') || '<div class="t">Nenhuma foto ainda</div>'}</div>
      <b>Fotos dos cortes</b>
      <div class="upl">${S.styles.map(st => `<label class="t filebtn" style="cursor:pointer">${S.stylePhotos[st.id] ? `<img src="${S.stylePhotos[st.id]}" alt="">` : ''}<span style="position:relative;z-index:1;${S.stylePhotos[st.id] ? 'background:rgba(0,0,0,.55);color:#fff;padding:2px 6px;border-radius:6px;align-self:end' : ''}">${esc(st.name)}</span><input type="file" accept="image/*" data-style="${st.id}"></label>`).join('')}</div>
    </div>
  </div>`;
}
