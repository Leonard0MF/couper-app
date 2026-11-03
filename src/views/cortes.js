import { esc, CAM } from '../utils.js';
import { S } from '../state.js';
import { secT } from '../components.js';

export function cortes() {
  return `<div class="view">
    ${secT('Escolha seu', 'corte')}
    <p class="muted small" style="margin:-4px 0 14px">Gostou de algum? Toque em "Quero esse" e mostre a referência na hora do corte.</p>
    <div class="styles">${S.styles.map(st => { const ph = S.stylePhotos[st.id]; return `<div class="style"><div class="img">${ph ? `<img src="${ph}" alt="${esc(st.name)}">` : CAM + '<br>Foto do corte<br><span style="font-size:11px">feita na casa</span>'}</div><div class="tx"><h3>${esc(st.name)}</h3><div class="muted small">${esc(st.desc)}</div><button class="btn sm" data-act="want" data-v="${st.id}">Quero esse</button></div></div>`; }).join('')}</div>
  </div>`;
}
