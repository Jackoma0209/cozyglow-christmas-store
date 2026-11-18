export type CurrencyCode = "gbp" | "usd";

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
  warehouseLabel: string;
  courierLabel: string;
  deliveryEta: string;
  stockCount: number;
}

export interface BundleTier {
  id: "single" | "double" | "triple";
  name: string;
  shortLabel: string;
  tagline: string;
  quantity: number;
  priceGbp: number;
  compareAtGbp: number;
  priceUsd: number;
  compareAtUsd: number;
  savingsPercent: number;
  badge?: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  freeShipping: boolean;
  includes: string[];
}

export interface OrderBumpConfig {
  id: string;
  title: string;
  subtitle: string;
  priceGbp: number;
  compareAtGbp: number;
  priceUsd: number;
  compareAtUsd: number;
  badge: string;
}

export interface PostPurchaseUpsellConfig {
  id: string;
  title: string;
  subtitle: string;
  priceGbp: number;
  compareAtGbp: number;
  priceUsd: number;
  compareAtUsd: number;
  discountBadge: string;
  bullets: string[];
}

export interface GallerySlide {
  id: string;
  label: string;
  shortTitle: string;
  caption: string;
  badge: string;
  scene: "chimney" | "night" | "cutaway" | "mantel" | "giftbox";
}

export interface AmbianceMode {
  id: "fireplace" | "nightlight" | "aromatherapy";
  name: string;
  shortName: string;
  kelvin: string;
  mistRate: string;
  noiseLevel: string;
  description: string;
  glowGradient: string;
  windowColor: string;
}

export interface HolidayScent {
  id: string;
  name: string;
  notes: string;
  mood: string;
  accentHex: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  tag: string;
  bundleBought: string;
  sceneCaption: string;
  sceneTone: "mantel" | "bedside" | "secret-santa" | "dining" | "nursery" | "office";
  helpfulCount: number;
  dateLabel: string;
}

export interface ComparisonRow {
  feature: string;
  cozyGlow: string;
  candles: string;
  plainHumidifier: string;
  cozyWins: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  gbp: {
    code: "gbp",
    symbol: "£",
    label: "GBP (£)",
    flag: "🇬🇧",
    warehouseLabel: "UK Express Warehouse (Birmingham)",
    courierLabel: "Royal Mail Tracked 48® / DPD Express",
    deliveryEta: "5–7 business days",
    stockCount: 14,
  },
  usd: {
    code: "usd",
    symbol: "$",
    label: "USD ($)",
    flag: "🇺🇸",
    warehouseLabel: "US Express Warehouse (New Jersey)",
    courierLabel: "USPS Priority / FedEx Tracked",
    deliveryEta: "5–7 business days",
    stockCount: 14,
  },
};

export const PRODUCT_CONFIG = {
  brandName: "CozyGlow™",
  productTitle:
    "CozyGlow™ — Nordic Christmas Cottage Aroma Diffuser & Chimney Humidifier",
  shortProductName: "CozyGlow™ Christmas Cottage Diffuser",
  rating: 4.9,
  reviewCount: 1428,
  valueProposition:
    "USB-C powered snowy winter cottage humidifier that puffs gentle aromatic mist directly out of the chimney while casting a warm fireplace LED glow through frosted cottage windows.",
  urgencyBar: {
    countdownInitialSeconds: 4 * 3600 + 18 * 60 + 42,
    prefix: "Order within",
    suffix:
      "for Guaranteed Pre-Christmas Tracked Delivery — Last Batch Before December Cutoff",
  },
  references: {
    walmartUrl:
      "https://www.walmart.com/ip/Christmas-House-Aroma-Diffuser-USB-Powered-Christmas-Cottage-Humidifier-Chimney-Mist-Effect-Warm-LED-Lights-Snowy-Village-Tabletop-Decoration-Holiday/21213809128",
    vexroanUrl:
      "https://vexroan.com/products/christmas-cottage-mist-diffuser-with-glowing-windows",
    sellTheTrendUrl: "https://www.sellthetrend.com/niche/seasonal",
  },
  specs: {
    tankCapacity: "200ml Reservoir",
    runtime: "6–8 Hours Continuous Chimney Mist",
    noise: "<25dB Whisper-Quiet Ultrasonic",
    power: "USB-C Powered (Braided Cable Included)",
    ledTemp: "2200K Warm Fireplace Glow",
    safety: "Cool Mist • Zero Flame • Auto Shut-Off",
  },
  guaranteeDays: 30,
  supportEmail: "concierge@cozyglowhome.com",
};

