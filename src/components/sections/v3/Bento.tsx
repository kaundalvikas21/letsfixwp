import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { IllustrationId } from "@/content/photos";
import { routes } from "@/config/routes";
import { matchIndex } from "@/content";
const BentoGrid = dynamic(() => import("./BentoMotion").then((m) => m.BentoGrid));
const BentoCell = dynamic(() => import("./BentoMotion").then((m) => m.BentoCell));
const SeeAllButton = dynamic(() => import("./BentoMotion").then((m) => m.SeeAllButton));
import { hasScreen, Illustration, Screen } from "./Photo";

// Cell 2 shows the real capture in a device frame once `npm run capture` (needs Docker) has written it.
// Until then: the v1 photograph of an engineer reading a real WordPress fatal error. Logged in docs/image-todo.md.
const CAPTURE = "/screens/critical-error-on-this-website.png";
const hasCapture = hasScreen(CAPTURE);

const cell = "relative flex h-full min-h-40 flex-col md:min-h-0 overflow-hidden rounded-[20px] p-6 shadow-card transition-shadow hover:shadow-lift";
const onPhoto = "min-h-72 md:min-h-0 justify-end bg-surface-2 text-on-photo";

type Cell = {
  title: string;
  line?: string;
  href: string;
  place: string; // grid span at md (2 columns) and explicit position at lg (4 columns x 3 rows)
  look: string;
  photo?: IllustrationId;
};

// Links follow contract rule 16: a category is its SITEMAP hub; a single problem is its service page.
const CELLS: Cell[] = [
  {
    title: "Hacked and malware",
    line: "Malware and backdoors removed, Google warnings cleared and the way in closed.",
    href: routes.hub("wordpress-security"),
    place: "md:col-span-2 md:row-span-2 lg:col-start-1 lg:row-start-1",
    look: onPhoto,
    photo: "settings-and-gears",
  },
  {
    title: "White screens and fatal errors",
    line: "Blank pages, critical error notices and 500 errors.",
    href: routes.hub("wordpress-fix"),
    place: "md:col-span-2 lg:col-start-3 lg:row-start-1",
    look: hasCapture ? "bg-surface-2" : onPhoto,
    photo: hasCapture ? undefined : "browser-with-code",
  },
  {
    title: "Plugin and theme conflicts",
    href: routes.service("plugin-theme-conflict"),
    place: "lg:col-start-3 lg:row-start-2",
    look: "bg-surface-2",
  },
  {
    title: "Slow site and Core Web Vitals",
    href: routes.service("speed-optimization"),
    place: "lg:col-start-1 lg:row-start-3",
    look: "bg-accent-tint",
  },
  {
    title: "WooCommerce checkout and payments",
    line: "Stuck checkouts, failed gateway payments and missing orders.",
    href: routes.service("woocommerce-fixes"),
    place: "md:row-span-2 lg:col-start-4 lg:row-start-2",
    look: onPhoto,
    photo: "team-at-work",
  },
  {
    title: "Locked out of wp\u2011admin", // non-breaking hyphen keeps "wp-admin" on one line
    href: routes.service("login-redirect-issues"),
    place: "lg:col-start-2 lg:row-start-3",
    look: "bg-surface",
  },
];

const Body = ({ title, line, photo }: Pick<Cell, "title" | "line" | "photo">) => (
  <>
    <ArrowUpRightIcon weight="duotone" className={`absolute top-5 right-5 size-5 ${photo ? "" : "text-muted"}`} aria-hidden />
    <h3 className="mt-auto max-w-[22ch] font-display text-xl leading-tight font-bold lg:text-2xl">{title}</h3>
    {line && <p className={`mt-2 max-w-[40ch] text-sm ${photo ? "" : "text-muted"}`}>{line}</p>}
  </>
);

const Device = () => (
  <Screen
    src={CAPTURE}
    alt='The WordPress page reading "There has been a critical error on this website."'
    sizes="(min-width: 1024px) 520px, 100vw"
    className="mt-4 mb-2"
  />
);

/** v3 home: bento of 7 cells (6 problem areas + "see all"), 4x3 at lg, 2 columns at md, 1 column below. */
export function Bento() {
  return (
    <section aria-labelledby="what-we-fix" className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-24">
      <p className="text-sm font-semibold text-accent-text">What we fix</p>
      <h2 id="what-we-fix" className="mt-2 font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">
        Everything that breaks, handled.
      </h2>

      <BentoGrid className="mt-10 grid gap-4 md:auto-rows-[200px] md:grid-cols-2 lg:auto-rows-[220px] lg:grid-cols-4 lg:gap-5">
        {CELLS.map((c, i) => (
          <BentoCell key={c.href} className={c.place}>
            <Link href={c.href} className={`${cell} ${c.look}`}>
              {c.photo && (
                <>
                  <Illustration id={c.photo} sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0" />
                  <span className="absolute inset-0 bg-photo-scrim" aria-hidden />
                </>
              )}
              <span className="relative flex h-full flex-col">
                {hasCapture && i === 1 && <Device />}
                <Body {...c} />
              </span>
            </Link>
          </BentoCell>
        ))}
        <BentoCell className="lg:col-start-3 lg:row-start-3">
          <SeeAllButton count={matchIndex.length} className={`${cell} w-full bg-accent text-on-accent`} />
        </BentoCell>
      </BentoGrid>
    </section>
  );
}
