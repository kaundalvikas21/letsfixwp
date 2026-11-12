import { ArrowDownIcon, WarningIcon } from "@phosphor-icons/react/ssr";
import { HoverFill } from "@/components/HoverFill";
import { Reveal, Stagger } from "@/components/motion";
import { card } from "@/components/templates/parts";
import { cn, leadSentence } from "@/lib/utils";

const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-3" } as const;

/**
 * "Safe things to try first": one card per check, in order, then the landing that says where the
 * safe options end. The first sentence of each check is the instruction and is the card's lead; the
 * rest is why. The hover is `HoverFill`, the site's one sanctioned hover for a card that is not a
 * link (the case studies' anatomy cards, the About stats strip): the fill grows out of the pointer.
 *
 * Separate cards rather than a ruled table, because the causes above are the table (contract rule 3).
 * The schema holds a guide to two or three checks, so the row never wraps.
 */
export function SafeStairs({ checks, warning }: { checks: readonly string[]; warning: string }) {
  const n = checks.length as 2 | 3;
  return (
    <>
      <Stagger as="ol" className={cn("grid gap-4", cols[n])}>
        {checks.map((x) => {
          const [lead, rest] = leadSentence(x);
          return (
            <li key={x}>
              <HoverFill className={cn(card, "h-full p-5")}>
                <p className="font-semibold leading-snug text-text">{lead}</p>
                {rest && <p className="mt-2 text-[15px] leading-relaxed text-muted">{rest}</p>}
              </HoverFill>
            </li>
          );
        })}
      </Stagger>

      <Reveal className="mt-6">
        <div className="flex flex-wrap items-start gap-x-4 gap-y-3 rounded-[14px] border border-line-strong bg-surface-2 p-5">
          <WarningIcon weight="duotone" className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
          <p className="min-w-0 flex-1 basis-60 text-sm text-muted">
            <span className="font-semibold text-text">Still broken after these?</span> {warning}
          </p>
          <a
            href="#call-us"
            className="group inline-flex min-h-11 items-center gap-2 self-center text-sm font-semibold text-accent-text underline-offset-4 hover:underline"
          >
            When to call us
            <ArrowDownIcon weight="bold" className="size-4 transition-[translate] duration-200 group-hover:translate-y-0.5" aria-hidden />
          </a>
        </div>
      </Reveal>
    </>
  );
}
