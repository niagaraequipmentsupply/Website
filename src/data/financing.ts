import type { FinancingConfig, FinancePromo } from "@/lib/types";

/**
 * Monthly payment examples are only rendered when `showEstimates` is true AND rate/term are set.
 * Leave false until the dealer confirms lender assumptions.
 */
export const financing: FinancingConfig = {
  showEstimates: false,
  annualRate: undefined,
  termMonths: 60,
  downPaymentPercent: 0,
  disclaimer: "Financing available on approved credit (OAC). Rates, terms and payments vary by applicant and lender. Contact us for a personalized quote.",
  partner: {
    name: "LeaseLink",
    url: "https://www.leaselink.ca/",
    applyUrl: "https://www.leaselink.ca/request-a-quote",
    blurb: "Lease Link Canada is a Canadian commercial equipment finance brokerage, serving Canadian businesses since 1998 with more than 20 lending partners. Lease-to-own equipment financing with flexible terms, seasonal payment structures and minimal or zero down payment options on approved credit.",
  },
};

/**
 * SAMPLE promotions & programs — edit or deactivate in the admin before launch.
 * Promo model IDs below are seed IDs; the seed script maps them to database records.
 */
export const financePromos: FinancePromo[] = [
  // 0% promo template — kept inactive; activate in /admin with real dates when an offer is running.
  {
    id: "promo-0pct", title: "0% financing on select mini excavators", kind: "promo", badge: "0% APR",
    summary: "Finance an eligible in-stock RIPPA mini excavator at 0% for 24 months on approved credit. Limited time and limited units.",
    highlights: ["0% APR for 24 months", "As little as 10% down", "In-stock units only"],
    terms: "Sample offer. On approved credit through our financing partner. Offer applies to eligible models while supplies last; cannot be combined with other offers. Ends when the end date passes.",
    startDate: undefined, endDate: undefined, eligibleModelIds: ["exc-r15-5-eco", "exc-r18-5-pro", "exc-r32-5-pro"], ctaLabel: "Get pre-approved", ctaHref: "#apply", featured: true, sortOrder: 1,
  },
  {
    id: "promo-no-pay-90", title: "No payments for 90 days", kind: "promo", badge: "No payments 90 days",
    summary: "Take delivery now and make your first payment in three months. Ideal for lining up a new machine before the season starts.",
    highlights: ["First payment deferred 90 days", "Available on finance and lease", "All new RIPPA machines"],
    terms: "Sample offer. Interest accrues from the delivery date. On approved credit; subject to lender approval.",
    eligibleModelIds: "all", ctaLabel: "Ask about deferred payments", ctaHref: "#apply", featured: false, sortOrder: 2,
  },
  {
    id: "program-seasonal", title: "Seasonal lease", kind: "program", badge: "Seasonal payments",
    summary: "Match payments to your cash flow. Pay more in your busy months and less (or nothing) in the off-season — built for landscapers, snow contractors and farms.",
    highlights: ["Skip-payment months in the off-season", "Lease-to-own with a buyout at term end", "Bundle attachments, warranty and delivery"],
    terms: "Structured through our financing partner on approved credit. Seasonal schedules depend on business type and lender approval.",
    eligibleModelIds: "all", ctaLabel: "Build a seasonal plan", ctaHref: "#apply", featured: false, sortOrder: 3,
  },
  {
    id: "program-lease-to-own", title: "Lease-to-own", kind: "program", badge: "Lease",
    summary: "Lower monthly payments than a loan with the option to own the machine at the end of the term. Payments may be fully deductible as an operating expense — ask your accountant.",
    highlights: ["Terms from 24 to 72 months", "$10 or fair-market-value buyout options", "Minimal or zero down on approved credit"],
    terms: "Terms and buyout options vary by lender and credit profile.",
    eligibleModelIds: "all", ctaLabel: "Get a lease quote", ctaHref: "#apply", featured: false, sortOrder: 4,
  },
  {
    id: "program-loan", title: "Equipment loan", kind: "program", badge: "Finance",
    summary: "Straightforward fixed-rate financing. Own the machine from day one and build equity with every payment.",
    highlights: ["Fixed monthly payments", "Finance the machine, attachments and delivery together", "Early payout options"],
    terms: "Rates and terms on approved credit.",
    eligibleModelIds: "all", ctaLabel: "Get pre-approved", ctaHref: "#apply", featured: false, sortOrder: 5,
  },
];
