"""Score for Back Online Today (LetsFixWP). 45 s, 120 BPM, a bar = 2 s from 0.0, one chord per bar.
0-6 s: the broken site, sparse vibraphone and marimba in B minor. 6-30 s: the team at work, a light D major bed (marimba figure,
plucked bass, soft kick, shaker, string pad), ducked under the voice. 30-34 s: subtraction, pad only, then near-silence 33.0-33.8.
34.0: the site comes back on the downbeat, the marimba theme with claps. 40.0: the title lands. Final D chord held to the end.
Run with the library's python:  LIB=<library> python -I audio/compose.py"""
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..'))
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, add, t_, env_exp

S.seed(23)
DUR = json.load(open(os.path.join(ROOT, 'vo/timeline.json')))['dur']
BAR = 2.0; BEAT = .5
CH = ['Bm', 'G', 'Bm', 'D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A', 'D', 'A', 'Bm', 'G', 'Em', 'A', 'D', 'G', 'A', 'D', 'D', 'D']
PAD = {'D': ['A3', 'D4', 'F#4'], 'G': ['G3', 'B3', 'D4'], 'A': ['A3', 'C#4', 'E4'], 'Bm': ['B3', 'D4', 'F#4'], 'Em': ['G3', 'B3', 'E4']}
ROOT_ = {'D': 'D2', 'G': 'G2', 'A': 'A2', 'Bm': 'B2', 'Em': 'E2'}
SPARSE = range(0, 3); FULL = list(range(3, 15)) + list(range(17, 21)); THIN = (15, 16)
HEAD = [(0, 'A5', .5), (.5, 'B5', .5), (1, 'D6', 1), (2, 'F#6', .5), (2.5, 'E6', .5), (3, 'D6', 1)]
MEL = {17: HEAD, 18: [(0, 'B5', 1), (1, 'D6', .5), (1.5, 'G6', .5), (2, 'F#6', 2)], 20: HEAD, 21: [(0, 'A6', 1), (1, 'F#6', 1), (2, 'D6', 2)]}
ev = []
def E(t, inst, p, d, v, pan=0., **kw): ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan, **kw))
for b, ch in enumerate(CH):
    t0 = b * BAR
    if t0 >= DUR: break
    if b in SPARSE:   # the broken site: a slow vibraphone chord and two marimba notes, minor
        for p in PAD[ch]: E(t0, 'vibraphone', S.name(S.midi(p) + 12), BAR, .2, -.1)
        tones = sorted(S.midi(p) + 12 for p in PAD[ch]); E(t0 + BEAT, 'marimba', S.name(tones[2]), .4, .32, .1); E(t0 + 3 * BEAT, 'marimba', S.name(tones[0]), .4, .26, .1)
        E(t0, 'contrabass', ROOT_[ch], BAR, .26, 0, attack=.3, release=.5)
        if b >= 1:
            for k in range(8): E(t0 + k * BEAT / 2, 'shaker', 'down' if k % 2 == 0 else 'up', None, .1 + (.04 if k % 2 == 0 else 0), .35)
        continue
    hold = DUR - t0 - .3 if b == 21 else BAR + .1
    if b == 22: break
    for i, p in enumerate(PAD[ch]): E(t0, 'violas' if i else 'cellos', p, hold, .24 if b not in THIN else .2, [-.3, 0, .3][i], attack=.35, release=.6)
    if b in THIN: continue
    if b in MEL:
        for (bt, n, d) in MEL[b]: E(t0 + bt * BEAT, 'marimba', n, max(.18, d * BEAT), .74, .05); (d >= 1.5) and E(t0 + bt * BEAT, 'vibraphone', n, d * BEAT, .3, -.1)
    elif b < 21:
        tones = sorted(S.midi(p) + 12 for p in PAD[ch])
        E(t0, 'marimba', S.name(tones[2]), .4, .42, .1); E(t0 + 2 * BEAT, 'marimba', S.name(tones[1]), .4, .36, .1); E(t0 + 3 * BEAT + BEAT / 2, 'marimba', S.name(tones[0]), .3, .3, .1)
    if b < 21:
        rt = ROOT_[ch]; E(t0, 'contrabass_pizz', rt, .45, .74, 0); E(t0 + 2 * BEAT, 'contrabass_pizz', rt, .4, .58, 0)
        for k in range(8): E(t0 + k * BEAT / 2, 'shaker', 'down' if k % 2 == 0 else 'up', None, .18 + (.06 if k % 2 == 0 else 0), .35)
    if 17 <= b < 21:
        for k in (1, 3): E(t0 + k * BEAT, 'claps', 'solo', None, .36, -.2)
# accents on the picture's hits
for k, t in enumerate((6.6, 6.725, 6.85)): E(t, 'glockenspiel', ['D6', 'F#6', 'A6'][k], .8, .3, -.2 + .2 * k)
E(19.0, 'timpani', 'D2', 1.0, .45, 0); E(19.0, 'cellos_pizz', 'D3', .4, .5)
E(28.25, 'glockenspiel', 'A6', 1.0, .3, .2)
E(34.0, 'timpani', 'D2', 1.6, .5, 0); E(34.0, 'sus_cymbal', 'hit', None, .22)
for p in ['D5', 'F#5', 'A5']: E(34.0, 'glockenspiel', p, 1.2, .3, 0)
E(40.0, 'sus_cymbal', 'hit', None, .2); E(40.0, 'timpani', 'D2', 1.2, .4)
for p in ['D4', 'F#4', 'A4', 'D5']: E(42.0, 'vibraphone', p, DUR - 42.3, .26, 0)
for p in ['D3', 'A3']: E(42.0, 'horn', p, DUR - 42.3, .24, 0, attack=.3, release=.5)
E(42.0, 'contrabass', 'D2', DUR - 42.3, .36, 0, attack=.2, release=.5)
mus = S.render(ev, dur=DUR)
def kick(v):
    d = .22; tt = t_(d); f = 62 + 70 * np.exp(-tt / .03)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .07) * v).astype(np.float32)
for b in FULL:
    for k in (0, 2): add(mus, kick(.36 if k == 0 else .26), b * BAR + k * BEAT, 1, 0)
for t in (19.0, 34.0, 40.0): add(mus, kick(.5), t, 1, 0)
mus = S.room(mus, size=.32, mix=.12)
# the held breath before the site comes back: the score drops to almost nothing 33.0-33.8, and returns on the downbeat
g = np.ones(len(mus)); a, b2, c = int(32.8 * SR), int(33.05 * SR), int(33.98 * SR)
g[a:b2] = np.linspace(1, .04, b2 - a); g[b2:c] = .04; mus *= g[:, None]
fade = int(.5 * SR); mus[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
mus *= .5 / max(1e-9, np.abs(mus).max())
os.makedirs(os.path.join(ROOT, 'music'), exist_ok=True)
sf.write(os.path.join(ROOT, 'music/score.wav'), mus[:int(DUR * SR)], SR, subtype='PCM_24')
har = [{'bar': b, 't0': b * BAR, 'chord': ch, 'notes': [S.midi(p) for p in PAD[ch]], 'root': S.midi(ROOT_[ch])} for b, ch in enumerate(CH)]
json.dump(har, open(os.path.join(ROOT, 'music/harmony.json'), 'w'))
print('score', mus.shape, 'peak', float(np.abs(mus).max()))
cr = S.credits(sorted({e['inst'] for e in ev})); cr = cr if isinstance(cr, str) else '\n'.join(cr)
open(os.path.join(ROOT, 'music/credits.txt'), 'w').write(cr + '\n'); print(cr)
