// Compote : Lâche des fruits dans la caisse : deux fruits pareils qui se touchent fusionnent en un plus gros. De la cerise à la citrouille, sans dépasser la ligne.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Compote</span><span class="hint">Souris ou ← → : viser · clic, espace ou ↓ : lâcher</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="coCanvas" width="216" height="288"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="coStats"></div></div>
      <div class="sysCard"><b>LES FRUITS</b><canvas id="coChain" width="232" height="48"></canvas></div>
      <div class="row"><button class="btn main" id="coNew">NOUVELLE PARTIE</button></div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2;min-width:320px;position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{max-width:460px;aspect-ratio:216/288}
#coChain{width:100%;image-rendering:pixelated;margin-top:8px}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: 'COMPOTE', T: { k: '#1a0610', k2: '#2a0c1a', fill: '#3a1424', fillOn: '#4e1c30', hl: '#5e2238', line: '#8a3450', acc: '#ff4a5a', accL: '#ffb0b8', accS: '#c02a3a', accD: '#4a0a14',
  rivet: '#ffe8ec', btn: '#5e2238', btnHi: '#9a4060', btnLo: '#2a0c1a', btnHov: '#742a46', btnHovHi: '#b85070', text: '#fff0f2', muted: '#e0a8b4', acc2: '#7ee07a', gold: '#ffd84a',
  orange: '#ffa030', red: '#ff4a5a', green: '#7ee07a', green2: '#2f8a3a', bg: '#1d0810', bgDot: '#3a1424', bgDot2: '#2a0c1a', spark: '#8a3450', spark2: '#ffd84a',
  tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................',
    '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................'] },
  emblem: ['......gg.....', '.....gg......', '....kkkkk....', '..kkrrrrrkk..', '.krrwrrrrrrk.', '.krwrrrrrrrk.', 'krrrkrrrkrrrk', 'krrrrrrrrrrrk', 'krrrrkkkrrrrk', '.krrrrrrrrrk.', '.kkrrrrrrrkk.', '...kkkkkkk...'],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown'], [/^LES FRUITS/, 'star']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

/* ---------- Compote : physique de disques (gravité, chocs, sous-pas), fusion des paires identiques ---------- */
const CO = {W: 216, H: 288, L: 14, R: 202, FLOOR: 276, LINE: 62, DROPY: 38};
// nom, rayon, couleur, ombre, reflet, détail
const FRUITS = [['cerise', 6, '#e8283c', '#9a0e22', '#ff9aa8', 'stem'], ['fraise', 8, '#ff4a5a', '#c02a3a', '#ffb0b8', 'seeds'], ['raisin', 10, '#9a5ae0', '#6a2aa8', '#d0b0ff', 'grape'],
  ['mandarine', 12, '#ffa030', '#d06a10', '#ffd8a0', 'dots'], ['pomme', 15, '#e83a3a', '#a81a2a', '#ffb0a8', 'leaf'], ['poire', 18, '#c8d840', '#8aa020', '#f0f8a8', 'leaf'],
  ['pêche', 21, '#ffb08a', '#e0785a', '#ffe0d0', 'cleft'], ['ananas', 24, '#ffd84a', '#c8a020', '#fff4a8', 'pine'], ['melon', 28, '#c8e86a', '#88b040', '#f0ffc0', 'net'],
  ['pastèque', 33, '#3aa84a', '#1a6a2a', '#8ae07a', 'stripes'], ['citrouille', 38, '#ff8a2a', '#c85a10', '#ffc890', 'ribs']];
