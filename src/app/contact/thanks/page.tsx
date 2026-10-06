import type { Metadata } from "next";
import { routes } from "@/config/routes";
import { Handoff } from "./Handoff";

export const metadata: Metadata = {
  title: "Request ready",
  alternates: { canonical: routes.contactThanks },
  robots: { index: false, follow: false },
};

export default function Thanks() {
  return (
    <>
      <h1>One last step: send it to our engineers</h1>
      <Handoff />
    </>
  );
}
