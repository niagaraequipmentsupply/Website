import type { Attachment } from "@/lib/types";

/** Compact class (≤ 2 t) vs mid class (2.5 t+) — adjust per attachment once RIPPA confirms fitment. */
const EXC_COMPACT = ["exc-r10-6-eco", "exc-r13-4-pro", "exc-r15-5-eco", "exc-r18-5-pro"];
const EXC_MID = ["exc-r22-3-pro", "exc-r32-5-pro", "exc-r57-pro", "exc-r82-pro"];
const EXC_MODELS = [...EXC_COMPACT, ...EXC_MID];

/**
 * PLACEHOLDER CATALOGUE — prices/variants mirror the design mockups. Replace with real data.
 * Compatibility: set `compatibleModelIds` per attachment (and per variant if a size only fits some models).
 */
export const attachments: Attachment[] = [
  {
    id: "att-digging-bucket", slug: "digging-bucket", attachmentCategory: "excavator-attachments", attachmentType: "Buckets",
    name: "Digging Bucket", description: '12" – 24" options', images: [], documents: [], compatibleCategories: ["excavators"], compatibleModelIds: EXC_MODELS,
    showPrice: true, supportsQuantity: false, featured: true, sortOrder: 1, isPlaceholder: true,
    variants: [
      { id: "db-12", label: '12" Digging Bucket', widthOrSize: '12"', price: 1250 },
      { id: "db-18", label: '18" Digging Bucket', widthOrSize: '18"', price: 1250 },
      { id: "db-24", label: '24" Digging Bucket', widthOrSize: '24"', price: 1250, compatibleModelIds: ["exc-r15-5-eco", "exc-r18-5-pro", ...EXC_MID] },
    ],
  },
  {
    id: "att-ditching-bucket", slug: "ditching-bucket", attachmentCategory: "excavator-attachments", attachmentType: "Buckets",
    name: "Ditching Bucket", description: '48" grading bucket', images: [], documents: [], compatibleCategories: ["excavators"], compatibleModelIds: EXC_MODELS,
    variants: [], basePrice: 1450, showPrice: true, supportsQuantity: false, featured: false, sortOrder: 2, isPlaceholder: true,
  },
  {
    id: "att-hydraulic-thumb", slug: "hydraulic-thumb", attachmentCategory: "excavator-attachments", attachmentType: "Thumbs",
    name: "Hydraulic Thumb", description: "Improved grip & control", images: [], documents: [], compatibleCategories: ["excavators"], compatibleModelIds: EXC_MODELS,
    variants: [], basePrice: 1850, showPrice: true, supportsQuantity: false, featured: true, sortOrder: 3, isPlaceholder: true,
  },
  {
    id: "att-auger", slug: "auger", attachmentCategory: "excavator-attachments", attachmentType: "Augers",
    name: "Auger", description: '6" – 18" options', images: [], documents: [], compatibleCategories: ["excavators"], compatibleModelIds: EXC_MODELS,
    showPrice: true, supportsQuantity: false, featured: true, sortOrder: 4, isPlaceholder: true,
    variants: [
      { id: "aug-6", label: '6" Auger', widthOrSize: '6"', price: 2100 },
      { id: "aug-12", label: '12" Auger', widthOrSize: '12"', price: 2100 },
      { id: "aug-18", label: '18" Auger', widthOrSize: '18"', price: 2100, compatibleModelIds: ["exc-r18-5-pro", ...EXC_MID] },
    ],
  },
  {
    id: "att-rake", slug: "rake", attachmentCategory: "excavator-attachments", attachmentType: "Rakes",
    name: "Rake", description: "Land clearing & cleanup", images: [], documents: [], compatibleCategories: ["excavators"], compatibleModelIds: EXC_MODELS,
    variants: [], basePrice: 1650, showPrice: true, supportsQuantity: false, featured: true, sortOrder: 5, isPlaceholder: true,
  },
  {
    id: "att-tilt-bucket", slug: "tilt-bucket", attachmentCategory: "excavator-attachments", attachmentType: "Buckets",
    name: "Tilt Bucket", description: "Grading on slopes & ditches", images: [], documents: [], compatibleCategories: ["excavators"], compatibleModelIds: ["exc-r18-5-pro", ...EXC_MID],
    variants: [], showPrice: false, supportsQuantity: false, featured: true, sortOrder: 6, isPlaceholder: true,
  },
  {
    id: "att-hydraulic-breaker", slug: "hydraulic-breaker", attachmentCategory: "excavator-attachments", attachmentType: "Breakers",
    name: "Hydraulic Breaker", description: "Concrete & rock demolition", images: [], documents: [], compatibleCategories: ["excavators"], compatibleModelIds: ["exc-r15-5-eco", "exc-r18-5-pro", ...EXC_MID],
    variants: [], showPrice: false, supportsQuantity: false, featured: false, sortOrder: 7, isPlaceholder: true,
  },
  // Skid steer attachments
  {
    id: "att-4in1-bucket", slug: "4-in-1-bucket", attachmentCategory: "skid-steer-attachments", attachmentType: "Buckets",
    name: "4-in-1 Bucket", description: "Dig, doze, grab & grade", images: [], documents: [], compatibleCategories: ["skid-steers"], compatibleModelIds: [],
    variants: [], showPrice: false, supportsQuantity: false, featured: true, sortOrder: 1, isPlaceholder: true,
  },
  {
    id: "att-pallet-forks", slug: "pallet-forks", attachmentCategory: "skid-steer-attachments", attachmentType: "Forks",
    name: "Pallet Forks", description: "Material handling", images: [], documents: [], compatibleCategories: ["skid-steers"], compatibleModelIds: [],
    variants: [], showPrice: false, supportsQuantity: false, featured: true, sortOrder: 2, isPlaceholder: true,
  },
  {
    id: "att-brush-cutter", slug: "brush-cutter", attachmentCategory: "skid-steer-attachments", attachmentType: "Cutters",
    name: "Brush Cutter", description: "Clearing & vegetation", images: [], documents: [], compatibleCategories: ["skid-steers"], compatibleModelIds: [],
    variants: [], showPrice: false, supportsQuantity: false, featured: true, sortOrder: 3, isPlaceholder: true,
  },
  {
    id: "att-snow-blower", slug: "snow-blower", attachmentCategory: "skid-steer-attachments", attachmentType: "Snow Equipment",
    name: "Snow Blower", description: "Ontario winters, handled", images: [], documents: [], compatibleCategories: ["skid-steers"], compatibleModelIds: [],
    variants: [], showPrice: false, supportsQuantity: false, featured: true, sortOrder: 4, isPlaceholder: true,
  },
  {
    id: "att-grapple-bucket", slug: "grapple-bucket", attachmentCategory: "skid-steer-attachments", attachmentType: "Grapples",
    name: "Grapple Bucket", description: "Brush, debris & logs", images: [], documents: [], compatibleCategories: ["skid-steers"], compatibleModelIds: [],
    variants: [], showPrice: false, supportsQuantity: false, featured: true, sortOrder: 5, isPlaceholder: true,
  },
];

