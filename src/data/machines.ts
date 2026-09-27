import type { Machine, MachineConfiguration } from "@/lib/types";

/**
 * SEED CATALOGUE — RIPPA lineup. Model names, engines, operating weights, horsepower and pricing
 * are taken from the dealer's current published listings (G&J Equipment, Sept 2026). Dig depth /
 * bucket specs were not published and are left blank. After the first `npm run seed`, edit
 * everything in the admin at /admin — this file is only used to seed the database.
 */

const cfg = (id: string, label: string, engine: string, hp: string, weight: string, price?: number): MachineConfiguration => ({ id, label, engine, horsepower: hp, operatingWeight: weight, price });

const exc = (
  id: string, slug: string, modelName: string, series: "ECO" | "PRO", shortDescription: string, configurations: MachineConfiguration[],
  extra: Partial<Machine> = {},
): Machine => ({
  id, slug, category: "excavators", modelName, series: `${series} Series`, brand: "RIPPA", shortDescription, images: [], documents: [], features: [], standardEquipment: [], applications: [], faqs: [], certifications: [], applicationFit: [], checklist: [],
  configurations, showPrice: true, featured: false, builderEnabled: true, sortOrder: 0,
  operatingWeight: configurations[0]?.operatingWeight, engine: configurations.map((c) => c.engine).filter((v, i, a) => v && a.indexOf(v) === i).join(" / "),
  warranty: "2 year warranty",
  specs: [
    { label: "Operating weight", value: configurations[0]?.operatingWeight ?? "", icon: "weight", highlight: true },
    { label: "Engine", value: configurations.map((c) => c.engine).filter((v, i, a) => v && a.indexOf(v) === i).join(" / "), icon: "engine", highlight: true },
    { label: "Horsepower", value: configurations.map((c) => c.horsepower).filter((v, i, a) => v && a.indexOf(v) === i).join(" / "), icon: "power", highlight: true },
    { label: "Warranty", value: "2 year", icon: "warranty", highlight: true },
  ],
  ...extra,
});

const ss = (
  id: string, slug: string, modelName: string, shortDescription: string, configurations: MachineConfiguration[], extra: Partial<Machine> = {},
): Machine => ({
  id, slug, category: "skid-steers", modelName, series: "RS Series", brand: "RIPPA", shortDescription, images: [], documents: [], features: [], standardEquipment: [], applications: [], faqs: [], certifications: [], applicationFit: [], checklist: [],
  configurations, showPrice: true, featured: false, builderEnabled: false, sortOrder: 0,
  operatingWeight: configurations[0]?.operatingWeight, engine: configurations.map((c) => c.engine).filter((v, i, a) => v && a.indexOf(v) === i).join(" / "),
  warranty: "2 year warranty",
  specs: [
    { label: "Operating weight", value: configurations[0]?.operatingWeight ?? "", icon: "weight", highlight: true },
    { label: "Engine", value: configurations.map((c) => c.engine).filter((v, i, a) => v && a.indexOf(v) === i).join(" / "), icon: "engine", highlight: true },
    { label: "Horsepower", value: configurations.map((c) => c.horsepower).filter((v, i, a) => v && a.indexOf(v) === i).join(" / "), icon: "power", highlight: true },
    { label: "Warranty", value: "2 year", icon: "warranty", highlight: true },
  ],
  ...extra,
});

