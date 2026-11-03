import { ui, save } from './state.js';
import { toast } from './components.js';
import { inicio } from './views/inicio.js';
import { agendar } from './views/agendar.js';
import { cortes } from './views/cortes.js';
import { clube } from './views/clube.js';
import { pontos } from './views/pontos.js';
import { painel } from './views/painel.js';

/* ---------- render ---------- */
export function render() {
  document.querySelectorAll('.mode .seg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === ui.mode));
  document.getElementById('tabbar').hidden = ui.mode !== 'cliente';
  document.querySelectorAll('.tabbar button').forEach(b => b.setAttribute('aria-current', b.dataset.v === ui.tab));
  const views = {inicio, agendar, cortes, clube, pontos};
  document.getElementById('root').innerHTML = ui.mode === 'painel' ? painel() : `<main class="app">${views[ui.tab]()}</main>`;
}
export const commit = (msg, bad) => { if (!save()) msg = (msg ? msg + ' ' : '') + '(fotos grandes não couberam no armazenamento do navegador)'; render(); if (msg) toast(msg, bad); };
