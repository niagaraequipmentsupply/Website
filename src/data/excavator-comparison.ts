import type { ApplicationFit, ChecklistItem, FitRating } from "@/lib/types";

/**
 * Excavator comparison data transcribed from the RIPPA "Your Home's Mini Construction Crew" buying guide.
 * Keyed by machine slug. R06-1 ECO is not in the dealer lineup and is omitted.
 */
const APPS = ["Pool digging", "Driveway repair", "Drainage trenching", "Stump removal", "Tree planting", "Snow removal", "Land levelling", "Fence installation", "Small foundations", "Farm construction"] as const;

type Row = { rating: FitRating; attachments: string }[];
const fit = (rows: Row): ApplicationFit[] => rows.map((r, i) => ({ application: APPS[i], rating: r.rating, attachments: r.attachments }));

const SAFETY = ["TOPS", "ROPS", "EU engine type", "Machinery Directive", "Electromagnetic compatibility (EMC)", "Whole-body vibration (WBV) test report", "Explosion-proof valve", "Quick-change push-button safety lock", "PP canopy cover", "Warning light", "Safety lock", "Protective mesh"];
const COMFORT = ["Air conditioner", "Seat", "Smart display", "Cab"];
type S = "standard" | "optional" | "na";
const checklist = (safety: (S | "-")[], comfort: { status: S; note?: string }[]): ChecklistItem[] => [
  ...SAFETY.map((feature, i) => ({ group: "safety" as const, feature, status: (safety[i] === "-" ? "na" : safety[i]) as S })),
  ...COMFORT.map((feature, i) => ({ group: "comfort" as const, feature, status: comfort[i].status, note: comfort[i].note })),
];
const std: S = "standard", opt: S = "optional", na: S = "na";

export interface ComparisonSeed {
  targetUsers: string; noiseLevel: string; indoorUse: boolean; warranty: string;
  applicationFit: ApplicationFit[]; checklist: ChecklistItem[];
}

