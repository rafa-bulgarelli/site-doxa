// Uso: node .claude/tower/bin/mobile-shot.mjs <url> <largura-css> [saida.png]
//
// Por que existe: `chrome --headless --window-size=390,…` NÃO renderiza a 390px — o
// Chrome impõe largura mínima de janela (~500px) e o print sai recortado, parecendo
// overflow que não existe (custou uma rodada de gate no card 011). Este script fala
// DevTools Protocol pelo WebSocket nativo do Node (>= 22), emula o viewport de verdade
// (`Emulation.setDeviceMetricsOverride`, mobile: true), imprime `scrollWidth` vs
// `clientWidth` (iguais = sem rolagem horizontal) e os elementos que passam da borda,
// e opcionalmente salva um print full-page. Zero dependências.
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const [url, wArg, out] = process.argv.slice(2);
const width = Number(wArg);
const port = 9222 + Math.floor(Math.random() * 500);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`,
   `--user-data-dir=/tmp/claude-501/chrome-prof-${port}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 60 && !target; i++) {
  try { const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); target = list.find((t) => t.type === 'page'); }
  catch { await sleep(250); }
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const call = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: true });
await call('Page.enable');
await call('Page.navigate', { url });
await sleep(1500);
const m = await call('Runtime.evaluate', { returnByValue: true, expression: `JSON.stringify({
  scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth,
  bodyHeight: document.body.scrollHeight,
  overflowing: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
    .slice(0, 8).map(e => e.tagName + '.' + String(e.className || '').slice(0, 70) + ' right=' + Math.round(e.getBoundingClientRect().right))
})` });
const info = JSON.parse(m.result.result.value);
console.log(JSON.stringify(info, null, 1));
if (out) {
  const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.min(info.bodyHeight, 6000), scale: 1 } });
  writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
  console.log('print:', out);
}
ws.close(); chrome.kill();
