import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const contactSchema = z.object({
  senderName: z.string().min(2, "Name must be at least 2 characters"),
  senderEmail: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  longDescription: z.string().optional().nullable(),
  imageUrl: z.string().url("Please provide a valid image URL"),
  galleryImages: z.string().optional().nullable(),
  techStack: z.string().min(1, "Please provide at least one technology"),
  features: z.string().optional().nullable(),
  metrics: z.string().optional().nullable(),
  architecture: z.string().optional().nullable(),
  liveLink: z.string().url("Please provide a valid URL").optional().or(z.literal("")).nullable(),
  githubLink: z.string().url("Please provide a valid GitHub URL").optional().or(z.literal("")).nullable(),
  demoVideoUrl: z.string().url("Please provide a valid URL").optional().or(z.literal("")).nullable(),
  isFeatured: z.boolean().default(false),
  category: z.enum(["WEB_DEV", "NETWORKING", "CLOUD_DEVOPS", "CYBER_SEC", "DATA_SCIENCE"]).default("WEB_DEV"),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("PUBLISHED"),
  role: z.string().optional().nullable(),
  teamSize: z.string().optional().nullable(),
  completionDate: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().min(2, "Skill name must be at least 2 characters"),
  category: z.enum(["FRONTEND", "BACKEND", "NETWORKING", "TOOLS_DEVOPS", "DATA_AI"]).default("FRONTEND"),
  proficiency: z.number().min(1).max(100).default(85),
  icon: z.string().optional().nullable(),
  yearsOfExp: z.string().optional().nullable(),
  isTopSkill: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const experienceSchema = z.object({
  title: z.string().min(2, "Title is required"),
  organization: z.string().min(2, "Organization / Institution is required"),
  location: z.string().optional().nullable(),
  period: z.string().min(2, "Period (e.g. 2023 - Present) is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["CAREER", "ACADEMIC", "CERTIFICATION"]).default("CAREER"),
  skills: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export const certificateSchema = z.object({
  title: z.string().min(2, "Certificate title is required"),
  issuer: z.string().min(2, "Issuing organization is required"),
  issueDate: z.string().min(2, "Issue date is required"),
  expiryDate: z.string().optional().nullable(),
  credentialUrl: z.string().url("Valid URL required").optional().or(z.literal("")).nullable(),
  credentialId: z.string().optional().nullable(),
  imageUrl: z.string().url("Valid image URL required").optional().or(z.literal("")).nullable(),
  category: z.enum(["TECH", "NETWORKING", "CLOUD", "DATA_AI"]).default("TECH"),
  isFeatured: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(20, "Markdown content must be at least 20 characters"),
  coverImage: z.string().url("Valid image URL required").optional().or(z.literal("")).nullable(),
  category: z.enum(["ENGINEERING", "NETWORKING", "CLOUD_DEVOPS", "WEB_DEV", "THOUGHTS"]).default("ENGINEERING"),
  tags: z.string().default("[]"),
  readingTime: z.string().default("5 min read"),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const testimonialSchema = z.object({
  authorName: z.string().min(2, "Author name is required"),
  authorTitle: z.string().min(2, "Author title / position is required"),
  authorCompany: z.string().min(2, "Company / Department is required"),
  authorAvatar: z.string().url("Valid image URL required").optional().or(z.literal("")).nullable(),
  quote: z.string().min(10, "Testimonial quote must be at least 10 characters"),
  rating: z.number().min(1).max(5).default(5),
  isApproved: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const siteSettingsSchema = z.object({
  siteTitle: z.string().min(3, "Site title is required"),
  heroGreeting: z.string().min(1, "Hero greeting is required"),
  heroTagline: z.string().min(5, "Hero tagline is required"),
  heroDescription: z.string().min(10, "Hero description is required"),
  aboutText: z.string().min(20, "About text is required"),
  statusBadgeText: z.string().optional().nullable(),
  availableForWork: z.boolean().default(true),
  resumeLink: z.string().optional().nullable(),
  githubUrl: z.string().url("Valid URL required").optional().nullable().or(z.literal("")),
  linkedinUrl: z.string().url("Valid URL required").optional().nullable().or(z.literal("")),
  twitterUrl: z.string().url("Valid URL required").optional().nullable().or(z.literal("")),
  contactEmail: z.string().email("Valid email required").optional().nullable().or(z.literal("")),
  dynamicBrandingTags: z.string().min(1, "Branding tags are required"),
  footerText: z.string().optional().nullable(),
  metaImage: z.string().optional().nullable(),
  particlesEnabled: z.boolean().default(true),
  blogEnabled: z.boolean().default(true),
  commandPaletteEnabled: z.boolean().default(true),
});

export const subscriberSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  name: z.string().optional().nullable(),
});
