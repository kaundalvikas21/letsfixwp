import { Reveal } from "@/components/motion";
import { layerIcon } from "@/content/icons";
import { layerLabel, type Guide } from "@/content/schema";

/**
 * "What usually causes it" as one ruled table, two columns from 768px. Each cell leads with the mark
 * of its cause's first layer (`layerIcon`, keyed to the hand-assigned `layers` field in the content
 * files; the first tag is the main one), every layer name beside it, then the cause.
 *
 * The rules are the card's own `--line` showing through a 1px gap, so the table needs no per-cell
 * border logic. An odd count keeps the last cause at one column's width and closes the row with an
 * empty surface cell, which is what stops the gap's `--line` filling the hole as a grey block. It
 * reveals as one element: a staggered cell would leave the gap showing as a solid block until it
 * arrived.
 */
export function CauseTable({ causes }: { causes: Guide["likelyCauses"] }) {
  const odd = causes.length % 2 === 1;
  return (
    <Reveal>
      <ul className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line shadow-card md:grid-cols-2">
        {causes.map((c) => {
          const Icon = layerIcon[c.layers[0]];
          return (
            <li key={c.text} className="group bg-surface p-5 transition-colors duration-300 ease-[var(--motion-ease)] hover:bg-surface-2">
              <div className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-[14px] bg-accent-tint text-accent-text" aria-hidden>
                  <Icon weight="duotone" className="size-[18px]" />
                </span>
                <span className="text-[13px] font-medium text-muted transition-colors duration-300 group-hover:text-accent-text">
                  {c.layers.map((l) => layerLabel[l]).join(", ")}
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-snug text-text">{c.text}</p>
            </li>
          );
        })}
        {odd && <li aria-hidden className="hidden bg-surface md:block" />}
      </ul>
    </Reveal>
  );
}
