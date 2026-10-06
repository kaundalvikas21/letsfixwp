import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "password-reset-not-working",
  title: "WordPress password reset not working",
  h1: "Fix WordPress password reset not working",
  errorText: "The email could not be sent. Possible reason: your host may have disabled the mail() function.",
  symptoms: [
    "WordPress shows \"The email could not be sent. Possible reason: your host may have disabled the mail() function.\"",
    "The page says a reset email was sent, but it never arrives",
    "Clicking the reset link shows \"Your password reset link appears to be invalid. Please request a new link below.\"",
    "The login page says \"Error: There is no account with that username or email address.\"",
  ],
  likelyCauses: [
    "The server cannot send email, or PHP mail() is disabled by the host",
    "Reset emails rejected or sent to spam because the domain lacks SPF, DKIM or DMARC records",
    "Email scanners or link tracking opening the reset link first and using up the one-time key",
    "The account email address being out of date or changed",
    "A security or login plugin replacing the normal reset process",
  ],
  safeChecks: [
    "Search your spam, junk and promotions folders for an email from WordPress with \"Password Reset\" in the subject.",
    "Request one new reset email and open the newest link straight away in a private window. Older links stop working once a new one is sent.",
  ],
  whenToCallUs:
    "If one fresh reset email does not arrive, or the newest link still says it is invalid, requesting more emails will not help. The next steps are setting a password directly in the database and fixing how the server sends mail, which needs hosting access and care with DNS records. Bring us in at that point, especially if other site emails are missing too.",
  parentService: "login-redirect-issues",
  urgency: "high",
  faqs: [
    { q: "Why does WordPress say the email was sent if I never get it?", a: "WordPress only knows it handed the message to the server. If the server cannot deliver it, or the receiving mailbox rejects it, WordPress has no way to tell you." },
    { q: "Can you reset the password without email?", a: "Yes. With hosting or database access we can set a new password directly, then fix email so future resets work on their own." },
    { q: "Why does my reset link say it is invalid?", a: "Each link works once and expires. Requesting a new email cancels the old link, and some company email scanners click links automatically before you do." },
    { q: "Is this related to my site not sending other emails?", a: "Usually yes. If reset emails fail, contact forms, order emails and notifications often fail too. Fixing sending fixes all of them." },
  ],
  seo: {
    title: "Fix WordPress Password Reset Not Working",
    description: "Password reset email never arrives or the link is invalid? We get you back into WordPress and fix email sending so resets work again.",
  },
  image: { slot: "illustration-password-reset-not-working", alt: "An empty email inbox next to a WordPress lost password form" },
});