export const machines: Machine[] = [
  // ---------------- Mini excavators R10 – R82 ----------------
  exc("exc-r10-6-eco", "r10-eco", "R10 ECO", "ECO", "1-tonne class entry excavator. Gas or Kubota diesel, canopy or cabin. Ideal for homeowners, rentals and tight access.", [
    cfg("r10-bs-canopy", "B&S Gasoline · Canopy", "Briggs & Stratton gasoline", "13.5 hp", "1,078 kg", 13151),
    cfg("r10-bs-cabin", "B&S Gasoline · Cabin", "Briggs & Stratton gasoline", "13.5 hp", "1,078 kg", 14472),
    cfg("r10-z482-canopy", "Kubota Z482 · Canopy", "Kubota Z482 diesel", "11 hp", "1,142 kg", 17874),
    cfg("r10-z482-cabin", "Kubota Z482 · Cabin", "Kubota Z482 diesel", "11 hp", "1,142 kg", 19188),
  ], { sortOrder: 1, featured: true }),
  exc("exc-r13-4-pro", "r13-pro", "R13 PRO", "PRO", "Compact PRO-series excavator with Kubota D722 power for landscaping and utility work.", [
    cfg("r13-d722-canopy", "Kubota D722 · Canopy", "Kubota D722 diesel", "13.7 hp", "1,323 kg", 24650),
  ], { sortOrder: 2 }),
  exc("exc-r15-5-eco", "r15-eco", "R15 ECO", "ECO", "Our most popular compact excavator. Balanced size, power and price for contractors and property owners.", [
    cfg("r15-d722-canopy", "Kubota D722 · Canopy", "Kubota D722 diesel", "13.7 hp", "1,532 kg", 22677),
    cfg("r15-d722-cabin", "Kubota D722 · Cabin", "Kubota D722 diesel", "13.7 hp", "1,532 kg", 24049),
  ], { sortOrder: 3, featured: true, badge: "Most Popular" }),
  exc("exc-r18-5-pro", "r18-pro", "R18 PRO", "PRO", "Step-up power and reach in the 2-tonne class with Kubota D902.", [
    cfg("r18-d902-canopy", "Kubota D902 · Canopy", "Kubota D902 diesel", "15.8 hp", "1,933 kg", 36339),
    cfg("r18-d902-cabin", "Kubota D902 · Cabin", "Kubota D902 diesel", "15.8 hp", "1,933 kg", 37707),
  ], { sortOrder: 4, featured: true }),
  exc("exc-r22-3-pro", "r22-pro", "R22 PRO", "PRO", "2.5-tonne class digging performance with Kubota D1105 for contractors.", [
    cfg("r22-d1105-canopy", "Kubota D1105 · Canopy", "Kubota D1105 diesel", "22.9 hp", "2,539 kg", 46052),
    cfg("r22-d1105-cabin", "Kubota D1105 · Cabin", "Kubota D1105 diesel", "22.9 hp", "2,539 kg", 48839),
  ], { sortOrder: 5 }),
  exc("exc-r32-5-pro", "r32-pro", "R32 PRO", "PRO", "3.5-tonne class excavator with Kubota V1505 and enclosed cab option for year-round Ontario work.", [
    cfg("r32-v1505-cabin", "Kubota V1505 · Cabin", "Kubota V1505 diesel", "22.9 hp", "3,623 kg", 44950),
    cfg("r32-v1505-canopy", "Kubota V1505 · Canopy", "Kubota V1505 diesel", "22.9 hp", "3,623 kg", 55598),
  ], { sortOrder: 6, featured: true }),
  exc("exc-r57-pro", "r57-pro", "R57 PRO", "PRO", "6-tonne class excavator with Kubota V2607. Rubber or steel track options.", [
    cfg("r57-rb", "Kubota V2607 · RB", "Kubota V2607 diesel", "46.9 hp", "5,792 kg", 75919),
    cfg("r57-rb-sb", "Kubota V2607 · RB-SB", "Kubota V2607 diesel", "46.9 hp", "5,792 kg", 79250),
    cfg("r57-sb-st", "Kubota V2607 · SB-ST", "Kubota V2607 diesel", "46.9 hp", "5,792 kg", 81390),
  ], { sortOrder: 7 }),
  exc("exc-r82-pro", "r82-pro", "R82 PRO", "PRO", "8-tonne class excavator with Yanmar 4TNV98 power for full-size site work.", [
    cfg("r82-rb", "Yanmar 4TNV98 · RB", "Yanmar 4TNV98L / 4TNV98C diesel", "60.3 hp", "8,200 kg", 119170),
    cfg("r82-st", "Yanmar 4TNV98 · ST", "Yanmar 4TNV98L / 4TNV98C diesel", "60.3 hp", "8,200 kg", 121341),
  ], { sortOrder: 8 }),

  // ---------------- Skid steers RS03 – RS20 ----------------
  ss("ss-rs03-2", "rs03", "RS03", "Mini tracked loader. Walk-behind class power for landscaping and tight sites.", [
    cfg("rs03-bs-tracked", "B&S Gasoline · Tracked", "Briggs & Stratton XR2100 gasoline", "13.5 hp", "639 kg", 7900),
  ], { sortOrder: 1 }),
  ss("ss-rs04-2", "rs04", "RS04", "Compact loader available tracked or wheeled, gas or Kubota diesel.", [
    cfg("rs04-bs-tracked", "B&S Gasoline · Tracked", "Briggs & Stratton 3864 gasoline", "22.8 hp", "906 kg", 9039),
    cfg("rs04-z482-tracked", "Kubota Z482 · Tracked", "Kubota Z482 diesel", "11 hp", "930 kg", 12532),
    cfg("rs04-z482-wheeled", "Kubota Z482 · Wheeled", "Kubota Z482 diesel", "11 hp", "800 kg", 12710),
  ], { sortOrder: 2, featured: true }),
  ss("ss-rs06-3", "rs06", "RS06", "Tracked loader with Kubota D1105 diesel for grading and material handling.", [
    cfg("rs06-d1105-tracked", "Kubota D1105 · Tracked", "Kubota D1105 diesel", "24.8 hp", "1,475 kg", 26638),
  ], { sortOrder: 3 }),
  ss("ss-rs07-2", "rs07", "RS07", "Cabin loader with Kubota D1105, tracked or wheeled.", [
    cfg("rs07-d1105-tracked", "Kubota D1105 · Tracked · Cabin", "Kubota D1105 diesel", "24.4 hp", "1,386 kg", 34977),
    cfg("rs07-d1105-wheeled", "Kubota D1105 · Wheeled · Cabin", "Kubota D1105 diesel", "24.4 hp", "1,386 kg", 32117),
  ], { sortOrder: 4, featured: true }),
  ss("ss-rs10", "rs10", "RS10", "Full-size wheeled skid steer with Kubota V2607 and enclosed cab.", [
    cfg("rs10-v2607-wheeled", "Kubota V2607 · Wheeled · Cabin", "Kubota V2607 diesel", "47.6 hp", "3,025 kg", 63857),
  ], { sortOrder: 5, featured: true }),
  ss("ss-rs20-2", "rs20", "RS20", "Heavy-duty loader with Kubota V2607, tracked or wheeled, enclosed cab.", [
    cfg("rs20-v2607-tracked", "Kubota V2607 · Tracked · Cabin", "Kubota V2607 diesel", "47.6 hp", "4,064 kg", 80216),
    cfg("rs20-v2607-wheeled", "Kubota V2607 · Wheeled · Cabin", "Kubota V2607 diesel", "47.6 hp", "4,064 kg", 82015),
  ], { sortOrder: 6 }),

  // ---------------- Other categories (placeholders until models are confirmed) ----------------
];

export const getMachine = (idOrSlug: string) => machines.find((m) => m.id === idOrSlug || m.slug === idOrSlug);
export const getMachinesByCategory = (category: string) =>
  machines.filter((m) => m.category === category).sort((a, b) => a.sortOrder - b.sortOrder);
export const builderMachines = () => machines.filter((m) => m.builderEnabled && m.category === "excavators").sort((a, b) => a.sortOrder - b.sortOrder);
