import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

const navLinks = [
  { name: "HOME", href: "/" },
  {
    name: "MEN",
    href: "/category/men",
  },
  { name: "WOMEN", href: "/category/women" },
  { name: "KIDS", href: "/category/kids" },
] as const;

const footerSections = [
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
    links: navLinks,
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
        href: "##",
      },
    ],
  },
] as const;

const socialLinks = [
  {
    icon: FaFacebook,
    href: "#",
  },
  {
    icon: FaInstagram,
    href: "##",
  },
  {
    icon: FaYoutube,
    href: "###",
  },
  {
    icon: FaLinkedin,
    href: "####",
  },
] as const;

const categories = [
  {
    src: "/men.png",
    alt: "men",
    describe:
      "Discover a collection of stylish, dynamic, and versatile fashion pieces for men, perfect for any occasion.",
    href: "/category/men",
  },
  {
    src: "/women.png",
    alt: "women",
    describe:
      "Express your personality and unique style with elegant and modern designs crafted for women.",
    href: "/category/women",
  },
  {
    src: "/kids.png",
    alt: "kids",
    describe:
      "Explore adorable, comfortable, and safe collections for kids, perfect for everyday activities.",
    href: "/category/kids",
  },
] as const;

export { navLinks, footerSections, socialLinks, categories };