export const BUNDLE_TIERS: BundleTier[] = [
  {
    id: "single",
    name: "Single Unit Offer",
    shortLabel: "1x CozyGlow™ Cottage",
    tagline: "Perfect for your bedside table or desk",
    quantity: 1,
    priceGbp: 39.95,
    compareAtGbp: 64.95,
    priceUsd: 59.95,
    compareAtUsd: 89.95,
    savingsPercent: 38,
    badge: "Save 38%",
    freeShipping: false,
    includes: [
      "1x CozyGlow™ Nordic Cottage Diffuser",
      "1x Braided Snow-White USB-C Cable",
      "Tracked Holiday Courier Dispatch (24h)",
    ],
  },
  {
    id: "double",
    name: '"Gift One, Keep One" 2x Cottage Bundle',
    shortLabel: "2x Cottages + Free Oil Trio",
    tagline: "Keep one on your mantel & gift one ready-to-wrap",
    quantity: 2,
    priceGbp: 64.95,
    compareAtGbp: 129.9,
    priceUsd: 89.95,
    compareAtUsd: 179.9,
    savingsPercent: 50,
    badge: "MOST POPULAR • SAVE 50%",
    isPopular: true,
    freeShipping: true,
    includes: [
      "2x CozyGlow™ Nordic Cottage Diffusers",
      "FREE Festive Essential Oil Trio (Pine, Cinnamon & Berry)",
      "FREE Tracked Express Shipping",
    ],
  },
  {
    id: "triple",
    name: '"Full Winter Village" 3x Cottage Bundle + 6 Scents',
    shortLabel: "3x Cottages + 6 Holiday Scents",
    tagline: "Create an animated mantelpiece village with all 6 collector oils",
    quantity: 3,
    priceGbp: 84.95,
    compareAtGbp: 194.85,
    priceUsd: 119.95,
    compareAtUsd: 269.85,
    savingsPercent: 56,
    badge: "BEST VALUE • SAVE 56%",
    isBestValue: true,
    freeShipping: true,
    includes: [
      "3x CozyGlow™ Nordic Cottage Diffusers",
      "6 Holiday Scents (Cinnamon Bark, Pine Needle, Spiced Clove, Roasted Chestnut, Peppermint Frost, Vanilla Fireside)",
      "FREE VIP Insured Delivery + 3x Gift Boxes",
    ],
  },
];

export const ORDER_BUMP: OrderBumpConfig = {
  id: "festive-oil-trio",
  title:
    "Festive Essential Oil Trio (Pine Forest, Cinnamon Hearth & Winter Berry) + Luxury Gift Box Wrapping",
  subtitle:
    "Pure water-soluble botanical blends formulated for ultrasonic chimney misting — zero residue, instant Christmas cabin aroma.",
  priceGbp: 9.95,
  compareAtGbp: 24.95,
  priceUsd: 12.95,
  compareAtUsd: 32.95,
  badge: "ONE-TIME ADD-ON • 60% OFF",
};

export const POST_PURCHASE_UPSELL: PostPurchaseUpsellConfig = {
  id: "vip-extra-cottage-vault",
  title:
    "VIP Warehouse Priority Add-On: 1x Extra CozyGlow™ Cottage + Full 6-Oil Holiday Scent Vault",
  subtitle:
    "Your parcel is still being packed in our Express Warehouse! Add a spare cottage for a last-minute Secret Santa or bedroom upgrade before the courier scans your label.",
  priceGbp: 24.95,
  compareAtGbp: 64.95,
  priceUsd: 34.95,
  compareAtUsd: 89.95,
  discountBadge: "62% POST-CHECKOUT VIP SAVINGS",
  bullets: [
    "1x Additional CozyGlow™ Nordic Cottage Diffuser",
    "All 6 Winter Collector Scents (10ml dropper bottles)",
    "Ships inside your existing priority box — £0/$0 extra shipping",
  ],
};