export const loaderAttachments: Attachment[] = [
  { id: "att-ld-gp-bucket", slug: "loader-gp-bucket", attachmentCategory: "loader-attachments", attachmentType: "Buckets", name: "General Purpose Bucket", description: "Bulk material & yard work", images: [], documents: [], compatibleCategories: ["loaders"], compatibleModelIds: [], variants: [], showPrice: false, supportsQuantity: false, featured: true, sortOrder: 1, isPlaceholder: true },
  { id: "att-ld-pallet-forks", slug: "loader-pallet-forks", attachmentCategory: "loader-attachments", attachmentType: "Forks", name: "Pallet Forks", description: "Material handling", images: [], documents: [], compatibleCategories: ["loaders"], compatibleModelIds: [], variants: [], showPrice: false, supportsQuantity: false, featured: true, sortOrder: 2, isPlaceholder: true },
  { id: "att-ld-snow-pusher", slug: "loader-snow-pusher", attachmentCategory: "loader-attachments", attachmentType: "Snow Equipment", name: "Snow Pusher", description: "Lots, lanes & yards", images: [], documents: [], compatibleCategories: ["loaders"], compatibleModelIds: [], variants: [], showPrice: false, supportsQuantity: false, featured: true, sortOrder: 3, isPlaceholder: true },
];
attachments.push(...loaderAttachments);

export const getAttachment = (idOrSlug: string) => attachments.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
export const getAttachmentsByCategory = (category: string) =>
  attachments.filter((a) => a.attachmentCategory === category).sort((a, b) => a.sortOrder - b.sortOrder);
export const featuredAttachments = (category: string) => getAttachmentsByCategory(category).filter((a) => a.featured);
