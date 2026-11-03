import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { JsonLd, organizationLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteShell } from "@/components/sections/v4/SiteShell";
import { brand, sharedOpenGraph } from "@/config/brand";
import { SITE_URL } from "@/config/sitemap";
import "./globals.css";

// opsz is the only extra axis the site actually sets; wght comes with the variable font. Dropping wdth,
// which nothing uses, takes the display face from 129KB to the size measured in docs/qa-report.md.
const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-bricolage" });
const body = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${brand.name}: WordPress fixes, care plans and development`, template: `%s | ${brand.name}` },
  description: "Broken WordPress site? Pick your problem and book a fix, or chat with an engineer.",
  openGraph: { ...sharedOpenGraph },
  twitter: { card: "summary_large_image" },
};

/**
 * The reveal trigger, ported from the reference's WOW.js: a box animates the first time it crosses
 * the viewport's bottom edge, then it stops being watched.
 *
 * Inline and not a module, which is the whole point of it. `.reveal-js` is what applies the hidden
 * start state, so the only code that can hide a section is code the HTML parser has already run. A
 * blocked bundle, a slow network or a thrown module leaves every page fully readable: no `.reveal-js`
 * class, no `opacity: 0`, no animation, just the page. The same reason the rest of this pass is CSS.
 *
 * It sits first in <body> so it executes before any `.reveal` element has been parsed, let alone
 * painted, which is what keeps the start state from arriving as a flash of visible-then-hidden. That
 * is also why it must not write to the DOM: running before React hydrates, every attribute or class
 * it added to a server-rendered element was one React then found and could not reconcile, which is a
 * hydration mismatch on nine sections of the home page. So nothing here sets an attribute, a class or
 * a style on anything React rendered. The animation is handed to the Web Animations API, which is a
 * running effect rather than a document change, and the "already watched" set is a WeakSet rather
 * than the `data-rv` marker it replaces. <html> keeps `suppressHydrationWarning` for the one class
 * this does add, the same arrangement every theme script uses.
 *
 * Two markers, one mechanism. `.reveal` on a container means each of its direct children is watched
 * and animated on its own entry; `.reveal-self` means this one element is. The container form is
 * only a shorthand, so a grid of twenty cards costs one class on the `ul` rather than twenty on the
 * `li`. Both collect into the same selector and animate identically.
 *
 * **Nothing writes these markers by hand any more.** `Reveal` and `Stagger` in
 * `src/components/motion/` are the only things that should emit them, and they also carry the
 * per-element API this script reads: `data-rv-dir` (up/down/left/right/none), `data-rv-dist` (px,
 * overriding the responsive default), `data-rv-delay` (ms, which is how `Stagger` orders a group)
 * and `data-rv-repeat` (present only when a caller opts out of `once`, which brief rule 2 says it
 * should not). Every attribute is optional, so the 59 bare `.reveal` markers that predate the
 * primitives keep working unchanged and simply take the defaults.
 *
 * The element is its own trigger, so a card does not wait on its section's crossing: siblings in a
 * row cross the viewport edge together. Ordering within that group is opt-in through `Stagger`,
 * which writes `data-rv-delay` per child at 70ms a step and stops laddering after the sixth, so a
 * twelve-card grid never forms a queue. A bare `.reveal` container still has no stagger at all.
 *
 * One owner per ancestor chain: if a container carries `.reveal`, nothing inside it may carry either
 * marker. Two animated elements on one chain multiply their opacities and sum their translates, so a
 * deeper marker always means the ancestor gives its own up.
 *
 * The numbers are not written here. Duration, easing and the responsive travel are read from
 * `--motion-duration`, `--motion-ease` and `--motion-distance` on `:root`, which mirror
 * `src/components/motion/tokens.ts` and are checked against it by `npm run check:motion`. The
 * travel is re-read when the 768px breakpoint changes, so a window dragged across it animates at
 * the right distance without a reload. A WAAPI animation cannot be started from CSS without a class
 * or attribute to toggle, which is why the playback lives here and only the values live there.
 *
 * **Two values bend for distance, and both are about a long travel rather than a short one.** The
 * token duration is tuned for a 24px nudge; an element that rises its own height, which on the
 * footer wordmark is 197px, covers that in the same 500ms and lurches. `data-rv-dur` lets one
 * element ask for longer without moving the token out from under the other hundred.
 *
 * The opacity ramp bends for the same reason. It finishes at 30% of the run, which on a 24px nudge
 * is imperceptible; on a long rise it means a fully opaque block travelling the remaining 70%,
 * which is exactly what reads as unsmooth. A `clip` reveal finishes it at 8% instead, because the
 * clip is already doing the revealing and a fade on top of it is a second, competing one. It is not
 * removed outright: 8% is a safety net for a caller who forgets the `overflow-hidden` a clip needs,
 * where the element would otherwise appear in full below its box.
 *
 * The viewport test is the brief's: `threshold 0.2` with `rootMargin: "0px 0px -15% 0px"`, so an
 * element starts a beat after it clips the fold rather than at the instant it does. The height
 * guard beside it is not decoration: an element taller than five viewports can never reach a 0.2
 * ratio, so anything taller than 80% of the window is accepted on first intersection instead. A
 * pinned rail would otherwise never animate at all.
 *
 * Opacity is written on all three keyframes on purpose. A property missing from the last keyframe
 * does not hold its previous value: WAAPI synthesises an implicit one from the element's underlying
 * style, which here is the `opacity: 0` start state, so `{opacity:1,offset:0.3}` alone faded every
 * element in and then straight back out to invisible under `fill: both`. Measured on /pricing/: 58
 * targets, 58 still hidden after a full scroll.
 *
 * Opacity finishes at 30% of the run while the transform takes the full second. A played animation
 * has no park state, but it is not instantaneous either, and docs/qa-report.md records this site's
 * own instrument catching two serious `color-contrast` violations at a 300ms settle that were gone
 * at 1500ms. One section at a time that window was mostly above the reader's eye; at element level a
 * scrolling reader always has something in flight. Finishing the fade in 300ms takes the ember
 * `.btn-primary` out of measurable range at any sample and leaves the movement unchanged.
 *
 * The MutationObserver is the reference's `live: true`. Without it a soft navigation would mount a
 * new page's sections after the sweep had finished and leave them at opacity 0 for good, which is the
 * one failure mode of a hidden start state that actually matters. It watches `#main` rather than
 * `body`: the heaviest mutators on this site, the Radix dialog portals and the chat vendor's widget,
 * are outside it and contain no targets. `childList` only, never `attributes`, which is why cmdk
 * churning `aria-selected` on every arrow key costs nothing.
 *
 * Reduced motion is checked here as well as in the stylesheet, because a WAAPI fill overrides a CSS
 * rule: the stylesheet keeps an untouched section visible, and this keeps a section that comes into
 * view from being animated at all. No IntersectionObserver, no `animate()`, or a curve the browser
 * will not parse, and the class comes straight back off: an old browser gets the static page rather
 * than an empty one.
 */