export const excavatorComparison: Record<string, ComparisonSeed> = {
  "r10-eco": {
    targetUsers: "Homeowners for backyard projects", noiseLevel: "Ultra-quiet (zero disturbance)", indoorUse: true, warranty: "1 year warranty",
    applicationFit: fit([
      { rating: 1, attachments: "Bucket (600 mm), ripper" }, { rating: 1, attachments: "Single-cylinder tilting bucket (600 mm), mud bucket (600 mm)" }, { rating: 1, attachments: "Single-cylinder tilting bucket (600 mm), bucket (200 mm)" },
      { rating: 1, attachments: "Bucket, light log grapple" }, { rating: 1, attachments: "Bucket, auger (800 mm)" }, { rating: 1, attachments: "Single-cylinder tilting bucket (600 mm), bucket (600 mm)" },
      { rating: 1, attachments: "Single-cylinder tilting bucket (600 mm), rake (400 mm)" }, { rating: 1, attachments: "Bucket, auger (1,200 mm)" }, { rating: 1, attachments: "Breaker, single-cylinder tilting bucket (600 mm)" }, { rating: 0, attachments: "" },
    ]),
    checklist: checklist([na, na, std, std, std, std, na, std, std, std, std, std], [{ status: na }, { status: std, note: "Comfort seat" }, { status: na }, { status: opt }]),
  },
  "r13-pro": {
    targetUsers: "Budget-conscious homeowners needing stronger lifting power", noiseLevel: "Ultra-quiet (zero disturbance)", indoorUse: false, warranty: "2 year warranty",
    applicationFit: fit([
      { rating: 1, attachments: "Bucket (600 mm), ripper" }, { rating: 2, attachments: "Single-cylinder tilting bucket (800 mm), mud bucket (600 mm)" }, { rating: 2, attachments: "Single-cylinder tilting bucket (800 mm), bucket (200 mm)" },
      { rating: 1, attachments: "Bucket, light log grapple" }, { rating: 1, attachments: "Bucket, auger (800 mm)" }, { rating: 2, attachments: "Single-cylinder tilting bucket (800 mm), bucket (600 mm)" },
      { rating: 2, attachments: "Single-cylinder tilting bucket (800 mm), rake (400 mm)" }, { rating: 1, attachments: "Bucket, auger (1,200 mm)" }, { rating: 1, attachments: "Breaker, single-cylinder tilting bucket (800 mm)" }, { rating: 2, attachments: "Bucket, log grapple, auger (1,200 mm), rake (600 mm)" },
    ]),
    checklist: checklist([std, std, std, std, std, std, std, std, std, std, std, std], [{ status: na }, { status: std, note: "Comfort seat" }, { status: na }, { status: na }]),
  },
  "r15-eco": {
    targetUsers: "Homeowners and small farm owners", noiseLevel: "Ultra-quiet (zero disturbance)", indoorUse: false, warranty: "1 year warranty",
    applicationFit: fit([
      { rating: 1, attachments: "Bucket (600 mm), ripper" }, { rating: 3, attachments: "Single-cylinder tilting bucket (800 mm), mud bucket (800 mm)" }, { rating: 3, attachments: "Single-cylinder tilting bucket (800 mm), bucket (200 mm)" },
      { rating: 3, attachments: "Bucket, light log grapple" }, { rating: 3, attachments: "Bucket, auger (800 mm)" }, { rating: 3, attachments: "Single-cylinder tilting bucket (800 mm), bucket (800 mm)" },
      { rating: 3, attachments: "Single-cylinder tilting bucket (800 mm), rake (600 mm)" }, { rating: 3, attachments: "Bucket, auger (1,200 mm)" }, { rating: 3, attachments: "Breaker, single-cylinder tilting bucket (800 mm)" }, { rating: 3, attachments: "Bucket, log grapple, auger (1,200 mm), rake (600 mm)" },
    ]),
    checklist: checklist([std, std, std, std, std, std, std, std, std, std, std, std], [{ status: na }, { status: std, note: "Comfort seat" }, { status: na }, { status: opt }]),
  },
  "r18-pro": {
    targetUsers: "Users handling tree roots and log moving", noiseLevel: "Ultra-quiet (zero disturbance)", indoorUse: false, warranty: "2 year warranty",
    applicationFit: fit([
      { rating: 3, attachments: "Bucket (800 mm), ripper" }, { rating: 4, attachments: "Single-cylinder tilting bucket (800 mm), mud bucket (800 mm)" }, { rating: 4, attachments: "Single-cylinder tilting bucket (800 mm), bucket (200 mm)" },
      { rating: 4, attachments: "Bucket, light log grapple" }, { rating: 4, attachments: "Bucket, auger (800 mm)" }, { rating: 4, attachments: "Single-cylinder tilting bucket (800 mm), bucket (800 mm)" },
      { rating: 4, attachments: "Single-cylinder tilting bucket (800 mm), rake (600 mm)" }, { rating: 3, attachments: "Bucket, auger (1,500 mm)" }, { rating: 3, attachments: "Double-cylinder tilting bucket (800 mm), breaker" }, { rating: 4, attachments: "Bucket, log grapple, auger (1,500 mm), rake (800 mm)" },
    ]),
    checklist: checklist([std, std, std, std, std, std, std, std, std, std, std, std], [{ status: na }, { status: std, note: "Comfort seat" }, { status: std }, { status: opt }]),
  },
  "r22-pro": {
    targetUsers: "Semi-professional contractors", noiseLevel: "Quiet & comfortable (low noise)", indoorUse: false, warranty: "2 year warranty",
    applicationFit: fit([
      { rating: 4, attachments: "Bucket (800 mm), ripper" }, { rating: 4, attachments: "Double-cylinder tilting bucket (800 mm), mud bucket (800 mm)" }, { rating: 4, attachments: "Double-cylinder tilting bucket (800 mm), bucket (300 mm)" },
      { rating: 4, attachments: "Bucket, log grapple" }, { rating: 4, attachments: "Bucket, auger (800 mm)" }, { rating: 4, attachments: "Double-cylinder tilting bucket (800 mm), bucket (800 mm)" },
      { rating: 4, attachments: "Double-cylinder tilting bucket (800 mm), rake (800 mm)" }, { rating: 3, attachments: "Bucket, auger (1,200 mm)" }, { rating: 4, attachments: "Double-cylinder tilting bucket (800 mm), breaker" }, { rating: 4, attachments: "Bucket, log grapple, auger (1,500 mm), rake (800 mm)" },
    ]),
    checklist: checklist([std, std, std, std, std, std, std, std, std, na, std, std], [{ status: std, note: "Heating & cooling" }, { status: std, note: "Suspension seat" }, { status: std }, { status: std }]),
  },
  "r32-pro": {
    targetUsers: "Users with larger properties and semi-professional contractors", noiseLevel: "Quiet & comfortable (low noise)", indoorUse: false, warranty: "2 year warranty",
    applicationFit: fit([
      { rating: 4, attachments: "Bucket (1,000 mm), ripper" }, { rating: 4, attachments: "Double-cylinder tilting bucket (1,000 mm), mud bucket (1,000 mm)" }, { rating: 4, attachments: "Double-cylinder tilting bucket (1,000 mm), bucket (300 mm)" },
      { rating: 4, attachments: "Bucket, light log grapple" }, { rating: 4, attachments: "Bucket, auger (1,500 mm)" }, { rating: 4, attachments: "Double-cylinder tilting bucket (1,000 mm), bucket (1,000 mm)" },
      { rating: 4, attachments: "Double-cylinder tilting bucket (1,000 mm), rake (800 mm)" }, { rating: 4, attachments: "Bucket, auger (1,500 mm)" }, { rating: 4, attachments: "Double-cylinder tilting bucket (1,000 mm), breaker" }, { rating: 4, attachments: "Bucket, log grapple, auger (1,500 mm), rake (800 mm)" },
    ]),
    checklist: checklist([std, std, std, std, std, std, std, std, std, std, std, std], [{ status: std, note: "Heating & cooling" }, { status: std, note: "Suspension seat" }, { status: std }, { status: std }]),
  },
  "r57-pro": {
    targetUsers: "Professional farms and land contractors", noiseLevel: "Standard working level (daytime operation)", indoorUse: false, warranty: "2 year warranty",
    applicationFit: fit([
      { rating: 4, attachments: "Bucket (1,000 mm), ripper" }, { rating: 4, attachments: "Double-cylinder tilting bucket (1,000 mm), mud bucket (1,000 mm)" }, { rating: 4, attachments: "Double-cylinder tilting bucket (1,000 mm), bucket (200 mm)" },
      { rating: 4, attachments: "Bucket, log grapple" }, { rating: 4, attachments: "Bucket, auger (1,500 mm)" }, { rating: 4, attachments: "Double-cylinder tilting bucket (1,000 mm), bucket (1,000 mm)" },
      { rating: 4, attachments: "Double-cylinder tilting bucket (1,200 mm), rake (800 mm)" }, { rating: 4, attachments: "Bucket, auger (1,500 mm)" }, { rating: 4, attachments: "Double-cylinder tilting bucket (1,200 mm), breaker" }, { rating: 4, attachments: "Bucket, log grapple, auger (1,500 mm), rake (800 mm)" },
    ]),
    checklist: checklist([std, std, std, std, std, std, "-", "-", "-", "-", std, std], [{ status: std, note: "Heating & cooling" }, { status: std, note: "Suspension seat" }, { status: std }, { status: std }]),
  },
  "r82-pro": {
    targetUsers: "Professional farms and land contractors", noiseLevel: "Standard working level (daytime operation)", indoorUse: false, warranty: "2 year warranty",
    applicationFit: fit([
      { rating: 3, attachments: "Bucket (1,000 mm), ripper" }, { rating: 3, attachments: "Double-cylinder tilting bucket (1,000 mm), mud bucket (1,000 mm)" }, { rating: 3, attachments: "Double-cylinder tilting bucket (1,000 mm), bucket (200 mm)" },
      { rating: 3, attachments: "Bucket, log grapple" }, { rating: 3, attachments: "Bucket, auger (1,500 mm)" }, { rating: 3, attachments: "Double-cylinder tilting bucket (1,000 mm), bucket (1,000 mm)" },
      { rating: 3, attachments: "Double-cylinder tilting bucket (1,200 mm), rake (800 mm)" }, { rating: 3, attachments: "Bucket, auger (1,500 mm)" }, { rating: 3, attachments: "Double-cylinder tilting bucket (1,200 mm), breaker" }, { rating: 3, attachments: "Bucket, log grapple, auger (1,500 mm), rake (800 mm)" },
    ]),
    checklist: checklist([na, na, na, na, na, na, "-", "-", "-", "-", std, std], [{ status: std, note: "Heating & cooling" }, { status: std, note: "Suspension seat" }, { status: na }, { status: std }]),
  },
};

