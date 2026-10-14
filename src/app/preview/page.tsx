import type { Metadata } from "next";
import Image from "next/image";
import { variations } from "@/config/variations";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: "Design variations",
  description: "Preview each design variation of the site.",
  alternates: { canonical: routes.preview },
  // An internal chooser, not a page for search engines.
  robots: { index: false, follow: false },
};

/**
 * /preview/: pick a design variation and open it.
 *
 * Each variation stays on its own branch, so this page cannot render them. It links to each branch's own
 * deployment instead, which is what lets someone compare the designs without git or a code editor.
 */
export default function Preview() {
  const deployed = variations.filter((v) => v.url).length;

  return (
    <article className="mx-auto w-full max-w-[1200px] px-6 py-16">
      <h1 className="max-w-[20ch] text-[clamp(2rem,4.2vw,3.25rem)]">Design variations</h1>
      <p className="mt-6 max-w-[62ch] text-lg text-muted">
        The same site, built three ways. Open one to browse it as a visitor would, then come back and compare.
        Each design lives on its own branch, so nothing here changes the live site.
      </p>

      {deployed === 0 && (
        <p className="mt-8 max-w-[62ch] border border-line p-5 text-[0.9375rem] text-muted">
          None of the variations has an address yet. Deploy each branch once, then paste its address into
          <code className="mx-1">src/config/variations.ts</code>. The cards below will start opening.
        </p>
      )}

      <ul className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {variations.map((v) => (
          <li key={v.id} className="flex flex-col border-t border-line pt-6">
            <h2 className="font-bold">{v.name}</h2>
            <p className="mt-2 max-w-[42ch] text-[0.9375rem] text-muted">{v.summary}</p>

            {/* One box for all three, and the whole capture shown inside it: cropping would flatter whichever
                design happened to be screenshotted widest. */}
            <div className="mt-5 grid aspect-[16/10] place-items-center overflow-hidden border border-line bg-bg">
              <Image
                src={v.shot}
                alt={`The ${v.name} home page`}
                width={1440}
                height={900}
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                className="max-h-full w-full object-contain object-top"
              />
            </div>

            <p className="mt-5 pt-1">
              {v.url ? (
                <a href={v.url} target="_blank" rel="noreferrer" className="btn-primary">
                  Open {v.name}
                </a>
              ) : (
                <span className="text-[0.9375rem] text-muted">Not deployed yet</span>
              )}
            </p>
            <p className="mt-3 text-sm text-muted">
              Branch <code>{v.branch}</code>
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
