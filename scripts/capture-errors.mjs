// Capture real WordPress error screens for the problem pages.
//
// Needs Docker running. Then:
//   npx playwright install chromium   (once)
//   node scripts/capture-errors.mjs
//
// Starts a throwaway WordPress with @wordpress/env (http://localhost:8888), breaks it one way at a time,
// screenshots the result at 1600x1000 into public/screens/<slot>.png, and undoes each break before the next.
// The slot names match image.slot in src/content/problems/*.ts; ProblemTemplate shows a capture once its file exists.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const root = resolve(import.meta.dirname, "..");
const out = join(root, "public", "screens");
const envDir = mkdtempSync(join(tmpdir(), "fixmywp-wpenv-"));
const URL = "http://localhost:8888/";

// The broken-state plugin lives in its own folder so we can drop it in and out.
const muDir = join(envDir, "mu-plugins");
mkdirSync(muDir, { recursive: true });
writeFileSync(join(envDir, ".wp-env.json"), JSON.stringify({ core: null, port: 8888, config: { WP_DEBUG: false }, mappings: { "wp-content/mu-plugins": "./mu-plugins" } }));

const wpEnv = (...args) =>
  execFileSync(join(root, "node_modules", ".bin", "wp-env"), args, { cwd: envDir, stdio: "inherit" });
const wp = (...args) => wpEnv("run", "cli", "wp", ...args);
const inContainer = (cmd) => wpEnv("run", "wordpress", "sh", "-c", cmd);
const setMu = (php) => writeFileSync(join(muDir, "break.php"), php ? `<?php\n${php}\n` : "<?php\n");

const states = [
  {
    slot: "screen-white-screen",
    // A PHP fatal with WordPress's recovery handler disabled, so the page is truly blank.
    break: () => {
      wp("config", "set", "WP_DISABLE_FATAL_ERROR_HANDLER", "true", "--raw");
      setMu("add_action('template_redirect', function () { undefined_function_for_capture(); });");
    },
    fix: () => {
      setMu("");
      wp("config", "delete", "WP_DISABLE_FATAL_ERROR_HANDLER");
    },
  },
  {
    slot: "screen-critical-error",
    // Same fatal with WordPress's own handler on: "There has been a critical error on this website."
    break: () => setMu("add_action('template_redirect', function () { undefined_function_for_capture(); });"),
    fix: () => setMu(""),
  },
  {
    slot: "screen-db-connection-error",
    break: () => wp("config", "set", "DB_PASSWORD", "wrong-password-for-capture"),
    fix: () => wp("config", "set", "DB_PASSWORD", "password"),
  },
  {
    slot: "screen-maintenance-mode",
    break: () => inContainer(`echo '<?php $upgrading = time(); ?>' > /var/www/html/.maintenance`),
    fix: () => inContainer("rm -f /var/www/html/.maintenance"),
  },
  {
    slot: "screen-too-many-redirects",
    // Every front end request redirects to a new URL, so the browser gives up with ERR_TOO_MANY_REDIRECTS.
    break: () => setMu("add_action('template_redirect', function () { wp_redirect(home_url('/?loop=' . mt_rand())); exit; });"),
    fix: () => setMu(""),
  },
];

mkdirSync(out, { recursive: true });
setMu("");
wpEnv("start");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
try {
  for (const s of states) {
    s.break();
    try {
      // Too-many-redirects never loads; Chromium shows its own error page, which is what visitors see.
      await page.goto(URL, { waitUntil: "load" }).catch(() => {});
      await page.screenshot({ path: join(out, `${s.slot}.png`) });
      console.log(`captured ${s.slot}`);
    } finally {
      s.fix();
    }
  }
} finally {
  await browser.close();
  wpEnv("destroy", "--force");
}
