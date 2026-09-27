import type { AttachmentCategory, Category } from "@/lib/types";

const empty = { buyingGuide: [], highlights: [], faqs: [] };

export const categories: Category[] = [
  { slug: "excavators", name: "Mini Excavators", shortName: "Excavators", description: "Compact RIPPA excavators for landscaping, utilities, trenching and tight-access sites.", sortOrder: 1, ...empty },
  { slug: "skid-steers", name: "Skid Steers", shortName: "Skid Steers", description: "Wheeled and tracked skid steer loaders built for grading, material handling and attachment work.", sortOrder: 2, ...empty },
  { slug: "loaders", name: "Loaders & Backhoes", shortName: "Loaders", description: "Articulated compact wheel loaders and the RB06 backhoe loader for farms, yards, snow and trenching.", sortOrder: 3, ...empty },
  { slug: "track-dumpers", name: "Track Dumpers", shortName: "Track Dumpers", description: "Tracked mini dumpers for moving material through gates and across lawns where wheels can't go.", sortOrder: 4, ...empty },
];

export const attachmentCategories: AttachmentCategory[] = [
  { slug: "excavator-attachments", name: "Excavator Attachments", description: "Buckets, thumbs, augers, rakes and more for RIPPA mini excavators.", machineCategories: ["excavators"], sortOrder: 1 },
  { slug: "skid-steer-attachments", name: "Skid Steer Attachments", description: "Buckets, forks, cutters, blowers and grapples for RS-series skid steers.", machineCategories: ["skid-steers"], sortOrder: 2 },
  { slug: "loader-attachments", name: "Loader Attachments", description: "Buckets, forks and snow equipment for compact wheel loaders.", machineCategories: ["loaders"], sortOrder: 3 },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getAttachmentCategory = (slug: string) => attachmentCategories.find((c) => c.slug === slug);
