import { pad, esc, hm, ddmm, WD, WDL, CAM, LOGO } from '../utils.js';
import { S } from '../state.js';
import { barber, balance, usage } from '../rules.js';
import { secT, nextAppt, apptHTML } from '../components.js';

export function inicio() {
  const nx = nextAppt()[0], u = usage(), bal = balance(), today = new Date().getDay();
  const photos = S.photos.length ? S.photos : [];
  const tiles = photos.length ? photos.slice(0, 5).map((p, i) => `<div class="ph ${i === 0 ? 'wide' : ''}"><img src="${p}" alt="Foto da Barbearia Couper"></div>`).join('')
    : `<div class="ph wide">${CAM}Fachada da barbearia<br><span class="dim">adicione em Barbearia › Vitrine</span></div><div class="ph">${CAM}Cadeiras</div><div class="ph">${CAM}Equipe</div>`;
  const maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(S.shop.name + ' ' + S.shop.address + ' ' + S.shop.city);
  return `<div class="view">
    <div class="hero"><img src="${LOGO}" alt="Barbearia Couper"><div class="tag">Corte, barba e acabamento. Agende pelo celular.</div></div>
    <a class="btn block" href="#" data-act="tab" data-v="agendar">Agendar horário</a>
    <div class="status" style="margin-top:12px">
      <button data-act="tab" data-v="agendar"><div class="v">${nx ? hm(nx.start) : '—'}</div><div class="l">${nx ? WD[new Date(nx.start).getDay()] + ' ' + ddmm(nx.start) + ' com ' + esc(barber(nx.bid).name) : 'Nenhum horário marcado'}</div></button>
      <button data-act="tab" data-v="clube"><div class="v">${u ? u.cutsLeft + u.beardsLeft : '—'}</div><div class="l">${u ? 'serviços do Clube no mês' : 'Conheça o Clube'}</div></button>
      <button data-act="tab" data-v="pontos"><div class="v">${bal}</div><div class="l">pontos no cartão</div></button>
    </div>
    ${nx ? secT('Seu próximo', 'horário') + apptHTML(nx) : ''}
    ${secT('A', 'casa')}<div class="gallery">${tiles}</div>
    ${secT('Nossa', 'equipe')}<div class="barbers">${S.barbers.map(b => `<div class="barber" style="cursor:default"><div class="avatar">${b.name[0]}</div><b>${esc(b.name)}</b><div class="dim" style="font-size:11.5px;line-height:1.3;margin-top:2px">${esc(b.role)}</div></div>`).join('')}</div>
    ${secT('Onde', 'estamos')}
    <div class="card place">
      <div><h3>${esc(S.shop.address)}</h3><div class="muted small">${esc(S.shop.city)}</div></div>
      <div class="hours">${[2, 3, 4, 5, 6, 0, 1].map(d => `<span class="${d === today ? 'today' : ''}">${WDL[d]}</span><span class="${d === today ? 'today' : 'muted'} num">${S.shop.hours[d] ? pad(S.shop.hours[d][0]) + ':00 – ' + pad(S.shop.hours[d][1]) + ':00' : 'Fechado'}</span>`).join('')}</div>
      <a class="btn ghost" href="${maps}" target="_blank" rel="noopener">Como chegar</a>
    </div>
  </div>`;
}
