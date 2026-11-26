export type Diet = "veg" | "nonveg" | "egg";

export type Variant = { id: string; label: string; price: number };
export type AddonGroup = {
  id: string;
  label: string;
  max: number;
  options: { id: string; label: string; price: number }[];
};

export type MenuItem = {
  id: string;
  name: string;
  native?: string;
  description: string;
  category: string;
  price: number;
  compareAt?: number;
  diet: Diet;
  image?: string;
  prep: number;
  tags?: ("bestseller" | "chef" | "new" | "spicy" | "seasonal")[];
  available?: boolean;
  variants?: Variant[];
  addons?: AddonGroup[];
  station: "Tandoor" | "Curry" | "Grill" | "Cold" | "Pastry" | "Bar";
  sold?: number;
  cost?: number;
};

export const categories = [
  { id: "small-plates", name: "Small Plates", note: "To share, or not." },
  { id: "tandoor", name: "Tandoor & Grill", note: "Charcoal, clay, patience." },
  { id: "coastal", name: "Coastal Curries", note: "Coconut, kokum, the Malabar coast." },
  { id: "rice", name: "Biryani & Rice", note: "Sealed with dough, opened at the table." },
  { id: "thali", name: "Thalis", note: "Lunch, 12 – 3:30 pm." },
  { id: "breads", name: "Breads", note: "Hand-pulled, to order." },
  { id: "desserts", name: "Desserts", note: "Jaggery, cardamom, coffee." },
  { id: "bar", name: "Bar", note: "Kokum, toddy, tamarind." },
];

const spice: AddonGroup = {
  id: "spice",
  label: "Spice level",
  max: 1,
  options: [
    { id: "mild", label: "Mild", price: 0 },
    { id: "medium", label: "Medium", price: 0 },
    { id: "hot", label: "Kerala hot", price: 0 },
  ],
};
const sides: AddonGroup = {
  id: "sides",
  label: "Add on the side",
  max: 3,
  options: [
    { id: "appam", label: "Two appams", price: 90 },
    { id: "parotta", label: "Malabar parotta", price: 70 },
    { id: "rice", label: "Steamed matta rice", price: 80 },
    { id: "raita", label: "Burnt garlic raita", price: 60 },
  ],
};
const portion: Variant[] = [
  { id: "half", label: "Half", price: 0 },
  { id: "full", label: "Full", price: 220 },
];
const biryaniSize: Variant[] = [
  { id: "single", label: "Single", price: 0 },
  { id: "sharing", label: "Sharing (serves 2)", price: 340 },
  { id: "handi", label: "Family handi (serves 4)", price: 920 },
];

