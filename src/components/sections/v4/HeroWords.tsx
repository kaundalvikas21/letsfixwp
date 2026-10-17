import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * One headline line, revealed word by word: 12px rise behind a clip mask, 60ms apart (hierarchy, and
 * the line is the promise). Every word is real text in the DOM; the mask carries its own descender
 * room so "today" keeps its tail at rest.
 *
 * The reveal is CSS (the `hero-word` utility over the `rise` keyframe), not Motion, so it needs no
 * client bundle and no hydration. The words are painted from the stylesheet on the first frame, and
 * `prefers-reduced-motion` drops the animation to the final state in the same place. A server
 * component, so the hero ships no JS of its own.
 */
export function HeroWords({ line, ember }: { line: string; ember?: string }) {
  const words = line.split(" ");
  return (
    <span className="block">
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.16em] inline-flex overflow-hidden pb-[0.16em] align-bottom">
            <span
              className={cn("hero-word", word === ember && "text-accent-text")}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
