import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

const baseImgUrl = "https://res.cloudinary.com/duobwq5xg/image/upload/";

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

export { baseImgUrl, footerSections, socialLinks };
