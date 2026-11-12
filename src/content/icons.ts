import type { Icon } from "@phosphor-icons/react";
import {
  ArrowCircleUpIcon,
  ArrowCounterClockwiseIcon,
  ArrowsClockwiseIcon,
  ArrowsLeftRightIcon,
  BankIcon,
  BroomIcon,
  CalendarBlankIcon,
  ChartBarIcon,
  ChatTeardropTextIcon,
  ClipboardTextIcon,
  ClockCounterClockwiseIcon,
  CodeIcon,
  CloudIcon,
  DatabaseIcon,
  FileCodeIcon,
  PuzzlePieceIcon,
  GearSixIcon,
  CreditCardIcon,
  CurrencyInrIcon,
  EqualsIcon,
  EyeIcon,
  FileTextIcon,
  GaugeIcon,
  HammerIcon,
  HardDrivesIcon,
  KeyIcon,
  LightningIcon,
  ListBulletsIcon,
  LockIcon,
  MagnifyingGlassIcon,
  MonitorIcon,
  PackageIcon,
  PenNibIcon,
  PercentIcon,
  PlugsConnectedIcon,
  PulseIcon,
  ReceiptIcon,
  RocketLaunchIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  SlidersIcon,
  StethoscopeIcon,
  TargetIcon,
  ToolboxIcon,
  TranslateIcon,
  TrendUpIcon,
  UserPlusIcon,
  VideoCameraIcon,
  WarningCircleIcon,
  WrenchIcon,
} from "@phosphor-icons/react/ssr";
import { hubIds } from "@/config/routes";
import { promises, remoteDelivery } from "./notices";
import { compares, services } from "./index";
import type { CauseLayer } from "./schema";

/**
 * Every icon the content layer maps, in one file.
 *
 * The rule these all follow: **an icon is keyed to a field that already exists**, never chosen per
 * string at the call site. A map from `verb` or `hub id` is checkable, is the same on every page
 * that renders that content, and fails the build when the content grows a value it does not cover.
 * Picking a mark inline next to each tile is how a site ends up with three different icons for
 * "Back up" on three different pages.
 *
 * Phosphor throughout, which is the site's one icon set (MASTER). One accent, so none of these
 * carries a colour of its own: the call site decides, and today they are all `--accent-text`.
 *
 * The vocabulary was sanity-checked against a competitor's plans page, which the owner offered as a
 * reference. Only the icon grammar was read from it, never a word of its copy: it runs Font Awesome
 * and reaches for wrench, shield, save, repeat, clock, cog, users and star for exactly the
 * categories below, which is the same shape this map lands on. CLAUDE.md forbids reusing a trading
 * competitor's content and nothing here does.
 */

/**
 * The six hubs. These label a whole area of the business, so the marks are the broadest in the file.
 */
export const hubIcon = {
  "wordpress-fix": WrenchIcon,
  "wordpress-security": ShieldCheckIcon,
  "wordpress-maintenance": ArrowsClockwiseIcon,
  "wordpress-performance-migration": GaugeIcon,
  "wordpress-development": CodeIcon,
  woocommerce: ShoppingCartIcon,
} as const satisfies Record<string, Icon>;

/**
 * Every verb used by a service's `whatWeDo` steps, 36 of them across the 32 services.
 *
 * Near-synonyms are deliberately given different marks rather than sharing one, because they sit in
 * the same list as each other: `Fix` is the wrench and `Repair` the toolbox, `Measure` the gauge and
 * `Optimize` the lightning, `Maintain` the cycle and `Update` the up-arrow. Two identical icons in
 * one four-step list would say the steps were the same step.
 *
 * `Test` and `Verify` do share `SealCheck`, which is the one exception and a checked one: no
 * service lists both, so the two never appear together. If one ever does, split them.
 */
export const verbIcon = {
  Assess: MagnifyingGlassIcon,
  Audit: ClipboardTextIcon,
  "Back up": HardDrivesIcon,
  Build: HammerIcon,
  Clean: BroomIcon,
  Configure: SlidersIcon,
  Design: PenNibIcon,
  Diagnose: StethoscopeIcon,
  Document: FileTextIcon,
  Fix: WrenchIcon,
  Handover: PackageIcon,
  Harden: ShieldCheckIcon,
  Integrate: PlugsConnectedIcon,
  Invoice: ReceiptIcon,
  Launch: RocketLaunchIcon,
  Log: ListBulletsIcon,
  Maintain: ArrowsClockwiseIcon,
  "Mark up": CodeIcon,
  Match: EqualsIcon,
  Measure: GaugeIcon,
  Migrate: ArrowsLeftRightIcon,
  Monitor: PulseIcon,
  Onboard: UserPlusIcon,
  Optimize: LightningIcon,
  Plan: CalendarBlankIcon,
  Recover: ArrowCounterClockwiseIcon,
  Repair: ToolboxIcon,
  Report: ChartBarIcon,
  Request: ChatTeardropTextIcon,
  Restore: ClockCounterClockwiseIcon,
  Review: EyeIcon,
  Scope: TargetIcon,
  Secure: LockIcon,
  Test: SealCheckIcon,
  Update: ArrowCircleUpIcon,
  Verify: SealCheckIcon,
} as const satisfies Record<string, Icon>;

