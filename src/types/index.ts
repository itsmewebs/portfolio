export type ProjectCategory = "WEB_DEV" | "NETWORKING" | "CLOUD_DEVOPS" | "CYBER_SEC" | "DATA_SCIENCE";
export type ProjectStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string | null;
  imageUrl: string;
  galleryImages?: string | null; // JSON string array of image URLs
  techStack: string; // JSON string e.g. ["Next.js", "Python"]
  features?: string | null; // JSON string array
  metrics?: string | null; // JSON string array of {label, value}
  architecture?: string | null;
  liveLink?: string | null;
  githubLink?: string | null;
  demoVideoUrl?: string | null;
  isFeatured: boolean;
  category: string;
  status: string;
  role?: string | null;
  teamSize?: string | null;
  completionDate?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriberData {
  id: string;
  email: string;
  name?: string | null;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date | null;
}

export type SkillCategory = "FRONTEND" | "BACKEND" | "NETWORKING" | "TOOLS_DEVOPS" | "DATA_AI";

export interface SkillData {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string | null;
  yearsOfExp?: string | null;
  isTopSkill: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ExperienceType = "CAREER" | "ACADEMIC" | "CERTIFICATION";

export interface ExperienceData {
  id: string;
  title: string;
  organization: string;
  location?: string | null;
  period: string;
  description: string;
  type: string;
  skills?: string | null; // JSON string array
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CertificateCategory = "TECH" | "NETWORKING" | "CLOUD" | "DATA_AI";

export interface CertificateData {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
  imageUrl?: string | null;
  category: string;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogCategory = "ENGINEERING" | "NETWORKING" | "CLOUD_DEVOPS" | "WEB_DEV" | "THOUGHTS";

export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown
  coverImage?: string | null;
  category: string;
  tags: string; // JSON string array
  readingTime: string;
  views: number;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialData {
  id: string;
  authorName: string;
  authorTitle: string;
  authorCompany: string;
  authorAvatar?: string | null;
  quote: string;
  rating: number;
  isApproved: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageData {
  id: string;
  senderName: string;
  senderEmail: string;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface SiteSettingsData {
  id: string;
  siteTitle: string;
  heroGreeting: string;
  heroTagline: string;
  heroDescription: string;
  aboutText: string;
  statusBadgeText?: string | null;
  availableForWork?: boolean;
  resumeLink?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  contactEmail?: string | null;
  dynamicBrandingTags: string; // JSON string array
  footerText?: string | null;
  metaImage?: string | null;
  particlesEnabled?: boolean;
  blogEnabled?: boolean;
  commandPaletteEnabled?: boolean;
  updatedAt: Date;
}

export interface ActivityLogData {
  id: string;
  action: string;
  details?: string | null;
  createdAt: Date;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  featuredProjects: number;
  totalSkills: number;
  totalExperiences: number;
  totalCertificates: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  totalBlogViews: number;
  totalTestimonials: number;
  unreadMessages: number;
  totalMessages: number;
}
