import type { Metadata } from "next";
import Link from "next/link";

// Text copied word for word from the live https://fixmywp.com/privacy-policy (noindex, follow there too).
export const metadata: Metadata = {
  title: { absolute: "Fix My WP Privacy Policy" },
  alternates: { canonical: "/legal/privacy" },
  robots: { index: false, follow: true },
};

export default function Privacy() {
  return (
    <article>
      <h1>Privacy Policy</h1>

      <h2>GENERAL INFO</h2>
      <p>
        Our primary purpose in collecting personal information is to provide you with a safer browsing experience and
        better services. We only collect personal information about you that we consider necessary for this purpose and
        to achieve this goal.
      </p>
      <p>
        You are under no obligation to provide us with this information and can access many aspects of the Site without
        providing us any personal information.
      </p>
      <p>When you visit this website, we can record certain information in relation to your visit such as:</p>
      <ul>
        <li>Your IP or proxy server IP;</li>
        <li>Basic domain information;</li>
        <li>Your Internet service provider is sometimes captured depending on the configuration of your ISP connection;</li>
        <li>The date and time of your visit to the website;</li>
        <li>The length of your session;</li>
        <li>The pages which you have accessed;</li>
        <li>The number of times you access our site within any month;</li>
        <li>The size of file you look at;</li>
        <li>The website which referred you to our website; and</li>
        <li>The operating system which your computer uses.</li>
      </ul>
      <p>This information is only used for statistical and website development purposes.</p>
      <p>
        Various pages on this Site invite you to provide us your name and contact details, for example, to go onto our
        mailing list for our newsletter updates, or to enable us to provide you with support related services.
      </p>
      <p>
        If you use our Site’s feedback and support forms, you are asked to provide your name, organisation, title,
        address, email address and telephone number. FIXMYWP will not otherwise collect information from you through
        this Site unless you knowingly provide it to us.
      </p>
      <p>
        By voluntarily providing information to us when using the Site, you are consenting to the collection and use of
        your personal information by us.
      </p>
      <p>
        The Site uses session cookies, which are used only during a browsing session, and expire when you quit your
        browser. Upon closing your browser, the session cookie set by this Site is destroyed and no personal information
        is maintained which might identify you should you visit our Site at a later date.
      </p>

      <h2>USE OF INFORMATION AND DISCLOSURE</h2>
      <p>FIXMYWP will only use the information it collects through the Site for the following purposes:</p>
      <ul>
        <li>Forwarding important information relating to FIXMYWP activities and other requested information;</li>
        <li>Contacting you in response to your feedback or query to discuss our services;</li>
        <li>Monitoring Site performance;</li>
        <li>Improving our Site and services to you;</li>
        <li>Internal administration; and</li>
        <li>Other purposes that are in accordance with your instructions.</li>
      </ul>
      <p>FIXMYWP will not give, sell, trade or otherwise disclose any personal information about you to a third party unless:</p>
      <ul>
        <li>You have provided us with your consent; or</li>
        <li>We are required to do so by law.</li>
      </ul>

      <h2>COOKIES AND ADVERTISING</h2>
      <p>
        Cookies are small files that a site or its service provider transfers to your computers hard drive through your
        Web browser (if you allow) that enables the sites or service providers systems to recognize your browser and
        capture and remember certain information.
      </p>
      <p>
        We use cookies to help us remember and process the items in your shopping cart, understand and save your
        preferences for future visits, keep track of advertisements and compile aggregate data about site traffic and
        site interaction so that we can offer better site experiences and tools in the future. We may contract with
        third-party service providers to assist us in better understanding our site visitors. These service providers are
        not permitted to use the information collected on our behalf except to help us conduct and improve our business.
      </p>
      <p>
        If you prefer, you can choose to have your computer warn you each time a cookie is being sent, or you can choose
        to turn off all cookies via your browser settings. Like most websites, if you turn your cookies off, some of our
        services may not function properly. However, you can still place orders by contacting customer service.
      </p>

      <h2>DISCLAIMER</h2>
      <p>
        This Site contains links to other sites. FIXMYWP is not responsible for the privacy practices of linked sites.
        Underlined words and phrases are click-through links or hyperlinks to pages and websites. FIXMYWP strongly
        recommends that you read the Privacy Policy of the linked websites as they may contain further terms and
        conditions which apply to you.
      </p>

      <h2>SECURITY</h2>
      <p>
        This Site has security measures in place to protect the loss or misuse of, or alteration or unauthorised access
        to, information under our control. However, if you send information to this Site, it will not be encrypted unless
        we expressly tell you it is.
      </p>

      <h2>AMENDMENTS TO THE PRIVACY POLICY</h2>
      <p>We may change this Policy. Such changes will be effective when a notice of the change is made available on the Site.</p>

      <h2>ONLINE PRIVACY ONLY</h2>
      <p>This online privacy policy applies only to information collected through our website and not to information collected offline.</p>

      <h2>TERMS OF SERVICES</h2>
      <p>
        Please also <Link href="/legal/terms">visit our Terms of Services section</Link> establishing the use,
        disclaimers, and limitations of liability governing the use of our website
      </p>

      <h2>YOUR CONSENT</h2>
      <p>By using our site, you consent to our privacy policy.</p>

      <h2>CHANGES TO OUR PRIVACY POLICY</h2>
      <p>If we decide to change our privacy policy, we will post those changes on this page.</p>
    </article>
  );
}
