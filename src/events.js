import { KEY, hm, WD, uid } from './utils.js';
import { S, ui, seed, save } from './state.js';
import { svc, barber, plan, balance, book, conclude } from './rules.js';
import { toast, resizeImage } from './components.js';
import { render, commit } from './render.js';

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, v = el.dataset.v;
  if (el.tagName === 'A') e.preventDefault();
  if (a === 'mode') { ui.mode = v; render(); scrollTo(0, 0); }
  else if (a === 'tab') { ui.tab = v; ui.pick = null; render(); scrollTo(0, 0); }
  else if (a === 'reset') { try { localStorage.removeItem(KEY); } catch (_) {} seed(); save(); ui.ag = {sid:null, bid:null, day:null, t:null, note:''}; ui.pick = null; render(); toast('Demonstração reiniciada.'); }
  else if (a === 'pickS') { ui.ag.sid = v; ui.ag.t = null; render(); }
  else if (a === 'pickB') { ui.ag.bid = v; ui.ag.t = null; render(); }
  else if (a === 'pickD') { ui.ag.day = +v; ui.ag.t = null; render(); }
  else if (a === 'pickT') { ui.ag.t = +v; render(); document.querySelector('.summary')?.scrollIntoView({behavior:'smooth', block:'center'}); }
  else if (a === 'clearNote') { ui.ag.note = ''; render(); }
  else if (a === 'book') { if (ui.busy) return; ui.busy = true; const r = book(); ui.busy = false; if (r.err) return toast(r.err, true); const b = r.b; ui.ag = {sid:null, bid:null, day:null, t:null, note:''}; commit(`Marcado: ${svc(b.sid).name} ${WD[new Date(b.start).getDay()]} às ${hm(b.start)} com ${barber(b.bid).name}.`); scrollTo(0, 0); }
  else if (a === 'cancel') { const b = S.bookings.find(x => x.id === v); if (b.start - Date.now() < 2 * 36e5) return toast('Faltam menos de 2 h. Para cancelar, fale com a barbearia.', true); b.status = 'cancelado'; commit(b.covered ? 'Horário cancelado. O crédito voltou para o seu Clube.' : 'Horário cancelado.'); }
  else if (a === 'want') { const st = S.styles.find(x => x.id === v); ui.ag.sid = st.sid; ui.ag.note = st.name; ui.ag.t = null; ui.tab = 'agendar'; render(); scrollTo(0, 0); toast(`Referência "${st.name}" anexada ao agendamento.`); }
  else if (a === 'pickPlan') { ui.pick = v; render(); scrollTo(0, 0); }
  else if (a === 'unpick') { ui.pick = null; render(); }
  else if (a === 'subscribe') { S.me.sub = {planId:ui.pick, since:Date.now(), status:'ativa'}; const p = plan(ui.pick); ui.pick = null; commit(`Bem-vindo ao ${p.name}! Seus créditos já estão disponíveis.`); scrollTo(0, 0); }
  else if (a === 'change') { S.me.sub.planId = v; commit(`Plano alterado para ${plan(v).name}.`); }
  else if (a === 'unsub') { S.me.sub.status = 'cancelando'; commit('Assinatura cancelada. Os créditos valem até o fim do ciclo.'); }
  else if (a === 'reactivate') { S.me.sub.status = 'ativa'; commit('Assinatura mantida.'); }
  else if (a === 'redeem') {
    const r = S.rewards.find(x => x.id === v); if (balance() < r.cost) return toast('Pontos insuficientes.', true);
    const code = Array.from({length:5}, () => 'ACDEFGHJKMNPRTUVWXY34679'[Math.floor(Math.random() * 24)]).join('');
    S.txs.push({at:Date.now(), points:-r.cost, desc:'Troca: ' + r.name}); S.vouchers.push({id:uid(), name:r.name, code, status:'ativo', at:Date.now()});
    commit(`Vale gerado: ${code}. Mostre no balcão.`);
  }
  else if (a === 'pday') { ui.pday = +v; render(); }
  else if (a === 'done') { const p = conclude(v); commit(p ? `Concluído. ${p} pontos para o cliente.` : 'Atendimento concluído.'); }
  else if (a === 'miss') { const b = S.bookings.find(x => x.id === v); b.status = 'faltou'; commit('Marcado como falta.'); }
  else if (a === 'vcode') {
    const c = document.getElementById('vcode').value.trim().toUpperCase(), vo = S.vouchers.find(x => x.code === c);
    if (!vo) return toast('Código não encontrado.', true);
    if (vo.status !== 'ativo') return toast('Esse vale já foi usado.', true);
    vo.status = 'usado'; vo.usedAt = Date.now(); commit(`Vale liberado: ${vo.name}.`);
  }
  else if (a === 'saveAddr') { S.shop.address = document.getElementById('addr').value.trim() || S.shop.address; S.shop.city = document.getElementById('city').value.trim(); commit('Endereço atualizado.'); }
  else if (a === 'delPhoto') { e.preventDefault(); S.photos.splice(+v, 1); commit('Foto removida.'); }
});
document.addEventListener('change', async e => {
  const t = e.target;
  try {
    if (t.id === 'upShop' && t.files.length) { for (const f of t.files) S.photos.push(await resizeImage(f)); commit(`${t.files.length} foto(s) adicionada(s).`); }
    else if (t.dataset.style && t.files.length) { S.stylePhotos[t.dataset.style] = await resizeImage(t.files[0]); commit('Foto do corte atualizada.'); }
  } catch (_) { toast('Não consegui abrir essa imagem.', true); }
});
