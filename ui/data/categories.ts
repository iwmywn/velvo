const customerGroup: string[] = ["men", "women", "kids"] as const;

const categories: string[] = [
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

const menItems = ["shirts", "jackets", "hoodies", "pants", "bags"] as const;

const womenItems = [
  "t-shirts",
  "sweaters",
  "jackets",
  "pants",
  "skirts",
  "dresses",
  "bags",
] as const;

const kidsItems = [
  "shirts",
  "t-shirts",
  "jackets",
  "hoodies",
  "shorts",
  "pants",
  "hats",
] as const;

export { customerGroup, categories, menItems, womenItems, kidsItems };
