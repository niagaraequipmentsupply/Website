import type { ChecklistItem, SpecValue } from "@/lib/types";

/** Transcribed from the RIPPA "Skid-Steer Loaders: Your Home's Mini Construction Crew" buying guide. RS03 is not in the guide. */
type S = "standard" | "optional" | "na";
const std: S = "standard", opt: S = "optional", na: S = "na";
const g = (group: ChecklistItem["group"], feature: string, status: S, note?: string): ChecklistItem => ({ group, feature, status, note });

interface SkidSeed { targetUsers: string; specs: SpecValue[]; checklist: ChecklistItem[] }
const spec = (label: string, value: string, imperial: string, group: SpecValue["group"], highlight = false): SpecValue => ({ label, value, imperial, group, highlight, icon: "generic" });

const config = (cab: S, ac: { status: S; note?: string }, autoLevel: S, vertical: S, track: S, wheeled: S, travelModule: S): ChecklistItem[] => [
  g("comfort", "Cabin", cab), g("comfort", "Air conditioning", ac.status, ac.note),
  g("other", "Float function", std), g("other", "Auto bucket levelling", autoLevel), g("other", "Vertical lift path", vertical),
  g("other", "Quick change (attachment plate)", std), g("other", "Four-in-one bucket", opt), g("other", "Fork", opt), g("other", "Sweeper", opt), g("other", "Breaker", opt),
  g("other", "Tracked undercarriage", track), g("other", "Wheeled undercarriage", wheeled), g("other", "Quick-change travel module", travelModule),
];

