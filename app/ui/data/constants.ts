import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

const navLinks = [
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

export { navLinks, footerSections, socialLinks };
