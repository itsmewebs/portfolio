import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seed V7.0 Zenith (Web Development & Network ICT Specialization) for alinets.com...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@alinets.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "Admin123!@#";
  const hashedPassword = await bcrypt.hash(rawPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      name: "Ali",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Default Site Settings (ICT Specialization: Web Development & Computer Networks)
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      siteTitle: "Ali - ICT Specialist | Web Developer & Network Infrastructure Architect",
      heroGreeting: "Hi, I'm Ali,",
      heroTagline: "ICT Specialist in Full-Stack Web Development, Network Architecture & Cloud Systems.",
      heroDescription: "Holding an academic degree in Information and Communications Technology (ICT), I engineer responsive full-stack web applications, scalable cloud infrastructure, and robust enterprise network topologies.",
      aboutText: "With a specialized degree in Information and Communications Technology (ICT), I focus on the intersection of modern Full-Stack Web Engineering, Computer Networks, and Infrastructure Systems. From architecting high-performance Next.js web applications to configuring enterprise routing protocols, firewalls, and cloud telemetry, I build secure, scalable digital ecosystems.",
      statusBadgeText: "ICT Specialist × Web Developer × Network Infrastructure Architect",
      availableForWork: true,
      resumeLink: "/resume.pdf",
      githubUrl: "https://github.com/alinets",
      linkedinUrl: "https://linkedin.com/in/alinets",
      twitterUrl: "https://twitter.com/alinets",
      contactEmail: "contact@alinets.com",
      footerText: "Engineered by Ali with Next.js 15, Neon PostgreSQL, Prisma ORM & Zenith Design v7.0.",
      dynamicBrandingTags: JSON.stringify([
        "ICT Specialist",
        "Full-Stack Web Developer",
        "Network Systems Engineer",
        "Next.js 15 & React 19",
        "TypeScript & Node.js",
        "Cisco Routing & Switching",
        "TCP/IP & Network Protocols",
        "VLANs & Subnetting",
        "Firewalls & VPN Security",
        "PostgreSQL & Prisma ORM",
        "Linux & DevOps Infrastructure",
        "Cloud Architecture"
      ]),
      particlesEnabled: true,
      blogEnabled: true,
      commandPaletteEnabled: true,
    },
    create: {
      id: "default",
      siteTitle: "Ali - ICT Specialist | Web Developer & Network Infrastructure Architect",
      heroGreeting: "Hi, I'm Ali,",
      heroTagline: "ICT Specialist in Full-Stack Web Development, Network Architecture & Cloud Systems.",
      heroDescription: "Holding an academic degree in Information and Communications Technology (ICT), I engineer responsive full-stack web applications, scalable cloud infrastructure, and robust enterprise network topologies.",
      aboutText: "With a specialized degree in Information and Communications Technology (ICT), I focus on the intersection of modern Full-Stack Web Engineering, Computer Networks, and Infrastructure Systems. From architecting high-performance Next.js web applications to configuring enterprise routing protocols, firewalls, and cloud telemetry, I build secure, scalable digital ecosystems.",
      statusBadgeText: "ICT Specialist × Web Developer × Network Infrastructure Architect",
      availableForWork: true,
      resumeLink: "/resume.pdf",
      githubUrl: "https://github.com/alinets",
      linkedinUrl: "https://linkedin.com/in/alinets",
      twitterUrl: "https://twitter.com/alinets",
      contactEmail: "contact@alinets.com",
      footerText: "Engineered by Ali with Next.js 15, Neon PostgreSQL, Prisma ORM & Zenith Design v7.0.",
      dynamicBrandingTags: JSON.stringify([
        "ICT Specialist",
        "Full-Stack Web Developer",
        "Network Systems Engineer",
        "Next.js 15 & React 19",
        "TypeScript & Node.js",
        "Cisco Routing & Switching",
        "TCP/IP & Network Protocols",
        "VLANs & Subnetting",
        "Firewalls & VPN Security",
        "PostgreSQL & Prisma ORM",
        "Linux & DevOps Infrastructure",
        "Cloud Architecture"
      ]),
      particlesEnabled: true,
      blogEnabled: true,
      commandPaletteEnabled: true,
    },
  });
  console.log(`✅ Site settings initialized for alinets.com.`);

  // 3. Clear and Seed Enriched Projects (Web Development & Network Engineering Focus)
  await prisma.project.deleteMany();

  const projects = [
    {
      title: "Enterprise Multi-VLAN Network Infrastructure & Routing Architecture",
      slug: "enterprise-multivlan-network-routing-architecture",
      description: "An enterprise-grade network topology design and deployment featuring multi-layer switching, OSPF dynamic routing, inter-VLAN routing, Access Control Lists (ACLs), and QoS traffic prioritization.",
      longDescription: `The Enterprise Multi-VLAN Network Infrastructure & Routing Architecture platform represents a comprehensive blueprint for high-availability, fault-tolerant enterprise network environments.

### Core Architectural Pillars
- **Hierarchical Network Design**: Implements Cisco's Three-Tier Architecture (Core, Distribution, and Access Layers) ensuring deterministic traffic routing and zero single-points-of-failure.
- **Dynamic Routing & Convergence**: Multi-area OSPF routing configuration for automated link-state convergence, path cost calculation, and autonomous boundary routing (ASBR).
- **Segmentation & Access Control**: Strict 802.1Q trunking, per-VLAN Spanning Tree (PVST+), DHCP Snooping, Dynamic ARP Inspection (DAI), and extended IP ACLs.
- **Quality of Service (QoS)**: DSCP prioritization for real-time VoIP and critical application traffic over bulk transfer pipelines.

### Engineering & Implementation
Designed with rigorous protocol compliance across RFC standards, utilizing Cisco IOS command hierarchies, sub-interface encapsulation, NAT overload (PAT), and redundant Hot Standby Router Protocol (HSRP) gateways.`,
      imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
      techStack: JSON.stringify(["Cisco IOS", "OSPF", "BGP", "VLANs (802.1Q)", "Inter-VLAN Routing", "ACLs & NAT", "Wireshark", "SNMP"]),
      features: JSON.stringify([
        "Multi-Area OSPF Dynamic Routing with Sub-Second Link Convergence",
        "Strict 802.1Q VLAN Network Segmentation & Inter-VLAN Routing",
        "Layer 2 Security Hardening (Port Security, DAI, DHCP Snooping)",
        "Redundant Gateway Failover using HSRP / VRRP",
        "Extended Access Control Lists (ACLs) & Stateful NAT Overload"
      ]),
      metrics: JSON.stringify([
        { label: "Network Uptime", value: "99.99%" },
        { label: "Packet Latency", value: "< 1.2ms" },
        { label: "Configured Subnets", value: "24 VLANs" }
      ]),
      architecture: "Cisco Three-Tier Hierarchical Model (Core / Distribution / Access) with redundant fiber trunking and stateful perimeter firewalls.",
      role: "Lead Network Infrastructure Architect",
      teamSize: "Solo Engineering Project",
      completionDate: "2024",
      liveLink: "https://alinets.com/projects/enterprise-multivlan-network-routing-architecture",
      githubLink: "https://github.com/alinets/enterprise-network-topology",
      isFeatured: true,
      category: "NETWORKING",
      status: "PUBLISHED",
      order: 1,
    },
    {
      title: "CloudNet Core — High-Availability Web Telemetry & Network Gateway",
      slug: "cloudnet-core-network-telemetry-gateway",
      description: "A real-time network device telemetry and uptime dashboard built with Next.js 15 App Router, TypeScript, WebSockets, and SNMP protocol integration for live traffic analysis.",
      longDescription: `Managing distributed networks requires continuous, low-latency telemetry ingestion and intuitive real-time visualizations.

CloudNet Core bridges low-level networking protocols (SNMP, NetFlow, ICMP) with modern web engineering, delivering a single-pane-of-glass operations center for network engineers.

### Key Capabilities
- **Real-Time Interface Telemetry**: Sub-50ms WebSocket streaming of port bandwidth, CRC error rates, and packet discards.
- **Automated Topology Mapping**: Dynamic SVG network graph rendering switch-to-router link states and STP root bridges.
- **Stateful Anomaly Detection**: Automated alerting pipelines for threshold breaches, BGP flap events, and interface saturation.
- **Executive Audit Reports**: Automated PDF generation summarizing MTTR, link availability, and peak throughput hours.`,
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      techStack: JSON.stringify(["Next.js 15", "React 19", "TypeScript", "WebSockets", "PostgreSQL", "Prisma", "Tailwind CSS", "Recharts", "Docker"]),
      features: JSON.stringify([
        "Sub-50ms Real-Time WebSocket Network Interface Streaming",
        "SNMPv3 MIB Polling Engine with Encrypted Telemetry Ingestion",
        "Interactive SVG Dynamic Topology Map & Port Inspector",
        "Automated Incident Dispatch via Webhooks and Telegram/Discord",
        "Multi-Tenant Role-Based Access Control for NOC Operators"
      ]),
      metrics: JSON.stringify([
        { label: "Telemetry Latency", value: "< 45ms" },
        { label: "Monitored Ports", value: "1,200+" },
        { label: "Incident Alert Time", value: "Instant" }
      ]),
      architecture: "Next.js 15 Server Components frontend consuming real-time WebSocket telemetry streams backed by Prisma ORM and Neon PostgreSQL.",
      role: "Lead Full-Stack & Systems Architect",
      teamSize: "Solo Engineering Project",
      completionDate: "2024",
      liveLink: "https://alinets.com/projects/cloudnet-core-network-telemetry-gateway",
      githubLink: "https://github.com/alinets/cloudnet-telemetry-core",
      isFeatured: true,
      category: "WEB_DEV",
      status: "PUBLISHED",
      order: 2,
    },
    {
      title: "NexusGuard — Automated Packet Inspection & Network Security IDS",
      slug: "nexusguard-packet-inspection-network-security-ids",
      description: "A high-performance network packet analyzer and intrusion detection prototype built with Python and Scapy, featuring live flow reconstruction, anomaly detection, and a reactive Next.js web portal.",
      longDescription: `Network security demands granular packet inspection to detect malicious payloads, lateral movement, and reconnaissance sweeps before compromise occurs.

NexusGuard captures raw network frames, reconstructs bidirectional TCP streams, and applies signature heuristics to identify threat vectors in real time.

### Technical Highlights
- **Deep Packet Inspection (DPI)**: Full protocol decoding across Ethernet, IPv4/IPv6, TCP, UDP, ICMP, DNS, and HTTP headers.
- **Port Scan & Flood Heuristics**: Algorithmic detection of SYN scans, NULL scans, and distributed amplification attacks.
- **Cryptographic Fingerprinting**: Identifies TLS handshake parameters and cipher suite negotiations to spot suspicious clients.
- **Modern Management Interface**: React & Next.js dashboard providing interactive packet visualizer, PCAP downloads, and hex dumps.`,
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      techStack: JSON.stringify(["Python", "Scapy", "FastAPI", "React 19", "Next.js", "TCP/IP Protocol", "PostgreSQL", "Tailwind CSS"]),
      features: JSON.stringify([
        "Real-Time Raw Packet Capture & Flow Reconstruction",
        "Automated Port Scan (SYN/FIN/XMAS) & DoS Detection Engine",
        "DNS Tunneling & Data Exfiltration Signature Classifier",
        "Interactive Packet Hex Inspector with BPF Filtering",
        "Instant PCAP Export & Wireshark Compatibility"
      ]),
      metrics: JSON.stringify([
        { label: "Capture Throughput", value: "1 Gbps" },
        { label: "Decoded Protocols", value: "35+ RFCs" },
        { label: "Detection Accuracy", value: "98.5%" }
      ]),
      architecture: "FastAPI packet decoding worker utilizing Scapy/libpcap streaming structured JSON events to PostgreSQL and Next.js UI.",
      role: "Network Security & Full-Stack Engineer",
      teamSize: "Solo Engineering Project",
      completionDate: "2024",
      liveLink: "https://alinets.com/projects/nexusguard-packet-inspection-network-security-ids",
      githubLink: "https://github.com/alinets/nexusguard-packet-analyzer",
      isFeatured: true,
      category: "NETWORKING",
      status: "PUBLISHED",
      order: 3,
    },
    {
      title: "Distributed Microservices API & Cloud Gateway Portal",
      slug: "distributed-microservices-api-cloud-gateway",
      description: "A scalable cloud API gateway and microservices architecture with JWT authentication, Redis rate-limiting, reverse proxy routing, and PostgreSQL multi-tenant database clusters.",
      longDescription: `Designed to handle millions of distributed transactions, this API gateway serves as the unified entry point for decoupled microservice clusters.

### Key Capabilities
- **Token Bucket Rate Limiting**: Distributed Redis rate-limiter mitigating abuse and enforcing tier-based API quotas.
- **Reverse Proxy & Load Balancing**: Weighted round-robin load distribution with automated health checking and circuit breaker fallback.
- **Strict Cryptographic Security**: Asymmetric RSA/ECDSA signed JWT access and refresh token authentication flows.
- **Developer Documentation & SDK**: Automated OpenAPI 3.0 specification generation with interactive test sandboxes.`,
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      techStack: JSON.stringify(["Node.js", "Express", "TypeScript", "Redis", "PostgreSQL", "Prisma ORM", "Docker", "Nginx"]),
      features: JSON.stringify([
        "Distributed Redis Token-Bucket API Rate Limiter",
        "Asymmetric JWT Authentication with Automated Key Rotation",
        "Dynamic Reverse Proxy Routing & Sub-5ms Gateway Latency",
        "Circuit Breaker & Fallback Resilience Patterns",
        "Automated OpenAPI 3.0 Interactive Documentation Sandbox"
      ]),
      metrics: JSON.stringify([
        { label: "Gateway Throughput", value: "12k req/sec" },
        { label: "p99 Latency", value: "< 8ms" },
        { label: "Cluster Uptime", value: "99.98%" }
      ]),
      architecture: "Containerized Node.js TypeScript gateway behind Nginx with Redis distributed cache and PostgreSQL primary/replica nodes.",
      role: "Backend & Systems Architect",
      teamSize: "Solo Engineering Project",
      completionDate: "2023",
      liveLink: "https://alinets.com/projects/distributed-microservices-api-cloud-gateway",
      githubLink: "https://github.com/alinets/cloud-api-gateway",
      isFeatured: false,
      category: "WEB_DEV",
      status: "PUBLISHED",
      order: 4,
    },
    {
      title: "Zero-Trust Access Controller & WireGuard VPN Gateway",
      slug: "zerotrust-wireguard-vpn-network-controller",
      description: "A modern software-defined perimeter and cryptographic VPN controller managing peer key exchanges, granular firewall rules, and Web UI administration for secure remote access.",
      longDescription: `Replacing brittle legacy SSL-VPN concentrators with next-generation WireGuard cryptographic tunneling and Zero-Trust Network Access (ZTNA) policies.

### Technical Highlights
- **Cryptographic Speed**: State-of-the-art Noise protocol key exchange running in-kernel for line-rate throughput and minimal CPU overhead.
- **Dynamic Access Policies**: Dynamic nftables firewall rule generation restricting client connectivity strictly to permitted internal subnets.
- **Web-Based Management**: Responsive Next.js administration portal for generating client QR codes, revoking keys, and monitoring active tunnel handshakes.`,
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      techStack: JSON.stringify(["WireGuard", "Linux Kernel", "TypeScript", "Next.js", "nftables", "PostgreSQL", "Tailwind CSS"]),
      features: JSON.stringify([
        "Cryptographic Noise Protocol VPN Tunnels with Line-Rate Performance",
        "Granular Micro-Segmentation & Dynamic Firewall Rule Enforcement",
        "Web-Based QR Code Config Generator for iOS, Android & Desktop Clients",
        "Real-Time Tunnel Handshake & Cryptographic Key Management",
        "Instant Single-Click Peer Access Revocation"
      ]),
      metrics: JSON.stringify([
        { label: "Cryptographic Overhead", value: "< 1%" },
        { label: "Handshake Time", value: "< 15ms" },
        { label: "Active Peer Capacity", value: "500+ Peers" }
      ]),
      architecture: "Linux kernel WireGuard interface controlled via TypeScript daemon and Next.js 15 administrative dashboard.",
      role: "Network & Systems Engineer",
      teamSize: "Solo Engineering Project",
      completionDate: "2023",
      liveLink: "https://alinets.com/projects/zerotrust-wireguard-vpn-network-controller",
      githubLink: "https://github.com/alinets/wireguard-ztna-controller",
      isFeatured: false,
      category: "NETWORKING",
      status: "PUBLISHED",
      order: 5,
    },
    {
      title: "Zenith Quantum Glassmorphism Portfolio & Enterprise CMS v7.0",
      slug: "zenith-quantum-glassmorphism-portfolio-cms",
      description: "The complete personal digital engineering platform—Next.js 15, Neon PostgreSQL, Prisma ORM, Auth.js v5, Spotlight Command Palette (⌘K), Blog CMS, Dark/Light theme system, and WebGL particle shaders.",
      longDescription: `A high-performance personal engineering platform designed to showcase full-stack web capabilities, ICT network implementations, and cloud architectures. Built with Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Neon Serverless PostgreSQL, and interactive Particle Canvas animations.`,
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      techStack: JSON.stringify(["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Prisma ORM", "Auth.js v5", "Neon PostgreSQL", "Framer Motion", "Sonner", "cmdk", "next-themes"]),
      features: JSON.stringify([
        "Interactive Canvas Particle Field & Shader FX",
        "Spotlight Command Palette (⌘K) Global Search & Navigation",
        "Full-featured Markdown Blog CMS with Real-Time Views Telemetry",
        "Executive CMS Command Center with Multi-Model Management",
        "Adaptive Dark/Light/System Theme Design Tokens",
        "Level MAX SEO Architecture with JSON-LD Structured Data & Dynamic Sitemap"
      ]),
      metrics: JSON.stringify([
        { label: "Lighthouse Score", value: "100/100" },
        { label: "First Load Time", value: "< 50ms" },
        { label: "Core Web Vitals", value: "All Green" }
      ]),
      architecture: "Next.js 15 App Router with full Server Component architecture, Server Actions, and Neon PostgreSQL via Prisma.",
      role: "Lead Architect & Full-Stack Developer",
      teamSize: "Solo Engineering Project",
      completionDate: "2024",
      liveLink: "https://alinets.com",
      githubLink: "https://github.com/alinets/portfolio-cms",
      isFeatured: false,
      category: "WEB_DEV",
      status: "PUBLISHED",
      order: 6,
    },
  ];

  for (const proj of projects) {
    await prisma.project.create({
      data: proj,
    });
  }
  console.log(`✅ Seeded ${projects.length} Web Development & Network Engineering projects.`);

  // 4. Seed Comprehensive Skills (Web Development, Networking & Systems ICT Focus)
  await prisma.skill.deleteMany();

  const skills = [
    // NETWORKING & SYSTEMS (ICT Specialization)
    { name: "Cisco Routing & Switching (CCNA)", category: "NETWORKING", proficiency: 96, icon: "Network", yearsOfExp: "3+ yrs", isTopSkill: true, order: 1 },
    { name: "TCP/IP Protocol Suite & OSI Model", category: "NETWORKING", proficiency: 98, icon: "Radio", yearsOfExp: "4+ yrs", isTopSkill: true, order: 2 },
    { name: "VLANs, 802.1Q & Spanning Tree (STP)", category: "NETWORKING", proficiency: 94, icon: "Layers", yearsOfExp: "3+ yrs", isTopSkill: true, order: 3 },
    { name: "OSPF & BGP Routing Protocols", category: "NETWORKING", proficiency: 92, icon: "GitFork", yearsOfExp: "3+ yrs", isTopSkill: true, order: 4 },
    { name: "Network Firewalls, NAT & VPN Security", category: "NETWORKING", proficiency: 90, icon: "ShieldCheck", yearsOfExp: "3+ yrs", isTopSkill: true, order: 5 },
    { name: "Wireshark & Packet Telemetry Analysis", category: "NETWORKING", proficiency: 92, icon: "Activity", yearsOfExp: "3+ yrs", isTopSkill: false, order: 6 },
    { name: "DNS, DHCP & Core Network Services", category: "NETWORKING", proficiency: 95, icon: "Server", yearsOfExp: "4+ yrs", isTopSkill: false, order: 7 },

    // FRONTEND WEB DEVELOPMENT
    { name: "Next.js 15 (App Router & Server Actions)", category: "FRONTEND", proficiency: 96, icon: "Code2", yearsOfExp: "3+ yrs", isTopSkill: true, order: 8 },
    { name: "React 19 & Server Components", category: "FRONTEND", proficiency: 94, icon: "Layout", yearsOfExp: "3+ yrs", isTopSkill: true, order: 9 },
    { name: "TypeScript 5.8", category: "FRONTEND", proficiency: 92, icon: "FileCode", yearsOfExp: "3+ yrs", isTopSkill: true, order: 10 },
    { name: "Tailwind CSS & Responsive UI/UX", category: "FRONTEND", proficiency: 95, icon: "Palette", yearsOfExp: "3+ yrs", isTopSkill: true, order: 11 },
    { name: "Framer Motion & Interactive Animations", category: "FRONTEND", proficiency: 88, icon: "Sparkles", yearsOfExp: "2+ yrs", isTopSkill: false, order: 12 },

    // BACKEND WEB DEVELOPMENT & DATABASES
    { name: "Node.js & Express REST APIs", category: "BACKEND", proficiency: 92, icon: "Cpu", yearsOfExp: "3+ yrs", isTopSkill: true, order: 13 },
    { name: "PostgreSQL & Neon Serverless Database", category: "BACKEND", proficiency: 94, icon: "Database", yearsOfExp: "3+ yrs", isTopSkill: true, order: 14 },
    { name: "Prisma ORM & Schema Modeling", category: "BACKEND", proficiency: 92, icon: "Layers", yearsOfExp: "3+ yrs", isTopSkill: true, order: 15 },
    { name: "Auth.js / NextAuth v5 & JWT Security", category: "BACKEND", proficiency: 90, icon: "Lock", yearsOfExp: "2+ yrs", isTopSkill: false, order: 16 },
    { name: "FastAPI & Python Microservices", category: "BACKEND", proficiency: 86, icon: "Server", yearsOfExp: "2+ yrs", isTopSkill: false, order: 17 },

    // CLOUD, DEVOPS & INFRASTRUCTURE
    { name: "Linux Server Administration (Ubuntu/Debian)", category: "TOOLS_DEVOPS", proficiency: 92, icon: "Terminal", yearsOfExp: "3+ yrs", isTopSkill: true, order: 18 },
    { name: "Docker & Containerization", category: "TOOLS_DEVOPS", proficiency: 88, icon: "Box", yearsOfExp: "2+ yrs", isTopSkill: false, order: 19 },
    { name: "Git, GitHub & CI/CD Pipelines", category: "TOOLS_DEVOPS", proficiency: 92, icon: "GitBranch", yearsOfExp: "3+ yrs", isTopSkill: false, order: 20 },
    { name: "Nginx Reverse Proxy & SSL/TLS Certificates", category: "TOOLS_DEVOPS", proficiency: 90, icon: "Globe", yearsOfExp: "3+ yrs", isTopSkill: false, order: 21 },
    { name: "Vercel, Cloudflare & Edge Deployments", category: "TOOLS_DEVOPS", proficiency: 90, icon: "Cloud", yearsOfExp: "3+ yrs", isTopSkill: false, order: 22 },
  ];

  for (const s of skills) {
    await prisma.skill.create({ data: s });
  }
  console.log(`✅ Seeded ${skills.length} Web Development & Networking ICT skills.`);

  // 5. Seed Experience & Career History (Web & Network ICT Focus)
  await prisma.experience.deleteMany();

  const experiences = [
    {
      title: "Network & Systems Engineer / ICT Specialist",
      organization: "Enterprise Infrastructure & Network Solutions",
      location: "Kuwait",
      period: "2023 - Present",
      description: "Managing enterprise LAN/WAN network infrastructure, configuring multi-layer Cisco switches and routers, designing OSPF dynamic routing topologies, implementing VLAN segmentation, and hardening perimeter firewall security policies.",
      type: "CAREER",
      skills: JSON.stringify(["Cisco IOS", "OSPF & BGP", "VLANs & Subnetting", "Network Firewalls", "Wireshark", "TCP/IP Architecture"]),
      order: 1,
    },
    {
      title: "Full-Stack Web Developer & Solutions Architect",
      organization: "alinets.com Digital Systems",
      location: "Kuwait",
      period: "2022 - Present",
      description: "Architecting high-performance modern web platforms using Next.js 15 App Router, TypeScript, Neon PostgreSQL database schemas, Prisma ORM, REST/GraphQL APIs, and responsive glassmorphic UI systems.",
      type: "CAREER",
      skills: JSON.stringify(["Next.js 15", "React 19", "TypeScript", "PostgreSQL", "Prisma ORM", "Tailwind CSS", "Node.js"]),
      order: 2,
    },
    {
      title: "Cloud Infrastructure & DevOps Engineer",
      organization: "Distributed Cloud Labs",
      location: "Kuwait",
      period: "2023 - Present",
      description: "Deploying containerized microservices with Docker, configuring Nginx reverse proxies with automated SSL/TLS termination, setting up Redis caching clusters, and automating CI/CD deployment pipelines.",
      type: "CAREER",
      skills: JSON.stringify(["Docker", "Linux Administration", "Nginx", "Redis", "CI/CD Workflows", "Cloudflare"]),
      order: 3,
    },
    {
      title: "Bachelor of Science in Information & Communications Technology (ICT)",
      organization: "Faculty of Information Technology - Academic Degree Program",
      location: "University",
      period: "Graduated with Honors",
      description: "Comprehensive academic degree covering Computer Networks, Telecommunications Infrastructure, Web Engineering, Relational Database Systems, Operating Systems, Network Security, and Distributed Systems.",
      type: "ACADEMIC",
      skills: JSON.stringify(["Computer Networks", "Web Systems Engineering", "Relational Databases", "Network Security", "Operating Systems", "Data Structures"]),
      order: 4,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log(`✅ Seeded ${experiences.length} career & academic milestones.`);

  // 6. Seed Certificates (Web & Networking ICT Focus)
  await prisma.certificate.deleteMany();

  const certificates = [
    {
      title: "Cisco Certified Network Associate (CCNA - Routing & Switching)",
      issuer: "Cisco Systems",
      issueDate: "2024",
      expiryDate: "2027",
      credentialUrl: "https://www.cisco.com",
      credentialId: "CSCO-CCNA-948201",
      imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80",
      category: "NETWORKING",
      isFeatured: true,
      order: 1,
    },
    {
      title: "Meta Advanced Full-Stack Web Development & React Architecture",
      issuer: "Meta / Coursera",
      issueDate: "2024",
      expiryDate: "Never",
      credentialUrl: "https://www.coursera.org",
      credentialId: "META-FS-847291",
      imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80",
      category: "TECH",
      isFeatured: true,
      order: 2,
    },
    {
      title: "CompTIA Network+ & Security Infrastructure Specialist",
      issuer: "CompTIA",
      issueDate: "2023",
      expiryDate: "2026",
      credentialUrl: "https://www.comptia.org",
      credentialId: "COMP-NET-730192",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
      category: "NETWORKING",
      isFeatured: true,
      order: 3,
    },
    {
      title: "Linux Professional Institute LPIC-1 System Administrator",
      issuer: "Linux Professional Institute (LPI)",
      issueDate: "2023",
      expiryDate: "Never",
      credentialUrl: "https://www.lpi.org",
      credentialId: "LPI-SYS-502841",
      imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=400&q=80",
      category: "TECH",
      isFeatured: true,
      order: 4,
    },
    {
      title: "PostgreSQL Database Administration & Performance Engineering",
      issuer: "Postgres Institute",
      issueDate: "2023",
      expiryDate: "Never",
      credentialUrl: "https://www.postgresql.org",
      credentialId: "PG-TUN-40192",
      imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=400&q=80",
      category: "TECH",
      isFeatured: false,
      order: 5,
    },
  ];

  for (const cert of certificates) {
    await prisma.certificate.create({ data: cert });
  }
  console.log(`✅ Seeded ${certificates.length} professional certifications.`);

  // 7. Seed Blog Posts (Web Development & Network Engineering Focus)
  await prisma.blogPost.deleteMany();

  const blogPosts = [
    {
      title: "Architecting Enterprise Network Infrastructures: Deep Dive into OSPF, BGP & VLAN Segmentation",
      slug: "architecting-enterprise-network-infrastructures-ospf-bgp-vlan",
      excerpt: "A comprehensive technical breakdown of multi-layer switching, dynamic link-state routing convergence, and Layer 2 security hardening in modern enterprise networks.",
      content: `## Hierarchical Enterprise Network Architecture

Modern enterprise networks demand high availability, deterministic traffic paths, and robust security boundaries. By leveraging the **Cisco Three-Tier Hierarchical Model** (Core, Distribution, and Access layers), network architects can scale infrastructure without compounding complexity.

\`\`\`text
                 [ Internet / WAN ]
                         │
               ┌─────────┴─────────┐
               │ Perimeter Firewalls│
               └─────────┬─────────┘
                         │
              ┌──────────┴──────────┐
              │  Core Layer Switches │  (High-speed 40G/100G Backbone)
              └──────────┬──────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
┌───────┴────────┐               ┌────────┴───────┐
│ Distribution 1 │               │ Distribution 2 │  (OSPF Routing / HSRP Gateway)
└───────┬────────┘               └────────┬───────┘
        │                                 │
    ┌───┴───┬───────┐                 ┌───┴───┬───────┐
    │       │       │                 │       │       │
[VLAN 10][VLAN 20][VLAN 30]       [VLAN 40][VLAN 50][VLAN 60] (Access Layer)
\`\`\`

## Dynamic Routing with Multi-Area OSPF

OSPF (Open Shortest Path First) provides rapid convergence and loop-free topology calculations using Dijkstra's Shortest Path First (SPF) algorithm.

\`\`\`cisco
! Cisco IOS OSPF Area 0 & Sub-Interface Configuration
interface GigabitEthernet0/0/0.10
 encapsulation dot1Q 10
 ip address 10.10.10.1 255.255.255.0
 ip ospf 1 area 0
!
interface GigabitEthernet0/0/0.20
 encapsulation dot1Q 20
 ip address 10.10.20.1 255.255.255.0
 ip ospf 1 area 0
!
router ospf 1
 router-id 1.1.1.1
 log-adjacency-changes
 passive-interface default
 no passive-interface GigabitEthernet0/0/1
\`\`\`

## Layer 2 Security Hardening

Segmenting networks into VLANs is only effective if Layer 2 attacks are actively mitigated:
1. **DHCP Snooping**: Designates trusted interfaces to prevent rogue DHCP server attacks.
2. **Dynamic ARP Inspection (DAI)**: Validates ARP packets against the DHCP snooping binding database to block ARP spoofing and Man-in-the-Middle (MitM) attacks.
3. **Port Security**: Enforces MAC address limits per access switchport to stop MAC-flooding table overflows.

> "A resilient network infrastructure is the unshakeable foundation upon which all modern full-stack web platforms and cloud applications depend."`,
      coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
      category: "NETWORKING",
      tags: JSON.stringify(["Cisco", "OSPF", "BGP", "VLANs", "Network Security", "TCP/IP"]),
      readingTime: "6 min read",
      views: 412,
      isPublished: true,
      isFeatured: true,
    },
    {
      title: "Building High-Performance Full-Stack Web Applications with Next.js 15 Server Actions & PostgreSQL",
      slug: "building-high-performance-full-stack-web-apps-nextjs-postgresql",
      excerpt: "How to architect zero-latency full-stack web platforms combining React 19 Server Components, type-safe Server Actions, and Neon serverless database pooling.",
      content: `## The Modern Full-Stack Web Paradigm

With the release of **Next.js 15** and **React 19**, the boundary between frontend user experience and backend database persistence has evolved into a unified, type-safe paradigm.

### Eliminating Redundant API Boilerplate

Instead of writing separate controller routes, fetch hooks, and payload serializers, **Server Actions** allow direct, secure database mutations executed exclusively on the server:

\`\`\`typescript
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProjectSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  techStack: z.string(),
  category: z.enum(["WEB_DEV", "NETWORKING", "CLOUD_DEVOPS"]),
});

export async function createProjectAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized access" };
  }

  const raw = Object.fromEntries(formData.entries());
  const validated = ProjectSchema.safeParse(raw);
  
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const project = await prisma.project.create({
    data: validated.data,
  });

  revalidatePath("/projects");
  return { success: true, project };
}
\`\`\`

## Key Architectural Advantages

1. **Zero Client Bundle Overhead**: Server Components and database drivers remain completely on the server.
2. **Instant Revalidation**: Next.js automatically purges stale cached pages with \`revalidatePath\`.
3. **Database Connection Pooling**: Neon's pooled endpoint ensures thousands of simultaneous requests never exhaust PostgreSQL connections.`,
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      category: "ENGINEERING",
      tags: JSON.stringify(["Next.js 15", "React 19", "TypeScript", "PostgreSQL", "Prisma ORM", "Server Actions"]),
      readingTime: "5 min read",
      views: 328,
      isPublished: true,
      isFeatured: true,
    },
    {
      title: "Network Telemetry & Real-Time Monitoring: Implementing WebSockets & SNMP Protocol Pipelines",
      slug: "network-telemetry-realtime-monitoring-websockets-snmp",
      excerpt: "Architecting a live network operations telemetry pipeline that ingests asynchronous SNMP polling data and streams real-time metrics to reactive web dashboards.",
      content: `## Ingesting Low-Level Protocol Telemetry

Network engineers frequently need sub-second visibility into link saturation, CRC error counters, and packet loss events across distributed switches and routers.

\`\`\`typescript
// Real-Time WebSocket Telemetry Dispatcher
import { WebSocketServer } from "ws";
import snmp from "net-snmp";

export function initTelemetryEngine(server: any) {
  const wss = new WebSocketServer({ server });
  
  wss.on("connection", (ws) => {
    const session = snmp.createSession("192.168.1.1", "public");
    const oids = ["1.3.6.1.2.1.2.2.1.10.1", "1.3.6.1.2.1.2.2.1.16.1"]; // ifInOctets, ifOutOctets
    
    const interval = setInterval(() => {
      session.get(oids, (error, varbinds) => {
        if (!error) {
          const telemetry = {
            inOctets: varbinds[0].value,
            outOctets: varbinds[1].value,
            timestamp: Date.now(),
          };
          ws.send(JSON.stringify(telemetry));
        }
      });
    }, 1000);
    
    ws.on("close", () => clearInterval(interval));
  });
}
\`\`\`

## Transforming Raw Packets into Actionable Insights

By piping SNMP polling data through a WebSocket gateway into a reactive Next.js frontend, network operations centers (NOC) gain instant awareness of anomalies before users experience degradation.`,
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      category: "NETWORKING",
      tags: JSON.stringify(["SNMP", "WebSockets", "Network Monitoring", "TypeScript", "Next.js"]),
      readingTime: "4 min read",
      views: 245,
      isPublished: true,
      isFeatured: false,
    },
    {
      title: "Zero-Trust Network Access (ZTNA) & Modern Web Security Protocols",
      slug: "zerotrust-network-access-modern-web-security",
      excerpt: "From TCP 3-way handshakes to modern TLS 1.3 encryption and WireGuard Noise protocol cryptography, securing enterprise web and network ecosystems.",
      content: `## Beyond the Castle-and-Moat Security Model

Traditional network perimeters assumed that everything inside the corporate firewall was implicitly trusted. Modern security architectures enforce **Zero Trust: Never Trust, Always Verify**.

### Fundamentals of TLS 1.3 & WireGuard Cryptography

1. **TLS 1.3 Handshake Optimization**: Reduces handshake round-trips from 2-RTT to 1-RTT (and 0-RTT resumption) while removing legacy vulnerable cipher suites.
2. **Noise Protocol Framework**: WireGuard's implementation uses ChaCha20 for symmetric encryption, Poly1305 for authentication, and Curve25519 for ECDH key exchange.
3. **Micro-Segmentation**: Enforcing least-privilege packet routing between web servers, database clusters, and management controllers.`,
      coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      category: "NETWORKING",
      tags: JSON.stringify(["Zero Trust", "WireGuard", "TLS 1.3", "Cryptography", "Network Security"]),
      readingTime: "5 min read",
      views: 285,
      isPublished: true,
      isFeatured: false,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }
  console.log(`✅ Seeded ${blogPosts.length} technical blog articles.`);

  // 8. Seed Testimonials (Web & Network ICT Focus)
  await prisma.testimonial.deleteMany();

  const testimonials = [
    {
      authorName: "Senior Network Infrastructure Architect",
      authorTitle: "Enterprise Telecommunications",
      authorCompany: "Network Solutions Partner",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      quote: "Ali demonstrates exceptional technical mastery across computer networks and routing architectures. His deep understanding of Cisco IOS, OSPF convergence, and Layer 2/3 security hardening is world-class.",
      rating: 5,
      isApproved: true,
      isFeatured: true,
      order: 1,
    },
    {
      authorName: "Lead Full-Stack Software Engineer",
      authorTitle: "Cloud Web Solutions",
      authorCompany: "Technology Collaborator",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      quote: "Ali writes clean, robust TypeScript and architected high-performance Next.js 15 web applications with effortless precision. His ability to bridge web development with network telemetry is truly impressive.",
      rating: 5,
      isApproved: true,
      isFeatured: true,
      order: 2,
    },
    {
      authorName: "Department Chair & Professor of ICT",
      authorTitle: "Faculty of Information and Communications Technology",
      authorCompany: "University Academic Faculty",
      authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      quote: "During his academic studies in Information and Communications Technology, Ali stood out for his rigorous problem-solving in computer networks, database systems, and full-stack software engineering.",
      rating: 5,
      isApproved: true,
      isFeatured: true,
      order: 3,
    },
  ];

  for (const test of testimonials) {
    await prisma.testimonial.create({ data: test });
  }
  console.log(`✅ Seeded ${testimonials.length} professional testimonials.`);

  // 9. Seed Activity Log
  await prisma.activityLog.create({
    data: {
      action: "V7_ZENITH_ICT_FOCUS_UPGRADE",
      details: "Portfolio refreshed with full focus on Web Development & Computer Networks as core ICT Specialization.",
    },
  });

  console.log("🎉 Version 7.0 Zenith Database Seeding successfully completed for alinets.com!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
