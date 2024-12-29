import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

const baseImgUrl = "https://res.cloudinary.com/dku9repmn/image/upload/";

const navLinks = [
  {
    label: "Men",
    href: "/categories/men",
  },
  { label: "Women", href: "/categories/women" },
  { label: "Kids", href: "/categories/kids" },
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

export { baseImgUrl, navLinks, footerSections, socialLinks };
