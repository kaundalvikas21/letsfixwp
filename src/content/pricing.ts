/**
 * Published prices. The owner fills these in; nothing here may be guessed (docs/section-contract.md rule 8).
 * null = not published yet, and the page renders nothing for it: no price line, no billing toggle, no saving.
 * Every price is a "from" price, since the work varies by problem and site.
 */
export type Price = { amount: number; currency: "INR" | "USD" };

export const prices: {
  fix: Price | null; // one-time fix, per fix
  cleanup: Price | null; // hacked site cleanup, per site
  planMonthly: Price | null; // care plan, billed monthly, per month
  planAnnual: Price | null; // care plan, billed yearly, per year
  planIsBestValue: boolean; // shows the "Best value" badge; set true only once the prices above bear it out
} = {
  fix: null,
  cleanup: null,
  planMonthly: null,
  planAnnual: null,
  planIsBestValue: false,
};

export const formatPrice = (p: Price) =>
  new Intl.NumberFormat(p.currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency: p.currency,
    maximumFractionDigits: 0,
  }).format(p.amount);

/** What a year costs on monthly billing minus the annual price. null when either is missing, currencies differ, or there is no saving. */
export const annualSaving = (monthly: Price | null, annual: Price | null): Price | null => {
  if (!monthly || !annual || monthly.currency !== annual.currency) return null;
  const amount = monthly.amount * 12 - annual.amount;
  return amount > 0 ? { amount, currency: annual.currency } : null;
};

// Self-check: the saving is computed, never typed in.
const t = annualSaving({ amount: 1000, currency: "INR" }, { amount: 10000, currency: "INR" });
if (t?.amount !== 2000 || annualSaving({ amount: 1000, currency: "INR" }, { amount: 12000, currency: "INR" }) !== null)
  throw new Error("pricing: annualSaving is wrong");
