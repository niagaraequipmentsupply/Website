/**
 * Category page content for the loader, track dumper and attachment categories (intro, buying guide, highlights, FAQs).
 * Excavator and skid steer content lives in excavator-comparison.ts. Seeded by npm run seed:comparison.
 */
export const extraCategoryContent = {
  loaders: {
    intro: "RIPPA's articulated loaders put a Kubota D1105 diesel and a 94.5\" turning radius into a 45\"-wide machine that works in barns, yards and between buildings. The RL06 is the loader; the RB06 adds an excavator arm on the back so one machine digs, loads and carries. Both run the same quick-attach loader attachments.",
    buyingGuide: [
      { title: "Farms, acreages and yards", text: "The RL06 handles feed, mulch, gravel and snow with a 600 kg (1,322 lb) max load and an 81\" dump height that clears a pickup bed. Add the telescopic RL06-T boom when you stack or load high-sided trailers.", slugs: ["rl06"] },
      { title: "Trenching, drainage and utilities", text: "The RB06 digs 98\" deep through a 119° swing at the back, then turns around to backfill and grade with the loader end. One machine for fence lines, tile, water lines and small foundations.", slugs: ["rb06"] },
      { title: "Landscapers and small contractors", text: "Either machine trailers behind a half-ton, fits a 4-foot gate and runs 4-in-1 buckets, forks, augers, sweepers and snow blades from the quick-attach plate.", slugs: ["rl06", "rb06"] },
    ],
    highlights: [
      { title: "Kubota D1105, 24.4 hp", text: "Three-cylinder water-cooled diesel, Stage V / Tier 4, with Kubota parts and service through the RIPPA Service Centre." },
      { title: "Articulated, 45\" wide", text: "Centre-pivot steering turns inside a barn aisle and treads lightly on finished ground." },
      { title: "One plate, many tools", text: "Quick-attach loader plate with auxiliary hydraulics for buckets, forks, augers, sweepers, blades and mixers." },
      { title: "Operator comfort", text: "Suspension seat, one-hand joystick, power steering on the RB06, LED lights and a fold-down guard as standard." },
    ],
    faqs: [
      { question: "What is the difference between the RL06 and the RB06?", answer: "The RL06 is a compact articulated wheel loader. The RB06 is the same loader with a hydraulic excavator arm and stabilizers on the back, so it also trenches and digs. The RB06 weighs about 600 kg (1,300 lb) more." },
      { question: "Can I tow a RIPPA loader behind a pickup?", answer: "Yes. The RL06 is 1,725 kg (3,802 lb) and the RB06 is 2,325 kg (5,126 lb). Both trailer behind a half-ton on a tandem-axle equipment trailer with brakes. We also deliver anywhere in Ontario." },
      { question: "What attachments fit?", answer: "Loader buckets, 4-in-1 buckets, pallet forks, side-shift forks, augers, sweepers, dozer and snow blades, log grapples, trenchers, mixers, breakers and stump grinders. Every one is listed with sizes on the RL06 and RB06 pages." },
      { question: "Is the RB06 a real backhoe?", answer: "It is a compact backhoe loader: 2,500 mm (98\") dig depth, 15.8 kN breakout force, a 400 mm (16\") bucket and a swivel seat between the loader and excavator consoles. It is sized for acreages, landscaping and utility work, not for a full-size construction backhoe's jobs." },
      { question: "What warranty and support come with it?", answer: "Two-year warranty backed by the RIPPA Service Centre in Thorold, genuine RIPPA and Kubota parts shipped across Canada, dealer pre-delivery inspection and an owner walk-through at delivery." },
    ],
  },
  "track-dumpers": {
    intro: "The RIPPA RD06 is a tracked mini dumper that carries 350 kg (770 lb) through a 31\" gate, across lawns and up 30% grades, with a hydraulic self-loading scoop so one person moves soil, gravel and debris without a wheelbarrow crew. The RD06-E adds a lifting body for tipping into trailers and skips.",
    buyingGuide: [
      { title: "Landscaping and hardscape", text: "Move topsoil, mulch and paver base through side yards and over finished lawns at 2.8 psi ground pressure. Roughly six wheelbarrow loads per trip.", slugs: ["rd06"] },
      { title: "Backyard projects and renovations", text: "Demolition debris, concrete and gravel out of a backyard or crawlspace through a standard gate. Gas engine, stand-behind levers, no training needed.", slugs: ["rd06"] },
      { title: "Nurseries, tree care and rentals", text: "Simple controls, a Briggs & Stratton engine and rubber tracks make it a rental-fleet favourite. Choose the RD06-E when you need to tip into a truck or skip.", slugs: ["rd06"] },
    ],
    highlights: [
      { title: "780 mm (31\") wide", text: "Fits a standard gate and side yard where wheeled carriers and mini loaders cannot go." },
      { title: "Self-loading scoop", text: "Hydraulic scoop fills the body from a pile, so one operator does the whole job." },
      { title: "Light on turf", text: "Rubber tracks at 19.6 kPa (2.8 psi) cross finished lawns and climb 30% grades." },
      { title: "Easy to own", text: "13.4 hp Briggs & Stratton gasoline engine, two-speed hydrostatic drive, minimal maintenance." },
    ],
    faqs: [
      { question: "How much can the RD06 carry?", answer: "350 kg (770 lb) rated payload in a 0.27 m³ (9.5 ft³) tipping body." },
      { question: "Will it fit through my gate?", answer: "Transport width is 780 mm (30.7\"), so it clears a standard 36\" gate with room to spare and passes most side yards." },
      { question: "What is the RD06-E?", answer: "The same dumper with a hydraulic lifting body that raises before tipping, for loading trailers, skips and truck beds." },
      { question: "Gas or diesel?", answer: "Gasoline: a 13.4 hp Briggs & Stratton XR2100 that runs on regular pump fuel and is simple to service." },
      { question: "How do I move it between jobs?", answer: "At 518 kg (1,140 lb) and 1,670 mm (66\") long it rides in a full-size pickup bed with ramps or on a small utility trailer." },
    ],
  },
  "excavator-attachments": {
    intro: "Every RIPPA excavator attachment is built for a specific machine class: pin size, bucket width and hydraulic flow change from the R06 to the R230. Pick your model to see only what fits, then choose the size. Buckets, thumbs and couplers cover most owners; augers, breakers, rakes, grapples and mulchers turn the machine into a year-round tool.",
    buyingGuide: [
      { title: "Every owner: bucket set and thumb", text: "A narrow trenching bucket, a wide ditching bucket and a hydraulic thumb do 80% of the work. Add a mechanical or hydraulic quick coupler to swap them in under a minute.", slugs: [] },
      { title: "Fencing, decks and tree planting", text: "An auger with 6\" to 24\" bits drills post holes and planting holes in minutes. Choose the planetary-reducer drive for rocky ground.", slugs: [] },
      { title: "Land clearing and demolition", text: "Hydraulic breakers, rakes, rippers, log grapples and forestry mulchers for the PRO models, matched to each machine's auxiliary flow.", slugs: [] },
    ],
    highlights: [
      { title: "Sized per model", text: "Each family lists the exact width, part number and machines it fits. No guessing." },
      { title: "Genuine RIPPA", text: "Factory pins, bushings and cylinders that match the machine's coupler and hydraulics." },
      { title: "Plate and coupler changes", text: "We convert couplers and fit adapters so attachments you already own keep working." },
      { title: "Quote with the machine", text: "Add attachments beside the excavator in one quote or in the builder." },
    ],
    faqs: [
      { question: "Will an attachment from one RIPPA model fit another?", answer: "Within a class, often yes: the R06, R10, R13 and R15 share many attachments, as do the R18 and R22. Across classes the pin size and width change. Every attachment page lists the exact models it fits." },
      { question: "Do I need a hydraulic quick coupler?", answer: "Not to start, but it turns a ten-minute pin change into a one-minute swap from the seat. Most owners with three or more attachments add one." },
      { question: "Can you fit attachments from another brand?", answer: "Usually. Send us the pin diameter, pin spacing and ear width and we will confirm or supply an adapter." },
      { question: "How do I get pricing?", answer: "Add the attachment to your quote with your machine selected and we reply with price and availability, or call the parts desk." },
    ],
  },
  "skid-steer-attachments": {
    intro: "RIPPA skid steer and stand-on loader attachments come in three plate standards. First-generation RS03, RS04, RS06 and RS07 loaders use the Toro Dingo-style mini plate; -2 and -3 generation loaders use RIPPA's proprietary plate; the RS10 and RS20 use the universal SSQA plate shared with Deere, Cat and Kubota. Filter by your model and the site shows only what fits.",
    buyingGuide: [
      { title: "Landscaping and hardscape", text: "4-in-1 bucket, pallet forks, auger and a land leveler cover most crews. Add a trencher for irrigation and a sweeper for clean-up.", slugs: [] },
      { title: "Farms and acreages", text: "Bale forks, rock buckets, high-dump buckets, snow pushers and plow blades for year-round chores.", slugs: [] },
      { title: "Clearing and tree work", text: "Brush cutters, stump grinders, log grapples, wood chippers and log splitters run from the loader's auxiliary hydraulics.", slugs: [] },
    ],
    highlights: [
      { title: "Three plate standards", text: "Toro Dingo-style mini plate, RIPPA proprietary plate, and universal SSQA on the RS10 and RS20. Each version shows its plate." },
      { title: "Plate conversions", text: "We change plates and fit adapters so you keep using attachments you already own." },
      { title: "Sized for the machine", text: "Brochure dimensions and capacities listed per loader class." },
      { title: "One quote", text: "Add attachments beside the loader in your quote or the skid steer builder." },
    ],
    faqs: [
      { question: "Which plate does my loader have?", answer: "RS03, RS04, RS06 and RS07 first-generation loaders use the Toro Dingo-style mini plate. Loaders sold as -2 or -3 use the RIPPA proprietary plate. RS10 and RS20 use the universal skid steer quick-attach (SSQA, ISO 24410). Check the badge on the plate or send us your serial number." },
      { question: "Can I run Toro Dingo or Bobcat MT attachments?", answer: "First-generation RIPPA mini loaders share the Toro Dingo-style plate, so those attachments fit. For other standards we supply adapter plates or convert the loader." },
      { question: "Do RS10 and RS20 take standard skid steer attachments?", answer: "Yes. They use the universal SSQA plate, the same as Deere, Cat, Kubota and most aftermarket attachments." },
      { question: "What hydraulic flow do the attachments need?", answer: "Standard-flow tools such as augers, sweepers and 4-in-1 buckets run on every model. High-flow tools such as mulchers and brush cutters need the RS06 and up. Each attachment page lists the models it is rated for." },
    ],
  },
  "loader-attachments": {
    intro: "Attachments for the RL06 wheel loader and RB06 backhoe loader: buckets, 4-in-1 buckets, forks, augers, sweepers, blades, grapples and mixers on the loader's quick-attach plate, plus backhoe buckets for the RB06 arm.",
    buyingGuide: [
      { title: "Yard and farm work", text: "General-purpose bucket, pallet forks and a snow blade cover most of the year; add a sweeper and a 4-in-1 bucket for clean-up and grading.", slugs: ["rl06", "rb06"] },
      { title: "Digging with the RB06", text: "Backhoe buckets, a ripper and an auger for the excavator end, with the loader end handling backfill.", slugs: ["rb06"] },
    ],
    highlights: [
      { title: "Quick-attach plate", text: "Swap loader attachments in under a minute with auxiliary hydraulics on the plate." },
      { title: "Genuine RIPPA", text: "Built for the RL06 and RB06 lift geometry and hydraulic flow." },
      { title: "Sized and priced with the machine", text: "Add attachments beside the loader in one written quote." },
    ],
    faqs: [
      { question: "Do RL06 and RB06 attachments interchange?", answer: "Loader attachments do: both use the same quick-attach plate on the loader end. Backhoe buckets fit only the RB06 arm." },
      { question: "Can I run skid steer attachments on the RL06?", answer: "Some, with an adapter. Send us the attachment's plate type and we will confirm or supply the adapter." },
    ],
  },
} as const;