export const skidSteerComparison: Record<string, SkidSeed> = {
  "rs04": {
    targetUsers: "Low sheds, confined agricultural facilities and small, cost-effective projects in tight spaces",
    specs: [
      spec("Rated power", "11.0 hp (8.2 kW)", "11.0 hp (8.2 kW)", "engine", true), spec("Cylinders", "2", "2", "engine"),
      spec("Main pump", "Triple gear pump (3)", "Triple gear pump (3)", "performance"), spec("Pump flow", "18 + 12 + 12 L/min", "4.8 + 3.2 + 3.2 gpm", "performance"),
      spec("Control valve", "Mechanically operated valve ×3", "Mechanically operated valve ×3", "performance"), spec("Travel motor", "Cycloidal, single speed", "Cycloidal, single speed", "performance"),
      spec("Auxiliary hydraulics", "2 groups, 5 lines · 18 L/min", "2 groups, 5 lines · 4.8 gpm", "performance"),
      spec("Total weight", "930 kg", "2,050 lb", "general", true), spec("System pressure", "14.5 MPa", "2,103 psi", "performance"), spec("Drive pressure", "14.5 MPa", "2,103 psi", "performance"),
      spec("Bucket capacity", "0.15 m³", "5.3 ft³", "general", true), spec("Rated load", "480 kg", "1,058 lb", "general", true),
      spec("Max dump height", "1,553 mm", "61.1 in", "performance"), spec("Max lift height", "2,080 mm", "81.9 in", "performance", true), spec("Max dump reach", "550 mm", "21.7 in", "performance"),
      spec("Ground clearance", "108 mm", "4.25 in", "dimensions"), spec("Travel speed", "2.5 km/h", "1.55 mph", "general"),
    ],
    checklist: config(na, { status: na }, na, na, std, std, std),
  },
  "rs06": {
    targetUsers: "Small job sites, farms and municipal maintenance needing flexible multi-purpose operation",
    specs: [
      spec("Rated power", "22.9 hp (17.1 kW)", "22.9 hp (17.1 kW)", "engine", true), spec("Cylinders", "3", "3", "engine"),
      spec("Main pump", "Load-sensing piston pump (1)", "Load-sensing piston pump (1)", "performance"), spec("Pump flow", "112.5 L/min", "29.7 gpm", "performance"),
      spec("Control valve", "Load-sensing multi-section valve", "Load-sensing multi-section valve", "performance"), spec("Travel motor", "Cycloidal, dual speed", "Cycloidal, dual speed", "performance"),
      spec("Auxiliary hydraulics", "2 groups, 5 lines · 80 L/min", "2 groups, 5 lines · 21.1 gpm", "performance"),
      spec("Total weight", "1,505 kg", "3,318 lb", "general", true), spec("System pressure", "22.5 MPa", "3,263 psi", "performance"), spec("Drive pressure", "22.5 MPa", "3,263 psi", "performance"),
      spec("Bucket capacity", "0.16 m³", "5.7 ft³", "general", true), spec("Rated load", "600 kg", "1,323 lb", "general", true),
      spec("Max dump height", "1,574 mm", "62.0 in", "performance"), spec("Max lift height", "2,473 mm", "97.4 in", "performance", true), spec("Max dump reach", "571 mm", "22.5 in", "performance"),
      spec("Ground clearance", "183 mm", "7.2 in", "dimensions"), spec("Travel speed (low / high)", "3 / 6.5 km/h", "1.86 / 4.04 mph", "general"),
    ],
    checklist: config(na, { status: na }, na, std, std, na, na),
  },
  "rs07": {
    targetUsers: "Precision stacking and loading at height, where extended reach and forward visibility matter",
    specs: [
      spec("Rated power", "22.9 hp (17.1 kW)", "22.9 hp (17.1 kW)", "engine", true), spec("Cylinders", "3", "3", "engine"),
      spec("Main pump", "Closed-circuit pump + integrated charge pump + gear pump (4)", "Closed-circuit pump + integrated charge pump + gear pump (4)", "performance"), spec("Pump flow", "48 + 48 + 28.2 + 48 L/min", "12.7 + 12.7 + 7.5 + 12.7 gpm", "performance"),
      spec("Control valve", "Pilot-operated multi-section valve", "Pilot-operated multi-section valve", "performance"), spec("Travel motor", "Cycloidal, single speed", "Cycloidal, single speed", "performance"),
      spec("Auxiliary hydraulics", "1 group, 3 lines · 48 L/min", "1 group, 3 lines · 12.7 gpm", "performance"),
      spec("Total weight", "1,386 kg", "3,056 lb", "general", true), spec("System pressure", "16 MPa", "2,321 psi", "performance"), spec("Drive pressure", "16 MPa", "2,321 psi", "performance"),
      spec("Bucket capacity", "0.16 m³", "5.7 ft³", "general", true), spec("Rated load", "670 kg", "1,474 lb", "general", true),
      spec("Max dump height", "1,725 mm", "67.9 in", "performance"), spec("Max lift height", "2,260 mm", "89.0 in", "performance", true), spec("Max dump reach", "508 mm", "20.0 in", "performance"),
      spec("Ground clearance", "176 mm", "6.9 in", "dimensions"), spec("Travel speed", "8 km/h", "4.97 mph", "general"),
    ],
    checklist: config(std, { status: std, note: "Heating only" }, na, na, std, std, na),
  },
  "rs10": {
    targetUsers: "Small contractors, landscaping and bulk material handling such as sand, gravel and feed",
    specs: [
      spec("Rated power", "47.6 hp (35.5 kW)", "47.6 hp (35.5 kW)", "engine", true), spec("Cylinders", "4", "4", "engine"),
      spec("Main pump", "Closed-circuit pump + integrated charge pump + gear pump (4)", "Closed-circuit pump + integrated charge pump + gear pump (4)", "performance"), spec("Pump flow", "66 + 66 + 32.8 + 46 L/min", "17.4 + 17.4 + 8.7 + 12.1 gpm", "performance"),
      spec("Control valve", "Pilot-operated multi-section valve", "Pilot-operated multi-section valve", "performance"), spec("Travel motor", "Piston motor, single speed", "Piston motor, single speed", "performance"),
      spec("Auxiliary hydraulics", "1 group, 3 lines · 46.2 L/min", "1 group, 3 lines · 12.2 gpm", "performance"),
      spec("Total weight", "3,025 kg", "6,669 lb", "general", true), spec("System pressure", "16 MPa", "2,321 psi", "performance"), spec("Drive pressure", "25 MPa", "3,626 psi", "performance"),
      spec("Bucket capacity", "0.41 m³", "14.5 ft³", "general", true), spec("Rated load", "1,212 kg", "2,672 lb", "general", true),
      spec("Max dump height", "2,428 mm", "95.7 in", "performance"), spec("Max lift height", "3,029 mm", "119.3 in", "performance", true), spec("Max dump reach", "772 mm", "30.4 in", "performance"),
      spec("Ground clearance", "210 mm", "8.3 in", "dimensions"), spec("Travel speed", "10 km/h", "6.21 mph", "general"),
    ],
    checklist: config(std, { status: std }, std, na, opt, std, na),
  },
  "rs20": {
    targetUsers: "Tough construction sites, large farms and industrial settings needing heavy lifting",
    specs: [
      spec("Rated power", "47.6 hp (35.5 kW)", "47.6 hp (35.5 kW)", "engine", true), spec("Cylinders", "4", "4", "engine"),
      spec("Main pump", "Closed-circuit pump + integrated charge pump + load-sensing piston pump (4)", "Closed-circuit pump + integrated charge pump + load-sensing piston pump (4)", "performance"), spec("Pump flow", "108 + 108 + 32.8 + 108 L/min", "28.5 + 28.5 + 8.7 + 28.5 gpm", "performance"),
      spec("Control valve", "Load-sensing multi-section valve", "Load-sensing multi-section valve", "performance"), spec("Travel motor", "Piston motor, dual speed", "Piston motor, dual speed", "performance"),
      spec("Auxiliary hydraulics", "1 group, 3 lines · 99 L/min", "1 group, 3 lines · 26.2 gpm", "performance"),
      spec("Total weight", "4,064 kg", "8,959 lb", "general", true), spec("System pressure", "22.5 MPa", "3,263 psi", "performance"), spec("Drive pressure", "32 MPa", "4,641 psi", "performance"),
      spec("Bucket capacity", "0.4 m³", "14.1 ft³", "general", true), spec("Rated load", "2,000 kg", "4,409 lb", "general", true),
      spec("Max dump height", "2,250 mm", "88.6 in", "performance"), spec("Max lift height", "3,750 mm", "147.6 in", "performance", true), spec("Max dump reach", "1,360 mm", "53.5 in", "performance"),
      spec("Ground clearance", "230 mm", "9.1 in", "dimensions"), spec("Travel speed (low / high)", "5 / 10 km/h", "3.11 / 6.21 mph", "general"),
    ],
    checklist: config(std, { status: std }, std, std, std, std, na),
  },
};
