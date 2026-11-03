import { esc, money, ddmm, LOGO } from '../utils.js';
import { S, ui } from '../state.js';
import { svc, plan, usage } from '../rules.js';
import { secT } from '../components.js';

export function clube() {
  const u = usage();
  if (ui.pick) {
    const p = plan(ui.pick);
    return `<div class="view">${secT('Assinar', p.name.replace('Clube ', ''))}
      <div class="card stack">
        <div class="row between"><h3>${esc(p.name)}</h3><span class="caps orange" style="font-size:26px">${money(p.price)}<span class="muted" style="font-size:14px">/mês</span></span></div>
        <ul class="small muted" style="margin:0;padding-left:18px">${p.perks.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <label class="f" for="payM">Forma de pagamento<select id="payM"><option>Cartão de crédito (recorrente)</option><option>Pix mensal</option></select></label>
        <p class="small dim" style="margin:0">Demonstração: nenhuma cobrança é feita. Na versão real, a renovação mensal é automática e o cancelamento vale ao fim do ciclo pago.</p>
        <button class="btn block" data-act="subscribe">Assinar por ${money(p.price)}/mês</button>
        <button class="btn ghost block" data-act="unpick">Voltar</button>
      </div></div>`;
  }
  if (u) {
    const p = u.p, sub = S.me.sub;
    const meter = (used, tot) => `<div class="meter">${Array.from({length:tot}, (_, i) => `<i class="${i < used ? 'on' : ''}"></i>`).join('')}</div>`;
    return `<div class="view">
      <div style="height:18px"></div>
      <div class="member stack">
        <div class="row between"><img src="${LOGO}" alt="Barbearia Couper"><span class="chip o">MEMBRO</span></div>
        <div><div class="script" style="font-size:34px;line-height:1">${esc(p.name)}</div><div class="muted small">${esc(S.me.name)} · desde ${ddmm(sub.since)}</div></div>
        ${p.cuts ? `<div class="stack" style="gap:6px"><div class="row between small"><span>Cortes</span><b class="num">${u.cuts} de ${p.cuts} usados</b></div>${meter(u.cuts, p.cuts)}</div>` : ''}
        ${p.beards ? `<div class="stack" style="gap:6px"><div class="row between small"><span>Barbas</span><b class="num">${u.beards} de ${p.beards} usadas</b></div>${meter(u.beards, p.beards)}</div>` : ''}
        <div class="small muted">${sub.status === 'cancelando' ? `Assinatura encerra em ${ddmm(u.c.end)}.` : `Renova em ${ddmm(u.c.end)} por ${money(p.price)}.`}</div>
      </div>
      <a class="btn block" href="#" data-act="tab" data-v="agendar" style="margin-top:14px">Usar meu Clube agora</a>
      ${secT('Seus', 'benefícios')}
      <div class="card"><ul class="small" style="margin:0;padding-left:18px;display:grid;gap:6px">${p.perks.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      ${secT('Plano')}
      <div class="stack">
        ${S.plans.filter(x => x.id !== p.id).map(x => `<button class="opt" data-act="change" data-v="${x.id}"><span><b>Mudar para ${esc(x.name)}</b><br><span class="muted small">${esc(x.perks[0])}</span></span><span class="p">${money(x.price)}</span></button>`).join('')}
        ${sub.status === 'cancelando' ? '<button class="btn ghost block" data-act="reactivate">Manter assinatura</button>' : '<button class="btn danger block" data-act="unsub">Cancelar assinatura</button>'}
      </div>
    </div>`;
  }
  return `<div class="view">
    <div class="club-hero"><div class="caps muted" style="font-size:18px">Assine o</div><div class="script">Clube Couper</div><p class="muted" style="margin:10px auto 0;max-width:34ch">Mensalidade fixa, cortes garantidos todo mês e prioridade na agenda. Ficou mais barato voltar sempre.</p></div>
    <div class="card row between small" style="margin:18px 0 22px"><span>4 cortes + 4 barbas avulsos</span><b class="num" style="text-decoration:line-through;opacity:.7">${money(svc('corte').price * 4 + svc('barba').price * 4)}</b><span>no Clube Completo</span><b class="num orange">${money(plan('completo').price)}</b></div>
    <div class="plans">${S.plans.map(p => `<div class="plan ${p.best ? 'best' : ''}">${p.best ? '<span class="badge">Mais escolhido</span>' : ''}
      <div class="caps" style="font-size:22px">${esc(p.name)}</div>
      <div class="price">${money(p.price).replace(',', '<small>,')}</small> <small>/mês</small></div>
      <ul>${p.perks.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <button class="btn ${p.best ? '' : 'ghost'}" data-act="pickPlan" data-v="${p.id}">Quero esse plano</button></div>`).join('')}</div>
    <p class="dim small" style="margin-top:16px">Créditos valem no mês do ciclo e não acumulam. Planos e valores são exemplos para a demonstração.</p>
  </div>`;
}