export const GALLERY_SLIDES: GallerySlide[] = [
  {
    id: "chimney-mist",
    label: "01",
    shortTitle: "Chimney Mist in Action",
    caption:
      "Hypnotic cool micro-mist curls gently out of the snow-dusted brick chimney for 6–8 hours.",
    badge: "Live Steam Effect",
    scene: "chimney",
  },
  {
    id: "night-glow",
    label: "02",
    shortTitle: "Warm LED Nighttime Glow",
    caption:
      "2200K flicker-free hearth LEDs illuminate frosted timber windows without blinding blue light.",
    badge: "2200K Amber Hearth",
    scene: "night",
  },
  {
    id: "oil-cutaway",
    label: "03",
    shortTitle: "Essential Oil Fill Cutaway",
    caption:
      "Lift the snowy roof to access the 200ml ultrasonic tank — add 200ml water and 3–4 festive drops.",
    badge: "200ml Lift-Roof Tank",
    scene: "cutaway",
  },
  {
    id: "mantel-village",
    label: "04",
    shortTitle: "Mantelpiece Village Setup",
    caption:
      "Pair 2 or 3 cottages across your fireplace mantel, bookshelf, or dining centerpiece.",
    badge: "Village Centerpiece",
    scene: "mantel",
  },
  {
    id: "gift-box",
    label: "05",
    shortTitle: "Gift Box Packaging",
    caption:
      "Arrives in protective Nordic keepsake packaging ready for under the tree or Secret Santa.",
    badge: "Gift-Ready Box",
    scene: "giftbox",
  },
];

export const AMBIANCE_MODES: AmbianceMode[] = [
  {
    id: "fireplace",
    name: "Warm Amber Fireplace Mode",
    shortName: "Warm Amber Fireplace",
    kelvin: "2200K Hearth Glow",
    mistRate: "Steady Chimney Plume (28ml/hr)",
    noiseLevel: "22 dB Whisper-Quiet",
    description:
      "Golden embers pulse softly behind frosted cottage panes while aromatic pine and cinnamon mist drifts upward — recreating a snowy Alpine log cabin on winter evenings.",
    glowGradient: "from-amber-500/35 via-orange-500/20 to-pine-950",
    windowColor: "#FBBF24",
  },
  {
    id: "nightlight",
    name: "Snowy Nightlight Mode",
    shortName: "Snowy Nightlight",
    kelvin: "1800K Dimmed Candlelight",
    mistRate: "Gentle Sleep Mist (18ml/hr)",
    noiseLevel: "<20 dB Nursery Silent",
    description:
      "Low-lumen amber nightlight soothes dry winter radiator air overnight without disrupting melatonin, automatically powering off the moment the 200ml tank runs dry.",
    glowGradient: "from-sky-400/20 via-amber-400/15 to-pine-950",
    windowColor: "#FDE68A",
  },
  {
    id: "aromatherapy",
    name: "Aromatherapy Mist Mode",
    shortName: "Aromatherapy Mist",
    kelvin: "2700K Soft Frosted Glow",
    mistRate: "High-Output Chimney Puff (35ml/hr)",
    noiseLevel: "24 dB Ultrasonic Flow",
    description:
      "Boosted 2.4MHz ultrasonic dispersion carries festive essential oil molecules across living rooms up to 280 sq ft while counteracting stuffy central heating.",
    glowGradient: "from-emerald-400/25 via-amber-400/20 to-pine-950",
    windowColor: "#FCD34D",
  },
];

export const HOLIDAY_SCENTS: HolidayScent[] = [
  {
    id: "cinnamon-bark",
    name: "Cinnamon Bark",
    notes: "Ceylon cinnamon • Warm nutmeg • Hearth embers",
    mood: "Spiced Kitchen Welcome",
    accentHex: "#D97706",
  },
  {
    id: "pine-needle",
    name: "Pine Needle",
    notes: "Nordic Scots pine • Frosted cedar • Fresh fir",
    mood: "Real Tree Forest Aroma",
    accentHex: "#15803D",
  },
  {
    id: "spiced-clove",
    name: "Spiced Clove",
    notes: "Mulled orange peel • Whole clove • Star anise",
    mood: "Christmas Market Mulled Wine",
    accentHex: "#B91C1C",
  },
  {
    id: "roasted-chestnut",
    name: "Roasted Chestnut",
    notes: "Toasted chestnut • Brown sugar • Smoked oak",
    mood: "Fireside Evening",
    accentHex: "#92400E",
  },
  {
    id: "peppermint-frost",
    name: "Peppermint Frost",
    notes: "Crisp candy cane • Alpine eucalyptus • Winter air",
    mood: "Clear Sinuses & Refresh",
    accentHex: "#0EA5E9",
  },
  {
    id: "vanilla-fireside",
    name: "Vanilla Fireside",
    notes: "Madagascar vanilla bean • Cashmere woods • Amber",
    mood: "Soft Bedtime Calm",
    accentHex: "#F59E0B",
  },
];

