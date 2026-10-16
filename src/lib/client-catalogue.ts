import type { Catalogue } from "@/lib/pricing";
import type { ImageAsset } from "@/lib/types";

/** Drop undefined-valued keys: React serialises each one as "$undefined" in the page payload. */
function compact<T extends object>(o: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) if (v !== undefined) out[k] = v;
  return out as T;
}
/** Client components only need one small rendition of an image, not the responsive source list or the full-size file. */
const slimImage = (i: ImageAsset): ImageAsset => compact({ src: i.src, alt: i.alt, width: i.width, height: i.height }) as ImageAsset;

/**
 * The catalogue copy handed to client components (builder, quote list, lead form). They read names, slugs, prices,
 * configurations, variants, the first image and the highlighted specs; everything else (long copy, features, FAQs,
 * documents, full spec tables, source links, certifications, plate notes) stays server-only. Keeps the per-page
 * payload to roughly a third of the full catalogue.
 */
export function clientCatalogue(c: Catalogue): Catalogue {
  return {
    machines: c.machines.map((m) => compact({
      ...m, longDescription: undefined, features: [], standardEquipment: [], applications: [], faqs: [], documents: [], checklist: [], applicationFit: [],
      certifications: [], plateNote: undefined, targetUsers: undefined, noiseLevel: undefined,
      specs: m.specs.filter((s) => s.highlight), images: m.images.slice(0, 1).map(slimImage),
      configurations: m.configurations.map((cfg) => compact(cfg)),
    })),
    attachments: c.attachments.map((a) => compact({
      ...a, longDescription: undefined, documents: [], sourceUrl: undefined, images: a.images.slice(0, 1).map(slimImage),
      variants: a.variants.map((v) => compact({ ...v, images: undefined })),
    })),
    addons: c.addons,
    warranties: c.warranties,
  };
}
