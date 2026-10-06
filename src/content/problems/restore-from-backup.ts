import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "restore-from-backup",
  category: "recovery",
  title: "Restore WordPress from backup",
  h1: "Restore a WordPress site from backup",
  symptoms: [
    "The backup plugin's restore stalls partway or ends with an error",
    "You have a .zip and a .sql file from your host and do not know what to do with them",
    "The restored site has missing images, old content or a login that no longer works",
    "You are not sure which of several backups is complete or free of malware",
  ],
  likelyCauses: [
    "A backup that holds only the database, or files without the uploads folder",
    "An archive too large for the server's upload limits or PHP timeouts",
    "A backup taken after the site was already infected, which brings the malware back",
    "A different domain, PHP version or database table prefix on the server being restored to",
    "A restore that would overwrite orders, form entries or posts made since the backup was taken",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Open each available backup, check its date and contents and confirm whether it is complete and clean." },
    { verb: "Back up", detail: "Save the current site as it is, so anything newer than the backup can still be recovered." },
    { verb: "Restore", detail: "Restore to a staging copy first, fix any path, URL or version differences, then move it to the live site." },
    { verb: "Verify", detail: "Check pages, media, logins, forms and checkout and bring across newer orders or posts where needed." },
    { verb: "Harden", detail: "Set up scheduled off-site backups and show you how to check that a backup is complete." },
  ],
  safeChecks: [
    "List the backups you have: where each one is stored (host panel, UpdraftPlus, Google Drive, your computer) and its date. Do not run a restore yet.",
    "Write down what has changed since the date you want to go back to, such as orders, posts or form entries, so none of it is forgotten.",
  ],
  urgency: "high",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Will I lose orders or posts made since the backup?", a: "A full restore replaces the database, so anything newer is overwritten. Because we save the current site first, we can usually bring newer orders, posts or entries back across." },
    { q: "My host keeps backups. Is that enough?", a: "It is a good start, but check how long they are kept and whether they include the database. Keeping a separate off-site copy protects you if the hosting account itself has a problem." },
    { q: "What if every backup is infected?", a: "We restore the content and rebuild the code from clean sources, replacing WordPress core, plugins and themes with fresh copies rather than trusting the infected files." },
    { q: "Can you restore if I only have the database or only the files?", a: "Often, yes. A database alone lets us rebuild the site with fresh core, plugin and theme files. Files alone are harder, but posts can sometimes be recovered from other sources." },
  ],
  relatedSlugs: ["migration-failed", "hacked", "site-down-after-update", "malware-removal"],
  seo: {
    title: "Restore WordPress From Backup | FixMyWP",
    description: "Backup restore failing or not sure which backup to trust? We check your backups, restore safely to staging first and keep newer orders and posts.",
  },
  image: { slot: "illustration-restore-from-backup", alt: "A stack of backup archives with one being unpacked back into a WordPress site" },
});