/**
 * Every criterion a comparison is built on, 21 of them across the three files in
 * `src/content/compares/`.
 *
 * Keyed to the criterion string, which is a field that already exists, for the reason this whole
 * file exists: six of the 21 appear in two comparisons each, and a map is the only way "Cost
 * structure" is guaranteed the same mark on /compare/wordpress-vs-wix/ and
 * /compare/woocommerce-vs-shopify/. Chosen at the call site it would drift the first time either
 * page was touched.
 *
 * **No two criteria in the same comparison share a mark**, which is the `verbIcon` rule and matters
 * more here: these sit in one column of one table, so two identical icons would say two rows were
 * about the same thing. Marks are reused *across* files where the pairs never meet, and the near
 * misses are deliberately split: `Cost structure` is the receipt and `Transaction fees` the
 * percent, `How you pay` the card and `Commitment` the calendar, `Indian payment gateways` the
 * bank and `GST invoicing` the rupee. Each of those pairs shares a table.
 *
 * **Identity is not the test, legibility at 16px is**, and the build check can only see the first.
 * Three marks were changed after looking at the rendered column rather than the map: `Ownership
 * and hosting` was the hard drives and sat directly above `Cost structure`'s receipt, which at
 * 16px are both a small ruled rectangle, so ownership took the key. `Backups and monitoring` was
 * the counter-clockwise clock directly under `Routine updates`' clockwise arrows, two circular
 * arrows in adjacent rows, so backups took the hard drives, which is also the mark `verbIcon`
 * already gives "Back up". `GST invoicing` was the document and shared a table with the receipt,
 * so it took the rupee, which says the thing the criterion is actually about.
 *
 * Nothing here characterises either side. A criterion is a question both columns answer, so the
 * mark belongs to the question and is identical on both halves of the row.
 */
export const criterionIcon = {
  // wordpress-vs-wix, and the six shared with woocommerce-vs-shopify
  "Ownership and hosting": KeyIcon,
  "Cost structure": ReceiptIcon,
  "Getting started": RocketLaunchIcon,
  "Flexibility and extensions": PlugsConnectedIcon,
  "SEO control": MagnifyingGlassIcon,
  "Maintenance burden": WrenchIcon,
  Portability: ArrowsLeftRightIcon,
  "Selling online in India": ShoppingCartIcon,
  "Regional language sites": TranslateIcon,
  // care-plan-vs-pay-as-you-go-support
  "How you pay": CreditCardIcon,
  "Routine updates": ArrowsClockwiseIcon,
  "Backups and monitoring": HardDrivesIcon,
  "When something breaks": WarningCircleIcon,
  "Budget predictability": ChartBarIcon,
  "Small changes and content edits": PenNibIcon,
  "Security responsibility": ShieldCheckIcon,
  Commitment: CalendarBlankIcon,
  // woocommerce-vs-shopify
  "Transaction fees": PercentIcon,
  "Indian payment gateways": BankIcon,
  "GST invoicing": CurrencyInrIcon,
  "Traffic spikes on sale days": TrendUpIcon,
} as const satisfies Record<string, Icon>;

/** The three `remoteDelivery` entries: a call, the work in progress, and what you are left holding. */
export const deliveryIcon = {
  Meetings: VideoCameraIcon,
  "While we work": MonitorIcon,
  Handover: PackageIcon,
} as const satisfies Record<string, Icon>;

/** The four promises as /contact/ draws them, keyed by the field each entry in `promises` carries. */
export const promiseIcon = {
  price: ReceiptIcon,
  login: KeyIcon,
  backup: HardDrivesIcon,
  access: LockIcon,
} as const satisfies Record<string, Icon>;

/**
 * The six layers a guide's causes are tagged with, keyed by `causeLayers` in schema.ts, shown beside
 * each cause in the guide's cause table. Every mark is distinct because two can share a cell: `HardDrives` is the machine, `FileCode` the language running on
 * it, `Cloud` everything past it. `Database` says itself, and `GearSix` is core plus its settings, which is what that layer holds.
 */
export const layerIcon = {
  server: HardDrivesIcon,
  php: FileCodeIcon,
  database: DatabaseIcon,
  wordpress: GearSixIcon,
  extensions: PuzzlePieceIcon,
  edge: CloudIcon,
} as const satisfies Record<CauseLayer, Icon>;

// Integrity, the same shape `photos.ts` uses: content that grows a value these maps do not cover
// fails the build here rather than rendering a hole on one page nobody opens.
for (const id of hubIds) if (!(id in hubIcon)) throw new Error(`icons: hub "${id}" has no icon`);
for (const s of services) {
  for (const w of s.whatWeDo) if (!(w.verb in verbIcon)) throw new Error(`icons: whatWeDo verb "${w.verb}" has no icon`);
}
for (const [, , key] of promises) if (!(key in promiseIcon)) throw new Error(`icons: promise "${key}" has no icon`);
for (const r of remoteDelivery) if (!(r.label in deliveryIcon)) throw new Error(`icons: delivery "${r.label}" has no icon`);
for (const c of compares) {
  // Every criterion covered, and no mark used twice inside one comparison: the second check is the
  // one that matters, because a duplicate renders happily and silently claims two rows are alike.
  const seen = new Map<Icon, string>();
  for (const r of c.rows) {
    const mark = criterionIcon[r.criterion as keyof typeof criterionIcon];
    if (!mark) throw new Error(`icons: compare criterion "${r.criterion}" has no icon`);
    const twin = seen.get(mark);
    if (twin) throw new Error(`icons: "${c.slug}" gives "${twin}" and "${r.criterion}" the same mark`);
    seen.set(mark, r.criterion);
  }
}
