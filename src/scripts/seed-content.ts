/**
 * Starter content: Catalys / Chevron lubricant products and the first blog guides.
 * Products mirror the Catalys catalogue (catalyslubricants.ca); confirm grades/approvals with your Catalys rep.
 * Posts are drafts of real owner questions gathered from the RIPPA owner forum; review before publishing.
 *   npm run seed:content
 */
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });
const log = (m: string) => payload.logger.info(m);

const lubricants = [
  { name: "Chevron Delo 400 XLE", brand: "Chevron", category: "engine-oil", tagline: "Heavy-duty synthetic-blend diesel engine oil", description: "Chevron's flagship heavy-duty diesel oil for modern low-emission and older engines. Extended drain capability with strong wear and deposit control.", grades: "10W-30, 15W-40", packaging: ["4l", "20l", "drum", "tote", "bulk"], approvals: "API CK-4 / SN; confirm OEM approvals on the data sheet", rippaUse: "Engine oil for Kubota D722, D902, D1105, V1505 and V2607 diesels", applications: ["Mini excavators and skid steers", "Farm tractors", "Trucks and fleets"], featured: true, sortOrder: 1 },
  { name: "Chevron Delo 400 SDE", brand: "Chevron", category: "engine-oil", tagline: "Conventional heavy-duty diesel engine oil", description: "Everyday 15W-40 for mixed fleets running on- and off-road diesel equipment.", grades: "15W-40", packaging: ["4l", "20l", "drum", "bulk"], approvals: "API CK-4; confirm on data sheet", rippaUse: "Alternative engine oil for Kubota-powered RIPPA machines where a conventional 15W-40 is specified", applications: ["Fleets", "Farms", "Contractors"], featured: false, sortOrder: 2 },
  { name: "Catalys Premium Plus 15W-40 CK-4", brand: "Catalys", category: "engine-oil", tagline: "Value heavy-duty diesel oil", description: "Catalys' own CK-4 diesel engine oil for shops and fleets that want a Canadian-made product at a sharp price.", grades: "15W-40", packaging: ["4l", "20l", "drum", "bulk"], approvals: "API CK-4", rippaUse: "Kubota diesels in RIPPA excavators and skid steers", applications: ["Repair shops", "Fleets"], featured: false, sortOrder: 3 },
  { name: "Catalys Optimum Full Syn HD", brand: "Catalys", category: "engine-oil", tagline: "Full-synthetic heavy-duty oil for cold starts", description: "Full-synthetic 0W-40 / 5W-40 for Ontario winters and extended drains.", grades: "0W-40, 5W-40", packaging: ["4l", "20l", "drum"], approvals: "Confirm on data sheet", rippaUse: "Recommended for winter operation of Kubota diesels", applications: ["Winter operation", "Snow contractors"], featured: false, sortOrder: 4 },
  { name: "Catalys Synblend 10W-30 CK-4", brand: "Catalys", category: "engine-oil", tagline: "Synthetic-blend diesel oil", description: "Synthetic-blend 10W-30 for improved cold flow and fuel economy in diesel engines.", grades: "10W-30", packaging: ["4l", "20l", "drum"], approvals: "API CK-4", applications: ["Fleets", "Farms"], featured: false, sortOrder: 5 },
  { name: "Chevron 1000 THF", brand: "Chevron", category: "hydraulic", tagline: "Tractor hydraulic / transmission fluid", description: "Universal tractor fluid for hydraulics, wet brakes and transmissions on farm equipment.", grades: "UTTO", packaging: ["20l", "drum", "tote", "bulk"], approvals: "Confirm OEM approvals on data sheet", applications: ["Tractors", "Farm loaders"], featured: true, sortOrder: 10 },
  { name: "Catalys Extreme XV Hydraulic Oil", brand: "Catalys", category: "hydraulic", tagline: "High-viscosity-index hydraulic oil", description: "Wide-temperature hydraulic oil that stays workable in Ontario winters and summers. The oil we put in most RIPPA machines at their first service.", grades: "ISO 32, 46, 68", packaging: ["20l", "drum", "tote"], approvals: "Confirm on data sheet", rippaUse: "Hydraulic system on all RIPPA excavators and skid steers (ISO 46 typical; ISO 32 for cold-weather operation)", applications: ["Mini excavators", "Skid steers", "Attachments"], featured: true, sortOrder: 11 },
  { name: "BioBlend BioFlo AW", brand: "BioBlend", category: "hydraulic", tagline: "Biodegradable anti-wear hydraulic oil", description: "Readily biodegradable hydraulic fluid for machines working near water, on farms and in environmentally sensitive sites.", grades: "ISO 32, 46, 68", packaging: ["20l", "drum"], approvals: "Confirm on data sheet", rippaUse: "Drop-in option for RIPPA hydraulics where biodegradable fluid is required", applications: ["Shoreline and drainage work", "Municipal", "Golf and turf"], featured: false, sortOrder: 12 },
  { name: "Chevron Delo Gear ESI", brand: "Chevron", category: "gear", tagline: "Extended-service gear oil", description: "Heavy-duty gear lubricant for final drives, axles and gearboxes.", grades: "80W-90, 85W-140", packaging: ["20l", "drum"], approvals: "Confirm on data sheet", rippaUse: "Track final drives / travel gearboxes where a GL-5 gear oil is specified", applications: ["Final drives", "Axles", "Gearboxes"], featured: false, sortOrder: 20 },
  { name: "Catalys ATF MD-3", brand: "Catalys", category: "transmission", tagline: "Multi-vehicle automatic transmission fluid", description: "Dexron III / Mercon type ATF for trucks, loaders and hydrostatic systems that call for ATF.", grades: "ATF", packaging: ["4l", "20l", "drum"], applications: ["Trucks", "Loaders"], featured: false, sortOrder: 21 },
  { name: "Chevron Black Pearl EP", brand: "Chevron", category: "grease", tagline: "Extreme-pressure multi-purpose grease", description: "Lithium-complex EP grease for pins, bushings, slew bearings and heavy loads.", grades: "NLGI 2", packaging: ["cartridge", "20l"], approvals: "Confirm on data sheet", rippaUse: "Daily greasing of boom, arm, bucket and blade pins and the swing bearing on RIPPA excavators", applications: ["Excavators", "Skid steers", "Farm equipment"], featured: true, sortOrder: 30 },
  { name: "Extended-life coolant / antifreeze", brand: "Catalys", category: "coolant", tagline: "Heavy-duty engine coolant", description: "Pre-mixed and concentrate coolant for diesel engines. Ask which formulation matches your engine.", grades: "50/50 premix, concentrate", packaging: ["4l", "20l", "drum"], rippaUse: "Kubota and Yanmar engines in RIPPA machines", applications: ["All diesel equipment"], featured: false, sortOrder: 40 },
  { name: "Diesel Exhaust Fluid (DEF)", brand: "Catalys", category: "def", tagline: "API-certified DEF", description: "For Tier 4 Final / SCR-equipped trucks and equipment.", packaging: ["1l", "4l", "20l", "drum", "tote", "bulk"], applications: ["Trucks", "Tier 4 equipment"], featured: false, sortOrder: 50 },
  { name: "BioBlend Bar & Chain Oil", brand: "BioBlend", category: "other", tagline: "Biodegradable bar and chain oil", description: "For chainsaws and brush cutters used on land-clearing jobs.", packaging: ["1l", "4l", "20l"], applications: ["Land clearing", "Arborists"], featured: false, sortOrder: 60 },
];

