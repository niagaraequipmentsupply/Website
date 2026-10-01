/**
 * Local landing pages: one per community Niagara Equipment Supply sells, delivers and services in.
 * Keep every page specific (local lots, soils, jobs, drive time from the Thorold yard) so these read as
 * useful guides, not duplicated boilerplate. Model slugs must exist in src/data/lineup.ts or loaders.ts.
 */
export interface ServiceArea {
  slug: string;
  name: string;
  /** Municipality / region line under the heading. */
  region: string;
  /** Drive from 16-2275 Hwy 20, Thorold. */
  drive: string;
  distanceKm: number;
  headline: string;
  metaDescription: string;
  intro: string[];
  neighbourhoods: string[];
  jobs: { title: string; text: string }[];
  popularModels: string[];
  faqs: { question: string; answer: string }[];
}

export const serviceAreas: ServiceArea[] = [
  {
    slug: "niagara-falls",
    name: "Niagara Falls",
    region: "City of Niagara Falls, Niagara Region",
    drive: "about 20 minutes east on Highway 20 / Lundy's Lane",
    distanceKm: 18,
    headline: "RIPPA mini excavators and compact equipment in Niagara Falls",
    metaDescription: "RIPPA mini excavator and skid steer dealer serving Niagara Falls, Chippawa and Stamford. Local delivery from Thorold, demos, financing and the RIPPA Service Centre 20 minutes away.",
    intro: [
      "Niagara Falls is twenty minutes from our Thorold yard, which makes it the easiest place in the region for us to deliver, demo and service RIPPA equipment. Most of the machines we send into the city go to residential lots in Chippawa, Stamford, Mount Carmel and the older streets between Lundy's Lane and the river, where side yards are narrow and the work is pools, patios, drainage and fence lines.",
      "The lots here are mostly heavy Niagara clay. A 1-ton R10 ECO or 1.3-ton R13 PRO with retractable tracks fits through a standard gate and still has the breakout force to dig footings and trench weeping tile, while a 3.2-ton R32 PRO handles the full pool digs and retaining walls that hospitality properties and larger homes need.",
    ],
    neighbourhoods: ["Chippawa", "Stamford", "Mount Carmel", "Lundy's Lane", "Drummond", "Fallsview", "Garner / Beaverdams", "Thundering Waters"],
    jobs: [
      { title: "Backyard pools and hot tub pads", text: "Compact track width through 36-inch gates, then full width for stability when the hole gets deep." },
      { title: "Drainage and weeping tile", text: "Narrow trenching buckets and a hydraulic thumb for pulling old tile out of clay." },
      { title: "Interlock, patios and retaining walls", text: "Dozer blade for base prep, tilt bucket for grading, forks for pallets of stone." },
      { title: "Hospitality and rental property upkeep", text: "Small loaders and dumpers for landscaping crews maintaining hotels, motels and short-term rentals." },
      { title: "Fence and deck footings", text: "Augers from 6 to 18 inches on the R13 and R15 for post holes in clay." },
    ],
    popularModels: ["r10-eco", "r13-pro", "r32-pro", "rs06"],
    faqs: [
      { question: "Can you deliver a mini excavator to a job site in Niagara Falls?", answer: "Yes. We deliver by flatbed from Thorold to anywhere in Niagara Falls, including Chippawa and the Lundy's Lane corridor. Ask for a delivered price when you request a quote and we will include it in writing." },
      { question: "Which RIPPA fits through a Niagara Falls side yard?", answer: "The R06 ECO retracts to 29 inches and the R10 ECO and R13 PRO to about 35 inches, so all three pass a standard 36-inch gate. Widen the tracks once you are in the yard for stability." },
      { question: "Where is service done for Niagara Falls customers?", answer: "At the RIPPA Service Centre on Highway 20 in Thorold, about twenty minutes away. We also handle RIPPA warranty claims in-house, so you are not shipping parts back and forth." },
    ],
  },
  {
    slug: "st-catharines",
    name: "St. Catharines",
    region: "City of St. Catharines, Niagara Region",
    drive: "about 15 minutes north on Highway 406",
    distanceKm: 10,
    headline: "RIPPA excavators, skid steers and loaders for St. Catharines",
    metaDescription: "RIPPA dealer 15 minutes from St. Catharines. Mini excavators from 0.6 to 23 tons, stand-on loaders and skid steers for Port Dalhousie, Glenridge, Merritton and north-end lots. Demos, financing and service in Thorold.",
    intro: [
      "St. Catharines is the largest city in Niagara and the one we see most often, fifteen minutes up the 406 from our yard. The housing stock runs from century homes near downtown and Port Dalhousie to 1960s bungalows in Glenridge and the north end, and nearly all of it shares the same problem for contractors: tight side yards, mature trees and no room for a full-size machine.",
      "That is where micro and mini excavators earn their keep. The R06 ECO fits through a 30-inch gap, the R10 ECO and R13 PRO through a standard gate, and the RS04 and RS06 stand-on loaders move spoil and stone out through the same opening. For builders on infill lots and the subdivisions around Brock University, the R18 PRO and R22 PRO give full-size digging power on a machine that still tows behind a pickup.",
    ],
    neighbourhoods: ["Port Dalhousie", "Glenridge", "Merritton", "Western Hill", "North End", "Vansickle", "Grantham", "Downtown"],
    jobs: [
      { title: "Side-yard access on older lots", text: "Retractable tracks and zero-tail swing for century homes with no room to spare." },
      { title: "Weeping tile and foundation waterproofing", text: "Trenching along foundations with a narrow bucket, spoil moved by stand-on loader." },
      { title: "Infill builds and additions", text: "R18 and R22 PRO for footings, service trenches and backfill on small city lots." },
      { title: "Tree and stump removal", text: "Hydraulic thumb and log grapple for arborists working mature north-end streets." },
      { title: "Patios, walkways and sod prep", text: "Dozer blade and tilt bucket for finish grading before interlock or new lawns." },
    ],
    popularModels: ["r06-eco", "r13-pro", "r18-pro", "rs04"],
    faqs: [
      { question: "Can I see a RIPPA before I buy?", answer: "Yes. Our yard on Highway 20 in Thorold is fifteen minutes from St. Catharines. Book a demo and you can run the machine, try the attachments and compare models side by side." },
      { question: "Do you deliver to St. Catharines?", answer: "We do. Delivery anywhere in St. Catharines is a short run from Thorold, and we include a delivered price on every written quote." },
      { question: "What do St. Catharines landscapers usually buy?", answer: "The R10 ECO or R13 PRO paired with an RS04 or RS06 stand-on loader is the most common combination: one machine digs, the other moves material through the gate." },
    ],
  },
  {
    slug: "welland",
    name: "Welland",
    region: "City of Welland, Niagara Region",
    drive: "about 15 minutes south on Highway 406",
    distanceKm: 12,
    headline: "RIPPA compact equipment dealer for Welland",
    metaDescription: "RIPPA mini excavators, track dumpers and skid steers for Welland, Dain City and Cooks Mills. Fifteen minutes from the Thorold yard, with delivery, financing and warranty service.",
    intro: [
      "Welland sits fifteen minutes south of us down the 406. It is a working city: canal-side industrial lots, post-war neighbourhoods with big backyards, Niagara College, and rural fringe out toward Cooks Mills and Dain City where small farms and large properties are the norm.",
      "That mix shows up in what Welland customers buy. Homeowners on quarter-acre lots take the R10 ECO or R15 ECO for drainage, ponds and fence lines. Contractors working the new subdivisions and canal-side redevelopment lean on the R22 PRO and R32 PRO, and the RD06 tracked dumper is popular for moving gravel and soil across soft ground that a wheelbarrow or pickup cannot cross.",
    ],
    neighbourhoods: ["Dain City", "Cooks Mills", "Fitch Street", "Prince Charles", "Rose City", "Niagara College area", "East Main", "Welland Canal lands"],
    jobs: [
      { title: "Hobby farms and acreage", text: "Fence posts with an auger, drainage ditches, culverts and pond cleanouts." },
      { title: "New subdivision finish work", text: "Grading, sod prep and service trenches on fresh lots with the R18 or R22." },
      { title: "Canal-side and industrial lots", text: "R32 and R57 PRO for footings, demolition cleanup and site prep." },
      { title: "Soft-ground hauling", text: "RD06 tracked dumper carries 770 lb of gravel or soil where a truck would sink." },
      { title: "Student housing and rental maintenance", text: "Stand-on loaders for crews maintaining properties near Niagara College." },
    ],
    popularModels: ["r15-eco", "r22-pro", "rd06", "rs07"],
    faqs: [
      { question: "Do you deliver equipment to Welland?", answer: "Yes, Welland is one of our shortest delivery runs. Every written quote includes the delivered price to your address or job site." },
      { question: "Is a tracked dumper worth it on a Welland property?", answer: "On soft, clay-heavy ground it usually is. The RD06 moves 770 lb per trip and loads itself with the hydraulic scoop, so one person can move a gravel delivery across a lawn without rutting it." },
      { question: "Can you service a RIPPA I bought somewhere else?", answer: "Yes. The RIPPA Service Centre in Thorold services every RIPPA, including machines bought from other dealers or imported directly, and we handle warranty claims for eligible units." },
    ],
  },
  {
    slug: "thorold",
    name: "Thorold",
    region: "City of Thorold, home of Niagara Equipment Supply",
    drive: "our yard is at 16-2275 Highway 20, Thorold",
    distanceKm: 0,
    headline: "Your local RIPPA dealer in Thorold",
    metaDescription: "Niagara Equipment Supply is the RIPPA dealer on Highway 20 in Thorold. Mini excavators, skid steers, loaders, parts and the RIPPA Service Centre, with demos in the yard and same-day pickup on stocked units.",
    intro: [
      "Thorold is home. Our yard, showroom and the RIPPA Service Centre are on Highway 20 between the 406 and Allanburg, which puts us minutes from the new subdivisions in Rolling Meadows and Thorold South, the older streets downtown, and the rural lots along the canal and out to Port Robinson.",
      "Being local means you can drop in, run the machines, pick up parts the same day and bring a unit in for service without arranging transport. Stocked models can usually be collected the day you buy, or we deliver anywhere in the city at short notice.",
    ],
    neighbourhoods: ["Downtown Thorold", "Rolling Meadows", "Thorold South", "Allanburg", "Port Robinson", "Confederation Heights", "Beaverdams", "Merritt Island"],
    jobs: [
      { title: "New-build finish grading", text: "Rolling Meadows and Thorold South lots need sod prep, drainage and fence posts once the builder leaves." },
      { title: "Pickup and same-day service", text: "Bring your RIPPA in for maintenance, warranty work or an attachment fit without a flatbed." },
      { title: "Canal and rural properties", text: "Ponds, culverts and tree work along the Welland Canal and out to Port Robinson." },
      { title: "Demos in the yard", text: "Run an R10, R18 and R32 back to back with the attachments you plan to buy." },
      { title: "Parts counter", text: "Filters, hoses, bucket teeth and pins for every RIPPA model, in stock or ordered in." },
    ],
    popularModels: ["r13-pro", "r18-pro", "r32-pro", "rs06"],
    faqs: [
      { question: "Can I pick up a machine the same day?", answer: "When the model and configuration are in stock, yes. We do a dealer pre-delivery inspection and walk you through the controls before it leaves the yard." },
      { question: "Do you do demos?", answer: "Yes. Book a time and we will have the models you are considering fuelled and ready with the attachments you want to try." },
      { question: "What are your hours?", answer: "Monday to Friday 8:00 AM to 5:00 PM, Saturdays by appointment. Call ahead for service drop-offs so a technician is ready for you." },
    ],
  },
  {
    slug: "pelham-fonthill",
    name: "Pelham and Fonthill",
    region: "Town of Pelham, Niagara Region",
    drive: "about 15 minutes west on Highway 20",
    distanceKm: 11,
    headline: "RIPPA equipment for Pelham, Fonthill and Fenwick properties",
    metaDescription: "RIPPA mini excavators, loaders and skid steers for estate lots, hobby farms and tender-fruit properties in Pelham, Fonthill, Fenwick and Ridgeville. Dealer and service centre 15 minutes away in Thorold.",
    intro: [
      "Pelham is straight west of us on Highway 20. Fonthill, Fenwick and Ridgeville are full of estate lots, acreages and small farms on the Fonthill Kame, which means sandier, better-draining ground than most of Niagara and property owners who do a lot of their own work.",
      "That is the classic owner-operator market for RIPPA. A 2-ton R18 PRO or 2.5-ton R22 PRO with a thumb, auger and a set of buckets covers driveways, ponds, barn pads and fencing for years, and the RL06 loader or an RS07 skid steer keeps up with gravel, mulch and firewood.",
    ],
    neighbourhoods: ["Fonthill", "Fenwick", "Ridgeville", "North Pelham", "Effingham", "Lookout Street area", "Pelham Hills", "Rice Road corridor"],
    jobs: [
      { title: "Long driveways and laneways", text: "Grading, gravel spreading and culvert replacement with the dozer blade and loader bucket." },
      { title: "Ponds and water features", text: "R22 and R32 PRO dig depth for ponds, with a tilt bucket to shape the banks." },
      { title: "Barns, shops and shed pads", text: "Footings, base prep and backfill on estate lots." },
      { title: "Orchard and vineyard fencing", text: "Auger post holes and trenching for irrigation on tender-fruit properties." },
      { title: "Firewood and brush", text: "Log grapple on the excavator or loader forks for moving wood and clearing bush." },
    ],
    popularModels: ["r18-pro", "r22-pro", "rl06", "rs07"],
    faqs: [
      { question: "Which RIPPA suits a 2 to 5 acre property in Pelham?", answer: "Most owners choose the R18 PRO or R22 PRO. Both tow behind a half-ton pickup, run a full attachment range and have the dig depth for ponds and drainage. Add a loader if you move a lot of material." },
      { question: "Do you deliver to Fenwick and Ridgeville?", answer: "Yes. All of Pelham is a short run from Thorold, and the delivered price is on your written quote." },
      { question: "Can you fit attachments before delivery?", answer: "Yes. We confirm fitment, install quick couplers, thumbs and auxiliary lines, and test everything in the yard before the machine leaves." },
    ],
  },
  {
    slug: "fort-erie",
    name: "Fort Erie",
    region: "Town of Fort Erie, Niagara Region",
    drive: "about 35 minutes via the QEW",
    distanceKm: 38,
    headline: "RIPPA mini excavators and dumpers for Fort Erie, Ridgeway and Crystal Beach",
    metaDescription: "RIPPA dealer serving Fort Erie, Ridgeway, Crystal Beach and Stevensville. Mini excavators and tracked dumpers for lakefront cottages, drainage and renovations, delivered from Thorold with financing and warranty service.",
    intro: [
      "Fort Erie is a thirty-five minute run down the QEW, and most of the equipment we send there goes to the lake. Crystal Beach, Ridgeway and the shoreline between them are cottage country turned year-round, with sandy ground, high water tables and lots that were never designed for construction access.",
      "Mini excavators are the only practical tool for a lot of that work. An R10 ECO or R15 ECO can get between cottages to dig drainage, replace septic lines or set deck footings, and the RD06 tracked dumper moves sand, gravel and demolition out over soft ground without tearing up what is left of the lawn. For bigger drainage and shoreline jobs, contractors run the R57 PRO.",
    ],
    neighbourhoods: ["Crystal Beach", "Ridgeway", "Stevensville", "Bridgeburg", "Thunder Bay (Fort Erie)", "Black Creek", "Douglastown", "Bay Beach"],
    jobs: [
      { title: "Cottage drainage and grading", text: "Sandy soils and high water tables mean drainage first, with narrow buckets between buildings." },
      { title: "Septic and water line work", text: "Trenching for septic beds and service lines on properties that still run on wells and septic." },
      { title: "Decks, docks and shoreline access", text: "Footings and grading on waterfront lots with no room for a truck." },
      { title: "Renovation cleanup", text: "RD06 dumper hauls demolition and gravel across soft ground to the road." },
      { title: "Seasonal property maintenance", text: "Stand-on loaders for crews maintaining rental cottages and beach properties." },
    ],
    popularModels: ["r10-eco", "r15-eco", "rd06", "r57-pro"],
    faqs: [
      { question: "How does delivery to Fort Erie work?", answer: "We deliver by flatbed from Thorold, usually within a few business days of the machine being set up and inspected. The delivered price to Fort Erie, Ridgeway or Crystal Beach is on your written quote." },
      { question: "Will a mini excavator damage a cottage lawn?", answer: "Rubber tracks spread the weight well, and the smaller RIPPA models put less pressure on the ground than a loaded wheelbarrow. On very soft ground we recommend track mats and the RD06 dumper rather than a truck." },
      { question: "Is service available for Fort Erie customers?", answer: "Yes. Machines come to the RIPPA Service Centre in Thorold for repairs and warranty work, and we can arrange transport if you do not have a trailer." },
    ],
  },
  {
    slug: "port-colborne",
    name: "Port Colborne and Wainfleet",
    region: "City of Port Colborne and Township of Wainfleet, Niagara Region",
    drive: "about 30 minutes south via Highway 406 and Highway 140",
    distanceKm: 32,
    headline: "RIPPA equipment for Port Colborne, Wainfleet and the Lake Erie shore",
    metaDescription: "RIPPA mini excavators and skid steers for Port Colborne, Wainfleet, Sherkston and Lowbanks. Farm drainage, septic, shoreline and marine work, delivered from Thorold with financing and the RIPPA Service Centre.",
    intro: [
      "Port Colborne sits at the south end of the Welland Canal, half an hour from our yard, with Wainfleet's farmland and lakeshore stretching west from it. The work down here is agricultural and marine: tile drainage, septic systems, shoreline protection, marina and cottage maintenance, and a lot of acreage that owners look after themselves.",
      "RIPPA's mid-size excavators fit that well. The R22 PRO and R32 PRO have the reach and dig depth for septic beds and drainage, the R57 PRO handles shoreline rock and larger farm work, and the RS07 and RS20 skid steers keep barns, laneways and yards in shape year-round, including snow.",
    ],
    neighbourhoods: ["Port Colborne downtown", "Sherkston", "Lowbanks", "Wainfleet", "Humberstone", "Sugarloaf", "Nickel Beach", "Marshville"],
    jobs: [
      { title: "Farm tile and ditch drainage", text: "Trenching and ditch cleanouts on flat Lake Erie clay." },
      { title: "Septic beds and water lines", text: "R22 and R32 PRO for rural properties on well and septic." },
      { title: "Shoreline and marina work", text: "R57 PRO with a thumb for rock, and loaders for marina yards." },
      { title: "Snow and yard maintenance", text: "RS07 and RS20 with pushers and blowers for laneways and lots." },
      { title: "Cottage and campground upkeep", text: "Compact loaders and dumpers for Sherkston and lakeshore properties." },
    ],
    popularModels: ["r22-pro", "r32-pro", "r57-pro", "rs20"],
    faqs: [
      { question: "Do you deliver to Wainfleet and Lowbanks?", answer: "Yes. Port Colborne and all of Wainfleet are regular delivery runs for us, and the delivered price is on your written quote." },
      { question: "Which RIPPA is best for septic and drainage work?", answer: "The R32 PRO is the most popular choice: a zero-tail 3.2-ton machine with a 9 ft 3 in dig depth, tilt blade and the hydraulic flow for a thumb or auger. The R22 PRO is a lighter option that still tows behind a pickup." },
      { question: "Can a skid steer handle snow on a long laneway?", answer: "Yes. The RS07 and RS20 run snow pushers, blades and blowers, and the enclosed heated cab makes winter work comfortable." },
    ],
  },
  {
    slug: "grimsby-lincoln",
    name: "Grimsby, Lincoln and Beamsville",
    region: "Town of Grimsby and Town of Lincoln, Niagara Region",
    drive: "about 30 minutes west on the QEW",
    distanceKm: 32,
    headline: "RIPPA equipment for Grimsby, Beamsville, Vineland and Jordan",
    metaDescription: "RIPPA mini excavators, skid steers and loaders for vineyards, orchards, greenhouses and new homes in Grimsby, Beamsville, Vineland and Jordan. Dealer, financing and service 30 minutes away in Thorold.",
    intro: [
      "Grimsby and Lincoln run along the lake below the escarpment, half an hour west of us on the QEW. This is Niagara's fruit belt: vineyards, orchards and greenhouses from Grimsby through Beamsville, Vineland and Jordan, plus fast-growing subdivisions in Grimsby and Beamsville where new homeowners inherit bare lots.",
      "Growers buy RIPPA for the jobs that never stop: trellis and fence posts with an auger, irrigation trenching, drainage, grading between rows and moving bins and pallets with forks. The RS07 skid steer and RL06 loader are the workhorses, with the R13 PRO and R18 PRO for trenching and post holes. New homeowners usually start with an R10 ECO for drainage, fencing and patios.",
    ],
    neighbourhoods: ["Grimsby", "Beamsville", "Vineland", "Jordan", "Jordan Station", "Campden", "Grimsby Beach", "Winona border"],
    jobs: [
      { title: "Vineyard and orchard posts", text: "Augers from 6 to 18 inches on the R13 and R18 for trellis and fence lines." },
      { title: "Irrigation and drainage trenching", text: "Narrow buckets for drip lines, tile and header trenches between rows." },
      { title: "Greenhouse and barn work", text: "Skid steers with forks and buckets for bins, pallets, gravel and soil." },
      { title: "New-home lots", text: "Finish grading, fence posts, patios and drainage on fresh subdivision lots." },
      { title: "Snow on farm lanes", text: "RS07 and RS20 with pushers for long driveways and loading areas." },
    ],
    popularModels: ["rs07", "rl06", "r13-pro", "r18-pro"],
    faqs: [
      { question: "What do growers in Lincoln usually run?", answer: "A skid steer or compact loader for daily material handling, plus a mini excavator for posts and trenching. The RS07 with forks and a bucket and the R18 PRO with an auger is a common pairing." },
      { question: "Do you deliver to Beamsville and Vineland?", answer: "Yes. Grimsby and Lincoln are regular QEW runs from Thorold. The delivered price is written into every quote." },
      { question: "Can RIPPA attachments fit my existing skid steer?", answer: "Universal skid steer quick-attach (SSQA) plates fit most brands. Tell us what you run and we will confirm the plate and hydraulic flow before you buy." },
    ],
  },
  {
    slug: "niagara-on-the-lake",
    name: "Niagara-on-the-Lake",
    region: "Town of Niagara-on-the-Lake, Niagara Region",
    drive: "about 30 minutes north via the 406 and Highway 55",
    distanceKm: 26,
    headline: "RIPPA compact equipment for Niagara-on-the-Lake, Virgil and St. Davids",
    metaDescription: "RIPPA mini excavators, stand-on loaders and skid steers for wineries, estate properties and landscapers in Niagara-on-the-Lake, Virgil, St. Davids and Queenston. Dealer and service centre 30 minutes away in Thorold.",
    intro: [
      "Niagara-on-the-Lake is half an hour from our yard and one of the most equipment-dense places in the region once you look past Queen Street. Dozens of wineries, estate properties with serious landscaping, Virgil and St. Davids subdivisions, and the landscaping and maintenance companies that look after all of it.",
      "That work favours compact, clean machines. Landscapers run the R10 ECO and R15 ECO for drainage, lighting trenches and planting, with RS04 or RS06 stand-on loaders to move soil, mulch and stone across finished lawns. Wineries lean on the RS07 skid steer and R18 PRO for posts, irrigation and yard work around the crush pad.",
    ],
    neighbourhoods: ["Old Town", "Virgil", "St. Davids", "Queenston", "Glendale", "Niagara Parkway", "Line 2 and Line 3 wineries", "Four Mile Creek"],
    jobs: [
      { title: "Estate landscaping", text: "Drainage, irrigation, lighting trenches and planting on large manicured properties." },
      { title: "Winery grounds and vineyards", text: "Trellis posts, irrigation lines and material handling around production buildings." },
      { title: "Low-impact access", text: "Stand-on loaders and small excavators that cross finished lawns without ruts." },
      { title: "Subdivision lots in Virgil and St. Davids", text: "Fence posts, patios, sod prep and drainage on new builds." },
      { title: "Heritage property work", text: "Micro excavators for foundations and drainage where nothing larger fits." },
    ],
    popularModels: ["r10-eco", "r15-eco", "rs06", "rs07"],
    faqs: [
      { question: "Which machine does the least damage to a finished lawn?", answer: "The RS04 and RS06 stand-on loaders and the R06 and R10 excavators on rubber tracks. Spread the load with track mats on soft ground and you can work across a lawn without leaving ruts." },
      { question: "Do you deliver to Niagara-on-the-Lake?", answer: "Yes, including Virgil, St. Davids and the Parkway. The delivered price is on your written quote." },
      { question: "Can you supply equipment for a landscaping company fleet?", answer: "Yes. We quote multi-unit purchases with attachments, financing through our partners and a service plan at the RIPPA Service Centre." },
    ],
  },
  {
    slug: "hamilton",
    name: "Hamilton",
    region: "City of Hamilton, including Stoney Creek, Ancaster, Dundas and Binbrook",
    drive: "about 50 minutes via the QEW and Red Hill Valley Parkway",
    distanceKm: 62,
    headline: "RIPPA mini excavators and skid steers for Hamilton contractors",
    metaDescription: "RIPPA dealer serving Hamilton, Stoney Creek, Ancaster, Dundas and Binbrook. Mini excavators from 1 to 23 tons and skid steers for renovation, demolition and landscaping contractors, with financing and in-house warranty service.",
    intro: [
      "Hamilton is the biggest market west of us, under an hour from the yard via the QEW and the Red Hill. Between the Mountain, the lower city, Stoney Creek, Ancaster, Dundas and the new neighbourhoods in Binbrook and Waterdown, there is more renovation, demolition and landscaping work than almost anywhere in Southern Ontario, and most of it happens on lots with no room for a full-size excavator.",
      "Hamilton contractors tend to buy the PRO series. The R32 PRO and R57 PRO give real production digging on a machine that moves on a tag trailer, and the RS20 compact track loader is a true replacement for a full-size skid steer on demolition and grading jobs. Renovators and landscapers working the lower city take the R13 PRO and R18 PRO for access.",
    ],
    neighbourhoods: ["Stoney Creek", "Ancaster", "Dundas", "Binbrook", "Waterdown", "Hamilton Mountain", "Westdale", "Winona"],
    jobs: [
      { title: "Renovation and addition footings", text: "R18 to R32 PRO for footings and underpinning on lower-city lots." },
      { title: "Demolition cleanup and site prep", text: "RS20 compact track loader and R57 PRO for grading, demolition and backfill." },
      { title: "Escarpment and clay-soil drainage", text: "Thumbs and narrow buckets for rock, roots and heavy clay." },
      { title: "Landscaping on the Mountain and in Ancaster", text: "Pools, retaining walls, patios and tree work on larger suburban lots." },
      { title: "Fleet replacements", text: "Multi-unit quotes for contractors replacing rental spend with owned RIPPA machines." },
    ],
    popularModels: ["r32-pro", "r57-pro", "rs20", "r18-pro"],
    faqs: [
      { question: "Do you deliver to Hamilton?", answer: "Yes. We deliver by flatbed across Hamilton, Stoney Creek, Ancaster, Dundas and Binbrook, and the delivered price is written into your quote." },
      { question: "How does warranty service work from Hamilton?", answer: "The RIPPA Service Centre in Thorold handles diagnosis, parts and the warranty claim with RIPPA. We can arrange transport for machines that need to come in, and many issues are solved over the phone first." },
      { question: "Can RIPPA replace a full-size skid steer?", answer: "For most contractors, the RS20 does. It has a 2,000 kg tipping load, 47.6 hp Kubota and a heated, air-conditioned cab, and it runs standard SSQA attachments." },
    ],
  },
  {
    slug: "burlington-oakville",
    name: "Burlington and Oakville",
    region: "Halton Region",
    drive: "about 55 minutes via the QEW",
    distanceKm: 72,
    headline: "RIPPA compact equipment for Burlington and Oakville",
    metaDescription: "RIPPA mini excavators and stand-on loaders for Burlington and Oakville landscapers, pool builders and homeowners. Delivered from the Niagara dealer with financing and warranty service.",
    intro: [
      "Burlington and Oakville are about an hour up the QEW. The work there is suburban and high-end: pools, outdoor kitchens, retaining walls, drainage and full backyard rebuilds on lots where the only access is a side yard, plus steady renovation work in older neighbourhoods like Aldershot, Roseland and Bronte.",
      "That makes Halton the natural home for RIPPA's smallest machines. The R06 ECO and R10 ECO fit where a rental mini will not, the R13 PRO and R15 ECO give pool builders and landscapers a pilot-control machine that fits through a gate, and the RS06 stand-on loader moves stone and spoil through the same opening.",
    ],
    neighbourhoods: ["Aldershot", "Roseland", "Bronte", "Glen Abbey", "Headon Forest", "Millcroft", "Old Oakville", "Alton Village"],
    jobs: [
      { title: "Pools and backyard rebuilds", text: "Side-yard access, then full-width stability for the dig." },
      { title: "Outdoor kitchens and patios", text: "Footings, base prep and grading on tight suburban lots." },
      { title: "Retaining walls and grade changes", text: "Tilt buckets and forks for stone on sloped lots." },
      { title: "Drainage and waterproofing", text: "Narrow trenching around foundations in older neighbourhoods." },
      { title: "Landscape crews", text: "R10 or R13 paired with an RS06 stand-on loader for daily install work." },
    ],
    popularModels: ["r06-eco", "r10-eco", "r13-pro", "rs06"],
    faqs: [
      { question: "Is it worth buying from a Niagara dealer if I am in Oakville?", answer: "Our customers in Halton think so: RIPPA pricing, a dealer that handles warranty claims in-house and delivery included on the quote. Service is in Thorold, and we can arrange transport when a machine needs to come in." },
      { question: "Do you deliver to Burlington and Oakville?", answer: "Yes. It is a straight QEW run, and the delivered price is on your written quote." },
      { question: "Which RIPPA fits a 30-inch side yard?", answer: "The R06 ECO retracts to 29 inches. The R10 ECO and R13 PRO need about 35 inches, which clears a standard 36-inch gate." },
    ],
  },
  {
    slug: "haldimand",
    name: "Haldimand County",
    region: "Dunnville, Caledonia, Cayuga and Hagersville",
    drive: "about 45 minutes west via Highway 3",
    distanceKm: 50,
    headline: "RIPPA excavators, loaders and skid steers for Haldimand County farms",
    metaDescription: "RIPPA dealer serving Dunnville, Caledonia, Cayuga, Hagersville and Jarvis. Mini excavators, loaders and skid steers for farms, drainage and rural properties, delivered from Thorold with financing and warranty service.",
    intro: [
      "Haldimand is farm country forty-five minutes west of us along Highway 3: cash crops and livestock around Cayuga and Hagersville, the Grand River through Caledonia and Dunnville, and a lot of rural properties whose owners want a machine they can run themselves rather than hire out.",
      "RIPPA's loaders and mid-size excavators are built for that. The RL06 compact loader and RB06 backhoe loader cover feeding, bedding, fencing and small digging jobs on one machine, the R22 PRO and R32 PRO handle drainage and ponds, and the RS07 and RS20 skid steers keep barns and laneways clear in every season.",
    ],
    neighbourhoods: ["Dunnville", "Caledonia", "Cayuga", "Hagersville", "Jarvis", "Selkirk", "Byng", "Grand River properties"],
    jobs: [
      { title: "Barn and livestock chores", text: "RL06 loader and RB06 backhoe loader for feed, bedding, manure and fencing." },
      { title: "Field and ditch drainage", text: "R22 and R32 PRO for tile outlets, ditch cleanouts and culverts." },
      { title: "Ponds and dugouts", text: "Zero-tail R32 PRO with a tilt bucket for shaping banks." },
      { title: "Grand River waterfront", text: "Shoreline grading and dock footings on river properties." },
      { title: "Snow and laneway upkeep", text: "RS07 and RS20 with pushers and blades for long rural laneways." },
    ],
    popularModels: ["rl06", "rb06", "r32-pro", "rs20"],
    faqs: [
      { question: "What is the difference between the RL06 and RB06?", answer: "Both are compact loaders with a Briggs & Stratton engine. The RL06 is a straight loader with telescopic boom option; the RB06 adds a backhoe for digging, which makes it a one-machine answer for small farms." },
      { question: "Do you deliver to Dunnville and Caledonia?", answer: "Yes. Haldimand County is a regular Highway 3 run from Thorold. The delivered price is included on your written quote." },
      { question: "Can you quote a package for a farm?", answer: "Yes. Tell us the chores and acreage and we will quote a machine, attachments, delivery and financing together." },
    ],
  },
];

export const serviceAreaBySlug = (slug: string) => serviceAreas.find((a) => a.slug === slug);
