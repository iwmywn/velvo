const categories: string[] = ["men", "women", "kids"] as const;

const subCategories: string[] = [
  "jackets",
  "shirts",
  "bags",
  "pants",
  "sweaters",
  "skirts",
  "t-shirts",
  "dresses",
  "hats",
  "shorts",
  "hoodies",
] as const;

const menItems = [
  { label: "Shirts", href: "shirts" },
  { label: "Jackets", href: "jackets" },
  { label: "Hoodies", href: "hoodies" },
  { label: "Pants", href: "pants" },
  { label: "Bags", href: "bags" },
] as const;

const womenItems = [
  { label: "T-Shirts", href: "t-shirts" },
  { label: "Sweaters", href: "sweaters" },
  { label: "Jackets", href: "jackets" },
  { label: "Pants", href: "pants" },
  { label: "Skirts", href: "skirts" },
  { label: "Dresses", href: "dresses" },
  { label: "Bags", href: "bags" },
] as const;

const kidsItems = [
  { label: "Shirts", href: "shirts" },
  { label: "T-Shirts", href: "t-shirts" },
  { label: "Jackets", href: "jackets" },
  { label: "Hoodies", href: "hoodies" },
  { label: "Shorts", href: "shorts" },
  { label: "Pants", href: "pants" },
  { label: "Hats", href: "hats" },
] as const;

export { categories, subCategories, menItems, womenItems, kidsItems };