/** Extra spec rows from the guide (metric | imperial) — added only if the machine lacks that label. */
export const excavatorGuideSpecs: Record<string, { label: string; value: string; imperial: string; group: "general" | "performance" | "dimensions" }[]> = {
  "r10-eco": [{ label: "Max digging depth", value: "1,833 mm", imperial: "72.2 in", group: "performance" }, { label: "Min transport width", value: "912 mm", imperial: "35.9 in", group: "dimensions" }],
  "r13-pro": [{ label: "Max digging depth", value: "2,044 mm", imperial: "80.5 in", group: "performance" }, { label: "Min transport width", value: "849 mm", imperial: "33.4 in", group: "dimensions" }],
  "r15-eco": [{ label: "Max digging depth", value: "1,807 mm", imperial: "71.1 in", group: "performance" }, { label: "Min transport width", value: "983 mm", imperial: "38.7 in", group: "dimensions" }],
  "r18-pro": [{ label: "Max digging depth", value: "2,627 mm", imperial: "103.5 in", group: "performance" }, { label: "Min transport width", value: "998 mm", imperial: "39.3 in", group: "dimensions" }],
  "r22-pro": [{ label: "Max digging depth", value: "2,293 mm", imperial: "90.3 in", group: "performance" }, { label: "Min transport width", value: "1,300 mm", imperial: "51.2 in", group: "dimensions" }],
  "r32-pro": [{ label: "Min transport width", value: "1,550 mm", imperial: "61.0 in", group: "dimensions" }],
  "r57-pro": [{ label: "Max digging depth", value: "3,785 mm", imperial: "149.0 in", group: "performance" }, { label: "Min transport width", value: "2,000 mm", imperial: "78.7 in", group: "dimensions" }],
  "r82-pro": [{ label: "Max digging depth", value: "4,020 mm", imperial: "158.4 in", group: "performance" }, { label: "Min transport width", value: "2,242 mm", imperial: "88.3 in", group: "dimensions" }],
};