export const REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Charlotte W.",
    location: "Manchester, UK",
    rating: 5,
    title: "Stopped my living room feeling like a radiator desert",
    body: "We have an artificial tree and dry central heating, so the room never quite smelled or felt like Christmas. Watching actual scented mist curl out of the little brick chimney every evening is honestly mesmerizing — every guest asks where we bought it.",
    tag: "Living Room Mantel",
    bundleBought: "2x Cottage Bundle",
    sceneCaption: "Flickering next to our garland & stockings",
    sceneTone: "mantel",
    helpfulCount: 94,
    dateLabel: "2 days ago",
  },
  {
    id: "rev-2",
    author: "Hannah M.",
    location: "Austin, TX",
    rating: 5,
    title: "Won our family Secret Santa by a landslide",
    body: "Grabbed the Gift One, Keep One bundle so my sister could have one too. The frosted windows cast such a cozy amber glow on her bedside table, and she uses Peppermint Frost every night without worrying about leaving a candle burning.",
    tag: "Secret Santa Hit",
    bundleBought: "2x Cottage Bundle",
    sceneCaption: "Unboxed at our holiday gift swap",
    sceneTone: "secret-santa",
    helpfulCount: 78,
    dateLabel: "4 days ago",
  },
  {
    id: "rev-3",
    author: "Oliver & Priya K.",
    location: "Surrey, UK",
    rating: 5,
    title: "Kid & dog proof — zero heat, totally silent",
    body: "With a toddler and a golden retriever, real pillar candles on low shelves were out of the question. CozyGlow gives us the exact fireplace glow and cinnamon scent with cool ultrasonic mist and auto shut-off when the 200ml tank empties.",
    tag: "Bedside & Family Safe",
    bundleBought: "3x Winter Village Bundle",
    sceneCaption: "Running quietly on our oak console table",
    sceneTone: "nursery",
    helpfulCount: 61,
    dateLabel: "5 days ago",
  },
  {
    id: "rev-4",
    author: "Megan T.",
    location: "Denver, CO",
    rating: 5,
    title: "Set up all 3 cottages as an animated village centerpiece",
    body: "Seeing three chimneys puffing pine-scented mist simultaneously down our dining table looks straight out of a storybook. Plugged all three into a discrete USB hub behind the runner and they run for 7+ hours straight.",
    tag: "Full Village Setup",
    bundleBought: "3x Winter Village Bundle",
    sceneCaption: "Three cottages puffing together at dinner",
    sceneTone: "dining",
    helpfulCount: 53,
    dateLabel: "1 week ago",
  },
  {
    id: "rev-5",
    author: "Daniel R.",
    location: "Bristol, UK",
    rating: 5,
    title: "Way nicer than clinical plastic bedroom humidifiers",
    body: "Used to wake up with a dry throat from winter heating, but ugly white cylinder humidifiers ruined our bedroom vibe. This looks like a proper Scandinavian ornament during the day and becomes a warm mini hearth at night.",
    tag: "Bedside Table",
    bundleBought: "1x Single Unit + Oil Trio",
    sceneCaption: "Bedside nightlight + eucalyptus mist",
    sceneTone: "bedside",
    helpfulCount: 47,
    dateLabel: "1 week ago",
  },
  {
    id: "rev-6",
    author: "Rachel S.",
    location: "Chicago, IL",
    rating: 5,
    title: "Arrived in 5 days packaged in gorgeous gift boxes",
    body: "Ordered on Monday afternoon and tracked delivery landed Friday. The Pine Needle oil smells authentically like a fresh Douglas fir rather than synthetic air freshener. Already ordering another pair for my mum.",
    tag: "Fast Holiday Delivery",
    bundleBought: "2x Cottage Bundle",
    sceneCaption: "Desk setup for winter WFH mornings",
    sceneTone: "office",
    helpfulCount: 39,
    dateLabel: "2 weeks ago",
  },
];

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Real Chimney Smoke/Mist Visual Effect",
    cozyGlow: "Yes — Hypnotic cool aromatic chimney plume",
    candles: "No — Soots up walls & ceilings",
    plainHumidifier: "No — Generic plastic spout",
    cozyWins: true,
  },
  {
    feature: "Zero Fire Hazard (Kid & Pet Safe)",
    cozyGlow: "100% Cool Ultrasonic Mist + Auto Shut-Off",
    candles: "Open flame & hot melted wax risk",
    plainHumidifier: "Safe, but zero warmth or charm",
    cozyWins: true,
  },
  {
    feature: "Combats Dry Winter Radiator Air",
    cozyGlow: "Yes — 200ml tank humidifies 6–8 hrs (<25dB)",
    candles: "No — Actually dries & pollutes air",
    plainHumidifier: "Yes — Functional but clinical",
    cozyWins: true,
  },
  {
    feature: "Reusable Year After Year",
    cozyGlow: "Built for every Christmas season (USB-C)",
    candles: "Burns out in ~20 hours (£30+ wasted)",
    plainHumidifier: "Gets hidden in a cupboard by guests",
    cozyWins: true,
  },
  {
    feature: "Warm Festive Window Illumination",
    cozyGlow: "2200K Warm Fireplace LED through frosted panes",
    candles: "Flickers unevenly & dies down",
    plainHumidifier: "Harsh blue/white LED indicator",
    cozyWins: true,
  },
];

