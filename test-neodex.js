// lancé par le test « local » de NeoDex : la vérification interne (fusion, chocs, gelés, gâtés), une partie à la souris et au clavier,
// la fusion animée, les fruits spéciaux, la manette, le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('coCanvas').__co, co = T.st(), CO = T.CO, FRUITS = T.FRUITS; ${code} })()`);
  const key = (k, type = 'keydown') => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('coCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'compote-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  await pj(`document.getElementById('coNew').click(), 0`); await sleep(200); await shot('0-depart');
  // quelques fruits lâchés au clavier, en visant à gauche puis à droite
  await key(' '); await sleep(100);
  for (const [k, n] of [['ArrowLeft', 300], ['ArrowRight', 600], ['ArrowLeft', 150]]) { await key(k); await sleep(n); await key(k, 'keyup'); await key(' '); await sleep(650); }
  const n1 = await C('return co.fruits.length + "|" + co.mode;'); if (!/^[1-9]\d*\|play$/.test(n1)) throw new Error('les fruits devaient tomber : ' + n1);
  // une fusion mise en scène : deux pommes qui se touchent, des fruits spéciaux posés à côté
  await C(`co.fruits = []; const R = l => FRUITS[l][1];
    co.fruits.push({x: 60, y: 250, vx: 0, vy: 0, l: 4, r: R(4), age: 80}, {x: 60 + R(4) * 2 - 2, y: 250, vx: 0, vy: 0, l: 4, r: R(4), age: 80},
      {x: 160, y: 260, vx: 0, vy: 0, l: 2, r: R(2), age: 80, ice: 600}, {x: 186, y: 262, vx: 0, vy: 0, l: 1, r: R(1), age: 80, rot: 900}, {x: 130, y: 262, vx: 0, vy: 0, l: 3, r: R(3), age: 80}); return 0;`);
  await sleep(140); await shot('1-fusion');
  const pear = await C('return co.fruits.some(f => f.l === 5) && co.juice.length > 0;'); if (!pear) throw new Error('deux pommes devaient donner une poire, avec du jus');
  await sleep(500); await shot('2-speciaux');
  const spec = await C('return co.fruits.filter(f => f.ice || f.rot).length;'); if (spec !== 2) throw new Error('le gelé et le gâté devaient rester : ' + spec);
  // la manette : la croix vise, A lâche, Start met en pause
  await pj(`(() => { const pad = {axes: [0, 0], buttons: Array.from({length: 17}, () => ({pressed: false}))}; window.__pad = pad; navigator.getGamepads = () => [pad]; return 0; })()`);
  const a0 = await C('return co.aim;');
  await pj(`(__pad.buttons[15].pressed = true, 0)`); await sleep(300); await pj(`(__pad.buttons[15].pressed = false, 0)`);
  const a1 = await C('return co.aim;'); if (!(a1 > a0 + 10)) throw new Error('la croix ne vise pas : ' + a0 + ' → ' + a1);
  const f0 = await C('return co.drops;'); await C('co.cool = 0; return 0;');
  await pj(`(__pad.buttons[0].pressed = true, 0)`); await sleep(120); await pj(`(__pad.buttons[0].pressed = false, 0)`); await sleep(120);
  if (await C('return co.drops;') !== f0 + 1) throw new Error('A ne lâche pas le fruit');
  await pj(`(__pad.buttons[9].pressed = true, 0)`); await sleep(120); await pj(`(__pad.buttons[9].pressed = false, 0)`); await sleep(120);
  if (await C('return co.mode;') !== 'pause') throw new Error('Start ne met pas en pause');
  await pj(`navigator.getGamepads = () => [], 0`);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.getElementById('coFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('coCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('coCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('coCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 380) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'vérification ok · fruits lâchés · fusion pomme + pomme · gelé et gâté · manette · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
