"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookLink, ChatButton } from "@/components/Cta";

/**
 * Under 768px: fixed bottom bar with BOOK and a CHAT icon.
 * Hidden while any [data-hero-cta] element is on screen, so the two CTA sets never compete.
 * Communicates state: the way to get help follows you once the hero CTAs scroll away.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  // Starts hidden so hero pages never flash the bar before the observer reports.
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-hero-cta]");
    const onScreen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target);
        else onScreen.delete(e.target);
      }
      setHeroVisible(onScreen.size > 0);
    }, { threshold: 1 }); // a half-visible CTA row still counts as hidden, so BOOK is always fully on screen
    targets.forEach((t) => io.observe(t));
    // No hero CTAs on this page: report "not visible" through the same async path.
    const t = targets.length ? undefined : setTimeout(() => setHeroVisible(false), 0);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [pathname]);

  if (pathname === "/app") return null; // the booking page is the BOOK destination

  const show = !heroVisible;
  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
      initial={false}
      animate={{ y: show ? 0 : "100%", opacity: show ? 1 : 0 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20 }}
      aria-hidden={!show}
      inert={!show}
    >
      <BookLink location="mobile-bar" className="flex-1" />
      <ChatButton location="mobile-bar" iconOnly />
    </motion.div>
  );
}
