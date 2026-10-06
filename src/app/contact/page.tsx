import type { Metadata } from "next";
import { BookLink, ChatButton } from "@/components/Cta";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact FixMyWP at ${site.email}, chat with an engineer, or book a WordPress fix.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <h1>Contact</h1>
      <p>
        Site broken right now? <BookLink location="contact" /> <ChatButton location="contact" />
      </p>
      <p>24/7 emergency client support.</p>
      <address>
        {site.name}
        <br />
        {site.address.street}
        <br />
        {site.address.locality} {site.address.region} {site.address.postalCode}
        <br />
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </address>
      <p>Hours: {site.hours}</p>
    </>
  );
}
