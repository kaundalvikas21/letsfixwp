"use client";

import Image from "next/image";
import { useCallback, useId, useRef, useState } from "react";

// Isolated client leaf (contract rule 2). Direct manipulation only: the clip tracks the pointer or
// the arrow keys with no transition, so there is no motion to collapse under prefers-reduced-motion.

const STEP = 5;
const clamp = (n: number) => Math.min(100, Math.max(0, n));

export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [pct, setPct] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    setPct(clamp(((clientX - r.left) / r.width) * 100));
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const by: Record<string, number> = { ArrowLeft: -STEP, ArrowRight: STEP, ArrowDown: -STEP, ArrowUp: STEP };
    if (e.key in by) {
      e.preventDefault();
      setPct((p) => clamp(p + by[e.key]));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setPct(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPct(100);
    }
  };

  return (
    <div
      ref={frameRef}
      className="relative aspect-16/10 w-full touch-none overflow-hidden border border-line select-none"
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) setFromClientX(e.clientX);
      }}
    >
      {/* The restored site sits underneath, full width. */}
      <Image src={after} alt={afterAlt} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />

      {/* The broken capture on top, clipped to the handle. */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        <Image src={before} alt={beforeAlt} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
      </div>

      <span id={labelId} className="sr-only">
        Reveal the broken site over the restored site
      </span>

      <div
        role="slider"
        tabIndex={0}
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={`${Math.round(pct)} percent broken site shown`}
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 z-10 flex w-11 cursor-ew-resize items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        style={{ left: `calc(${pct}% - 22px)` }}
      >
        <span aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-accent" />
        <span aria-hidden className="relative size-11 border-2 border-accent bg-surface" />
      </div>
    </div>
  );
}