const cos = gstore('compote', {games: 0, top: 0});
let co = null;
function coSprite(l) {  // chaque fruit dessiné pixel par pixel : contour, ombre en bas à droite, reflet, détail, petit visage
  const [, r, c, d, h, kind] = FRUITS[l], S = r * 2 + 2, cv = el('canvas'); cv.width = cv.height = S + 8; const g = cv.getContext('2d'), o = 4 + r + 1;
  const inside = (x, y, rr) => (x - o + .5) ** 2 + (y - o + .5) ** 2 <= rr * rr;
  for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) {
    if (!inside(x, y, r + 1)) continue;
    if (!inside(x, y, r)) { px(g, '#2a0a10', x, y); continue; }
    const dx = (x - o) / r, dy = (y - o) / r; let col = dx + dy > .9 ? d : c;
    if (kind === 'stripes' && Math.floor(dx * 3.6 + Math.sin(dy * 4) * .4 + 9) % 2) col = '#1a6a2a';
    if (kind === 'ribs' && Math.abs((dx * 3 + 6) % 2 - 1) < .18) col = d;
    if (kind === 'net' && ((x + y) % 6 === 0 || (x - y + 60) % 6 === 0)) col = '#f0ffc0';
    if (kind === 'pine' && ((x + y) % 5 === 0 || (x - y + 50) % 5 === 0)) col = d;
    if (kind === 'grape' && ((x % 6 === 0 && y % 2) || (y % 6 === 0 && x % 2))) col = d;
    if (kind === 'cleft' && Math.abs(dx + .15 - dy * .3) < .07) col = d;
    if ((dx + .4) ** 2 + (dy + .45) ** 2 < .06) col = h;
    px(g, col, x, y);
  }
  if (kind === 'seeds' || kind === 'dots') for (let i = 0; i < 9; i++) { const a = i * 2.4, rr = r * (.35 + (i % 3) * .18); px(g, kind === 'seeds' ? '#ffe86a' : d, Math.round(o + Math.cos(a) * rr), Math.round(o + Math.sin(a) * rr + 1)); }
  const top = o - r - 1;
  if (kind === 'stem') { px(g, '#2a0a10', o, top - 4, 1, 4); px(g, '#4fb85a', o + 1, top - 4, 2, 1); }
  if (kind === 'seeds') { px(g, '#2f8a3a', o - 3, top, 7, 2); px(g, '#4fb85a', o - 2, top - 1, 5, 1); }
  if (kind === 'leaf' || kind === 'ribs') { px(g, '#5a3010', o, top - 2, 2, 3); px(g, '#2f8a3a', o + 2, top - 2, 4, 2); px(g, '#4fb85a', o + 3, top - 3, 3, 1); }
  if (kind === 'pine') for (let i = -2; i <= 2; i++) { px(g, '#2f8a3a', o + i * 2, top - 3 + Math.abs(i), 1, 4 - Math.abs(i)); px(g, '#4fb85a', o + i * 2 + 1, top - 2 + Math.abs(i), 1, 3 - Math.abs(i)); }
  // visage : deux yeux et une bouche, à la taille du fruit
  const e = Math.max(1, Math.round(r / 9)), ex = Math.round(r * .32), ey = o + Math.round(r * .05);
  px(g, '#2a0a10', o - ex - e, ey, e, e * 2); px(g, '#2a0a10', o + ex, ey, e, e * 2); px(g, '#2a0a10', o - e, ey + e * 3, e * 2, e);
  if (r >= 10) { px(g, '#ff8aa0', o - ex - e * 3, ey + e * 2, e * 2, e); px(g, '#ff8aa0', o + ex + e, ey + e * 2, e * 2, e); }
  return cv;
}
const CO_SPR = FRUITS.map((f, i) => coSprite(i));
function coNew() {
  co = Object.assign(co || {tick: 0, raf: 0}, {seen: co ? co.tick : 0, mode: 'ready', fruits: [], aim: CO.W / 2, cur: coPick(), next: coPick(), cool: 0, score: 0, danger: 0, pops: [], top: 0, record: false, dead: 0});
}
function coPick() { return Math.floor(Math.random() * 5); }
let coac = null;
function coBeep(f, d, type = 'triangle', slide = 0) { try { coac ??= new AudioContext(); const o = coac.createOscillator(), g = coac.createGain(), t = coac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(.06, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(coac.destination); o.start(t); o.stop(t + d + .02); } catch {} }
function coDrop() {
  if (co.mode === 'ready') { co.mode = 'play'; cos.games++; saveGames(); }
  if (co.mode === 'pause') { co.mode = 'play'; return; }
  if (co.mode === 'over') { if (co.dead > 40) coNew(); return; }
  if (co.cool) return;
  const r = FRUITS[co.cur][1]; co.fruits.push({x: Math.max(CO.L + r, Math.min(CO.R - r, co.aim)), y: CO.DROPY, vx: 0, vy: 0, l: co.cur, r, age: 0});
  co.cur = co.next; co.next = coPick(); co.cool = 32; coBeep(300, .08);
}
function coStep() {  // un sous-pas de physique
  const F = co.fruits;
  for (const f of F) { f.vy += .09; f.vx *= .995; f.vy *= .995; f.x += f.vx; f.y += f.vy;
    if (f.x - f.r < CO.L) { f.x = CO.L + f.r; f.vx = Math.abs(f.vx) * .3; } if (f.x + f.r > CO.R) { f.x = CO.R - f.r; f.vx = -Math.abs(f.vx) * .3; }
    if (f.y + f.r > CO.FLOOR) { f.y = CO.FLOOR - f.r; f.vy = -Math.abs(f.vy) * .15; f.vx *= .92; } }
  for (let it = 0; it < 3; it++) for (let i = 0; i < F.length; i++) for (let j = i + 1; j < F.length; j++) {
    const a = F[i], b = F[j]; if (a.gone || b.gone) continue;
    const dx = b.x - a.x, dy = b.y - a.y, rr = a.r + b.r, d2 = dx * dx + dy * dy; if (d2 >= rr * rr) continue;
    if (a.l === b.l) { coMerge(a, b); continue; }
    const d = Math.sqrt(d2) || .01, nx = dx / d, ny = dy / d, over = rr - d, ma = a.r * a.r, mb = b.r * b.r, ka = mb / (ma + mb), kb = ma / (ma + mb);
    a.x -= nx * over * ka; a.y -= ny * over * ka; b.x += nx * over * kb; b.y += ny * over * kb;
    const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (rv < 0) { const imp = -1.15 * rv; a.vx -= nx * imp * ka; a.vy -= ny * imp * ka; b.vx += nx * imp * kb; b.vy += ny * imp * kb; }
  }
  if (F.some(f => f.gone)) co.fruits = F.filter(f => !f.gone);
}
function coMerge(a, b) {
  a.gone = b.gone = true; const x = (a.x + b.x) / 2, y = (a.y + b.y) / 2, l = a.l + 1;
  co.score += (l + 1) * (l + 2) / 2; co.pops.push({x, y, r: a.r, t: 0, l: Math.min(l, 10)});
  if (l >= FRUITS.length) { co.score += 100; coBeep(523, .5, 'square', 1046); return; }  // deux citrouilles : elles disparaissent
  const r = FRUITS[l][1]; co.fruits.push({x, y, vx: (a.vx + b.vx) / 2, vy: (a.vy + b.vy) / 2 - .6, l, r, age: 60});
  co.top = Math.max(co.top, l); coBeep(260 * 1.12 ** l, .14, 'triangle', 390 * 1.12 ** l);
}
function coUpdate() {
  if (co.mode === 'over') { co.dead++; return; }
  if (co.mode !== 'play') return;
  if (co.cool) co.cool--;
  if (coKeys.L) co.aim -= 2.2; if (coKeys.R) co.aim += 2.2;
  const r = FRUITS[co.cur][1]; co.aim = Math.max(CO.L + r, Math.min(CO.R - r, co.aim));
  for (let s = 0; s < 3; s++) coStep();
  for (const f of co.fruits) f.age++;
  for (const p of co.pops) p.t++; co.pops = co.pops.filter(p => p.t < 14);
  const high = co.fruits.some(f => f.age > 70 && f.y - f.r < CO.LINE && Math.abs(f.vy) < .6);
  co.danger = high ? co.danger + 1 : Math.max(0, co.danger - 2);
  if (co.danger > 120) { co.mode = 'over'; co.dead = 0; co.record = best('compote', co.score); cos.top = Math.max(cos.top, co.top); saveGames(); coInfo(); coBeep(200, .6, 'sawtooth', 50); }
}
function coDraw() {
  const g = co.g, {W, H, L, R, FLOOR, LINE} = CO;
  for (; co.seen < co.tick; co.seen++) if (co.mode !== 'play') coUpdate();
  // le mur du fond : papier peint à motifs, puis la caisse en bois
  px(g, '#3a1424', 0, 0, W, H);
  for (let y = 0; y < H; y += 12) for (let x = (y / 12 % 2) * 6; x < W; x += 12) { px(g, '#4a1c30', x + 2, y + 4, 2, 2); px(g, '#4a1c30', x + 4, y + 2, 2, 2); }
  px(g, '#5a3010', L - 6, LINE - 18, 6, FLOOR - LINE + 30); px(g, '#5a3010', R, LINE - 18, 6, FLOOR - LINE + 30); px(g, '#8a5420', L - 5, LINE - 18, 2, FLOOR - LINE + 30); px(g, '#8a5420', R + 1, LINE - 18, 2, FLOOR - LINE + 30);
  px(g, '#2a1408', L, LINE - 18, R - L, FLOOR - LINE + 18); px(g, '#341a0c', L, LINE - 18, R - L, 2);
  for (let y = LINE; y < FLOOR; y += 24) px(g, '#2f170a', L, y, R - L, 1);
  px(g, '#5a3010', L - 6, FLOOR, R - L + 12, H - FLOOR); px(g, '#8a5420', L - 6, FLOOR, R - L + 12, 2);
  // la ligne : pointillés, rouge clignotant quand ça déborde
  const warn = co.danger > 0 && Math.floor(co.tick / 6) % 2;
  for (let x = L; x < R; x += 6) px(g, warn ? '#ff4a5a' : '#8a3450', x, LINE, 3, 1);
  // la visée et le fruit à lâcher
  if (co.mode === 'play' || co.mode === 'ready') {
    const r = FRUITS[co.cur][1], x = Math.round(co.aim);
    for (let y = CO.DROPY + r + 4; y < FLOOR; y += 6) px(g, '#ffffff22', x, y, 1, 3);
    if (!co.cool) g.drawImage(CO_SPR[co.cur], x - r - 5, CO.DROPY - r - 5);
  }
  for (const f of co.fruits) g.drawImage(CO_SPR[f.l], Math.round(f.x - f.r - 5), Math.round(f.y - f.r - 5));
  for (const p of co.pops) { const rr = p.r + p.t * 1.5; g.strokeStyle = p.t % 4 < 2 ? '#ffffff' : FRUITS[Math.min(p.l, 10)][2]; g.lineWidth = 2; g.beginPath(); g.arc(Math.round(p.x), Math.round(p.y), rr, 0, 7); g.stroke(); }
  // score et fruit suivant
  pxFont(g, String(co.score), 6, 14, '#ffffff', 12);
  PXK.fill(g, 'SUIVANT', W - 34, 8, '#e0a8b4', PXK.scale(8), 'center'); const nr = FRUITS[co.next][1], sc = Math.min(1, 12 / nr);
  g.drawImage(CO_SPR[co.next], W - 34 - (nr + 5) * sc, 26 - (nr + 5) * sc, (nr * 2 + 10) * sc, (nr * 2 + 10) * sc);
  if (co.mode === 'ready') gameText(g, W, [['COMPOTE', '#ff4a5a', 16], ['Clic pour lâcher un fruit', '#ffffff'], ['Deux pareils = un plus gros', '#e0a8b4'], ['Record ' + (games.best.compote || 0), '#ffd84a']], 130);
  if (co.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Clic pour reprendre', '#e0a8b4']], 140);
  if (co.mode === 'over' && co.dead > 15) gameText(g, W, [['DÉBORDÉ !', '#ff4a5a', 14], ['Score ' + co.score, '#ffffff'], ['Plus gros fruit : ' + FRUITS[co.top][0], '#ffd84a'], [co.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.compote || 0), '#7ee07a'], [co.dead > 40 ? 'Clic pour rejouer' : '', '#e0a8b4']], 120);
}
function coInfo() {
  $('coStats').replaceChildren(...[['Meilleur score', games.best.compote || 0], ['Parties', cos.games], ['Plus gros fruit', FRUITS[cos.top][0]]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
  const c = $('coChain'), g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height); let x = 2;
  FRUITS.forEach(([, r], i) => { const s = Math.min(1, 9 / r), w = (r * 2 + 10) * s; g.globalAlpha = i <= cos.top + 1 ? 1 : .3; g.drawImage(CO_SPR[i], x, 24 - w / 2, w, w); x += w + 1; }); g.globalAlpha = 1;
}
const coKeys = {};
const cv = $('coCanvas');
const coX = e => { const b = cv.getBoundingClientRect(); return (e.clientX - b.left) / b.width * CO.W; };
cv.onpointermove = e => { if (co) co.aim = coX(e); };
cv.onpointerdown = e => { e.preventDefault(); if (!co) return; co.aim = coX(e); coDrop(); };
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !co || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); coKeys[e.key === 'ArrowLeft' ? 'L' : 'R'] = true; }
  if ((e.key === ' ' || e.key === 'ArrowDown' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); coDrop(); }
  if (e.key.toLowerCase() === 'p' && co.mode === 'play') co.mode = 'pause';
});
document.addEventListener('keyup', e => { if (e.key === 'ArrowLeft') coKeys.L = false; if (e.key === 'ArrowRight') coKeys.R = false; });
$('coNew').onclick = () => { coNew(); $('coNew').blur(); };
{  // vérification : deux cerises qui se touchent donnent une fraise ; deux fruits différents ne fusionnent pas et finissent posés sans se chevaucher
  const keep = co; co = null; coNew(); co.mode = 'play';
  co.fruits = [{x: 100, y: 200, vx: 0, vy: 0, l: 0, r: 6, age: 0}, {x: 108, y: 200, vx: 0, vy: 0, l: 0, r: 6, age: 0}]; coStep(); const merged = co.fruits.length === 1 && co.fruits[0].l === 1;
  co.fruits = [{x: 100, y: 200, vx: 0, vy: 0, l: 2, r: 10, age: 0}, {x: 104, y: 180, vx: 0, vy: 0, l: 4, r: 15, age: 0}]; for (let i = 0; i < 600; i++) coStep();
  const [a, b] = co.fruits, apart = Math.hypot(a.x - b.x, a.y - b.y) >= a.r + b.r - 1.5, rest = co.fruits.every(f => f.y + f.r <= CO.FLOOR + .01);
  console.assert(merged && apart && rest, 'compote', {merged, apart, rest});
  co = keep;
}
ctx.onOpen(() => {
  if (!co || !co.g) { coNew(); co.g = cv.getContext('2d'); }
  gameLoop(co, 'compote', coUpdate, coDraw); coInfo();
});
}
