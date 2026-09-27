/**
 * Typed data models for Niagara Equipment Supply.
 * All catalogue content renders from these shapes. Replace the local data files in `src/data`
 * with a CMS / Supabase adapter that returns the same types and no component needs to change.
 */

export type CategorySlug = "excavators" | "skid-steers" | "loaders" | "track-dumpers";
export type AttachmentCategorySlug = "excavator-attachments" | "skid-steer-attachments" | "loader-attachments";

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  image?: ImageAsset;
  sortOrder: number;
  /** Category landing-page content (all optional; sections hide when empty). */
  intro?: string;
  buyingGuide: BuyingGuideEntry[];
  highlights: CategoryHighlight[];
  faqs: Faq[];
}

export interface NavLeaf { label: string; href: string }

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  image?: ImageAsset;
  /** Placeholder art kind used until a photo is uploaded. */
  artKind?: "excavators" | "skid-steers" | "loaders" | "track-dumpers" | "attachment" | "generic";
  /** Second level (e.g. attachment types under a category). */
  children?: NavLeaf[];
}

export interface NavGroup {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface AttachmentCategory {
  slug: AttachmentCategorySlug;
  name: string;
  description: string;
  /** Machine categories this attachment family fits. */
  image?: ImageAsset;
  machineCategories: CategorySlug[];
  sortOrder: number;
}

export type SpecGroup = "general" | "performance" | "engine" | "dimensions";

export interface SpecValue {
  label: string;
  value: string;
  /** Imperial equivalent for the unit toggle, e.g. "7,432 lb". */
  imperial?: string;
  /** Section of the full spec table. */
  group?: SpecGroup;
  /** Icon key rendered by the SpecList component. */
  icon?: "weight" | "engine" | "depth" | "warranty" | "power" | "capacity" | "width" | "reach" | "generic";
  /** Show in compact card spec rows. */
  highlight?: boolean;
}

/** A purchasable configuration of a base model (engine / cab / undercarriage). */
export interface MachineConfiguration {
  id: string;
  label: string;
  engine?: string;
  horsepower?: string;
  operatingWeight?: string;
  /** CAD. Undefined = pricing on request. */
  price?: number;
  sku?: string;
  inStock?: boolean;
}

export interface DocumentAsset {
  label: string;
  url: string;
  kind?: "spec-sheet" | "brochure" | "manual" | "other";
}

export interface MachineFeature {
  eyebrow?: string;
  title: string;
  text: string;
  image?: ImageAsset;
}

export interface Faq { question: string; answer: string }

/** 0 = not compatible · 1 = usable but not optimal · 2 = compatible · 3 = well suited · 4 = highly suited */
export type FitRating = 0 | 1 | 2 | 3 | 4;
export interface ApplicationFit { application: string; rating: FitRating; attachments?: string }
export type ChecklistStatus = "standard" | "optional" | "na";
export interface ChecklistItem { group: "safety" | "comfort" | "other"; feature: string; status: ChecklistStatus; note?: string }

export interface BuyingGuideEntry { title: string; text: string; modelIds: string[] }
export interface CategoryHighlight { title: string; text: string }

export interface Machine {
  id: string;
  slug: string;
  category: CategorySlug;
  modelName: string;
  series?: string;
  brand: string;
  shortDescription: string;
  longDescription?: string;
  images: ImageAsset[];
  specs: SpecValue[];
  /** Engine / cab configurations. When present, list price = lowest configuration price ("Starting from"). */
  configurations: MachineConfiguration[];
  /** Downloadable spec sheets / brochures. */
  documents: DocumentAsset[];
  /** Landing-page style highlight blocks. */
  features: MachineFeature[];
  /** What ships with the machine as standard. */
  standardEquipment: string[];
  /** Best-fit jobs, e.g. "Pool excavation". */
  applications: string[];
  faqs: Faq[];
  /** e.g. "EPA Tier 4 Final", "CE". */
  certifications: string[];
  /** Comparison-chart data */
  targetUsers?: string;
  noiseLevel?: string;
  indoorUse?: boolean;
  /** Attachment mounting standard on this machine (skid steers / loaders). */
  plateType?: string;
  plateNote?: string;
  applicationFit: ApplicationFit[];
  checklist: ChecklistItem[];
  /** Undefined = pricing on request. Values in CAD. Ignored when configurations carry prices. */
  basePrice?: number;
  promoPrice?: number;
  /** Show price publicly. If false, always render "Request pricing". */
  showPrice: boolean;
  warranty?: string;
  engine?: string;
  operatingWeight?: string;
  featured: boolean;
  inStock?: boolean;
  builderEnabled: boolean;
  badge?: string;
  sortOrder: number;
  /** Placeholder records are sample content awaiting owner-supplied data. */
  isPlaceholder?: boolean;
}

export interface AttachmentVariant {
  id: string;
  label: string;
  widthOrSize?: string;
  sku?: string;
  /** Absolute price for this variant (CAD). Undefined = pricing on request. */
  price?: number;
  /** Restrict this variant further than the parent attachment. */
  compatibleModelIds?: string[];
  /** Mounting plate for this version when it differs across versions (skid steer -1 vs -2/-3). */
  plateType?: string;
  images?: ImageAsset[];
}

export interface Attachment {
  id: string;
  slug: string;
  attachmentCategory: AttachmentCategorySlug;
  attachmentType: string;
  name: string;
  description: string;
  longDescription?: string;
  images: ImageAsset[];
  documents: DocumentAsset[];
  /** Explicit model compatibility. Empty array + compatibleCategories = category-wide. */
  compatibleModelIds: string[];
  compatibleCategories: CategorySlug[];
  /** Mounting standard this attachment ships with. */
  plateType?: string;
  /** Source catalogue reference (e.g. rippagroup.ca URL). */
  sourceUrl?: string;
  variants: AttachmentVariant[];
  /** Used when there are no variants. Undefined = pricing on request. */
  basePrice?: number;
  showPrice: boolean;
  /** Allow quantity > 1 in builder/quote (e.g. teeth, tracks). */
  supportsQuantity: boolean;
  featured: boolean;
  inStock?: boolean;
  sortOrder: number;
  isPlaceholder?: boolean;
}

export type AddonType = "protection" | "pdi" | "delivery" | "service";

export interface Addon {
  id: string;
  name: string;
  type: AddonType;
  shortDescription: string;
  fullDescription?: string;
  /** Undefined = quote required. */
  price?: number;
  quoteRequired?: boolean;
  /** "all" or a list of eligible model IDs. */
  compatibleModelIds: "all" | string[];
  selectable: boolean;
  defaultSelected: boolean;
  icon: "shield" | "wrench" | "truck" | "file";
  sortOrder: number;
}

export interface WarrantyOption {
  id: string;
  name: string;
  termMonths: number;
  coverageSummary: string;
  eligibleModelIds: "all" | string[];
  price?: number;
  financeEligible: boolean;
  sortOrder: number;
}

export interface DeliveryOption {
  id: string;
  name: string;
  regionRule: string;
  flatPrice?: number;
  quoteRequired: boolean;
  description: string;
}

export type FinanceSelection = "cash" | "finance" | "lease";

export interface FinancePromo {
  id: string;
  title: string;
  kind: "promo" | "program";
  badge?: string;
  summary: string;
  highlights: string[];
  terms?: string;
  startDate?: string;
  endDate?: string;
  eligibleModelIds: "all" | string[];
  ctaLabel: string;
  ctaHref: string;
  featured: boolean;
  sortOrder: number;
}

export interface FinancingConfig {
  /** Only show a monthly estimate when the dealer has configured real assumptions. */
  showEstimates: boolean;
  annualRate?: number;
  termMonths?: number;
  downPaymentPercent?: number;
  disclaimer: string;
  partner?: { name: string; url: string; applyUrl?: string; blurb?: string };
}

export interface AttachmentSelection {
  attachmentId: string;
  variantId?: string;
  quantity: number;
}

export interface BuilderConfiguration {
  selectedModelId?: string;
  /** Chosen engine / cab configuration of the selected model. */
  selectedConfigurationId?: string;
  attachmentSelections: AttachmentSelection[];
  addonSelections: string[];
  warrantySelectionId?: string;
  deliverySelectionId?: string;
  financeSelection: FinanceSelection;
}

export interface PricedLine {
  id: string;
  group: "machine" | "attachment" | "protection" | "warranty" | "delivery";
  label: string;
  detail?: string;
  quantity: number;
  /** Undefined = price on request */
  unitPrice?: number;
  lineTotal?: number;
  quoteRequired: boolean;
}

export interface BuildTotals {
  lines: PricedLine[];
  subtotal: number;
  taxEstimate?: number;
  total: number;
  /** Number of lines with no public price. */
  unpricedCount: number;
}

/** Quote cart line items (quote-first sales flow, no checkout). */
export type QuoteItem =
  | { id: string; kind: "machine"; machineId: string; configurationId?: string; quantity: number }
  | { id: string; kind: "attachment"; attachmentId: string; variantId?: string; quantity: number }
  | { id: string; kind: "build"; name: string; configuration: BuilderConfiguration; createdAt: string };

export interface Post {
  id: string; slug: string; title: string; category: string; excerpt: string; publishedAt: string; cover?: ImageAsset; videoUrl?: string;
  /** Plain-text paragraphs (rich text flattened). */
  contentText: string; contentHtml?: string; relatedMachineIds: string[]; tags: string[]; readMinutes?: number; featured: boolean; author?: string;
}

export interface Lubricant {
  id: string; slug: string; name: string; brand: string; category: string; tagline?: string; description: string; grades?: string; applications: string[];
  packaging: string[]; approvals?: string; rippaUse?: string; images: ImageAsset[]; documents: DocumentAsset[]; featured: boolean; sortOrder: number;
}

export interface LeadPayload {
  source: "quote" | "builder" | "contact" | "financing" | "service" | "parts" | "lubricants" | "content-request";
  contact: { name: string; company?: string; email: string; phone: string; location?: string; message?: string };
  items?: QuoteItem[];
  builds?: { configuration: BuilderConfiguration; totals: BuildTotals }[];
  page?: string;
  submittedAt: string;
}
