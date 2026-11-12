// Resumable picture render: every frame to out/frames/f_00000.jpg, skipping frames already on disk, so a crash or a power cut
// costs only the frames in flight. build.sh encodes the folder afterwards.
// LIB=<library> node tools/frames.mjs [--fps 30] [--workers 2] [--q 'n=10']
import fs from 'fs';
import path from 'path';
const LIB = process.env.LIB || process.env.HOME + '/lemo-opuscar';
const { openDemo, closeServer, glLost } = await import(LIB + '/core/render/page.mjs');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = +arg('--fps', 30), WK = +arg('--workers', 2), Q = arg('--q', '');
const dir = decodeURIComponent(new URL('..', import.meta.url).pathname).replace(/\/$/, '');
const out = path.join(dir, 'out/frames'); fs.mkdirSync(out, { recursive: true });
const name = f => path.join(out, `f_${String(f).padStart(5, '0')}.jpg`);
const probe = await openDemo(dir, { q: Q }); const DUR = await probe.page.evaluate(() => window.DUR); await probe.browser.close();
const TOTAL = Math.round(DUR * FPS), todo = [...Array(TOTAL).keys()].filter(f => !(fs.existsSync(name(f)) && fs.statSync(name(f)).size > 0));
console.log(`${TOTAL} frames, ${TOTAL - todo.length} already on disk, ${todo.length} to render`);
const t0 = Date.now(); let n = 0;
await Promise.all([...Array(WK)].map(async (_, w) => {
  const mine = todo.filter((_, i) => i % WK === w); if (!mine.length) return;
  const { browser, page } = await openDemo(dir, { q: Q }); page.setDefaultTimeout(300000);
  for (const f of mine) {
    await page.evaluate(t => window.render(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    fs.writeFileSync(name(f) + '.tmp', buf); fs.renameSync(name(f) + '.tmp', name(f));   // a frame on disk is always whole
    if (++n % 30 === 0) { const s = (Date.now() - t0) / 1000; console.log(`${n}/${todo.length}  ${s.toFixed(0)}s  eta ${((todo.length - n) * s / n / 60).toFixed(0)} min`);
      const lost = await glLost(page); if (lost) { console.error('WebGL context lost: ' + lost); process.exit(1); } }
  }
  await browser.close();
}));
closeServer(); console.log('done', TOTAL, 'frames');
