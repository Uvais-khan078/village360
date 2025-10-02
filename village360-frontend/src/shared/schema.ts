import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.string().optional(),
  district: z.string().optional(),
  block: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

// Added missing schemas and types to fix build errors

export const insertProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  villageId: z.string().min(1),
  status: z.enum(["planning", "ongoing", "completed", "delayed"]),
  budget: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  createdBy: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.string(),
  district: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

export const projectSchema = insertProjectSchema.extend({
  id: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export const villageSchema = z.object({
  id: z.string(),
  name: z.string(),
  district: z.string(),
  block: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  amenities: z.array(z.any()).optional(),
});

export type Village = z.infer<typeof villageSchema>;

export const reportSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  reportType: z.string().optional(),
});

export type Report = z.infer<typeof reportSchema>;

export const dashboardStatsSchema = z.object({
  totalProjects: z.number(),
  completedProjects: z.number(),
  ongoingProjects: z.number(),
  delayedProjects: z.number(),
  totalVillages: z.number().optional(),
  activeProjects: z.number().optional(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

export const insertVillageSchema = villageSchema.omit({ id: true });
export type InsertVillage = z.infer<typeof insertVillageSchema>;

export const insertReportSchema = reportSchema.omit({ id: true });
export type InsertReport = z.infer<typeof insertReportSchema>;

export const projectWithDetailsSchema = projectSchema.extend({
  village: villageSchema,
  createdByUser: userSchema,
});

export type ProjectWithDetails = z.infer<typeof projectWithDetailsSchema>;
