import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

export const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "Men",
    href: "/category/men",
  },
  { name: "Women", href: "/category/women" },
  { name: "Kids", href: "/category/kids" },
] as const;

export const footerSections = [
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
        href: "#",
      },
    ],
  },
] as const;

export const socialLinks = [
  {
    icon: FaFacebook,
    href: "#",
  },
  {
    icon: FaInstagram,
    href: "#",
  },
  {
    icon: FaYoutube,
    href: "#",
  },
  {
    icon: FaLinkedin,
    href: "#",
  },
] as const;

export const categories = [
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
