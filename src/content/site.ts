// Brand facts from the audit (docs/audit.md). Only owner-confirmed facts live here.
export const site = {
  name: "FixMyWP",
  url: "https://fixmywp.com",
  email: "help@fixmywp.com",
  colors: { primary: "#CC3333", secondary: "#399A35" },
  guaranteeDays: 30,
  hackedPromise: "restored in a day or less",
  plan: {
    name: "Hosting and maintenance plan",
    freeFixValue: "$150.00",
  },
  address: {
    street: "2852 S. Willamette St. #272",
    locality: "Eugene",
    region: "OR",
    postalCode: "97405",
    country: "US",
  },
  hours: "Mon. to Fri. 8am to 6pm PST",
} as const;
