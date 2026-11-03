import logoUrl from './assets/logo.png';

export const LOGO = logoUrl;

export const DAY = 864e5, MIN = 6e4, KEY = 'couper-demo-v1';
export const pad = n => String(n).padStart(2, '0');
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const money = n => n.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
export const hm = t => { const d = new Date(t); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
export const ddmm = t => { const d = new Date(t); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1); };
export const sod = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
export const WD = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const WDL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
export const SCISSORS = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.6 7.6 20 18M8.6 16.4 20 6"/></svg>';
export const CAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
