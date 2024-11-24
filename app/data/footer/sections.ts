import links from "../nav-links";

export default [
  {
    title: "May We Help You?",
    links: [
      {
        name: "NNVA",
        href: "mailto:anhnnv21@uef.edu.vn",
      },
      {
        name: "HAT",
        href: "mailto:tuanha321@uef.edu.vn",
      },
    ],
  },
  {
    title: "Categories",
    links: links,
  },
  {
    title: "The company",
    links: [
      {
        name: "Privacy",
        href: "#",
      },
      {
        name: "Term & conditions",
        href: "#",
      },
    ],
  },
] as const;
