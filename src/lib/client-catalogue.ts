import type { Catalogue } from "@/lib/pricing";

/**
 * The catalogue copy handed to client components (builder, quote list, lead form). They read names, slugs, prices,
 * configurations, variants, the first image and the highlighted specs; everything else (long copy, features, FAQs,
 * documents, full spec tables) stays server-only. Cuts the RSC payload on every page by roughly half.
 */
export function clientCatalogue(c: Catalogue): Catalogue {
  return {
    machines: c.machines.map((m) => ({
      ...m, longDescription: undefined, features: [], standardEquipment: [], applications: [], faqs: [], documents: [], checklist: [], applicationFit: [],
      specs: m.specs.filter((s) => s.highlight), images: m.images.slice(0, 1),
    })),
    attachments: c.attachments.map((a) => ({ ...a, longDescription: undefined, documents: [], images: a.images.slice(0, 1) })),
    addons: c.addons,
    warranties: c.warranties,
  };
}
