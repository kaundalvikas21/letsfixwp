import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "http-error-uploading-images",
  category: "errors",
  title: "WordPress HTTP error uploading images",
  h1: "Fix the HTTP error when uploading images to WordPress",
  symptoms: [
    "The media uploader stops and shows \"HTTP error.\" next to the file",
    "WordPress says \"The server cannot process the image. This can happen if the server is busy or does not have enough resources to complete the task.\"",
    "Uploads fail with \"The uploaded file exceeds the upload_max_filesize directive in php.ini.\"",
    "You see \"Unable to create directory wp-content/uploads/... Is its parent directory writable by the server?\"",
    "Small images upload fine but large photos fail every time",
  ],
  likelyCauses: [
    "PHP upload_max_filesize, post_max_size or memory_limit too low for the image",
    "The image library (Imagick or GD) running out of resources while creating thumbnail sizes",
    "Wrong folder permissions or ownership on wp-content/uploads",
    "A server firewall such as ModSecurity blocking the upload request",
    "A plugin hooking into uploads, such as an image optimizer, failing partway through",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Reproduce the failed upload and read the PHP and server logs to see which limit, permission or plugin stops it." },
    { verb: "Back up", detail: "Copy the uploads folder and database before changing permissions or server settings." },
    { verb: "Repair", detail: "Adjust PHP limits within your host's allowance, fix folder permissions, or switch the image library setting so uploads complete." },
    { verb: "Verify", detail: "Upload large and small images, PDFs and other files you use, and confirm thumbnails generate correctly." },
    { verb: "Harden", detail: "Leave the upload folder with correct, not overly open, permissions and tell you the largest file size the server now accepts." },
  ],
  safeChecks: [
    "Resize the image to under 2560 pixels wide and try again. If the smaller copy uploads, the server is running short on resources for large images.",
    "Rename the file to plain letters and numbers (no spaces, accents or symbols) and upload it in a private window.",
  ],
  urgency: "standard",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why does WordPress just say \"HTTP error.\"?", a: "The uploader only knows the server request failed. The real reason is in the server or PHP log, which is where we look first." },
    { q: "Is it safe to set the uploads folder to 777?", a: "No. That lets any process on the server write to it, which attackers can abuse. The correct fix is the right owner and standard permissions." },
    { q: "Can I keep uploading by shrinking every image?", a: "As a workaround, yes, and smaller images help page speed anyway. But if normal sized photos fail, something on the server should be fixed." },
    { q: "Could a plugin be causing it?", a: "Yes. Image optimization, watermark and security plugins all run during uploads. If one fails, the whole upload fails. We test with them paused to rule them in or out." },
  ],
  relatedSlugs: ["memory-exhausted-error", "plugin-conflict", "php-upgrade-broke-site", "slow-wordpress-site"],
  seo: {
    title: "Fix WordPress HTTP Error Uploading Images | FixMyWP",
    description: "Media library says \"HTTP error.\" on upload? We find the PHP limit, permission or plugin blocking it and get image uploads working again.",
  },
  image: { slot: "illustration-http-error-uploading-images", alt: "The WordPress media uploader showing a red HTTP error next to an image file" },
});
