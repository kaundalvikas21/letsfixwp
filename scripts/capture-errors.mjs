// Capture real WordPress error screens for the problem pages.
//
// Needs Docker running. Then:
//   npx playwright install chromium   (once)
//   node scripts/capture-errors.mjs
//
// Starts a throwaway WordPress with @wordpress/env (http://localhost:8888), breaks it one way at a time,
// screenshots the result at 1600x1000 into public/screens/<guide-slug>.png, and undoes each break before the next.
// The names match image.slot in src/content/guides/*.ts; GuideTemplate shows a capture once its file exists.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

// Docker has to be up before wp-env is asked to start anything. Without this the failure surfaces
// several calls later as a container error, which reads like a bug in this script rather than a
// machine that is missing a prerequisite.
try {
  execFileSync("docker", ["info"], { stdio: "ignore" });
} catch {
  console.error(
    "capture: Docker is not running.\n" +
      "  wp-env starts a throwaway WordPress in Docker, so Docker Desktop has to be up first.\n" +
      "  Nothing was created and no file in this repo was touched.\n" +
      "  See docs/image-todo.md for which captures this would actually produce.",
  );
  process.exit(1);
}

const root = resolve(import.meta.dirname, "..");
const out = join(root, "public", "screens");
const envDir = mkdtempSync(join(tmpdir(), "fixmywp-wpenv-"));
const URL = "http://localhost:8888/";

// The broken-state plugin lives in its own folder so we can drop it in and out.
const muDir = join(envDir, "mu-plugins");
mkdirSync(muDir, { recursive: true });
writeFileSync(join(envDir, ".wp-env.json"), JSON.stringify({ core: null, port: 8888, config: { WP_DEBUG: false }, mappings: { "wp-content/mu-plugins": "./mu-plugins" } }));

// Run wp-env's own entry point with the Node we are already running, rather than the shim in
// node_modules/.bin. The shim is three files: `wp-env` (a POSIX shell script), `wp-env.cmd` and
// `wp-env.ps1`. On Windows `execFileSync` was handed the extensionless shell script, which Windows
// cannot execute, and the whole run died on `spawnSync ... ENOENT` before Docker was ever reached.
//
// Naming `wp-env.cmd` instead would fix Windows and break everything else, and `.cmd` needs
// `shell: true` on current Node (the CVE-2024-27980 change), which would then put `sh -c "<php>"`
// through a shell that has its own ideas about quotes. `bin/wp-env` is a plain `#!/usr/bin/env
// node` script, so handing it to `process.execPath` is one path that behaves the same everywhere
// and needs no shell at all.
const WP_ENV = join(root, "node_modules", "@wordpress", "env", "bin", "wp-env");
const wpEnv = (...args) => execFileSync(process.execPath, [WP_ENV, ...args], { cwd: envDir, stdio: "inherit" });
const wp = (...args) => wpEnv("run", "cli", "wp", ...args);
const inContainer = (cmd) => wpEnv("run", "wordpress", "sh", "-c", cmd);
const setMu = (php) => writeFileSync(join(muDir, "break.php"), php ? `<?php\n${php}\n` : "<?php\n");

const states = [
  {
    slot: "white-screen-of-death",
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
    slot: "critical-error-on-this-website",
    // Same fatal with WordPress's own handler on: "There has been a critical error on this website."
    break: () => setMu("add_action('template_redirect', function () { undefined_function_for_capture(); });"),
    fix: () => setMu(""),
  },
  {
    slot: "error-establishing-database-connection",
    break: () => wp("config", "set", "DB_PASSWORD", "wrong-password-for-capture"),
    fix: () => wp("config", "set", "DB_PASSWORD", "password"),
  },
  {
    slot: "stuck-in-maintenance-mode",
    break: () => inContainer(`echo '<?php $upgrading = time(); ?>' > /var/www/html/.maintenance`),
    fix: () => inContainer("rm -f /var/www/html/.maintenance"),
  },
  {
    slot: "too-many-redirects",
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
  // The healthy site before anything is broken: the "after" frame (src/components/sections/v3/Steps.tsx).
  await page.goto(URL, { waitUntil: "load" });
  await page.screenshot({ path: join(out, "restored.png") });
  console.log("captured restored");
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
