import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ali | ICT Specialist — Web Developer & Network Architect",
    short_name: "Ali Portfolio",
    description:
      "Official portfolio of Ali: ICT Specialist, Full-Stack Web Developer, and Network Infrastructure Architect.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1318",
    theme_color: "#13161c",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
