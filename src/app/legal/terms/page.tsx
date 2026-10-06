import type { Metadata } from "next";
import { LegalPending } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";

// fixmywp.com text, shown only when brand.legacy.enabled (it belongs to that business). Copied word for word from the live https://fixmywp.com/tos (noindex, follow there too).
export const metadata: Metadata = {
  title: brand.legacy.enabled ? { absolute: "Fix My WP Terms Service" } : "Terms of Service",
  alternates: { canonical: routes.legal.terms },
  robots: { index: false, follow: true },
};

export default function Terms() {
  if (!brand.legacy.enabled) return <LegalPending title="Terms of Service" />;
  return (
    <article>
      <h1>Terms Of Service</h1>

      <h2>Membership</h2>
      <p>
        You need not be a member of the Site to access or use the content or services. However, access to some areas of
        the Site and some content and services may also be restricted to members only.
      </p>
      <p>On becoming a member, you will be required to enter into a separate Membership Agreement.</p>

      <h2>Proprietary Rights</h2>
      <p>
        Your use of the Site does not grant to you any ownership or interest in any content, code, data or materials you
        may access on or through the Site or any intellectual property rights subsisting any content, code, data or
        materials you may access on or through the Site.
      </p>
      <p>
        You may download a single copy of any content contained on the Site, solely for your personal, non-commercial
        use, consistent with these terms of use, provided that you maintain the copyright and other notices contained in
        that content. This excludes products available for sale/licensing on the Sites.
      </p>
      <p>
        If you make other use of the Site, or the Products, content, code, data or materials on the Site or available
        through the Site, except as otherwise provided above, you will violate copyright and other laws of Greece, other
        countries, as well as applicable state laws and may be subject to liability for such unauthorized use.
      </p>

      <h2>Copyright Agent</h2>
      <p>
        We respect the intellectual property rights of others.If you believe that your work has been copied in a way
        that constitutes copyright infringement, please forward the following information to <strong>FIXMYWP</strong>
        :your address, telephone number, and email address;
      </p>
      <p>a description of where the alleged infringing material is located;</p>
      <p>a description of the copyrighted work that you claim has been infringed; and</p>
      <p>
        a statement by you, that you warrant that the above information in your notice is accurate and that you are the
        copyright owner or are authorised to act on the copyright owner’s behalf.
      </p>

      <h2>Trade Marks</h2>
      <p>
        The trade marks, logos, service marks and trade names (collectively the Trade Marks) displayed on the Site, or on
        content available through the Site, are registered and unregistered Trade Marks of <strong>FIXMYWP</strong>.
      </p>
      <p>
        Nothing contained on the Site should be construed as granting expressly or by implication any license or right to
        use any Trademark displayed on the Site without the written permission of <strong>FIXMYWP</strong>.
      </p>

      <h2>Changes to Terms of and Conditions</h2>
      <p>
        <strong>FIXMYWP</strong> may, at its sole discretion, revise or change these Terms and Conditions (in whole or in
        part) from time to time and at any time without notice to you.
      </p>
      <p>Changes in the Terms and Conditions will be effective when posted by us on this page.</p>
      <p>
        Your continued use of the Site and/or the services made available on or through the Site after any changes to
        the Terms and Conditions are posted will be considered acceptance of those changes.
      </p>

      <h2>User Information</h2>
      <p>
        In the course of your use of the Site and/or the content or services made available on, or through, the Site,
        you may be asked to provide certain personalized information to us (User Information). <strong>FIXMYWP</strong>{" "}
        information collection and use policies with respect to the privacy of such User Information are set out in the{" "}
        <strong>FIXMYWP</strong> Privacy Policy.
      </p>
      <p>You are solely responsible for the accuracy and content of User Information.</p>

      <h2>Linking to the Site</h2>
      <p>
        You agree that if you include a link from any other web site to the Site, such link must link to the full
        version of an HTML formatted page of the Site.
      </p>
      <p>
        You are not permitted to link directly to any image hosted on the Site or our services, such as using an
        “in-line” linking method to cause the image hosted by us to be displayed on another web site.
      </p>
      <p>
        You agree not to download or use images hosted on the Site on another web site, for any purpose, including,
        without limitation, posting such images on another web site.
      </p>
      <p>
        You agree not to link from any other web site to the Site in any manner such that the Site, or any page of the
        Site, is “framed,” surrounded or obfuscated by any third party content, materials or branding.
      </p>
      <p>
        We reserve our right to insist that any link to the Site be discontinued, and to revoke your right to link to
        the Site from any other web site at any time upon written notice to you.
      </p>

      <h2>Third Party Sites</h2>
      <p>You may be able to move from the Site to third party web sites (Linked Site).</p>
      <p>
        You acknowledge and agree that we have no responsibility for the information, content, products, services,
        advertising, code or other materials which may or may not be provided by or through Linked Site, even if they are
        owned or run by affiliates of ours.
      </p>
      <p>
        The inclusion of any link to such web sites on our Site does not imply <strong>FIXMYWP</strong> endorsement,
        sponsorship, or recommendation of that web site.
      </p>
      <p>FIXMYWP disclaims any liability for links to another web site.</p>

      <h2>Disclaimer</h2>
      <p>
        The Trade Practices Act and similar state and territory legislation in Greece may confer rights and remedies on
        you in relation to the provision goods or services on the Site which cannot be excluded, restricted or modified by{" "}
        <strong>FIXMYWP</strong> (Non-excludable Rights).
      </p>
      <p>
        <strong>FIXMYWP</strong> does not exclude any Non-excludable Rights but does exclude all other conditions and
        warranties implied by custom, law or statute.
      </p>
      <p>
        Except as provided for by the Non-excludable Rights:all content and services on the Site is provided “as is” and
        without warranties of any kind, either express or implied;
      </p>
      <p>
        <strong>FIXMYWP</strong> and its suppliers expressly disclaim all warranties of any kind, including but not
        limited to implied warranties of merchantability and fitness for a particular purpose;
      </p>
      <p>
        <strong>FIXMYWP</strong> does not warrant that the functions contained in any content or your access to the Site
        will be uninterrupted or error-free, that any defects will be corrected or that the Site or the server which
        stores and transmits content to you are free of viruses or any other harmful components; and
      </p>
      <p>
        <strong>FIXMYWP</strong> does not warrant or make any representation regarding your access to, or the results of
        your access to, the Site (including any related or linked web sites) or any content in terms of correctness,
        accuracy, timeliness, completeness, reliability or otherwise.
      </p>
      <p>
        Under no circumstances (including but not limited to any act or omission on the part of <strong>FIXMYWP</strong>)
        will <strong>FIXMYWP</strong> or its affiliates be liable for any indirect, incidental, special and/or
        consequential damages or loss of profits whatsoever which result from any use or access of, or any inability to
        use or access, the Site or the content.To the fullest extent permitted by law, <strong>FIXMYWP</strong>’s
        liability for breach of any implied warranty or condition which cannot be excluded is limited at the option of{" "}
        <strong>FIXMYWP</strong> to the following:in the case of services supplied or offered by{" "}
        <strong>FIXMYWP</strong>:
      </p>
      <p>the supply of the services again;</p>
      <p>the payment of the cost of having services supplied again; and</p>
      <p>in the case of goods supplied or offered by us:</p>
      <p>the replacement of the goods or the supply of equivalent goods; or</p>
      <p>the payment of the cost of replacing the goods or acquiring equivalent goods.</p>

      <h2>Applicable Laws</h2>
      <p>
        We control and operate the Sites from our offices in Greece in accordance with the laws of Greece. We do not
        represent that materials on the Site are appropriate or available for use in other locations. Persons who choose
        to access the Site from other locations do so on their own initiative, and are responsible for compliance with
        local laws, if and to the extent local laws are applicable.
      </p>
    </article>
  );
}
