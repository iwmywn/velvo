const collections: string[] = [
  "jackets",
  "shirts",
  "pants",
  "t-shirts",
] as const;

const collectionItems = [
  {
    label: "Jackets",
    href: "jackets",
    image: "v1735392875/jackets_zeft6m.png",
  },
  {
    label: "Shirts",
    href: "shirts",
    image: "v1735392874/shirts_a4agqs.png",
  },
  {
    label: "Pants",
    href: "pants",
    image: "v1735392875/pants_zrqdsu.png",
  },
  {
    label: "T-shirts",
    href: "t-shirts",
    image: "v1735392874/t-shirts_a2uvit.png",
  },
];

export { collections, collectionItems };
