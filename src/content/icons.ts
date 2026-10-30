import type { Icon } from "@phosphor-icons/react";
import {
  ArrowCircleUpIcon,
  ArrowCounterClockwiseIcon,
  ArrowsClockwiseIcon,
  ArrowsLeftRightIcon,
  BroomIcon,
  CalendarBlankIcon,
  ChartBarIcon,
  ChatTeardropTextIcon,
  ClipboardTextIcon,
  ClockCounterClockwiseIcon,
  CodeIcon,
  EqualsIcon,
  EyeIcon,
  FileTextIcon,
  GaugeIcon,
  HammerIcon,
  HardDrivesIcon,
  LightningIcon,
  ListBulletsIcon,
  LockIcon,
  MagnifyingGlassIcon,
  MonitorIcon,
  PackageIcon,
  PenNibIcon,
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
  UserPlusIcon,
  VideoCameraIcon,
  WrenchIcon,
} from "@phosphor-icons/react/ssr";
import { hubIds } from "@/config/routes";
import { remoteDelivery } from "./notices";
import { services } from "./index";

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

/** The three `remoteDelivery` entries: a call, the work in progress, and what you are left holding. */
export const deliveryIcon = {
  Meetings: VideoCameraIcon,
  "While we work": MonitorIcon,
  Handover: PackageIcon,
} as const satisfies Record<string, Icon>;

// Integrity, the same shape `photos.ts` uses: content that grows a value these maps do not cover
// fails the build here rather than rendering a hole on one page nobody opens.
for (const id of hubIds) if (!(id in hubIcon)) throw new Error(`icons: hub "${id}" has no icon`);
for (const s of services) {
  for (const w of s.whatWeDo) if (!(w.verb in verbIcon)) throw new Error(`icons: whatWeDo verb "${w.verb}" has no icon`);
}
for (const r of remoteDelivery) if (!(r.label in deliveryIcon)) throw new Error(`icons: delivery "${r.label}" has no icon`);
