import type { SpecValue } from "@/lib/types";
import type { LineupModel } from "@/data/lineup";

/**
 * RIPPA loaders and the RD06 track dumper — specs transcribed from the RIPPA RL06, RB06 and RD06 brochures
 * (rippagroup.ca product documents, 2025/26). Metric values with the brochure's imperial figures.
 * The RL06-T (telescopic boom) shares the RL06 brochure, so it is offered as a configuration of the RL06.
 * The RD06-E (lifting body) shares the RD06 brochure and is a configuration of the RD06.
 */
type SG = SpecValue["group"];
const s = (label: string, value: string, imperial: string, group: SG, icon?: SpecValue["icon"], highlight = false): SpecValue => ({ label, value, imperial, group, icon: icon ?? "generic", highlight });

const loaderFaqs = (m: string, weight: string, width: string): { question: string; answer: string }[] => [
  { question: `Can I tow the ${m} behind a pickup?`, answer: `Operating weight is ${weight} before attachments. A tandem-axle equipment trailer with brakes and a half-ton or larger truck handles it comfortably. We also deliver anywhere in Ontario.` },
  { question: `Will the ${m} fit through a gate or barn door?`, answer: `Transport width is ${width}. Articulated steering with a 94.5" turning radius lets it work in tight yards, barns and between buildings.` },
  { question: "What attachments does it run?", answer: "A quick-attach plate and auxiliary hydraulics are standard, so buckets, pallet forks, 4-in-1 buckets, augers, sweepers, snow blades and more swap in under a minute. See the attachments listed for this model below." },
  { question: "What engine is in it?", answer: "A three-cylinder, water-cooled Kubota D1105 diesel rated 24.4 hp (18.2 kW) at 3,000 rpm, meeting EU Stage V / US Tier 4 emissions. Parts and service support through our RIPPA Service Centre." },
  { question: "What warranty and support do I get?", answer: "Two-year warranty backed by the RIPPA Service Centre, genuine RIPPA and Kubota parts, dealer pre-delivery inspection and an owner walk-through at delivery." },
];

