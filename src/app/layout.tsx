import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ParticleField } from "@/components/ui/ParticleField";
import { ShaderBackground } from "@/components/ui/ShaderBackground";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { BackToTop } from "@/components/ui/BackToTop";
import { Toaster } from "@/components/ui/Toaster";
import { JsonLd } from "@/components/ui/JsonLd";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alinets.com"),
  title: {
    default: "Ali | ICT Specialist — Web Developer & Network Infrastructure Architect (alinets.com)",
    template: "%s | Ali (alinets.com)",
  },
  description:
    "Official portfolio & engineering platform of Ali: ICT Specialist, Full-Stack Web Developer, and Computer Network Architect. Explore enterprise web applications, Cisco network topologies, routing protocols, and cloud infrastructure.",
  keywords: [
    "Ali",
    "alinets.com",
    "ICT Specialist",
    "Web Developer",
    "Computer Networks",
    "Network Infrastructure Architect",
    "Cisco CCNA",
    "Routing and Switching",
    "OSPF BGP VLANs",
    "Next.js 15",
    "React 19",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Prisma ORM",
    "Linux Server Administration",
    "Docker & DevOps",
    "Network Security & VPNs",
    "Full-Stack Web Engineering",
  ],
  authors: [{ name: "Ali", url: "https://alinets.com" }],
  creator: "Ali",
  publisher: "Ali",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://alinets.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alinets.com",
    siteName: "Ali Portfolio (alinets.com)",
    title: "Ali | ICT Specialist — Web Developer & Network Infrastructure Architect",
    description:
      "Bridging Full-Stack Web Engineering with Enterprise Computer Networks & Cloud Systems.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ali Portfolio - alinets.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali | ICT Specialist — Web Developer & Network Infrastructure Architect",
    description:
      "Bridging Full-Stack Web Engineering with Enterprise Computer Networks & Cloud Systems on alinets.com.",
    creator: "@alinets",
    images: ["/og-image.jpg"],
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://alinets.com/#person",
        name: "Ali",
        url: "https://alinets.com",
        jobTitle: "ICT Specialist, Full-Stack Web Developer & Network Systems Architect",
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "Bachelor of Science in Information & Communications Technology (ICT)",
        },
        knowsAbout: [
          "Information and Communications Technology (ICT)",
          "Computer Networks & Infrastructure",
          "Cisco Routing & Switching (CCNA)",
          "Network Protocols (TCP/IP, OSPF, BGP, VLANs, DNS, DHCP)",
          "Full-Stack Web Development (Next.js 15, React 19, TypeScript)",
          "Database Systems (PostgreSQL, Prisma ORM)",
          "Cloud & DevOps (Linux, Docker, Nginx)",
          "Network Security & WireGuard VPNs",
        ],
        sameAs: [
          "https://github.com/alinets",
          "https://linkedin.com/in/alinets",
          "https://twitter.com/alinets",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://alinets.com/#website",
        url: "https://alinets.com",
        name: "Ali Portfolio & ICT Engineering Platform",
        publisher: {
          "@id": "https://alinets.com/#person",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://alinets.com/api/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body
        className={`${plusJakarta.variable} min-h-screen bg-background text-on-surface antialiased flex flex-col relative selection:bg-primary-container selection:text-white`}
      >
        <JsonLd data={rootJsonLd} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Background Ambient Layers */}
          <ShaderBackground />
          <ParticleField />
          <div className="blob-bg w-[650px] h-[650px] bg-primary -top-40 -left-40" />
          <div className="blob-bg w-[550px] h-[550px] bg-secondary top-1/2 -right-40" />
          <div className="blob-bg w-[500px] h-[500px] bg-tertiary -bottom-40 left-1/3" />

          {children}

          {/* Global Interactive Overlays */}
          <CommandPalette />
          <BackToTop />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
