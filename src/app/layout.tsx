import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { JsonLd, organizationLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteShell } from "@/components/sections/v4/SiteShell";
import { brand } from "@/config/brand";
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
  openGraph: { siteName: brand.name, type: "website", locale: "en_IN" },
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
 * There is no stagger, and that is the ported behaviour rather than a simplification. The element is
 * its own trigger now, so a card no longer waits on its section's crossing: siblings in a row cross
 * the viewport edge together and rise together. The reference is the same, measured: 67 `wow` nodes
 * on its /wordpress-websites/ and exactly one `data-wow-delay` among them. The 70ms ladder stays
 * where the reference keeps its own, above the fold, in `rise-in` on the masthead.
 *
 * One owner per ancestor chain: if a container carries `.reveal`, nothing inside it may carry either
 * marker. Two animated elements on one chain multiply their opacities and sum their translates, so a
 * deeper marker always means the ancestor gives its own up.
 *
 * The 14px / 1000ms spec lives here rather than in a stylesheet keyframe, because a WAAPI animation
 * cannot be started from CSS without a class or attribute to toggle, which is the thing that caused
 * the mismatch. `--ease-spring` is still read from the stylesheet, so the curve has one definition.
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
  var d=document,root=d.documentElement;
  root.classList.add('reveal-js');
  var ease=getComputedStyle(root).getPropertyValue('--ease-spring').trim()||'ease';
  var reduce=matchMedia('(prefers-reduced-motion: reduce)');
  var seen=new WeakSet();
  var io=new IntersectionObserver(function(es){
    for(var i=0;i<es.length;i++){
      if(!es[i].isIntersecting)continue;
      var el=es[i].target;
      io.unobserve(el);
      if(reduce.matches)continue;
      try{
        el.animate(
          [{opacity:0,transform:'translateY(14px)'},{opacity:1,offset:0.3},{opacity:1,transform:'none'}],
          {duration:1000,easing:ease,fill:'both'}
        );
      }catch(err){root.classList.remove('reveal-js');return;}
    }
  });
  var queued=0;
  function scan(){
    queued=0;
    var n=d.querySelectorAll('.reveal > *, .reveal-self');
    for(var i=0;i<n.length;i++){if(!seen.has(n[i])){seen.add(n[i]);io.observe(n[i]);}}
  }
  /* The set is about 130 nodes on /pricing/ where it was five, and TileGrid replaces up to 52 li on
     every filter keystroke, so the scan coalesces onto a frame instead of running per batch. */
  function rescan(){if(!queued)queued=requestAnimationFrame(scan);}
  function start(){scan();new MutationObserver(rescan).observe(d.getElementById('main')||d.body,{childList:true,subtree:true});}
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
