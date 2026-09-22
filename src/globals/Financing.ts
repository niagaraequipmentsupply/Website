import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "@/collections/revalidate";

export const Financing: GlobalConfig = {
  slug: "financing",
  admin: { group: "Settings", description: "Monthly payment examples only appear when 'Show estimates' is on and a rate + term are set." },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "showEstimates", type: "checkbox", defaultValue: false },
    { type: "row", fields: [
      { name: "annualRate", type: "number", admin: { width: "33%", description: "% APR" } },
      { name: "termMonths", type: "number", defaultValue: 60, admin: { width: "33%" } },
      { name: "downPaymentPercent", type: "number", defaultValue: 0, admin: { width: "33%" } },
    ] },
    { name: "partnerName", type: "text", defaultValue: "LeaseLink", admin: { description: "Financing partner shown on the Financing page." } },
    { name: "partnerUrl", type: "text", defaultValue: "https://www.leaselink.ca/" },
    { name: "partnerApplyUrl", type: "text", admin: { description: "Direct online application link, if the partner provides one." } },
    { name: "partnerBlurb", type: "textarea", admin: { description: "One paragraph about the partner and what they finance." } },
    { name: "disclaimer", type: "textarea", defaultValue: "Financing available on approved credit (OAC). Rates, terms and payments vary by applicant and lender. Contact us for a personalized quote." },
  ],
};
