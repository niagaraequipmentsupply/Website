/**
 * Attachment family descriptions and brochure specifications, keyed by normalized family name.
 * Specs transcribed from the RIPPA RS03/RS04 (mini), RS06/RS07 (compact) and RS10/RS20 (full-size) brochures
 * and the R32 excavator brochure. Metric here; the site's units layer converts to ft / in and kg / lb.
 */
export interface FamilyInfo {
  /** Customer-facing name */
  name: string;
  type: string;
  description: string;
  /** Per size class or model group → spec lines */
  specs?: Record<string, string[]>;
}

const F = (name: string, type: string, description: string, specs?: Record<string, string[]>): FamilyInfo => ({ name, type, description, specs });

export const families: Record<string, FamilyInfo> = {
  // ---------- Excavator ----------
  "DIGGING BUCKET": F("Digging Bucket", "Buckets", "General-purpose toothed bucket for trenching, footings and loading. Widths from 200 mm for utility trenches to 1,200 mm for bulk digging; each model has its own pin size, so choose the bucket built for your machine."),
  "DIGGING BUCKET WITH TEETH": F("Digging Bucket", "Buckets", "Toothed digging bucket for the full-size R210 / R230 class."),
  "CLEAN UP BUCKET": F("Ditching / Clean-up Bucket", "Ditching & Clean-up Buckets", "Wide, smooth-edge bucket for grading, ditch cleaning, backfilling and finishing. Widths from 300 mm to 1,500 mm depending on model."),
  "MUD BUCKET": F("Ditching / Clean-up Bucket", "Ditching & Clean-up Buckets", "Wide smooth-edge bucket for grading and ditch work."),
  "TILT BUCKET SIMPLE CYLINDER": F("Tilt Bucket (single cylinder)", "Tilt Buckets", "Hydraulic tilt bucket for grading slopes and ditches without repositioning the machine. Single-cylinder version; runs on the auxiliary circuit."),
  "TILT BUCKET DOUBLE CYLINDER": F("Tilt Bucket (double cylinder)", "Tilt Buckets", "Heavy-duty hydraulic tilt bucket with two cylinders for faster, stronger tilt under load. For slope grading, ditch profiling and finish work."),
  "TILT BUCKET": F("Tilt Bucket", "Tilt Buckets", "Hydraulic tilt bucket for grading slopes and ditches."),
  "SKELETON BUCKET": F("Skeleton (Riddle) Bucket", "Skeleton & Rock Buckets", "Slotted bucket that sifts soil from rocks, roots and debris. Sort backfill on site and keep the good material."),
  "GRID BUCKET WITH MOTOR": F("Rotary Screening Bucket", "Skeleton & Rock Buckets", "Hydraulically driven screening bucket that separates fine material from rock and debris while you work."),
  "GRAPPLE BUCKET": F("Grapple Bucket", "Grapples", "Bucket with a hydraulic top clamp for grabbing brush, logs and demolition debris."),
  "LOG GRAPPLE": F("Log Grapple", "Grapples", "Hydraulic grapple for logs, brush, stumps and irregular loads."),
  "ROTATING LOG GRAPPLE": F("Rotating Log Grapple", "Grapples", "Hydraulic log grapple with 360° hydraulic rotation for placing logs and material precisely.", { default: ["Rotation angle: 360°", "Control: hydraulic"] }),
  "HYDRAULIC ROTATING LOG GRAPPLE": F("Rotating Log Grapple", "Grapples", "Hydraulic log grapple with 360° rotation.", { default: ["Rotation angle: 360°", "Control: hydraulic"] }),
  "HYDRAULIC THUMB": F("Hydraulic Thumb", "Thumbs", "Hydraulic thumb that works with the bucket to grab rocks, logs and debris. Standard on most RIPPA excavators; listed here as a replacement or upgrade."),
  "MECHANICAL THUMB": F("Mechanical Thumb", "Thumbs", "Pin-adjusted fixed thumb for occasional grabbing without a hydraulic circuit."),
  "HYDRAULIC HAMMER": F("Hydraulic Breaker", "Breakers & Hammers", "Hydraulic breaker for concrete, rock and frozen ground. Matched to each model's auxiliary flow and pressure."),
  "HYDRAULIC BREAKER": F("Hydraulic Breaker", "Breakers & Hammers", "Hydraulic breaker for concrete, rock and frozen ground.", { mini: ["Length 0.7 m, width 1.0 m, height 0.41 m", "Weight 130 kg"], full: ["Length 1.45 m, width 1.25 m, height 0.7 m", "Weight 320 kg"] }),
  "AUGER": F("Auger", "Augers", "Hydraulic earth auger drive with bit. Bit diameters from 150 mm to 800 mm and lengths of 800 to 1,500 mm; reducer versions for larger bits in hard ground."),
  "AUGER WITH REDUCER": F("Auger (with reducer)", "Augers", "Auger drive with planetary reducer for higher torque in hard or rocky ground."),
  "RAKE": F("Rake", "Rakes", "Tined rake for land clearing, root and rock raking, and site clean-up. Widths from 400 mm to 1,000 mm."),
  "RIPPER": F("Ripper", "Rippers", "Single-shank ripper for breaking hard, frozen or compacted ground and pulling roots ahead of the bucket."),
  "EXTENSION ARM": F("Extension Arm", "Extension Arms", "Bolt-on arm extension that adds 500 mm to 1,000 mm of reach and dig depth for ditching and pond work."),
  "EXTENSION ARM MOUNTING PARTS": F("Extension Arm Mounting Kit", "Extension Arms", "Mounting hardware for the extension arm."),
  "HYDRAULIC QUICK ATTACH": F("Hydraulic Quick Coupler", "Couplers & Quick Attach", "Hydraulic quick coupler for changing buckets and attachments from the seat."),
  "MECHANICAL QUICK ATTACH": F("Mechanical Quick Coupler", "Couplers & Quick Attach", "Pin-grabber mechanical quick coupler for fast, tool-free bucket changes."),
  "HYDRAULIC TILT QUICK COUPLER": F("Hydraulic Tilt Quick Coupler", "Couplers & Quick Attach", "Quick coupler with built-in hydraulic tilt so any bucket becomes a tilt bucket."),
  "HYDRAULIC ROTATING QUICK COUPLER": F("Hydraulic Rotating Quick Coupler", "Couplers & Quick Attach", "Quick coupler with hydraulic rotation for angled trenching and grading."),
  "ISO TO SAE SWITCH": F("ISO / SAE Pattern Switch", "Couplers & Quick Attach", "Control-pattern change valve to switch between ISO (excavator) and SAE (backhoe) joystick patterns."),
  "MULCHER": F("Mulcher", "Mowers & Mulchers", "Hydraulic flail mulcher for brush, saplings and roadside vegetation."),
  "FORESTRY MULCHER": F("Forestry Mulcher", "Mowers & Mulchers", "Heavy-duty fixed-tooth forestry mulcher for land clearing on the larger PRO models."),
  "FOREST MULCHER": F("Forestry Mulcher", "Mowers & Mulchers", "Heavy-duty forestry mulcher for land clearing."),
  "DRUM MOWER": F("Drum Mower", "Mowers & Mulchers", "Boom-mounted drum mower for ditches, banks and roadside grass."),
  "CHAIN MOWER": F("Chain Mower", "Mowers & Mulchers", "Chain flail mower for heavy brush on full-size excavators."),
  "PALLET FORKS": F("Pallet Forks", "Forks", "Coupler-mounted forks for moving pallets and bundles with the excavator."),
  "FORKS": F("Pallet Forks", "Forks", "Coupler-mounted forks for pallets and bundles."),
  "EAGLE BECK SCISSORS": F("Eagle-Beak Shear", "Utility & Specialty", "Hydraulic shear for demolition and scrap handling on the R82."),
  "POMPE DE RAVITAILLEMENT": F("Refuelling Pump", "Utility & Specialty", "On-machine refuelling pump for the R57 and R82."),
  // ---------- Skid steer / mini loader ----------
  "FOUR-IN-ONE BUCKET": F("4-in-1 Bucket", "4-in-1 Buckets", "Hydraulic clam-shell bucket that digs, dozes, grabs and grades. The single most useful loader bucket for landscaping and clean-up.", { mini: ["Bucket capacity 0.25 m³", "Maximum opening width 1,100 mm", "Two hydraulic cylinders", "Q235 steel", "Length 1.15 m, width 0.75 m, height 0.55 m", "Weight 140 kg"], compact: ["Bucket capacity 0.3 m³", "Maximum opening width 800 mm", "Two hydraulic cylinders", "Q235 steel"], full: ["Bucket capacity 0.4 m³", "Maximum opening width 1,500 mm", "Two hydraulic cylinders", "Length 1.95 m, width 1.15 m, height 0.91 m", "Weight 270 kg"] }),
  "4 IN 1 BUCKET": F("4-in-1 Bucket", "4-in-1 Buckets", "Hydraulic clam-shell bucket that digs, dozes, grabs and grades."),
  "ROCK BUCKET": F("Rock Bucket", "Skeleton & Rock Buckets", "Tined skeleton bucket for sifting rocks and debris out of soil.", { mini: ["Length 1.0 m, width 0.5 m, height 0.6 m", "Weight 99 kg"], compact: ["Bucket capacity 0.35 m³", "Width 1,200 mm", "Spill plate option available"], full: ["Length 1.9 m, width 0.75 m, height 0.67 m", "Weight 190 kg"] }),
  "STONE BUCKET": F("Rock Bucket", "Skeleton & Rock Buckets", "Tined bucket for sifting rocks and debris."),
  "STUMP BUCKET": F("Stump Bucket", "Buckets", "Narrow, toothed bucket for prying out stumps and roots and digging in tight spots."),
  "HIGH DUMP BUCKET": F("High Dump Bucket", "Buckets", "Bucket with a secondary dump cylinder for loading high-sided trucks and bins.", { compact: ["Bucket capacity 0.35 m³", "Maximum dumping angle 90°", "Dumping height 3,000 mm", "Q235 steel"] }),
  "MIXING BUCKET": F("Mixing Bucket", "Concrete & Mixing", "Hydraulic concrete mixing bucket for pours on site."),
  "MIXER": F("Mixing Barrel", "Concrete & Mixing", "Hydraulic drum mixer for mortar and concrete on the loader.", { mini: ["Capacity 0.25 L drum (brochure figure)", "Mechanical discharge", "Required hydraulic flow 30 L/min", "Length 0.7 m, width 0.9 m, height 0.7 m", "Weight 116 kg"], compact: ["Capacity 0.3 L drum (brochure figure)", "Required hydraulic flow 40 L/min"] }),
  "MIXING BARREL": F("Mixing Barrel", "Concrete & Mixing", "Hydraulic drum mixer for mortar and concrete."),
  "DIRECT DIGGING": F("Backhoe Arm", "Utility & Specialty", "Front-mounted digging arm that turns the loader into a backhoe.", { mini: ["Digging depth 800 mm", "Bucket capacity 0.15 m³", "One hydraulic line", "Length 1.8 m, width 0.8 m, height 0.58 m", "Weight 110 kg"], compact: ["Digging depth 800 mm", "Bucket capacity 0.15 m³", "One hydraulic circuit"], full: ["Length 2.3 m, width 1.3 m, height 0.7 m", "Weight 170 kg"] }),
  "BACKHOE": F("Backhoe Arm", "Utility & Specialty", "Front-mounted digging arm that turns the loader into a backhoe."),
  "TRENCHER": F("Trencher", "Trenchers", "Chain trencher for irrigation, drainage and cable runs.", { compact: ["Trenching width 210 mm", "Trenching depth 800 mm", "Manual bolt chain tensioning", "Motor option 40 L/min"], full: ["Trenching width 300 mm", "Trenching depth 1,000 mm", "Heavy-duty chain", "Bolt chain tensioning"] }),
  "TRENCH FILLER": F("Trench Filler", "Trenchers", "Auger-style backfill attachment that pushes spoil back into the trench."),
  "ROTARY DRILL": F("Auger (Rotary Drill)", "Augers", "Hydraulic auger drive with bit for post holes and tree planting.", { mini: ["800 mm bits in 150, 200, 220 and 250 mm diameters", "Length 1.3 m, width 0.62 m, height 0.35 m", "Weight 110–114 kg"], compact: ["Drilling diameter 100–400 mm", "Drilling depth 1,000 mm", "Torque 2,500 Nm", "Rotation speed 70 rpm", "Alloy drill bits"], full: ["1,200 mm bits from 150 mm to 600 mm diameter", "Length 1.3 m, width 1.0–1.4 m, height 0.6–0.75 m", "Weight 180–260 kg"] }),
  "TARIÈRE": F("Auger (Rotary Drill)", "Augers", "Hydraulic auger drive with bit."),
  "LAWN MOWER": F("Finish Mower", "Mowers & Mulchers", "Front-mounted rotary finish mower for lawns and grass.", { mini: ["Cutting width 1,200 mm", "Straight blade, 3 blades", "Cutting height adjustment 500 mm", "Length 1.3 m, width 1.35 m, height 0.7 m", "Weight 184 kg"], compact: ["Cutting width 1,100 mm", "Straight blade, 3 blades", "Protective plate", "Cutting height adjustment 50 mm"], full: ["Cutting width 1,600 mm", "Manganese steel blades, 2 blades", "Length 1.45 m, width 1.4 m, height 0.85 m", "Weight 193 kg"] }),
  "MOWER": F("Finish Mower", "Mowers & Mulchers", "Front-mounted rotary finish mower."),
  "BRUSH CUTTER": F("Brush Cutter", "Mowers & Mulchers", "Heavy rotary cutter for shrubs, saplings and overgrown lots.", { mini: ["Cutting diameter 1,100 mm", "Manganese steel blade", "Required hydraulic flow 30 L/min", "Shrubs up to 30 mm diameter", "Length 1.6 m, width 1.2 m, height 0.5 m", "Weight 165 kg"], compact: ["Cutting diameter 1,100 mm", "Manganese steel blade", "Required hydraulic flow 40 L/min", "Shrubs up to 30 mm diameter"], full: ["Cutting diameter 1,500 mm", "Manganese steel blade", "Required hydraulic flow 50 L/min", "Shrubs up to 50 mm diameter"] }),
  "LAND CLEARING RAKE": F("Land Clearing Rake / Mulcher", "Mowers & Mulchers", "Hydraulic land-clearing head for brush and small trees."),
  "STUMP GRINDER": F("Stump Grinder", "Mowers & Mulchers", "Hydraulic stump grinder wheel.", { compact: ["Grinding depth 100 mm", "Wheel diameter 580 mm, 32 teeth", "Required hydraulic flow 40 L/min", "2,000 rpm"], full: ["Grinding depth 200 mm", "Wheel diameter 680 mm, 40 teeth", "Required hydraulic flow 50 L/min", "1,800 rpm"] }),
  "STUMP CRUSHER": F("Stump Grinder", "Mowers & Mulchers", "Hydraulic stump grinder wheel."),
  "EVENTREUR": F("Stump Grinder", "Mowers & Mulchers", "Hydraulic stump grinder."),
  "BULLDOZER BLADE": F("Dozer Blade", "Blades & Graders", "Hydraulic-angle dozer blade for grading, backfilling and pushing snow.", { mini: ["Blade width 1,150 mm, height 600 mm", "Maximum dozing angle 30°", "Hydraulic tilt", "Q235 steel", "Length 1.25 m, width 0.7 m, height 0.7 m", "Weight 130 kg"], compact: ["Blade width 1,200 mm, height 550 mm", "Maximum dozing angle 45°", "45 steel"], full: ["Blade width 1,800 mm, height 900 mm", "Maximum dozing angle 45°", "Hydraulic tilt", "Length 1.85 m, width 0.8 m, height 1.0 m", "Weight 200 kg"] }),
  "BULLDOZER ANGLE BLADE": F("Dozer Blade", "Blades & Graders", "Hydraulic-angle dozer blade."),
  "LAME BULLDOZER": F("Dozer Blade", "Blades & Graders", "Hydraulic-angle dozer blade."),
  "DOZER BLADE": F("Dozer Blade", "Blades & Graders", "Hydraulic-angle dozer blade."),
  "SNOW SHOVEL": F("Snow Pusher", "Snow", "Box-style snow pusher for lots, lanes and yards."),
  "SNOW PLOW": F("Snow Plow Blade", "Snow", "Angling snow plow blade for clearing drives, lots and laneways with the loader. Trip-edge protection and replaceable cutting edge."),
  "LOADER BUCKET": F("Loader Bucket", "Buckets", "General-purpose loader bucket for the RB06 backhoe and RL06 compact wheel loader: stockpiling, loading and grading with a bolt-on cutting edge."),
  "SNOW BLOWER": F("Snow Blower", "Snow", "Hydraulic two-stage snow blower with adjustable chute.", { compact: ["Throwing distance 6 m", "Adjustable throwing direction", "Collection width 1,100 mm"], full: ["Adjustable throwing direction", "Collection width 1,500 mm", "Auger diameter 650 mm", "Length 1.8 m, width 1.3 m, height 1.95 m", "Weight 300 kg"] }),
  "GRADER": F("Land Leveler", "Blades & Graders", "Grading bar for levelling topsoil, gravel and lots.", { mini: ["Length 1.38 m, width 1.3 m, height 0.45 m", "Weight 42 kg"], full: ["Length 1.48 m, width 1.4 m, height 0.65 m", "Weight 65 kg"] }),
  "LEVELER": F("Land Leveler", "Blades & Graders", "Grading bar for levelling topsoil, gravel and lots."),
  "LAND LEVELER": F("Land Leveler", "Blades & Graders", "Grading bar for levelling."),
  "FORK": F("Pallet Forks", "Forks", "Manually adjustable pallet forks with anti-spill backrest.", { mini: ["Rated load 500 kg", "Overflow protection", "Manual width adjustment, 800 mm fork spread", "Length 1.2 m, width 0.72 m, height 0.7 m", "Weight 92 kg"], compact: ["Fork length 950 mm (brochure: 95 mm)", "Fork width 1,100 mm", "Rated load 1,000 kg", "Manual width adjustment, 0–700 mm"], full: ["Rated load 2,000 kg", "Anti-spill protection", "Manual width adjustment, 1,000 mm fork spread", "Length 1.3 m, width 0.93 m, height 0.4 m"] }),
  "FOURCHES": F("Pallet Forks", "Forks", "Manually adjustable pallet forks."),
  "HYDRAULIC FORKS": F("Side-Shift Pallet Forks", "Forks", "Hydraulically side-shifting pallet forks.", { mini: ["Rated load 500 kg", "Side shift 50 mm", "Hydraulic adjustment", "Length 1.25 m, width 0.72 m, height 0.4 m", "Weight 110 kg"], compact: ["Rated load 1,000 kg", "Side shift 300 mm", "Hydraulic adjustment"], full: ["Rated load 2,000 kg", "Side shift 1,000 mm", "Hydraulic adjustment", "Length 1.35 m, width 0.93 m, height 0.45 m", "Weight 260 kg"] }),
  "SIDE-SHIFT PALLET FORK": F("Side-Shift Pallet Forks", "Forks", "Hydraulically side-shifting pallet forks."),
  "HYDRAULIC PITCHFORK": F("Hydraulic Pitchfork / Bale Fork", "Forks", "Hydraulic tined fork for hay, silage and brush."),
  "HYDRAULIC GRAPPLE": F("Grapple Bucket", "Grapples", "Bucket with hydraulic top grapple for brush, logs and debris.", { mini: ["Grab capacity 0.25 m³", "Opening width 1,150 mm", "Length 1.25 m, width 0.85 m, height 0.8 m", "Weight 140 kg"], compact: ["Grab capacity 0.5 m³", "Opening width 700 mm"], full: ["Grabbing capacity 1 m³", "Opening width 1,700 mm"] }),
  "LOG GRAPPLE HOOK": F("Log Grapple", "Grapples", "Hydraulic log grapple."),
  "SWEEPER": F("Angle Sweeper", "Sweepers", "Open rotary broom for sweeping lots, sidewalks and barns.", { mini: ["Sweeping width 1,200 mm", "Nylon and steel wire brush", "200 rpm", "Hydraulic motor 2K-100", "Length 1.55 m, width 1.15 m, height 0.8 m", "Weight 130 kg"], compact: ["Sweeping width 1,200 mm", "Nylon and steel wire brush", "250 rpm", "Hydraulic motor 2K-160"], full: ["Sweeping width 1,800 mm", "PET brush", "200–350 rpm", "Hydraulic motor 2K-245"] }),
  "ROTARY BRUSH": F("Angle Sweeper", "Sweepers", "Open rotary broom."),
  "ENCLOSED SWEEPER": F("Enclosed Sweeper (Pick-up Broom)", "Sweepers", "Enclosed broom with collection box for parking lots and yards.", { mini: ["Sweeping width 1,200 mm", "Nylon and steel wire brush", "200 rpm", "Hydraulic motor 2K-100", "Collection box 0.2 m³", "Length 1.5 m, width 1.4 m, height 0.6 m", "Weight 170 kg"], compact: ["Sweeping width 1,200 mm", "Nylon and steel wire brush", "250 rpm", "Hydraulic motor 2K-160", "Collection box 0.3 m³"], full: ["Sweeping width 1,800 mm", "PET brush", "200–350 rpm", "Hydraulic motor 2K-245", "Collection box 0.5 m³"] }),
  "RIPPER SS": F("Ripper", "Rippers", "Multi-tooth ripper for breaking hard ground.", { mini: ["2 replaceable teeth", "Maximum loosening depth 200 mm", "Length 0.67 m, width 0.5 m, height 0.6 m", "Weight 43 kg"], compact: ["3 replaceable alloy-steel teeth", "Maximum loosening depth 300 mm"] }),
  "LIFTING DEVICE": F("Lifting Jib", "Utility & Specialty", "Telescoping jib with hook for lifting and placing loads.", { mini: ["Rated lifting capacity 300 kg", "Maximum lifting height 3 m", "Boom length 2,000 mm", "Hydraulic rotation", "Safety valve 160 bar", "Length 0.65 m, width 1.2 m, height 0.3 m", "Weight 53 kg"] }),
  "TRACTION DEVICE": F("Tow Hitch (Traction Device)", "Utility & Specialty", "Ball-hitch receiver plate for moving trailers around the yard.", { mini: ["Ball-head connection", "Length 0.7 m, width 0.4 m, height 0.35 m", "Weight 32 kg"] }),
  "PULLING DEVICE": F("Tow Hitch (Traction Device)", "Utility & Specialty", "Ball-hitch receiver plate for moving trailers."),
  "ROTARY PLOW": F("Rotary Tiller", "Landscaping", "Hydraulic rotary tiller for seedbeds and garden prep.", { compact: ["Working width 700 mm (brochure: 70 mm)", "Tilling depth 200 mm", "Rotor speed 250 rpm, 20 blades", "Required hydraulic flow 40 L/min"], full: ["Working width 1,200 mm", "Tilling depth 300 mm", "Rotor speed 350 rpm, 50 blades", "Required hydraulic flow 50 L/min"] }),
  "ROTARY TILLER": F("Rotary Tiller", "Landscaping", "Hydraulic rotary tiller."),
  "SOIL RENOVATOR": F("Soil Renovator", "Landscaping", "Toothed roller for breaking and preparing topsoil."),
  "LAWN AERATOR": F("Lawn Aerator", "Landscaping", "Spiked roller for aerating turf."),
  "VIBRATORY PLOW": F("Vibratory Plow", "Landscaping", "Vibrating blade plow for pulling in irrigation lines and cable."),
  "ROLLER": F("Roller", "Landscaping", "Smooth compaction roller.", { compact: ["Roller diameter 800 mm", "Roller width 1,200 mm"], full: ["Roller diameter 800 mm", "Roller width 1,800 mm"] }),
  "LOG SPLITTER": F("Log Splitter", "Wood Processing", "Hydraulic log splitter that runs off the loader's auxiliary circuit."),
  "HORIZONTAL LOG SPLITTER": F("Horizontal Log Splitter", "Wood Processing", "Horizontal hydraulic log splitter."),
  "WOOD CHIPPER": F("Wood Chipper", "Wood Processing", "Hydraulic drum chipper for branches and brush.", { mini: ["Length 0.95 m, width 0.7 m, height 1.35 m", "Weight 96 kg"] }),
  "QUICK ATTACH": F("Quick-Attach Plate", "Couplers & Quick Attach", "Replacement or conversion quick-attach mounting plate."),
  "QUICK CHANGE": F("Quick-Attach Plate", "Couplers & Quick Attach", "Replacement or conversion quick-attach mounting plate."),
  "UNIVERSAL QUICK-CHANGE SWITCH": F("Universal Quick-Change Adapter", "Couplers & Quick Attach", "Adapter plate that lets RIPPA loaders run attachments built for other plate standards. Ask us about plate conversions."),
  "HYDRAULIC HAMMER SS": F("Hydraulic Breaker", "Breakers & Hammers", "Hydraulic breaker for concrete and rock."),
};

/** Size class for skid-steer brochure specs. */
export const classOf = (modelSlugs: string[]): "mini" | "compact" | "full" | undefined => {
  if (modelSlugs.some((m) => m === "rs10" || m === "rs20")) return "full";
  if (modelSlugs.some((m) => m === "rs06" || m === "rs07")) return "compact";
  if (modelSlugs.some((m) => m === "rs03" || m === "rs04")) return "mini";
  return undefined;
};