const revealScript = `(function(){
  if(!('IntersectionObserver' in window)||!Element.prototype.animate)return;
  var d=document,root=d.documentElement,cs=getComputedStyle(root);
  root.classList.add('reveal-js');
  var ease=cs.getPropertyValue('--motion-ease').trim()||'ease';
  var dur=(parseFloat(cs.getPropertyValue('--motion-duration'))||0.5)*1000;
  var dist=24;
  function readDist(){dist=parseFloat(getComputedStyle(root).getPropertyValue('--motion-distance'))||24;}
  readDist();
  var narrow=matchMedia('(max-width: 767px)');
  narrow.addEventListener?narrow.addEventListener('change',readDist):narrow.addListener(readDist);
  var reduce=matchMedia('(prefers-reduced-motion: reduce)');
  var seen=new WeakSet();
  function from(el){
    var dir=el.getAttribute('data-rv-dir')||'up';
    if(dir==='none')return 'none';
    var px=parseFloat(el.getAttribute('data-rv-dist'));
    if(!(px>=0))px=dist;
    if(dir==='clip')return 'translateY(100%)';
    if(dir==='down')return 'translateY('+(-px)+'px)';
    if(dir==='left')return 'translateX('+px+'px)';
    if(dir==='right')return 'translateX('+(-px)+'px)';
    return 'translateY('+px+'px)';
  }
  var io=new IntersectionObserver(function(es){
    for(var i=0;i<es.length;i++){
      var e=es[i],el=e.target,repeat=el.hasAttribute('data-rv-repeat'),a,j;
      if(!e.isIntersecting){
        if(repeat){a=el.getAnimations();for(j=0;j<a.length;j++)a[j].cancel();}
        continue;
      }
      if(e.intersectionRatio<0.2&&e.boundingClientRect.height<innerHeight*0.8)continue;
      if(!repeat)io.unobserve(el);
      if(reduce.matches)continue;
      var move=el.getAttribute('data-rv-target')==='child'?el.firstElementChild:el;
      if(!move)continue;
      try{
        var clip=el.getAttribute('data-rv-dir')==='clip';
        move.animate(
          [{opacity:0,transform:from(el)},{opacity:1,offset:clip?0.08:0.3},{opacity:1,transform:'none'}],
          {duration:+el.getAttribute('data-rv-dur')||dur,delay:+el.getAttribute('data-rv-delay')||0,easing:ease,fill:'both'}
        );
      }catch(err){root.classList.remove('reveal-js');return;}
    }
  },{threshold:[0,0.2],rootMargin:'0px 0px -15% 0px'});
  var queued=0;
  function scan(){
    queued=0;
    var n=d.querySelectorAll('.reveal > *, .reveal-self, [data-rv-target]');
    for(var i=0;i<n.length;i++){if(!seen.has(n[i])){seen.add(n[i]);io.observe(n[i]);}}
  }
  function rescan(){if(!queued)queued=requestAnimationFrame(scan);}
  function start(){
    scan();
    var mo=new MutationObserver(rescan);
    mo.observe(d.getElementById('main')||d.body,{childList:true,subtree:true});
    var f=d.querySelector('footer');
    if(f)mo.observe(f,{childList:true,subtree:true});
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',start);else start();
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable}`}>
      {/* The mobile action bar's space is reserved in globals.css, keyed on the bar being there at all. */}
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
        <JsonLd data={organizationLd()} />
        <SiteShell>
          <main id="main">{children}</main>
          <SiteFooter />
        </SiteShell>
      </body>
    </html>
  );
}
