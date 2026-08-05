import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Prototipo } from './proto/Prototipo';
import './index.css';

/**
 * A única amarra entre o site e a pasta `proto/`, e ela é uma linha de
 * propósito: quando a decisão do dono estiver tomada, some esta condição e a
 * pasta, e não sobra rastro. Não há roteador no projeto — o `/empresas` funciona
 * porque o Vite devolve o mesmo HTML para qualquer caminho.
 */
const ehPrototipo = window.location.pathname.startsWith('/proto');

createRoot(document.getElementById('root')!).render(
  <StrictMode>{ehPrototipo ? <Prototipo /> : <App />}</StrictMode>,
);
