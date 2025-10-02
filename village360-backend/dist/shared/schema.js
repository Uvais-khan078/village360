import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, timestamp, int, decimal, mysqlEnum } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export const users = mysqlTable("users", {
    id: varchar("id", { length: 36 }).primaryKey(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    role: mysqlEnum("role", ["admin", "district_officer", "block_officer", "public_viewer"]).notNull().default("public_viewer"),
    district: text("district"),
    block: text("block"),
    createdAt: timestamp("created_at").defaultNow(),
});
export const villages = mysqlTable("villages", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: text("name").notNull(),
    district: text("district").notNull(),
    block: text("block").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
    longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
    population: int("population"),
    createdAt: timestamp("created_at").defaultNow(),
});
export const projects = mysqlTable("projects", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql `(UUID())`),
    villageId: varchar("village_id", { length: 36 }).notNull().references(() => villages.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: mysqlEnum("status", ["planning", "ongoing", "completed", "delayed", "cancelled"]).notNull().default("planning"),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    budget: decimal("budget", { precision: 12, scale: 2 }),
    progress: int("progress").default(0),
    createdBy: varchar("created_by", { length: 36 }).notNull().references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
export const reports = mysqlTable("reports", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql `(UUID())`),
    projectId: varchar("project_id", { length: 36 }).references(() => projects.id),
    reportType: mysqlEnum("report_type", ["progress", "completion", "gap_analysis", "monthly"]).notNull(),
    title: text("title").notNull(),
    content: text("content"),
    fileUrl: text("file_url"),
    createdBy: varchar("created_by", { length: 36 }).notNull().references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
});
export const amenities = mysqlTable("amenities", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql `(UUID())`),
    villageId: varchar("village_id", { length: 36 }).notNull().references(() => villages.id),
    amenityType: text("amenity_type").notNull(), // education, water, healthcare, electricity, roads
    available: int("available").default(0),
    required: int("required").default(0),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Relations
export const usersRelations = relations(users, ({ many }) => ({
    projects: many(projects),
    reports: many(reports),
}));
export const villagesRelations = relations(villages, ({ many }) => ({
    projects: many(projects),
    amenities: many(amenities),
}));
export const projectsRelations = relations(projects, ({ one, many }) => ({
    village: one(villages, {
        fields: [projects.villageId],
        references: [villages.id],
    }),
    createdBy: one(users, {
        fields: [projects.createdBy],
        references: [users.id],
    }),
    reports: many(reports),
}));
export const reportsRelations = relations(reports, ({ one }) => ({
    project: one(projects, {
        fields: [reports.projectId],
        references: [projects.id],
    }),
    createdBy: one(users, {
        fields: [reports.createdBy],
        references: [users.id],
    }),
}));
export const amenitiesRelations = relations(amenities, ({ one }) => ({
    village: one(villages, {
        fields: [amenities.villageId],
        references: [villages.id],
    }),
}));
// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true,
});
export const insertVillageSchema = createInsertSchema(villages).omit({
    id: true,
    createdAt: true,
});
export const insertProjectSchema = createInsertSchema(projects).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export const insertReportSchema = createInsertSchema(reports).omit({
    id: true,
    createdAt: true,
});
export const insertAmenitySchema = createInsertSchema(amenities).omit({
    id: true,
    updatedAt: true,
});
// Auth schemas
export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});
export const registerSchema = insertUserSchema.extend({
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