export const menu: MenuItem[] = [
  // Small plates
  { id: "m01", name: "Tuna Kokum Tartare", description: "Yellowfin, kokum gel, curry-leaf oil, puffed rice, a little green chilli.", category: "small-plates", price: 545, diet: "nonveg", image: "/img/tuna-tartare.jpg", prep: 8, tags: ["chef", "new"], station: "Cold", sold: 212, cost: 168 },
  { id: "m02", name: "Papdi Chaat, Our Way", description: "Crisp papdi, chilled dahi, tamarind, pomegranate, sev and beetroot chutney.", category: "small-plates", price: 295, diet: "veg", image: "/img/papdi-chaat.jpg", prep: 6, tags: ["bestseller"], station: "Cold", sold: 486, cost: 64 },
  { id: "m03", name: "Kheema Samosa", description: "Hand-folded, lamb kheema, mint and tamarind chutneys.", category: "small-plates", price: 325, diet: "nonveg", image: "/img/samosa.jpg", prep: 10, station: "Tandoor", sold: 301, cost: 92, addons: [spice] },
  { id: "m04", name: "Bombay Pav Bhaji", description: "Buttered pav, slow-mashed bhaji, raw onion, lime. Unashamedly messy.", category: "small-plates", price: 275, diet: "veg", image: "/img/pav-bhaji.jpg", prep: 9, tags: ["bestseller"], station: "Curry", sold: 534, cost: 58 },
  { id: "m05", name: "Idli, Vada, Podi", description: "Steamed idli, crisp medu vada, gunpowder podi, coconut chutney and sambar.", category: "small-plates", price: 245, diet: "veg", image: "/img/idli-vada.jpg", prep: 7, station: "Curry", sold: 266, cost: 41 },
  { id: "m06", name: "Kachumber & Smoked Curd", description: "Cucumber, heirloom tomato, red onion, smoked hung curd, chaat masala.", category: "small-plates", price: 265, diet: "veg", image: "/img/kachumber.jpg", prep: 5, station: "Cold", sold: 144, cost: 48 },

  // Tandoor
  { id: "m07", name: "Tandoori Kozhi", description: "Half chicken, 24-hour kashmiri chilli marinade, banana-leaf service.", category: "tandoor", price: 545, diet: "nonveg", image: "/img/tandoori-kozhi.jpg", prep: 22, tags: ["bestseller", "spicy"], station: "Tandoor", sold: 612, cost: 171, variants: portion },
  { id: "m08", name: "Charcoal Seekh", description: "Hand-minced lamb on the skewer, smoked over coconut-shell charcoal.", category: "tandoor", price: 595, diet: "nonveg", image: "/img/seekh.jpg", prep: 18, tags: ["chef"], station: "Grill", sold: 398, cost: 204 },
  { id: "m09", name: "Paneer Tikka Sizzler", description: "Malai paneer, charred peppers, pickled onion, on a hot iron.", category: "tandoor", price: 445, diet: "veg", image: "/img/paneer-tikka.jpg", prep: 15, tags: ["bestseller"], station: "Tandoor", sold: 571, cost: 118, addons: [spice] },

  // Coastal curries
  { id: "m10", name: "Malabar Prawn Moilee", description: "Tiger prawns in turmeric coconut milk, curry leaf, green chilli. Served with matta rice.", category: "coastal", price: 745, diet: "nonveg", image: "/img/prawn-moilee.jpg", prep: 18, tags: ["bestseller", "chef"], station: "Curry", sold: 688, cost: 262, addons: [spice, sides] },
  { id: "m11", name: "Kerala Meen Curry", description: "Seer fish in kodampuli and red chilli, clay-pot simmered.", category: "coastal", price: 695, compareAt: 760, diet: "nonveg", image: "/img/meen-curry.jpg", prep: 20, tags: ["spicy"], station: "Curry", sold: 455, cost: 238, addons: [spice, sides] },
  { id: "m12", name: "Goan Pork Xacuti", description: "Roasted coconut, poppy seed, 14 spices, a splash of feni.", category: "coastal", price: 685, diet: "nonveg", image: "/img/goan-xacuti.jpg", prep: 16, tags: ["seasonal"], station: "Curry", sold: 189, cost: 221, addons: [sides] },
  { id: "m13", name: "Chettinad Kozhi & Parotta", description: "Black pepper, kalpasi, star anise. Two flaky Malabar parottas.", category: "coastal", price: 595, diet: "nonveg", image: "/img/chettinad-parotta.jpg", prep: 18, tags: ["spicy"], station: "Curry", sold: 377, cost: 176, addons: [spice] },
  { id: "m14", name: "Paneer Makhani", description: "Charred tomato, fenugreek, cultured butter. Comfort, unapologetically.", category: "coastal", price: 495, diet: "veg", image: "/img/paneer-makhani.jpg", prep: 14, tags: ["bestseller"], station: "Curry", sold: 642, cost: 132, addons: [sides] },
  { id: "m15", name: "Five Dal & Curry Table", description: "A rotating set of dal, sabzi and a curry of the day — for the table.", category: "coastal", price: 845, diet: "veg", image: "/img/curry-spread.jpg", prep: 12, station: "Curry", sold: 122, cost: 214 },

  // Rice
  { id: "m16", name: "Thalassery Chicken Biryani", description: "Short-grain kaima rice, fried shallots, cashew, raisins. Dum-sealed.", category: "rice", price: 545, diet: "nonveg", image: "/img/thalassery-biryani.jpg", prep: 25, tags: ["bestseller"], station: "Curry", sold: 812, cost: 168, variants: biryaniSize },
  { id: "m17", name: "Mutton Dum Biryani", description: "Bone-in goat, saffron, kewra, slow dum for three hours.", category: "rice", price: 645, diet: "nonveg", image: "/img/mutton-biryani.jpg", prep: 25, tags: ["chef"], station: "Curry", sold: 498, cost: 226, variants: biryaniSize },
  { id: "m18", name: "Prawn Ghee Pulao", description: "Coastal prawns, ghee rice, lemon and coriander.", category: "rice", price: 595, diet: "nonveg", image: "/img/prawn-pulao.jpg", prep: 18, station: "Curry", sold: 233, cost: 197 },
  { id: "m19", name: "Subz Pulao, Nawabi", description: "Seasonal vegetables, boiled eggs, saffron, rose water, silver leaf.", category: "rice", price: 445, diet: "egg", image: "/img/ghee-pulao.jpg", prep: 18, station: "Curry", sold: 154, cost: 109 },

  // Thali
  { id: "m20", name: "Signature Coastal Thali", description: "Fish fry, prawn curry, thoran, rasam, matta rice, appam, payasam.", category: "thali", price: 895, diet: "nonveg", image: "/img/thali.jpg", prep: 15, tags: ["bestseller"], station: "Curry", sold: 402, cost: 285 },
  { id: "m21", name: "Garden Thali", description: "Three vegetables, dal, sambar, curd rice, poppadum, pickle, dessert.", category: "thali", price: 695, diet: "veg", image: "/img/thali-plate.jpg", prep: 12, station: "Curry", sold: 288, cost: 176 },

  // Breads
  { id: "m22", name: "Malabar Parotta", description: "Layered, slapped, crisp-edged.", category: "breads", price: 85, diet: "egg", image: "/img/chettinad-parotta.jpg", prep: 6, station: "Tandoor", sold: 1203, cost: 14 },
  { id: "m23", name: "Garlic Butter Naan", description: "Tandoor-blistered, cultured butter.", category: "breads", price: 95, diet: "veg", image: "/img/paneer-makhani.jpg", prep: 5, station: "Tandoor", sold: 988, cost: 12 },
  { id: "m24", name: "Palappam (two)", description: "Lacy rice-and-coconut hoppers.", category: "breads", price: 90, diet: "veg", image: "/img/prawn-moilee.jpg", prep: 6, station: "Tandoor", sold: 644, cost: 11 },
  { id: "m25", name: "Kulcha, Amritsari", description: "Spiced potato filling, ajwain, white butter.", category: "breads", price: 145, diet: "veg", image: "/img/pav-bhaji.jpg", prep: 8, station: "Tandoor", sold: 310, cost: 22 },

  // Desserts
  { id: "m26", name: "Rose & Raspberry Gateau", description: "Rose chantilly, raspberry, almond sponge, gulkand.", category: "desserts", price: 395, diet: "egg", image: "/img/rose-cake.jpg", prep: 4, tags: ["new"], station: "Pastry", sold: 176, cost: 92 },
  { id: "m27", name: "Filter Coffee Sundae", description: "Chicory ice cream, jaggery fudge, coffee crumble, cream.", category: "desserts", price: 345, diet: "veg", image: "/img/coffee-sundae.jpg", prep: 4, tags: ["bestseller"], station: "Pastry", sold: 433, cost: 71 },
  { id: "m28", name: "Elaneer Payasam", description: "Tender coconut, reduced milk, cardamom. Served cold.", category: "desserts", price: 275, diet: "veg", image: "/img/coffee-sundae.jpg", prep: 3, station: "Pastry", sold: 251, cost: 49 },

  // Bar
  { id: "m29", name: "Kokum Collins", description: "Gin, kokum shrub, soda, kaffir lime.", category: "bar", price: 545, diet: "veg", image: "/img/bar.jpg", prep: 4, tags: ["bestseller"], station: "Bar", sold: 521, cost: 118 },
  { id: "m30", name: "Toddy Shop Sour", description: "Aged rum, palm jaggery, lime, egg white, nutmeg.", category: "bar", price: 595, diet: "egg", image: "/img/bar.jpg", prep: 5, station: "Bar", sold: 302, cost: 131 },
  { id: "m31", name: "Tamarind Old Fashioned", description: "Indian single malt, tamarind demerara, orange bitters.", category: "bar", price: 745, diet: "veg", image: "/img/bar.jpg", prep: 5, tags: ["chef"], station: "Bar", sold: 248, cost: 196 },
  { id: "m32", name: "Sol Kadhi Spritz", description: "Zero-proof. Kokum, coconut milk, green chilli, soda.", category: "bar", price: 295, diet: "veg", image: "/img/bar.jpg", prep: 3, station: "Bar", sold: 377, cost: 42 },
];

export const menuById = Object.fromEntries(menu.map((m) => [m.id, m]));
export const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;
