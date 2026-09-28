import type { Faq, MachineConfiguration, MachineFeature, SpecValue } from "@/lib/types";

/**
 * RIPPA R32 PRO content. Sources: RIPPA product brochure (RIPPA_Product-Brochure_Mini-excavator-_R32.pdf) and
 * rippa.com/product/mini-excavator-r32. Photos are cropped from the brochure. Pricing from the dealer listing.
 * Image keys map to files uploaded by src/scripts/seed-r32.ts.
 */
export const r32 = {
  slug: "r32-pro",
  modelName: "R32 PRO",
  series: "PRO Series",
  badge: "Best Seller",
  shortDescription: "3.5-ton zero-tail with cab, A/C, load-sensing hydraulics and tilting blade. 9 ft 3\" dig depth for pools, foundations and trenching.",
  longDescription:
    "The R32 PRO is RIPPA's semi-professional 3.5-tonne class mini excavator. A Kubota V1505 diesel drives a variable-displacement piston pump and a load-sensing 9-way multiplex valve, so the machine stays responsive when you dig, swing and travel at the same time. A tailless swing and a boom that offsets 47° right and 74° left let it work against walls and fences, while the tilting dozer blade handles levelling and slope trimming without repositioning. The enclosed cab comes with air conditioning, a fan heater, flip-up windshield and a mechanically suspended seat for full-day comfort.",
  warranty: "2 year warranty",
  certifications: ["EPA Tier 4", "CE", "Euro V"],
  configurations: [
    { id: "r32-v1505-cabin", label: "Kubota V1505 · Enclosed cab", engine: "Kubota V1505 diesel", horsepower: "22.9 hp (17.1 kW)", operatingWeight: "3,623 kg", price: 44950 },
    { id: "r32-v1505-canopy", label: "Kubota V1505 · Open canopy", engine: "Kubota V1505 diesel", horsepower: "22.9 hp (17.1 kW)", operatingWeight: "3,510 kg", price: 55598 },
  ] satisfies MachineConfiguration[],
  specs: [
    // Highlights (hero + cards)
    { label: "Operating weight", value: "3,623 kg", imperial: "7,987 lb", group: "general", icon: "weight", highlight: true },
    { label: "Engine", value: "Kubota V1505", imperial: "Kubota V1505", group: "engine", icon: "engine", highlight: true },
    { label: "Max power", value: "22.9 hp (17.1 kW)", imperial: "22.9 hp (17.1 kW)", group: "engine", icon: "power", highlight: true },
    { label: "Max digging depth", value: "2,827 mm", imperial: "111.3 in", group: "performance", icon: "depth", highlight: true },
    { label: "Bucket capacity", value: "0.08 m³", imperial: "2.83 ft³", group: "general", icon: "capacity", highlight: true },
    // General
    { label: "Machine weight", value: "3,510 kg", imperial: "7,738 lb", group: "general" },
    { label: "Travel speed (low / high)", value: "0–1.8 / 0–2.8 km/h", imperial: "0–1.1 / 0–1.7 mph", group: "general" },
    { label: "Gradeability", value: "30%", imperial: "30%", group: "general" },
    { label: "Ground pressure", value: "36 kPa", imperial: "5.2 psi", group: "general" },
    // Performance
    { label: "Max digging force", value: "27 kN", imperial: "6,070 lbf", group: "performance" },
    { label: "Max digging radius", value: "4,831 mm", imperial: "190.2 in", group: "performance" },
    { label: "Max digging height", value: "4,563 mm", imperial: "179.6 in", group: "performance" },
    { label: "Max dumping height", value: "3,181 mm", imperial: "125.2 in", group: "performance" },
    { label: "Boom swing (left / right)", value: "74° / 47°", imperial: "74° / 47°", group: "performance" },
    { label: "Max swing angle", value: "110°", imperial: "110°", group: "performance" },
    { label: "Dozer blade tilt angle", value: "31°", imperial: "31°", group: "performance" },
    { label: "Main pump flow", value: "99 L/min", imperial: "26 gal/min", group: "performance" },
    { label: "Rated system pressure", value: "18 MPa", imperial: "2,610 psi", group: "performance" },
    { label: "Control valve", value: "Load-sensing 9-way multiplex", imperial: "Load-sensing 9-way multiplex", group: "performance" },
    // Engine
    { label: "Engine brand", value: "Kubota", imperial: "Kubota", group: "engine" },
    { label: "Rated speed", value: "2,300 rpm", imperial: "2,300 rpm", group: "engine" },
    { label: "Displacement", value: "1.5 L", imperial: "0.4 gal", group: "engine" },
    { label: "Cylinders", value: "4", imperial: "4", group: "engine" },
    { label: "Cooling", value: "Water-cooled", imperial: "Water-cooled", group: "engine" },
    { label: "Engine oil capacity", value: "5 L", imperial: "1.32 gal", group: "engine" },
    { label: "Fuel", value: "Diesel", imperial: "Diesel", group: "engine" },
    { label: "Fuel consumption (theoretical)", value: "1.3–1.5 L/h", imperial: "0.34–0.40 gal/h", group: "engine" },
    // Dimensions & transport
    { label: "Transport length", value: "2,921 mm", imperial: "115 in", group: "dimensions" },
    { label: "Transport width", value: "1,550 mm", imperial: "61 in", group: "dimensions" },
    { label: "Transport height", value: "2,485 mm", imperial: "97.9 in", group: "dimensions" },
    { label: "Ground clearance (counterweight)", value: "522 mm", imperial: "20.6 in", group: "dimensions" },
    { label: "Standard bucket width", value: "400 mm", imperial: "15.7 in", group: "dimensions" },
    { label: "Boom length", value: "2,220 mm", imperial: "86.6 in", group: "dimensions" },
    { label: "Arm length", value: "1,620 mm", imperial: "65.4 in", group: "dimensions" },
    { label: "Dozer blade width", value: "1,550 mm", imperial: "61 in", group: "dimensions" },
  ] satisfies SpecValue[],
  features: [
    { eyebrow: "Engineered performance", title: "Kubota V1505 with load-sensing hydraulics", text: "A 17.1 kW Kubota V1505 diesel drives a variable-displacement piston pump (99 L/min) and a load-sensing 9-way multiplex valve. Flow and pressure adjust automatically to the load, so digging, swinging and travelling at the same time stays smooth, with less heat and longer component life.", image: "r32-pro-trenching" },
    { eyebrow: "Work anywhere", title: "Tailless swing and offset boom", text: "The counterweight stays inside the track width, and the boom swings 74° left and 47° right. Dig right up against walls, fences and buildings without repositioning, and without the rear-end collision risk of a conventional tail.", image: "feat-tailless" },
    { eyebrow: "Design detail", title: "Tilting dozer blade", text: "High-strength steel blade with reinforced ribs that tilts left and right for levelling, side-pushing and slope trimming. Lubrication ports at every pivot make routine maintenance quick.", image: "feat-dozer-blade" },
    { eyebrow: "Safety", title: "Explosion-proof boom valve", text: "If a hydraulic line ruptures, the explosion-proof valve locks the boom cylinder so the machine cannot lose control. A switching valve block secures the auxiliary lines so a failed quick-connect hose at the bucket can be replaced on site.", image: "feat-explosion-valve" },
    { eyebrow: "Control & comfort", title: "Full cab: A/C, fan heater, suspended seat", text: "Air conditioning for summer, a fan heater to keep glass clear in winter, a flip-up windshield, a mechanically suspended seat with armrests, dual-button pilot joysticks, a pattern-change valve and a colour display showing key operating parameters.", image: "feat-cab" },
    { eyebrow: "Built to last", title: "Cylinder guards, dual-speed travel and rubber tracks", text: "Guarded hydraulic cylinders, a built-in travel motor integrated with the reducer, engineering rubber tracks and a dual-speed mode that balances fast repositioning with heavy-load climbing.", image: "feat-track" },
    { eyebrow: "Easy to maintain", title: "Rear-opening hood and central grease points", text: "The rear hood and flip-up side covers expose the engine and hydraulics for daily checks. A metal-covered track tensioning port gives access to the tension cylinder without removing tracks, and grease fittings are grouped in one place.", image: "feat-engine-cover" },
  ] satisfies (Omit<MachineFeature, "image"> & { image?: string })[],
  standardEquipment: [
    "Kubota V1505 4-cylinder water-cooled diesel", "Variable-displacement piston pump, 99 L/min", "Load-sensing 9-way multiplex control valve", "Tilting dozer blade", "Tailless swing with 74° / 47° boom offset",
    "Auxiliary hydraulic lines (4 high-pressure circuits)", "Hydraulic quick-change lock with dual safety", "Explosion-proof boom cylinder valve", "Hydraulic cylinder guards", "Dual-speed travel with built-in travel motor",
    "Engineering rubber tracks", "Pilot-operated control lock", "Power lock switch", "Pattern-change valve (ISO / SAE controls)", "Dual-button pilot joysticks", "Colour operating display",
    "Enclosed cab with air conditioner and fan heater", "Flip-up front windshield", "Mechanically suspended seat with armrests", "Foot pedal for boom swing / auxiliary", "Nickel-plated grease fittings with protective blocks", "LED work lights and mirrors",
  ],
  applications: ["Pool excavation", "Driveway repair", "Drainage ditches", "Stump removal", "Tree planting", "Farm buildings", "Snow removal", "Land levelling", "Fence installation", "Small foundations"],
  faqs: [
    { question: "Will the R32 PRO fit through a residential gate?", answer: "The machine is 1,550 mm (61 in) wide at the tracks and dozer blade, so it fits most double gates and side yards. For narrow single-gate access, look at the smaller R15 ECO or R18 PRO instead." },
    { question: "Can I trailer it behind a pickup?", answer: "Operating weight is 3,623 kg (7,987 lb) plus the trailer, so you need a truck and trailer rated for roughly 5,500 kg (12,000 lb) combined. Most half-ton trucks are not suitable; a 3/4-ton or 1-ton with a tandem-axle equipment trailer is typical. We also deliver across Ontario." },
    { question: "What attachments come standard and what is optional?", answer: "The machine ships with a digging bucket and the hydraulic quick-change lock, auxiliary lines and dozer blade listed under Standard Equipment. Thumbs, additional buckets, augers, breakers, rakes, rippers, tilt buckets and grapples are optional and listed in the attachments section with the sizes that fit." },
    { question: "Is the R32 PRO an ISO or SAE control pattern?", answer: "Both. A pattern-change valve in the cab lets you switch between ISO (excavator) and SAE (backhoe) patterns in seconds." },
    { question: "How does it handle Ontario winters?", answer: "The enclosed cab has an air conditioner and a fan heater to keep the glass clear. The engine is a Kubota V1505 diesel; ask us about block heaters and winter fuel conditioning when you order." },
    { question: "What warranty and support do I get?", answer: "Two-year warranty backed by our own service department, genuine RIPPA and Kubota parts in stock, dealer pre-delivery inspection, and optional extended coverage and rustproofing available in the builder." },
  ] satisfies Faq[],
  /** Gallery order: first is the main image. */
  images: [
    { key: "r32-pro-cab-photo", alt: "RIPPA R32 PRO enclosed cab at the dealership" },
    { key: "r32-pro-canopy", alt: "RIPPA R32 PRO open canopy" },
    { key: "r32-pro-render", alt: "RIPPA R32 PRO mini excavator, enclosed cab, three-quarter view" },
    { key: "r32-pro-jobsite", alt: "RIPPA R32 PRO grading gravel on a residential driveway" },
    { key: "r32-pro-stump", alt: "RIPPA R32 PRO lifting a tree stump with a hydraulic thumb" },
    { key: "r32-pro-trenching", alt: "RIPPA R32 PRO digging a trench in a backyard" },
    { key: "r32-pro-farm", alt: "RIPPA R32 PRO levelling with the dozer blade on a farm" },
    { key: "r32-pro-auger", alt: "RIPPA R32 PRO drilling with an auger attachment" },
    { key: "r32-pro-rear", alt: "RIPPA R32 PRO rear view showing tailless counterweight" },
  ],
  /** Attachments from the brochure that fit the R32 PRO. Existing seed attachments are matched by slug and updated. */
  attachments: [
    { slug: "digging-bucket", name: "Digging Bucket", type: "Buckets", description: "Five widths from 35 cm to 105 cm", image: "att-bucket",
      variants: [
        { label: '35 cm (14") Digging Bucket', widthOrSize: '35 cm / 14"', note: "58.3 kg" }, { label: '45 cm (18") Digging Bucket', widthOrSize: '45 cm / 18"', note: "65 kg" },
        { label: '65 cm (26") Digging Bucket', widthOrSize: '65 cm / 26"', note: "81 kg" }, { label: '85 cm (33") Digging Bucket', widthOrSize: '85 cm / 33"', note: "87 kg" }, { label: '105 cm (41") Digging Bucket', widthOrSize: '105 cm / 41"', note: "93 kg" },
      ] },
    { slug: "ditching-bucket", name: "Ditching (Mud) Bucket", type: "Buckets", description: "Smooth-edge grading bucket, 62–122 cm", image: "att-mud-bucket",
      variants: [
        { label: '62 cm (24") Ditching Bucket', widthOrSize: '62 cm / 24"' }, { label: '82 cm (32") Ditching Bucket', widthOrSize: '82 cm / 32"' }, { label: '102 cm (40") Ditching Bucket', widthOrSize: '102 cm / 40"' }, { label: '122 cm (48") Ditching Bucket', widthOrSize: '122 cm / 48"' },
      ] },
    { slug: "riddle-bucket", name: "Riddle (Skeleton) Bucket", type: "Buckets", description: "Sift rocks and debris from soil", image: "att-riddle-bucket", variants: [{ label: '85 cm (33") Riddle Bucket', widthOrSize: '85 cm / 33"' }] },
    { slug: "tilt-bucket", name: "Tilting Bucket", type: "Buckets", description: "Hydraulic tilt for slopes and ditches, 80 or 100 cm", image: "att-tilting-bucket",
      variants: [
        { label: '80 cm (31") Tilt Bucket · single cylinder', widthOrSize: '80 cm / 31"' }, { label: '80 cm (31") Tilt Bucket · double cylinder', widthOrSize: '80 cm / 31" (2-cyl)' },
        { label: '100 cm (39") Tilt Bucket · single cylinder', widthOrSize: '100 cm / 39"' }, { label: '100 cm (39") Tilt Bucket · double cylinder', widthOrSize: '100 cm / 39" (2-cyl)' },
      ] },
    { slug: "rake", name: "Rake", type: "Rakes", description: "Land clearing & cleanup, 40–80 cm", image: "att-rake",
      variants: [{ label: '40 cm (16") Rake', widthOrSize: '40 cm / 16"' }, { label: '60 cm (24") Rake', widthOrSize: '60 cm / 24"' }, { label: '80 cm (31") Rake', widthOrSize: '80 cm / 31"' }] },
    { slug: "ripper", name: "Ripper", type: "Rippers", description: "Single-shank ripper for hard ground and roots", image: "att-ripper", variants: [] },
    { slug: "log-grapple", name: "Log Grapple", type: "Grapples", description: "Lightweight grapple for logs, brush and debris", image: "att-log-grapple", variants: [] },
    { slug: "hydraulic-breaker", name: "Hydraulic Breaker", type: "Breakers", description: "Concrete & rock demolition", image: "att-breaker", variants: [] },
    { slug: "auger", name: "Auger (Rotary Drill)", type: "Augers", description: "Post holes and tree planting, 20–30 cm bits", image: "att-rotary-drill",
      variants: [{ label: '20 cm (8") × 80 cm Auger', widthOrSize: '20 cm / 8"' }, { label: '30 cm (12") × 100 cm Auger', widthOrSize: '30 cm / 12" × 100 cm' }, { label: '30 cm (12") × 120 cm Auger', widthOrSize: '30 cm / 12" × 120 cm' }, { label: '30 cm (12") × 150 cm Auger', widthOrSize: '30 cm / 12" × 150 cm' }] },
    { slug: "flail-mower", name: "Flail Mower", type: "Mowers", description: "Hydraulic mower for brush and roadside grass", image: "att-mower", variants: [] },
  ],
};