const rich = (paras: string[]) => ({ root: { type: "root", format: "" as const, indent: 0, version: 1, direction: "ltr" as const, children: paras.map((t) => {
  const m = t.match(/^(#{2,3}) (.*)$/);
  if (m) return { type: "heading", tag: m[1].length === 2 ? "h2" : "h3", format: "" as const, indent: 0, version: 1, direction: "ltr" as const, children: [{ type: "text", text: m[2], format: 0, detail: 0, mode: "normal", style: "", version: 1 }] };
  if (t.startsWith("- ")) return { type: "list", listType: "bullet", tag: "ul", start: 1, format: "" as const, indent: 0, version: 1, direction: "ltr" as const, children: t.split("\n").map((li, i) => ({ type: "listitem", value: i + 1, format: "" as const, indent: 0, version: 1, direction: "ltr" as const, children: [{ type: "text", text: li.replace(/^- /, ""), format: 0, detail: 0, mode: "normal", style: "", version: 1 }] })) };
  if (t.startsWith("1. ")) return { type: "list", listType: "number", tag: "ol", start: 1, format: "" as const, indent: 0, version: 1, direction: "ltr" as const, children: t.split("\n").map((li, i) => ({ type: "listitem", value: i + 1, format: "" as const, indent: 0, version: 1, direction: "ltr" as const, children: [{ type: "text", text: li.replace(/^\d+\. /, ""), format: 0, detail: 0, mode: "normal", style: "", version: 1 }] })) };
  return { type: "paragraph", format: "" as const, indent: 0, version: 1, direction: "ltr" as const, textFormat: 0, children: [{ type: "text", text: t, format: 0, detail: 0, mode: "normal", style: "", version: 1 }] };
}) } });

const posts = [
  {
    title: "RIPPA Mini Excavator First 25-Hour Service: What to Change and Why", slug: "rippa-first-25-hour-service", category: "maintenance", readMinutes: 6, featured: true, tags: ["first service", "hydraulic oil", "filters", "R10", "R15", "R18"], machines: ["r10-eco", "r13-pro", "r15-eco", "r18-pro", "r22-pro", "r32-pro"],
    excerpt: "The first service on a new RIPPA is the most important one it will ever get. Here's exactly what our technicians change at 25 hours, what to look for in the old oil, and why we don't wait for 50.",
    paras: [
      "New hydraulic systems shed a small amount of metal as pumps, cylinders and valve spools bed in. That's normal, and it's exactly why the first oil change matters more than any other. Owners on the RIPPA forum report doing a full fluid change at 22 to 25 hours and finding fine metal in the hydraulic oil with nothing alarming. Get it out early and the system runs clean for years.",
      "## What we change at 25 hours",
      "- Engine oil and filter (Kubota diesels take a heavy-duty diesel oil; we use Chevron Delo 400 in 10W-30 or 15W-40 depending on season)\n- Hydraulic oil and return filter, plus a look at the suction strainer\n- Fuel filter and a drain of the water separator\n- Air filter inspection (replace if it has been in dust)\n- Every grease point on the boom, arm, bucket, blade and swing bearing",
      "## What we check while it's apart",
      "- Track tension and roller condition\n- Every hydraulic fitting and quick-coupler o-ring for weeping (a common delivery-day leak)\n- Main relief / breakout pressure against spec, because some machines leave the factory set low\n- Battery terminals, belt tension and coolant level\n- Bolt torque on counterweight, ROPS/canopy and blade",
      "## Doing it yourself",
      "Warm the machine for ten minutes so the oil drains fully, park on level ground with the blade down, and shut it off. Drain the hydraulic tank into a clean pan so you can see what came out; a light grey haze is fine, chunks are not. Refill with a high-viscosity-index ISO 46 hydraulic oil (ISO 32 if you run all winter), cycle every function slowly with the machine idling, then top up. Log the hours and keep the receipts for your warranty file.",
      "If you'd rather we did it, book a 25-hour service and we'll do all of the above in the shop or on site and record it against your serial number.",
    ],
  },
  {
    title: "What Hydraulic Oil Does a RIPPA Mini Excavator Take?", slug: "rippa-hydraulic-oil-guide", category: "guide", readMinutes: 4, featured: false, tags: ["hydraulic oil", "ISO 46", "winter"], machines: ["r06-eco", "r10-eco", "r13-pro", "r15-eco", "r18-pro", "r22-pro", "r32-pro", "r57-pro", "r82-pro"],
    excerpt: "The short answer is a good anti-wear hydraulic oil in ISO 46, or ISO 32 if you work through Ontario winters. The longer answer covers viscosity index, biodegradable options and what not to put in the tank.",
    paras: [
      "RIPPA machines ship with a conventional ISO 46 anti-wear hydraulic oil. That grade is right for spring-to-fall work in Ontario. The problem is winter: a straight ISO 46 thickens below freezing, the pump cavitates on cold starts and everything feels slow and jerky until the oil warms up.",
      "## Our recommendation",
      "- Year-round: a high-viscosity-index (HVI) ISO 46 such as Catalys Extreme XV. HVI oils thin less when hot and thicken less when cold, so the machine behaves the same in July and January.\n- Winter-only or snow contractors: HVI ISO 32.\n- Near water or on environmentally sensitive sites: a biodegradable fluid such as BioBlend BioFlo AW in the same ISO grade.",
      "## What not to use",
      "Don't top up with ATF, engine oil or tractor fluid unless the manual for your specific machine allows it. Mixing fluid types can foam, attack seals and mask a leak. If the tank is low, find out where it went first.",
      "## How much you need",
      "Tank capacity varies by model; the spec sheet for each machine on our product pages lists it where RIPPA publishes it. Buy a 20 L pail for the compact ECO and PRO models and a drum if you run more than one machine. We stock both over the counter.",
    ],
  },
  {
    title: "How to Adjust Track Tension on a RIPPA Excavator", slug: "rippa-track-tension", category: "guide", readMinutes: 5, featured: false, tags: ["tracks", "undercarriage", "grease"], machines: ["r10-eco", "r13-pro", "r15-eco", "r18-pro", "r22-pro", "r32-pro"],
    excerpt: "Loose tracks throw; tight tracks wear rollers and rob power. Here's how to measure sag, add or release grease at the tension cylinder, and how often to check.",
    paras: [
      "Rubber tracks are tensioned by a grease cylinder behind the idler. Pumping grease in pushes the idler forward and tightens the track; opening the relief valve lets grease out and loosens it. Every RIPPA excavator in our lineup uses this system, and the access port is behind a metal cover on the track frame.",
      "## Measure first",
      "1. Park on firm, level ground and lift one side of the machine with the boom and blade until the track just clears the ground.\n2. Measure the sag between the bottom of the track frame and the top of the track at the midpoint. RIPPA specifies the sag per model in the operator's manual; most compact models sit around 10 to 20 mm (roughly 1/2 to 3/4 in).\n3. Repeat on the other side. Uneven tension is the number one cause of thrown tracks on turns.",
      "## Adjusting",
      "- Too loose: clean the grease fitting, connect a grease gun and pump slowly while watching the idler move. Stop when sag is in spec.\n- Too tight: crack the relief valve a quarter turn with a wrench, standing to the side, and let grease escape until sag is right. Never remove the fitting completely; the cylinder is under pressure.\n- Lower the machine and run it forward and back a few metres, then re-measure.",
      "## How often",
      "Check weekly in mud and clay, which packs the undercarriage and effectively tightens the track, and after any new-machine break-in. Clean the undercarriage at the end of every day in wet conditions.",
    ],
  },
  {
    title: "Field Call: Quick Coupler Leaking on a New R18 PRO", slug: "field-call-r18-quick-coupler-leak", category: "field-call", readMinutes: 3, featured: false, tags: ["field call", "hydraulics", "o-ring", "R18 PRO"], machines: ["r18-pro"],
    excerpt: "A customer's R18 PRO was weeping hydraulic oil at the thumb quick-disconnect within the first week. Ten minutes and a 60-cent o-ring. Here's what we found and how to check yours.",
    paras: [
      "The customer noticed a wet patch under the boom after every use and a slow drop in the sight glass. On site we traced it to the female quick-disconnect on the thumb circuit. The o-ring had a small nick, probably from being connected with grit on the face during setup.",
      "## The fix",
      "1. Relieve pressure: engine off, key on, cycle the thumb lever both ways.\n2. Disconnect the coupler and wipe both faces clean.\n3. Pick the old o-ring out with a plastic pick, match the size and Shore hardness, and fit the new one dry.\n4. Reconnect, run the thumb through its range at idle and check for weeping.",
      "## Check yours",
      "Wipe every quick-disconnect on the machine dry, run each attachment function for a minute, and look again. Weeping on a new machine is almost always a face seal or o-ring, not a cylinder. We carry the o-ring kits for every RIPPA coupler in stock.",
    ],
  },
  {
    title: "RIPPA RS06 Overheating? Check the Cooling-Fan Recall First", slug: "rs06-overheating-fan-recall", category: "maintenance", readMinutes: 3, featured: false, tags: ["RS06", "recall", "overheating"], machines: ["rs06"],
    excerpt: "Early RS06 loaders could show coolant temperatures around 115 °C after 30 minutes of travel. RIPPA traced it to a temperature sensor reading high and an undersized fan, and issued a free update. Here's how to tell if your unit needs it.",
    paras: [
      "RIPPA published a service notice for a batch of RS06 stand-on loaders whose coolant gauge climbed to around 115 °C after 30 or more minutes of continuous travel. Two causes were identified: an analog temperature sensor reading about 10 °C high, and a cooling fan that moved too little air for sustained high-load travel.",
      "## The update",
      "The recall replaces the fan with a 400 mm eight-blade unit and fits a calibrated sensor. Parts and labour are covered. RIPPA lists affected serial ranges at recall.rippa.com; we can check your serial for you and carry out the update in our shop.",
      "## In the meantime",
      "Keep the radiator screen clean, check coolant level cold, and don't ignore a gauge that climbs on long transport runs. If it has already overheated, have the coolant tested and the head checked before it goes back to work.",
    ],
  },
  {
    title: "Can You Haul a RIPPA Mini Excavator Behind a Pickup?", slug: "haul-rippa-mini-excavator-pickup-trailer", category: "buying", readMinutes: 5, featured: false, tags: ["transport", "trailer", "towing"], machines: ["r06-eco", "r10-eco", "r13-pro", "r15-eco", "r18-pro", "r22-pro"],
    excerpt: "Up to the R18 PRO, yes, with the right trailer and a truck rated for it. Here are the operating weights, widths and trailer notes for every compact RIPPA so you can match it to what you already own.",
    paras: [
      "The most common pre-purchase question we get is whether the machine will go on the trailer in the driveway. The answer depends on three numbers: the machine's operating weight, the trailer's payload after its own weight, and your truck's rated towing capacity with the tongue weight it will see.",
      "## Rules of thumb",
      "- R06 ECO, R10 ECO, R13 PRO, R15 ECO and R18 PRO: 1,650 to 4,300 lb operating weight. A tandem-axle equipment trailer with brakes and a properly equipped half-ton or three-quarter-ton truck handles these.\n- R22 PRO and R32 PRO: 5,600 to 8,000 lb. Plan on a three-quarter or one-ton truck and a 10,000 lb-plus rated trailer.\n- R57 PRO and up: float delivery. We deliver anywhere in Ontario.",
      "## Width and gates",
      "Every compact RIPPA has retractable tracks. The R06 ECO narrows to 2 ft 5 in, the R13 PRO to 2 ft 9 in, the R10 and R15 to just under 3 ft, and the R18 PRO to 3 ft 3 in. Exact figures are on each product page under Specifications.",
      "## Loading tips",
      "Load with the blade facing the truck for a lower centre of gravity on the ramps, chain all four corners to rated tie-down points, and lower the blade and bucket onto the deck. Check the chains after the first few kilometres.",
    ],
  },
];

const count = async (c: "lubricants" | "posts") => (await payload.count({ collection: c })).totalDocs;
if ((await count("lubricants")) === 0) {
  for (const l of lubricants) await payload.create({ collection: "lubricants", data: { ...l, applications: l.applications.map((text) => ({ text })), slug: l.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), _status: "published" } as never });
  log(`Seeded ${lubricants.length} lubricant products`);
} else log("Lubricants exist, skipping");

if ((await count("posts")) === 0) {
  const machines = await payload.find({ collection: "machines", limit: 500, depth: 0 });
  const idOf = (slug: string) => machines.docs.find((m) => m.slug === slug)?.id;
  let d = new Date("2026-09-01");
  for (const p of posts) {
    d = new Date(d.getTime() + 3 * 86_400_000);
    await payload.create({ collection: "posts", data: { title: p.title, slug: p.slug, category: p.category, excerpt: p.excerpt, publishedAt: d.toISOString(), content: rich(p.paras), relatedMachines: p.machines.map(idOf).filter((x): x is number => typeof x === "number"), tags: p.tags.map((tag) => ({ tag })), readMinutes: p.readMinutes, featured: p.featured, _status: "published" } as never });
  }
  log(`Seeded ${posts.length} starter posts`);
} else log("Posts exist, skipping");
process.exit(0);
