import Image from "next/image";
import { HeroUrlForm } from "./HeroUrlForm";
import { brand } from "@/config/brand";

// Layout family: left-aligned text with a tall right image, 7/5 of 12. Logged in docs/layout-ledger.md.
// Four text elements, no eyebrow: h1, subtext, the field label, the chat link.
// The image is a logged placeholder (docs/image-todo.md): picsum is step (c) of contract rule 7.
const HERO_IMAGE = "https://picsum.photos/seed/letsfixwp-hero-1/880/1100";

export function Hero() {
  return (
    <section aria-labelledby="hero">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-6 min-h-[calc(100dvh-var(--nav-h))] content-center md:grid-cols-12 md:items-center md:gap-6 md:pr-0">
        <div className="pt-16 md:col-span-7 md:py-24 md:pr-12">
          <h1 id="hero" className="text-[clamp(2rem,4.2vw,3.75rem)]">
            WordPress problems, fixed properly.
          </h1>

          <p className="mt-6 max-w-[46ch] text-lg text-muted">Paste your site address. {brand.quoteFlow}</p>

          <div className="mt-10 max-w-[32rem]">
            <HeroUrlForm location="home:hero" />
          </div>
        </div>

        <div className="-mx-6 aspect-video md:col-span-5 md:mx-0 md:aspect-4/5">
          <Image
            src={HERO_IMAGE}
            alt="A WordPress engineer at work: hands on a laptop keyboard in natural window light, the site's admin dashboard open on screen"
            width={880}
            height={1100}
            priority
            sizes="(min-width: 1200px) 500px, (min-width: 768px) 42vw, 100vw"
            className="h-full w-full object-cover grayscale"
          />
        </div>
      </div>
    </section>
  );
}
