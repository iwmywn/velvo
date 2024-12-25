import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

const navLinks = [
  {
    label: "Men",
    href: "/category/men",
  },
  { label: "Women", href: "/category/women" },
  { label: "Kids", href: "/category/kids" },
] as const;

const footerSections = [
  {
    title: "May We Help You?",
    links: [
      {
        label: "NNVA",
        href: "mailto:anhnnv21@uef.edu.vn",
      },
      {
        label: "HAT",
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
        label: "Privacy",
        href: "#",
      },
      {
        label: "Term & conditions",
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

export { navLinks, footerSections, socialLinks };