export const categoryContent = {
  excavators: {
    intro: "RIPPA excavators run from the 747 kg R06 ECO that fits through a doorway, to the 8-tonne R82 PRO and the full-size 21.5-tonne R230. ECO models are the value pick for homeowners and rentals; PRO models add Kubota power, stronger hydraulics, enclosed cabs and the safety features contractors expect. Every machine ships with a dozer blade, auxiliary hydraulics and a quick coupler, and shares a common attachment range so you can add buckets, thumbs, augers and breakers as the work grows.",
    buyingGuide: [
      { title: "Homeowners & backyard projects", text: "From the 30-inch R06 ECO to the R15 ECO, these fit through a residential gate, trailer behind a half-ton, and handle fence posts, garden beds, drainage and small footings. Ultra-quiet for residential streets.", slugs: ["r06-eco", "r10-eco", "r13-pro", "r15-eco"] },
      { title: "Acreages, hobby farms & landscapers", text: "More reach and lift for stumps, logs, tree planting and driveway repair. Still under a metre wide with an enclosed cab option for shoulder-season work.", slugs: ["r15-eco", "r18-pro"] },
      { title: "Contractors & larger properties", text: "3-tonne-class digging force, load-sensing hydraulics, tilting blade and a full heated and cooled cab. Pools, foundations, trenching and demolition with a breaker.", slugs: ["r22-pro", "r32-pro"] },
      { title: "Professional farms & land contractors", text: "6 and 8-tonne machines for site prep, drainage at depth, land clearing and daily production work. Rubber or steel tracks.", slugs: ["r57-pro", "r82-pro"] },
    ],
    highlights: [
      { title: "Kubota & Yanmar power", text: "Every diesel RIPPA excavator runs a Kubota or Yanmar engine with parts availability across Ontario." },
      { title: "Attachments that fit", text: "Buckets, thumbs, tilt buckets, augers, rakes, rippers, grapples and breakers sized for each model, with fitment confirmed on every product page." },
      { title: "Safety built in", text: "TOPS/ROPS structures, explosion-proof boom valves, pilot control locks and quick-change safety locks on PRO models." },
      { title: "Set up and delivered", text: "Dealer PDI, fluids checked, controls set to your pattern, and flatbed delivery anywhere in Ontario." },
    ],
    faqs: [
      { question: "ECO or PRO — what's the difference?", answer: "ECO models are the value option: gas or Kubota diesel, canopy standard, simpler hydraulics. PRO models add Kubota power on every unit, stronger digging force, TOPS/ROPS certification, explosion-proof valves and enclosed cab options. Both share the same attachment range." },
      { question: "Which excavator fits through my gate?", answer: "The R06 ECO (747 mm), R13 PRO (849 mm), R10 ECO (912 mm), R15 ECO (983 mm) and R18 PRO (998 mm) are all under one metre wide at their minimum track setting. The R22 PRO is 1,300 mm and the R32 PRO is 1,550 mm." },
      { question: "Can I tow one behind my pickup?", answer: "Anything up to the R18 PRO (about 1,900 kg) trailers behind a half-ton with a suitable equipment trailer. The R22 and R32 typically need a 3/4-ton or 1-ton truck. The R57 and R82 are float-delivered." },
      { question: "What attachments come with the machine?", answer: "A digging bucket, dozer blade, auxiliary hydraulic lines and a quick coupler. Thumbs, extra buckets, augers and breakers are optional and listed with prices on each product page." },
      { question: "Do you offer financing?", answer: "Yes. Loans, lease-to-own and seasonal payment plans through our financing partner on approved credit, with periodic promotions on select models. See the Financing page." },
    ],
  },
  "skid-steers": {
    intro: "RIPPA RS-series loaders range from the 45-inch-wide RS03 stand-on mini track loader to the 4-tonne RS20 compact track loader with an enclosed cab. Choose tracked for soft ground and grading or wheeled for pavement and speed, then add the attachments your work needs — buckets, forks, brush cutters, snow blowers and grapples.",
    buyingGuide: [
      { title: "Mini tracked loaders", text: "Stand-on and compact loaders that fit through gates and move soil, gravel and pallets on landscaping and rental jobs.", slugs: ["rs03", "rs04"] },
      { title: "Mid-size tracked & wheeled", text: "Kubota diesel power with cabin options for year-round grading, material handling and attachment work.", slugs: ["rs06", "rs07"] },
      { title: "Full-size production loaders", text: "Kubota V2607 power, enclosed heated cabs and the lift capacity for construction, farm and snow contracts.", slugs: ["rs10", "rs20"] },
    ],
    highlights: [
      { title: "Tracked or wheeled", text: "Most RS models come in both undercarriage styles, so you can pick flotation or speed." },
      { title: "Kubota diesel options", text: "Kubota Z482, D1105 and V2607 engines across the range, with gas Briggs & Stratton on entry models." },
      { title: "Universal attachment plate", text: "Skid steer quick-attach plate for buckets, forks, cutters, blowers and grapples." },
      { title: "Set up and delivered", text: "Dealer PDI and Ontario-wide delivery on every unit." },
    ],
    faqs: [
      { question: "Tracked or wheeled?", answer: "Tracks give flotation and traction on soft ground, mud and slopes, and grade more smoothly. Wheels are faster, cheaper to maintain and easier on finished surfaces like driveways and lots. Many customers with mixed work choose tracks." },
      { question: "What attachments work with RS loaders?", answer: "Standard skid steer quick-attach plate. Buckets, 4-in-1 buckets, pallet forks, brush cutters, snow blowers and grapples are listed under Skid Steer Attachments." },
      { question: "Which models have a cab?", answer: "The RS07, RS10 and RS20 come with enclosed cabs. The RS03, RS04 and RS06 are stand-on platform loaders." },
    ],
  },
} as const;
