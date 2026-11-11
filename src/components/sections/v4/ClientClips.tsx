import type { ReactNode } from "react";
import { testimonials } from "@/content/testimonials";
import { frameShell, videoCaption, VideoSlotBox } from "@/components/VideoFrame";
import { ClipRail } from "@/components/sections/v4/ClipRail";
import { Section } from "@/components/templates/parts";
import { cn } from "@/lib/utils";

/**
 * Clients on camera: the reserved client clips as a wall of portrait frames.
 *
 * **Server Components, no client island, no player library.** A `video controls` element needs no
 * boundary and no JavaScript, so this section costs nothing in the bundle and nothing on the network
 * until someone presses play (`preload="none"` lives in VideoFrame's `Clip`). That is what makes it
 * safe to put on the pages people reach while they are deciding to spend money, which is also where
 * the LCP budget is tightest.
 *
 * **No carousel.** The home page already pages these same four clients by hand, which spends contract
 * rule 9's pause and prev/next affordances once. A static wall needs none of them, and the four
 * posters answering "is this a real person" all at once is the point of a wall rather than a window.
 *
 * **No quote text in a wall card.** Contract rule 14 caps a quote at three lines and forbids cutting
 * one; the `excerpt` strings are about 90 characters, which is five or six lines in a 264px column.
 * The words stay where the column is wide enough for them: the home carousel and the service page
 * blockquote. Here the clip is the testimonial and `videoCaption` is its text alternative.
 *
 * A rail on a phone, two columns at 768 and four from there, never three: contract rule 6 bans three
 * equal cards unless every column carries its own image, its own list and its own CTA, and these carry
 * a frame and an attribution.
 */

/**
 * Every client with a reserved clip, and the four the teasing pages show.
 *
 * The home and pricing pages interrupt a page about something else, so they tease: four clients and a
 * link to the library. Swiping twelve cards in the middle of a page whose job is to get someone to
 * book is work, not proof. The case study page is the library and shows all of them.
 *
 * One definition rather than a `.slice(0, 4)` written at each call site, so the cap moves in one place
 * and the two teasing pages cannot drift apart.
 */
const TEASER = 4;

/** The shape this reads off a testimonial. Structural, so the `as const` content satisfies it. */
type ClipClient = {
  video: Parameters<typeof videoCaption>[0];
  name: string;
  role: string;
  org: string;
  placeholder?: boolean;
};

/**
 * One client, as a portrait frame with the attribution under it.
 *
 * **An unconfirmed entry is credited to nobody.** The placeholder names in src/content/testimonials.ts
 * are "Client name, Role, Company", and printing those under a frame would read as an attribution
 * rather than as a gap. So a placeholder shows only the slot's own sentence, which says what will play
 * there and that it is not filmed yet. The name appears the day the words are a real client's, which
 * is the same condition `check-confirmed.ts` gates a production build on.
 */
export function ClipCard({ client, className }: { client: ClipClient; className?: string }) {
  const named = !client.placeholder;
  return (
    <figure className={cn(frameShell, "flex h-full flex-col", className)}>
      <VideoSlotBox id={client.video} />
      <figcaption className="px-2 pt-3 pb-1">
        {named ? (
          <p className="text-[15px]">
            <span className="font-semibold">{client.name}</span>
            <span className="text-muted">
              , {client.role}, {client.org}
            </span>
          </p>
        ) : null}
        <p className={cn("text-sm text-muted", named && "mt-1")}>{videoCaption(client.video)}</p>
      </figcaption>
    </figure>
  );
}

/**
 * The four clients: a carousel on a phone, a row of four from 768 up.
 *
 * **One definition, because three pages draw this.** It lived twice, once here and once in
 * ClientStories, which is how a grid ends up with two slightly different hovers. This codebase paid for
 * that lesson once already, in the pass that gave every card grid one `cardLink`. Both callers use this.
 *
 * **Why it pages on a phone and not above it.** A carousel earns its cost when the items do not fit.
 * At 1440 four cards are one row and nothing is hidden, so paging them would put three of the four
 * behind a press for no reason. On a phone the same four were a 2x2 block 1212px tall whose clips were
 * 142px wide, which is not enough of a face to be worth watching. Paged, each clip is about 230px and
 * the section is about a third shorter.
 *
 * The cards are built here, on the server, and handed to `ClipRail` as nodes, so nothing in
 * src/content/videos.ts reaches that island. The rail, the controls and the reasoning about contract
 * rule 9 all live in ClipRail.tsx.
 */
export function ClipWall({
  clients,
  action,
  className,
}: {
  clients: readonly ClipClient[];
  /** The section's own link, which the rail puts on the control row beside the paging. */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <ClipRail label="Client clips" action={action} className={className}>
      {clients.map((client) => (
        <ClipCard key={client.video} client={client} />
      ))}
    </ClipRail>
  );
}

/**
 * Every clip at once, two across on a phone and four across from 768 up. No paging at any width.
 *
 * **Why this page does not get the carousel.** A carousel is a teaser: it shows one client and implies
 * more, which is the right shape on the home and pricing pages, where the clips interrupt a page about
 * something else. The case study page is the library. Someone who has arrived here has already decided
 * to look at proof, and a grid lets them see how much of it there is and pick, where a rail would hide
 * the count behind four presses. It is also the Cohley reference the owner sent: a wall, not a window.
 *
 * **It is a Server Component, and that is the point of keeping the two apart.** No island, no
 * observer, no controls. The whole gallery is markup, however many clips it grows to.
 *
 * Never three columns: contract rule 6 bans three equal cards unless every column carries its own
 * image, list and CTA. Two then four, so a 12 clip library reads as 6 rows on a phone and 3 across on a
 * desktop.
 */
export function ClipGrid({ clients, className }: { clients: readonly ClipClient[]; className?: string }) {
  return (
    <ul className={cn("reveal grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6", className)}>
      {clients.map((client) => (
        <li key={client.video}>
          <ClipCard client={client} />
        </li>
      ))}
    </ul>
  );
}

/**
 * The section, for an inner page that uses the `Section` rhythm.
 *
 * `Section` puts `reveal-self` on its own heading, so the list carries the plain `reveal` class and its
 * children animate as a group. The two are siblings rather than nested, which keeps the one animated
 * element per ancestor chain rule.
 *
 * `layout` picks which of the two shapes the page wants: the carousel that teases, or the grid that
 * lists. The reasoning for each is on the component it names.
 */
export function ClientClips({ title, id, layout = "carousel" }: { title: string; id: string; layout?: "carousel" | "grid" }) {
  const clients = testimonials as readonly ClipClient[];
  return (
    <Section id={id} title={title}>
      {layout === "grid" ? <ClipGrid clients={clients} /> : <ClipWall clients={clients.slice(0, TEASER)} />}
    </Section>
  );
}

/** The four a teasing page shows, for a caller that composes its own section (the home page). */
export const teaserClients = (testimonials as readonly ClipClient[]).slice(0, TEASER);
