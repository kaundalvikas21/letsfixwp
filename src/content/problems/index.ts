import type { Category, Problem } from "../schema";

import whiteScreenOfDeath from "./white-screen-of-death";
import criticalErrorOnThisWebsite from "./critical-error-on-this-website";
import errorEstablishingDatabaseConnection from "./error-establishing-database-connection";
import internalServerError500 from "./500-internal-server-error";
import serviceUnavailable503 from "./503-service-unavailable";
import siteDownAfterUpdate from "./site-down-after-update";
import stuckInMaintenanceMode from "./stuck-in-maintenance-mode";
import hacked from "./hacked";
import malwareRemoval from "./malware-removal";
import redirectHack from "./redirect-hack";
import googleDeceptiveSiteWarning from "./google-deceptive-site-warning";
import japaneseKeywordSpamHack from "./japanese-keyword-spam-hack";
import unknownAdminUsers from "./unknown-admin-users";
import pluginConflict from "./plugin-conflict";
import themeBroken from "./theme-broken";
import phpFatalError from "./php-fatal-error";
import memoryExhaustedError from "./memory-exhausted-error";
import syntaxError from "./syntax-error";
import tooManyRedirects from "./too-many-redirects";
import postsReturning404 from "./posts-returning-404";
import httpErrorUploadingImages from "./http-error-uploading-images";
import mixedContentSslErrors from "./mixed-content-ssl-errors";
import lockedOutOfWpAdmin from "./locked-out-of-wp-admin";
import loginRedirectLoop from "./login-redirect-loop";
import passwordResetNotWorking from "./password-reset-not-working";
import phpUpgradeBrokeSite from "./php-upgrade-broke-site";
import failedCoreUpdate from "./failed-core-update";
import pageBuilderLayoutBroken from "./page-builder-layout-broken";
import slowWordpressSite from "./slow-wordpress-site";
import coreWebVitalsFailing from "./core-web-vitals-failing";
import highServerLoad from "./high-server-load";
import woocommerceCheckoutNotWorking from "./woocommerce-checkout-not-working";
import paymentGatewayErrors from "./payment-gateway-errors";
import woocommerceEmailsNotSending from "./woocommerce-emails-not-sending";
import wordpressNotSendingEmail from "./wordpress-not-sending-email";
import migrationFailed from "./migration-failed";
import restoreFromBackup from "./restore-from-backup";

export const problems: Problem[] = [
  whiteScreenOfDeath,
  criticalErrorOnThisWebsite,
  errorEstablishingDatabaseConnection,
  internalServerError500,
  serviceUnavailable503,
  siteDownAfterUpdate,
  stuckInMaintenanceMode,
  hacked,
  malwareRemoval,
  redirectHack,
  googleDeceptiveSiteWarning,
  japaneseKeywordSpamHack,
  unknownAdminUsers,
  pluginConflict,
  themeBroken,
  phpFatalError,
  memoryExhaustedError,
  syntaxError,
  tooManyRedirects,
  postsReturning404,
  httpErrorUploadingImages,
  mixedContentSslErrors,
  lockedOutOfWpAdmin,
  loginRedirectLoop,
  passwordResetNotWorking,
  phpUpgradeBrokeSite,
  failedCoreUpdate,
  pageBuilderLayoutBroken,
  slowWordpressSite,
  coreWebVitalsFailing,
  highServerLoad,
  woocommerceCheckoutNotWorking,
  paymentGatewayErrors,
  woocommerceEmailsNotSending,
  wordpressNotSendingEmail,
  migrationFailed,
  restoreFromBackup,
];

const bySlug = new Map(problems.map((p) => [p.slug, p]));
const byLegacySlug = new Map(
  problems.filter((p) => p.legacySlug).map((p) => [p.legacySlug!, p]),
);

// Fail the build on broken content links rather than shipping dead related links.
for (const p of problems) {
  for (const r of p.relatedSlugs) {
    if (!bySlug.has(r) || r === p.slug) {
      throw new Error(`Problem "${p.slug}" has invalid relatedSlug "${r}"`);
    }
  }
}
if (bySlug.size !== problems.length) throw new Error("Duplicate problem slug");

export const getProblem = (slug: string) => bySlug.get(slug);
export const getProblemByLegacySlug = (slug: string) => byLegacySlug.get(slug);
export const legacyProblems = [...byLegacySlug.values()];

/** Canonical path: the legacy URL when one exists, otherwise /fix/<slug>. */
export const problemPath = (p: Problem) =>
  p.legacySlug ? `/${p.legacySlug}` : `/fix/${p.slug}`;

export const problemsIn = (c: Category) => problems.filter((p) => p.category === c);

/** The slice of each problem that client components (search, triage) need. */
export type ProblemSummary = Pick<Problem, "slug" | "title" | "h1" | "symptoms" | "category"> & { path: string };
export const problemSummaries: ProblemSummary[] = problems.map((p) => ({
  slug: p.slug,
  title: p.title,
  h1: p.h1,
  symptoms: p.symptoms,
  category: p.category,
  path: problemPath(p),
}));