export const FAQS: FaqItem[] = [
  {
    question: "How is CozyGlow™ powered and is a cable included?",
    answer:
      "CozyGlow™ uses universal USB-C power (5V/1A) and includes a braided snow-white USB-C cable in every box. Plug it into any standard phone charger brick, power bank, laptop, or TV USB port for effortless placement anywhere on your mantel, shelf, or nightstand.",
  },
  {
    question: "How large is the water tank and how long does the chimney mist last?",
    answer:
      "Beneath the lift-off snowy roof sits a generous 200ml ultrasonic water reservoir. One fill delivers 6 to 8 hours of continuous aromatic chimney mist (or up to 10 hours in intermittent sleep mist mode) before the built-in water-level sensor triggers automatic shut-off.",
  },
  {
    question: "Is it safe around children, cats, dogs, and wooden mantels?",
    answer:
      "Yes — 100%. Unlike paraffin candles or heated wax warmers, CozyGlow™ uses cool-touch 2.4MHz ultrasonic vibration. There is zero flame, zero hot surface, and zero soot or damp condensation on wooden shelves, plus automatic shut-off when water runs low.",
  },
  {
    question: "Can I use my own essential oils or just plain water?",
    answer:
      "Both! Run pure tap or filtered water for whisper-quiet (<25dB) winter humidity, or add 3–5 drops of our water-soluble Festive Essential Oils (or any standard aromatherapy oil) directly into the 200ml tank for instant Cinnamon, Pine, or Vanilla Fireside ambiance.",
  },
  {
    question: "How fast is shipping and what if I want to return it?",
    answer:
      "Orders placed before the daily warehouse cutoff dispatch within 24 hours via Royal Mail Tracked 48® / DPD Express (UK) or USPS Priority / FedEx Tracked (US), arriving in 5–7 business days with full tracking. Every order is backed by our 30-Day Money-Back Holiday Guarantee.",
  },
];

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const symbol = CURRENCIES[currency].symbol;
  return `${symbol}${amount.toFixed(2)}`;
}

export function getBundlePricing(
  bundle: BundleTier,
  currency: CurrencyCode
): { price: number; compareAt: number; perUnit: number } {
  const price = currency === "gbp" ? bundle.priceGbp : bundle.priceUsd;
  const compareAt =
    currency === "gbp" ? bundle.compareAtGbp : bundle.compareAtUsd;
  return {
    price,
    compareAt,
    perUnit: Number((price / bundle.quantity).toFixed(2)),
  };
}

export function getOrderBumpPrice(currency: CurrencyCode): {
  price: number;
  compareAt: number;
} {
  return {
    price: currency === "gbp" ? ORDER_BUMP.priceGbp : ORDER_BUMP.priceUsd,
    compareAt:
      currency === "gbp" ? ORDER_BUMP.compareAtGbp : ORDER_BUMP.compareAtUsd,
  };
}
