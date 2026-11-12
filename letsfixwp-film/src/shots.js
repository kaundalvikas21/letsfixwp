// The one take for Back Online Today: [t, target (Vector3 | subject), dist, az, el, fov, target offset?, {ease}?] and impact shakes [t, amp, decay].
// Film seconds. az 0 = camera on the +z side looking toward -z (cards read upright); el in radians.
import { DUR } from './vo.js';
const R = { ease: 1 };
const SHOT = [
  // S1 the camera falls onto the desk and lands on the broken site
  [0.0, 'site', 2.1, .38, 1.22, 36],
  [0.6, 'site', .68, .26, .74, 36],
  [2.6, 'site', .63, .14, .7, 36],
  // S2 slow orbit left while the visitors come, bump the error and leave
  [5.55, 'site', .66, -.12, .66, 36, null, R],
  // S3 whip to the team card: three developers pop up beside the title tent
  [6.15, 'teamTent', .72, .08, .6, 36],
  [9.4, 'teamTent', .64, .24, .55, 36, null, R],
  // S4 rise over the whole desk while the route draws: what we do
  [10.4, 'wide', 2.3, .04, 1.0, 36],
  [11.9, 'wide', 2.27, .08, 1.0, 36, null, R],
  // S5 down to the phone and the team: the message travels
  [12.9, 'teamPhone', .8, .26, .72, 36],
  [14.6, 'teamPhone', .76, .3, .74, 36],
  [15.6, 'team', .62, .2, .64, 36],
  [17.35, 'team', .6, .15, .62, 36, null, R],
  // S6 ride the hops to the price card, rise to read it; the stamp
  [17.95, 'lead', .56, .3, .5, 36],
  [18.6, 'price', .72, .08, .95, 36],
  [20.85, 'price', .7, .04, .98, 36, null, R],
  // S7 ride to the access card, rise to read it
  [21.4, 'lead', .56, .22, .5, 36],
  [22.1, 'access', .72, .04, .95, 36],
  [25.35, 'access', .7, 0, .98, 36, null, R],
  // S8 ride along to the backup tower, half an orbit while the copy goes in
  [25.95, 'lead', .62, -.45, .46, 36],
  [26.7, 'tower', .78, .15, .5, 36],
  [27.7, 'tower', .72, .5, .46, 36],
  [28.75, 'towerTop', .72, .72, .5, 36, null, R],
  // S9 the big jump back to the site: the camera arcs up over the back of the desk with it
  [29.3, 'backleg', 1.45, .42, .95, 36],
  [29.95, 'fix', .62, .22, .62, 36],
  // S10 a slow push while the team fixes Pip; the held breath; back online
  [33.0, 'fix', .5, .12, .6, 36],
  [34.55, 'fix', .52, .08, .6, 36],
  [36.1, 'site', .66, .04, .66, 36, null, R],
  // S11 whip to the access card: the key lies back down, access removed
  [36.6, 'access', .64, -.06, .95, 36],
  [38.2, 'access', .62, -.1, 1.0, 36, null, R],
  // S12 pull back over the whole desk: the title lands, the customers come back
  [40.0, 'final', 2.08, .06, 1.1, 36],
  [DUR, 'final', 2.14, .12, 1.12, 36],
];
// ?thumb=1: the website poster. The title sits in the upper half and the play button (drawn by the site over the
// centre of the poster) lands on open desk between the title and the cards, not on the words.
const QS = new URLSearchParams(location.search), THUMB = QS.has('thumb');
const TK = (QS.get('thumb') || '').split(',').map(Number), [, , td = 1.2, taz = 0, tel = .9] = TK;   // thumb=x,z,dist,az,el
export const KEYS = THUMB ? [[0, 'thumb', td, taz, tel, 36], [DUR, 'thumb', td, taz, tel, 36]] : SHOT;
export const SHAKES = THUMB ? [] : [[19.0, .005, 9], [34.0, .004, 9], [36.75, .002, 10], [40.0, .004, 9]];
