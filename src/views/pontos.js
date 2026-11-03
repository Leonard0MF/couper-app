import { esc, ddmm, SCISSORS, LOGO } from '../utils.js';
import { S } from '../state.js';
import { balance } from '../rules.js';
import { secT } from '../components.js';

export function pontos() {
  const bal = balance(), rws = S.rewards.slice().sort((a, b) => a.cost - b.cost), next = rws.find(r => r.cost > bal);
  let stamps = '';
  if (next) { const n = 10, per = next.cost / n, on = Math.min(n, Math.floor(bal / per)); stamps = `<div class="row between small"><span class="muted">Rumo a: <b style="color:var(--cream)">${esc(next.name)}</b></span><b class="num">${bal}/${next.cost}</b></div><div class="stamps">${Array.from({length:n}, (_, i) => `<div class="stamp ${i < on ? 'on' : ''}">${i < on ? SCISSORS : ''}</div>`).join('')}</div><div class="small muted">Cada carimbo vale ${per} pts. Faltam ${next.cost - bal} pts.</div>`; }
  const vs = S.vouchers.filter(v => v.status === 'ativo');
  return `<div class="view">
    <div style="height:18px"></div>
    <div class="punch">
      <div class="row between" style="align-items:flex-end"><div><div class="caps muted" style="font-size:16px">Cartão fidelidade</div><div class="big">${bal}<span class="caps" style="font-size:22px;margin-left:6px">pts</span></div></div><img src="${LOGO}" alt="" style="width:110px"></div>
      ${stamps}
    </div>
    ${vs.length ? secT('Seus', 'vales') + `<div class="stack">${vs.map(v => `<div class="voucher"><div><b>${esc(v.name)}</b><div class="dim small">Mostre o código no balcão</div></div><div class="code">${v.code}</div></div>`).join('')}</div>` : ''}
    ${secT('Trocar', 'pontos')}
    <div class="card" style="padding-top:4px;padding-bottom:4px">${rws.map((r, i) => `<div class="reward" style="${i ? '' : 'border-top:0'}"><div><b>${esc(r.name)}</b><div class="muted small num">${r.cost} pts</div></div><button class="btn sm ${bal >= r.cost ? '' : 'ghost'}" data-act="redeem" data-v="${r.id}" ${bal < r.cost ? 'disabled' : ''}>Trocar</button></div>`).join('')}</div>
    ${secT('Como', 'ganhar')}
    <div class="card small"><div style="display:grid;grid-template-columns:1fr auto;gap:6px 14px">${S.services.map(x => `<span>${esc(x.name)}</span><b class="num orange">+${x.pts}</b>`).join('')}</div><p class="dim" style="margin:10px 0 0">Membros do Clube Corte e Completo ganham em dobro nos serviços pagos. Pontos valem por 6 meses.</p></div>
    ${secT('Extrato')}
    <div class="ledger">${S.txs.slice().sort((a, b) => b.at - a.at).slice(0, 12).map(t => `<div class="li"><span>${esc(t.desc)}<br><span class="dim small">${ddmm(t.at)}</span></span><b class="${t.points >= 0 ? 'pos' : 'neg'}">${t.points > 0 ? '+' : ''}${t.points}</b></div>`).join('') || '<p class="dim small">Sem movimentações.</p>'}</div>
  </div>`;
}
