import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "syntax-error",
  title: "WordPress syntax error",
  h1: "Fix a WordPress parse or syntax error",
  symptoms: [
    "The whole site shows \"Parse error: syntax error, unexpected '}' in /wp-content/themes/yourtheme/functions.php on line 42\"",
    "Messages such as \"syntax error, unexpected end of file\" or \"unexpected identifier\" appear instead of the page",
    "Both the front end and wp-admin fail, so you cannot log in to undo the change",
    "The error started right after adding a code snippet or editing a file",
  ],
  likelyCauses: [
    "A code snippet pasted into functions.php with a missing semicolon, bracket or quote",
    "Curly quotes copied from a blog post or document instead of plain straight quotes",
    "A file edited over FTP or the host file manager, which skips the safety check the WordPress editor runs",
    "An incomplete upload that cut a PHP file off partway through",
  ],
  safeChecks: [
    "Copy the full error message and note the file path and line number. That tells you exactly which file needs fixing.",
    "If the path points inside wp-content/plugins, rename that plugin's folder in your host's file manager. WordPress deactivates it and the site should load again.",
  ],
  whenToCallUs:
    "If the error points at a file you did not edit, or the site still fails after you took your snippet out, stop editing. Each manual change on a live file risks a new error somewhere else. An engineer can restore the file from a clean copy and put your code back in a safe place.",
  parentService: "critical-error",
  urgency: "critical",
  faqs: [
    { q: "I only added one line of code. How did it break everything?", a: "PHP reads the whole file before running it. A single missing bracket or semicolon means the file cannot be read at all, and if that file loads on every page, every page fails." },
    { q: "Why can't I log in to undo it?", a: "wp-admin loads your theme's functions.php and active plugins too, so a syntax error there blocks the dashboard as well. The fix has to be made through file access." },
    { q: "Why didn't the WordPress editor stop me?", a: "The built-in theme and plugin editors check for fatal errors and roll back, but edits made over FTP, the host file manager or some snippet tools skip that check." },
    { q: "Will I lose the code I added?", a: "We keep a copy of your snippet, fix it if it is correct in intent, and add it back in a safe place so the feature you wanted still works." },
  ],
  seo: {
    title: "Fix a WordPress Parse or Syntax Error",
    description: "Site showing \"Parse error: syntax error, unexpected\"? We find the broken line, fix the code and get your WordPress front end and admin back.",
  },
  image: { slot: "illustration-syntax-error", alt: "A code editor with one line highlighted in red where a PHP syntax error was found" },
});