export const loaders: LineupModel[] = [
  // ============================================================ RL06
  {
    slug: "rl06", modelName: "RL06", category: "loaders", series: "Compact Wheel Loader", sortOrder: 1, builderEnabled: false, featured: true,
    shortDescription: "Articulated compact wheel loader with a 24.4 hp Kubota diesel, 600 kg (1,322 lb) max load and 2,060 mm (81\") dump height. 1,150 mm (45\") wide for barns, yards and tight sites.",
    longDescription: "The RL06 is RIPPA's articulated compact wheel loader: a Kubota D1105 diesel, hydrostatic drive and a centre-pivot frame that turns inside a 2,400 mm (94.5\") radius. At 1,150 mm (45.3\") wide and 1,725 kg (3,802 lb) it moves through barn doors and between buildings, then lifts 600 kg (1,322 lb) to a 2,060 mm (81\") dump height, enough to load a pickup or a one-ton dump trailer.\n\nAll-terrain tires, a quick-attach plate and auxiliary hydraulics make it a true multi-tool for farms, acreages, landscapers and small contractors: bucket work, pallet forks, 4-in-1 bucket, sweeper, snow blade and auger. A suspension seat, one-hand multifunction joystick, LED work lights and a fold-up operator guard come standard; the seat tilts forward for daily checks.\n\nThe RL06-T version adds a telescopic boom for extra reach and lift height when loading high-sided trailers or stacking. Both are sold, set up and supported by Niagara Equipment Supply in Thorold, with delivery across Ontario.",
    certifications: ["CE", "EPA", "EU Stage V"], warranty: "2 year warranty",
    configurations: [
      { id: "rl06-std", label: "Kubota D1105 · Standard boom · Open canopy", engine: "Kubota D1105 diesel", horsepower: "24.4 hp (18.2 kW)", operatingWeight: "1,725 kg" },
      { id: "rl06-t", label: "Kubota D1105 · Telescopic boom (RL06-T) · Open canopy", engine: "Kubota D1105 diesel", horsepower: "24.4 hp (18.2 kW)", operatingWeight: "1,725 kg" },
    ],
    specs: [
      s("Operating weight", "1,725 kg", "3,802 lb", "general", "weight", true), s("Engine", "Kubota D1105", "Kubota D1105", "engine", "engine", true),
      s("Max power", "24.4 hp (18.2 kW)", "24.4 hp (18.2 kW)", "engine", "power", true), s("Max lift height", "3,380 mm", "133.1 in", "performance", "reach", true), s("Transport width", "1,150 mm", "45.3 in", "dimensions", "width", true),
      s("Bucket capacity", "0.23 m³", "8.1 ft³", "general", "capacity"), s("Rated load", "300 kg", "661 lb", "general"), s("Max load", "600 kg", "1,322 lb", "general"),
      s("Travel speed", "0–8 km/h", "0–5 mph", "general"), s("Gradeability", "25%", "25%", "general"), s("Ground pressure", "73.7 kPa", "10.6 psi", "general"),
      s("Max dump height", "2,060 mm", "81.1 in", "performance"), s("Max dump reach", "650 mm", "25.6 in", "performance"), s("Turning radius", "2,400 mm", "94.5 in", "performance"),
      s("Wheelbase", "840 / 1,250 mm", "33 / 49 in", "performance"), s("Ground clearance", "155 mm", "6.1 in", "performance"),
      s("Engine model", "Kubota D1105", "Kubota D1105", "engine"), s("Rated speed", "3,000 rpm", "3,000 rpm", "engine"), s("Displacement", "1.123 L", "1.123 L", "engine"), s("Cylinders", "3, water-cooled", "3, water-cooled", "engine"),
      s("Fuel", "Diesel", "Diesel", "engine"), s("Fuel consumption", "1.3–1.5 L/h", "1.3–1.5 L/h", "engine"), s("Fuel tank", "15 L", "4 gal", "engine"), s("Hydraulic tank", "28 L", "7.4 gal", "engine"),
      s("Travel pump flow", "96 L/min", "25.4 gal/min", "engine"), s("Work pump flow", "42 L/min", "11.1 gal/min", "engine"), s("Relief pressure", "20 MPa", "2,900 psi", "engine"),
      s("Transport length (with bucket)", "3,650 mm", "143.8 in", "dimensions"), s("Transport length (no bucket)", "3,120 mm", "122.9 in", "dimensions"), s("Transport height", "2,300 mm", "90.6 in", "dimensions"), s("Bucket width", "1,150 mm", "45.3 in", "dimensions"),
    ],
    features: [
      { eyebrow: "Power", title: "Kubota D1105: 24.4 hp, Stage V clean", text: "Three-cylinder water-cooled diesel with high torque at low rpm and an electronically governed injection curve. Low noise, low vibration, Euro V / US Tier 4 final.", image: "rl06-action" },
      { eyebrow: "Articulated", title: "Centre-pivot frame, 94.5\" turning radius", text: "The articulated chassis needs less power for most tasks, reduces surface damage and turns inside a barn aisle. Driveshaft transmission with a small steering angle and strong climbing ability." },
      { eyebrow: "Lift", title: "3,380 mm (133\") lift, 2,060 mm (81\") dump height", text: "Twin upper cylinders give more lift force and stability with heavy loads. Loads a pickup bed or one-ton dump trailer without a ramp." },
      { eyebrow: "Traction", title: "All-terrain tires", text: "Aggressive tread for mud, gravel, snow and turf. Better grip on unpaved surfaces, less slip, quieter on hard ground." },
      { eyebrow: "Operator", title: "Suspension seat, joystick, LED lights, safety guard", text: "One-hand forward/reverse joystick, centralized switch panel, instrument display with oil level and temperature, fold-down guard, retractable seat belt and a warning beacon." },
      { eyebrow: "Service", title: "Tilt-forward seat, split radiator", text: "Open the seat for engine, filter and hydraulic checks in seconds. Split-type radiator dissipates heat and is easy to clean." },
    ],
    standardEquipment: ["Kubota D1105 diesel", "Hydrostatic four-wheel drive", "Articulated steering", "General-purpose bucket 1,150 mm", "Quick-attach plate with auxiliary hydraulics", "Suspension seat with seat belt", "Four-post ROPS canopy with fold-down operator guard", "LED work lights and warning beacon", "Instrument display"],
    applications: ["Farms and acreages", "Barn and feed handling", "Landscaping and hardscape", "Snow removal", "Yard and material handling", "Rental fleets"],
    faqs: loaderFaqs("RL06", "1,725 kg (3,802 lb)", "1,150 mm (45.3\")"),
    images: [{ key: "rl06-render", alt: "RIPPA RL06 compact wheel loader" }, { key: "rl06-action", alt: "RIPPA RL06 loading topsoil" }],
    brochure: "RIPPA-RL06-Spec-Sheet.pdf", targetUsers: "Farms, acreages, landscapers, small contractors and rental fleets that need a loader narrow enough for barns and yards.",
  },
  // ============================================================ RB06
  {
    slug: "rb06", modelName: "RB06", category: "loaders", series: "Backhoe Loader", sortOrder: 2, builderEnabled: false, featured: true,
    shortDescription: "Compact backhoe loader: RL06 loader up front, 2,500 mm (98\") dig-depth excavator arm at the back. One 24.4 hp Kubota machine that digs, loads and carries.",
    longDescription: "The RB06 pairs the RL06 articulated loader with a rear excavator arm on a 119° swing, so one compact machine handles the whole job: dig the trench, backfill it, load the truck and grade the drive. The backhoe reaches 3,400 mm (134\"), digs 2,500 mm (98.5\") deep with 15.8 kN of breakout force, and the loader end lifts 600 kg (1,322 lb) to a 2,060 mm (81\") dump height.\n\nAt 1,150 mm (45.3\") wide and 2,325 kg (5,126 lb) it trailers behind a pickup and works between houses, in barns and on acreages where a full-size backhoe cannot go. The operator seat swivels to the excavator controls, stabilizer legs plant the machine for digging, and power steering, a suspension seat and a four-post TOPS/ROPS canopy come standard.\n\nQuick-attach connectors on both ends swap loader attachments and backhoe buckets in under a minute. Sold, set up and supported by the RIPPA Service Centre at Niagara Equipment Supply in Thorold, with delivery across Ontario.",
    certifications: ["CE", "EPA", "EU Stage V"], warranty: "2 year warranty",
    configurations: [
      { id: "rb06-std", label: "Kubota D1105 · Open canopy", engine: "Kubota D1105 diesel", horsepower: "24.4 hp (18.2 kW)", operatingWeight: "2,325 kg" },
    ],
    specs: [
      s("Operating weight", "2,325 kg", "5,126 lb", "general", "weight", true), s("Engine", "Kubota D1105", "Kubota D1105", "engine", "engine", true),
      s("Max power", "24.4 hp (18.2 kW)", "24.4 hp (18.2 kW)", "engine", "power", true), s("Max digging depth", "2,500 mm", "98.5 in", "performance", "depth", true), s("Transport width", "1,150 mm", "45.3 in", "dimensions", "width", true),
      s("Loader bucket capacity", "0.23 m³", "8.1 ft³", "general", "capacity"), s("Rated load", "300 kg", "661 lb", "general"), s("Max load", "600 kg", "1,322 lb", "general"),
      s("Backhoe bucket capacity", "0.036 m³", "1.3 ft³", "general"), s("Travel speed", "0–8 km/h", "0–5 mph", "general"), s("Gradeability", "25%", "25%", "general"), s("Ground pressure", "107.6 kPa", "15.6 psi", "general"),
      s("Max dump height (loader)", "2,060 mm", "81.2 in", "performance"), s("Max lift height (loader)", "3,380 mm", "133.2 in", "performance"), s("Max dump reach (loader)", "650 mm", "25.6 in", "performance"),
      s("Max digging force", "15.8 kN", "3,552 lbf", "performance"), s("Max digging radius", "3,400 mm", "134 in", "performance"), s("Max digging height", "3,200 mm", "126.1 in", "performance"), s("Max dump height (backhoe)", "2,160 mm", "85.1 in", "performance"),
      s("Backhoe swing angle", "119°", "119°", "performance"), s("Turning radius", "2,400 mm", "94.6 in", "performance"), s("Track (tread) width", "840 mm", "33.1 in", "performance"), s("Wheelbase", "1,730 mm", "68.2 in", "performance"), s("Ground clearance", "155 mm", "6.1 in", "performance"),
      s("Engine model", "Kubota D1105", "Kubota D1105", "engine"), s("Rated speed", "3,000 rpm", "3,000 rpm", "engine"), s("Displacement", "1.123 L", "1.123 L", "engine"), s("Cylinders", "3, water-cooled", "3, water-cooled", "engine"),
      s("Fuel", "Diesel", "Diesel", "engine"), s("Fuel consumption", "1.3–1.5 L/h", "1.3–1.5 L/h", "engine"), s("Travel pump flow", "96 L/min", "25.4 gal/min", "engine"), s("Work pump flow", "42 L/min", "11.1 gal/min", "engine"), s("Relief pressure", "18–20 MPa", "2,610–2,900 psi", "engine"),
      s("Transport length (with bucket)", "5,180 mm", "204.1 in", "dimensions"), s("Transport length (no bucket)", "4,590 mm", "180.8 in", "dimensions"), s("Transport height", "2,600 mm", "102.4 in", "dimensions"),
      s("Loader bucket width", "1,150 mm", "45.3 in", "dimensions"), s("Backhoe bucket width", "400 mm", "15.8 in", "dimensions"), s("Boom length", "1,780 mm", "70.1 in", "dimensions"), s("Arm length", "940 mm", "37 in", "dimensions"),
    ],
    features: [
      { eyebrow: "Two machines in one", title: "Loader up front, excavator at the back", text: "Swivel the seat to the backhoe console and dig 2,500 mm (98\") deep through a 119° swing; turn back and load, backfill and grade with the articulated loader end.", image: "rb06-action" },
      { eyebrow: "Power", title: "Kubota D1105: 24.4 hp, low noise, low vibration", text: "Water-cooled three-cylinder diesel at 3,000 rpm handles municipal and landscaping work with high adaptability and Stage V emissions." },
      { eyebrow: "Stability", title: "Stabilizer legs", text: "Outriggers extend and compact the ground before digging, so the machine does not rock or tip under load." },
      { eyebrow: "Comfort", title: "Suspension seat, power steering, pilot joystick", text: "The seat isolates up to 90% of vertical vibration and swivels front to back. Electric-assist steering and a single pilot handle for lift, tilt and drive shorten every cycle." },
      { eyebrow: "Safety", title: "Four-post TOPS / ROPS canopy", text: "Certified roll-over and tip-over protection, LED work lights, mirror, handrail, fire extinguisher and a rear tow hook that doubles as a recovery point." },
      { eyebrow: "Uptime", title: "Quick-attach both ends, inspection port", text: "Change loader attachments or backhoe buckets in under a minute; a service port and gas-strut step give fast access for daily checks." },
    ],
    standardEquipment: ["Kubota D1105 diesel", "Hydrostatic four-wheel drive with articulated steering", "Loader bucket 1,150 mm", "Backhoe bucket 400 mm", "Stabilizer legs", "Swivel suspension seat", "Power steering", "Four-post TOPS / ROPS canopy", "LED work lights, beacon and mirror", "Quick-attach connectors front and rear"],
    applications: ["Acreages and hobby farms", "Utility trenching and backfill", "Landscaping and drainage", "Municipal and grounds work", "Fence and post work", "Small contractors and rentals"],
    faqs: [
      { question: "Is the RB06 an excavator or a loader?", answer: "Both. The front is the RL06 articulated loader (600 kg / 1,322 lb max load); the rear is a hydraulic excavator arm with a 2,500 mm (98\") dig depth and 119° swing. The seat swivels between the two consoles." },
      ...loaderFaqs("RB06", "2,325 kg (5,126 lb)", "1,150 mm (45.3\")").slice(0, 2),
      { question: "Which backhoe buckets fit?", answer: "The rear arm uses RIPPA's compact excavator buckets and attachments; the front runs loader attachments. Both ends have quick-attach connectors. Ask us to confirm sizes for your serial number." },
      { question: "What warranty and support do I get?", answer: "Two-year warranty backed by the RIPPA Service Centre, genuine RIPPA and Kubota parts, dealer pre-delivery inspection and an owner walk-through at delivery." },
    ],
    images: [{ key: "rb06-render", alt: "RIPPA RB06 compact backhoe loader" }, { key: "rb06-action", alt: "RIPPA RB06 backhoe loader on a landscaping site" }],
    brochure: "RIPPA-RB06-Spec-Sheet.pdf", targetUsers: "Acreage owners, landscapers, small contractors and municipalities that want one compact machine to dig, load and carry.",
  },
  // ============================================================ RD06
  {
    slug: "rd06", modelName: "RD06", category: "track-dumpers", series: "Track Dumper", sortOrder: 1, builderEnabled: false, featured: true,
    shortDescription: "Tracked mini dumper with a 350 kg (770 lb) payload, self-loading scoop and a 13.4 hp Briggs & Stratton engine. 780 mm (31\") wide for gates, paths and backyards.",
    longDescription: "The RD06 moves material where a wheelbarrow is too slow and a truck cannot go: through a 780 mm (30.7\") gate, across lawns, over mud and up 30% grades on rubber tracks with 19.6 kPa (2.8 psi) ground pressure. The 0.27 m³ (9.5 ft³) tipping body carries 350 kg (770 lb) of soil, gravel, mulch or demolition debris, and the hydraulic self-loading scoop fills it without a second machine.\n\nA 13.4 hp Briggs & Stratton XR2100 gasoline engine drives a two-speed hydrostatic track system from stand-behind controls, so anyone on the crew can run it. The RD06-E adds a lifting body for tipping into trailers and skips.\n\nBuilt for landscapers, hardscape crews, nurseries, arborists and homeowners with a big project. Sold and supported by the RIPPA Service Centre at Niagara Equipment Supply in Thorold, with delivery across Ontario.",
    certifications: ["CE", "EPA"], warranty: "2 year warranty",
    configurations: [
      { id: "rd06-std", label: "Briggs & Stratton XR2100 · Standard body", engine: "Briggs & Stratton XR2100 gasoline", horsepower: "13.4 hp (10 kW)", operatingWeight: "518 kg" },
      { id: "rd06-e", label: "Briggs & Stratton XR2100 · Lifting body (RD06-E)", engine: "Briggs & Stratton XR2100 gasoline", horsepower: "13.4 hp (10 kW)", operatingWeight: "518 kg" },
    ],
    specs: [
      s("Operating weight", "518 kg", "1,140 lb", "general", "weight", true), s("Engine", "Briggs & Stratton XR2100", "Briggs & Stratton XR2100", "engine", "engine", true),
      s("Max power", "13.4 hp (10 kW)", "13.4 hp (10 kW)", "engine", "power", true), s("Rated load", "350 kg", "770 lb", "general", "capacity", true), s("Transport width", "780 mm", "30.7 in", "dimensions", "width", true),
      s("Dump body capacity", "0.27 m³", "9.5 ft³", "general"), s("Self-loading scoop capacity", "0.03 m³", "1.06 ft³", "general"), s("Travel speed (low / high)", "0–2 / 0–4 km/h", "0–1.24 / 0–2.48 mph", "general"),
      s("Gradeability", "30%", "30%", "general"), s("Ground pressure", "19.6 kPa", "2.8 psi", "general"),
      s("Max unloading height", "356 mm", "14 in", "performance"), s("Max unloading distance", "272 mm", "10.7 in", "performance"), s("Ground clearance", "70 mm", "2.8 in", "performance"),
      s("Engine model", "Briggs & Stratton XR2100", "Briggs & Stratton XR2100", "engine"), s("Rated speed", "3,600 rpm", "3,600 rpm", "engine"), s("Displacement", "0.42 L", "0.42 L", "engine"), s("Cylinders", "1, air-cooled", "1, air-cooled", "engine"),
      s("Fuel", "Gasoline (92 octane)", "Gasoline (92 octane)", "engine"), s("Fuel consumption", "0.8–1.2 L/h", "0.8–1.2 L/h", "engine"), s("Pump flow", "14.4 + 14.4 L/min", "3.8 + 3.8 gal/min", "engine"), s("Relief pressure", "16–18 MPa", "2,320–2,610 psi", "engine"),
      s("Transport length", "1,670 mm", "65.7 in", "dimensions"), s("Transport height", "1,200 mm", "47.2 in", "dimensions"), s("Body width", "700 mm", "27.6 in", "dimensions"),
    ],
    features: [
      { eyebrow: "Access", title: "780 mm (31\") wide, tracks that tread lightly", text: "Passes a standard gate and side yard, crosses finished lawns at 2.8 psi and climbs 30% grades where wheelbarrows and wheeled carriers stall." },
      { eyebrow: "Self-loading", title: "Hydraulic scoop fills the body", text: "Scrape up soil, gravel or mulch and tip it into the body without a second machine or a shovel crew." },
      { eyebrow: "Payload", title: "350 kg (770 lb), 0.27 m³ (9.5 ft³) body", text: "Roughly six wheelbarrow loads per trip. Hydraulic tip for fast dumping." },
      { eyebrow: "Power", title: "Briggs & Stratton XR2100, 13.4 hp", text: "Air-cooled gasoline engine with two-speed hydrostatic drive: easy starting, easy fuel, easy service." },
      { eyebrow: "Simple", title: "Stand-behind controls anyone can run", text: "Lever controls for drive, tip and scoop. Minimal training, ideal for rental fleets and crews." },
      { eyebrow: "RD06-E", title: "Lifting body option", text: "The RD06-E raises the body to tip into trailers, skips and truck beds." },
    ],
    standardEquipment: ["Briggs & Stratton XR2100 gasoline engine", "Two-speed hydrostatic rubber-track drive", "Hydraulic tipping body 0.27 m³", "Hydraulic self-loading scoop", "Stand-behind lever controls"],
    applications: ["Landscaping and hardscape", "Backyard and side-yard access", "Nurseries and tree care", "Demolition debris", "Farm chores", "Rental fleets"],
    faqs: [
      { question: "How much does the RD06 carry?", answer: "Rated payload is 350 kg (770 lb) in a 0.27 m³ (9.5 ft³) body, about six wheelbarrow loads per trip." },
      { question: "Will it damage a lawn?", answer: "Ground pressure is 19.6 kPa (2.8 psi) on rubber tracks, far less than a wheeled carrier or a loaded wheelbarrow tire. Avoid pivot turns on wet turf." },
      { question: "Gas or diesel?", answer: "Gasoline: a 13.4 hp Briggs & Stratton XR2100 on 92-octane fuel, air-cooled and simple to service." },
      { question: "Can I fit it in a pickup or van?", answer: "It is 1,670 mm (65.7\") long, 780 mm (30.7\") wide, 1,200 mm (47.2\") tall and 518 kg (1,140 lb). It rides in a full-size pickup bed with ramps or on a small utility trailer." },
      { question: "What warranty and support do I get?", answer: "Two-year warranty backed by the RIPPA Service Centre, genuine RIPPA and Briggs & Stratton parts, and dealer pre-delivery inspection." },
    ],
    images: [{ key: "rd06-render", alt: "RIPPA RD06 tracked mini dumper" }, { key: "rd06-photo", alt: "RIPPA RD06 mini dumper with self-loading scoop" }],
    brochure: "RIPPA-RD06-Spec-Sheet.pdf", targetUsers: "Landscapers, hardscape crews, nurseries, arborists, rental fleets and homeowners with big backyard projects.",
  },
];
