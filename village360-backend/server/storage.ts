import crypto from 'crypto';
import {
  users,
  villages,
  projects,
  reports,
  amenities,
  type User,
  type InsertUser,
  type Village,
  type InsertVillage,
  type Project,
  type InsertProject,
  type ProjectWithDetails,
  type Report,
  type InsertReport,
  type Amenity,
  type InsertAmenity,
  type VillageWithAmenities,
  type DashboardStats,
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<boolean>;

  // Village methods
  getVillages(): Promise<Village[]>;
  getVillage(id: string): Promise<Village | undefined>;
  getVillageWithAmenities(id: string): Promise<VillageWithAmenities | undefined>;
  createVillage(village: InsertVillage): Promise<Village>;
  updateVillage(id: string, village: Partial<InsertVillage>): Promise<Village | undefined>;

  // Project methods
  getProjects(): Promise<ProjectWithDetails[]>;
  getProject(id: string): Promise<ProjectWithDetails | undefined>;
  getProjectsByVillage(villageId: string): Promise<ProjectWithDetails[]>;
  getProjectsByUser(userId: string): Promise<ProjectWithDetails[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Report methods
  getReports(): Promise<Report[]>;
  getReportsByProject(projectId: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;

  // Amenity methods
  getAmenitiesByVillage(villageId: string): Promise<Amenity[]>;
  updateAmenity(amenity: InsertAmenity): Promise<Amenity>;

  // Dashboard methods
  getDashboardStats(): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Check DB connection on initialization
    db.execute(sql`SELECT 1`).catch(() => {
      console.warn("Database connection failed.");
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error) {
      console.warn("Database query failed.");
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const userData = { ...insertUser, id };
    await db.insert(users).values(userData);
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  async getVillages(): Promise<Village[]> {
    return await db.select().from(villages).orderBy(villages.name);
  }

  async getVillage(id: string): Promise<Village | undefined> {
    const [village] = await db.select().from(villages).where(eq(villages.id, id));
    return village || undefined;
  }

  async getVillageWithAmenities(id: string): Promise<VillageWithAmenities | undefined> {
    const village = await this.getVillage(id);
    if (!village) return undefined;

    const villageAmenities = await this.getAmenitiesByVillage(id);
    return { ...village, amenities: villageAmenities };
  }

  async createVillage(village: InsertVillage): Promise<Village> {
    const id = crypto.randomUUID();
    const villageData = { ...village, id };
    await db.insert(villages).values(villageData);
    const [newVillage] = await db.select().from(villages).where(eq(villages.id, id));
    return newVillage;
  }

  async updateVillage(id: string, village: Partial<InsertVillage>): Promise<Village | undefined> {
    await db.update(villages).set(village).where(eq(villages.id, id));
    const [updatedVillage] = await db.select().from(villages).where(eq(villages.id, id));
    return updatedVillage || undefined;
  }

  async getProjects(): Promise<ProjectWithDetails[]> {
    return (await db
      .select({
        id: projects.id,
        villageId: projects.villageId,
        title: projects.title,
        description: projects.description,
        status: projects.status,
        startDate: projects.startDate,
        endDate: projects.endDate,
        budget: projects.budget,
        progress: projects.progress,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        village: villages,
        createdBy: {
          id: users.id,
          username: users.username,
        },
      })
      .from(projects)
      .leftJoin(villages, eq(projects.villageId, villages.id))
      .leftJoin(users, eq(projects.createdBy, users.id))
      .orderBy(desc(projects.createdAt))) as ProjectWithDetails[];
  }

  async getProject(id: string): Promise<ProjectWithDetails | undefined> {
    const [project] = await db
      .select({
        id: projects.id,
        villageId: projects.villageId,
        title: projects.title,
        description: projects.description,
        status: projects.status,
        startDate: projects.startDate,
        endDate: projects.endDate,
        budget: projects.budget,
        progress: projects.progress,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        village: villages,
        createdBy: {
          id: users.id,
          username: users.username,
        },
      })
      .from(projects)
      .leftJoin(villages, eq(projects.villageId, villages.id))
      .leftJoin(users, eq(projects.createdBy, users.id))
      .where(eq(projects.id, id));

    return (project as ProjectWithDetails) || undefined;
  }

  async getProjectsByVillage(villageId: string): Promise<ProjectWithDetails[]> {
    return (await db
      .select({
        id: projects.id,
        villageId: projects.villageId,
        title: projects.title,
        description: projects.description,
        status: projects.status,
        startDate: projects.startDate,
        endDate: projects.endDate,
        budget: projects.budget,
        progress: projects.progress,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        village: villages,
        createdBy: {
          id: users.id,
          username: users.username,
        },
      })
      .from(projects)
      .leftJoin(villages, eq(projects.villageId, villages.id))
      .leftJoin(users, eq(projects.createdBy, users.id))
      .where(eq(projects.villageId, villageId))
      .orderBy(desc(projects.createdAt))) as ProjectWithDetails[];
  }

  async getProjectsByUser(userId: string): Promise<ProjectWithDetails[]> {
    return (await db
      .select({
        id: projects.id,
        villageId: projects.villageId,
        title: projects.title,
        description: projects.description,
        status: projects.status,
        startDate: projects.startDate,
        endDate: projects.endDate,
        budget: projects.budget,
        progress: projects.progress,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        village: villages,
        createdBy: {
          id: users.id,
          username: users.username,
        },
      })
      .from(projects)
      .leftJoin(villages, eq(projects.villageId, villages.id))
      .leftJoin(users, eq(projects.createdBy, users.id))
      .where(eq(projects.createdBy, userId))
      .orderBy(desc(projects.createdAt))) as ProjectWithDetails[];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = crypto.randomUUID();
    const projectData = { ...project, id };
    await db.insert(projects).values(projectData);
    const [newProject] = await db.select().from(projects).where(eq(projects.id, id));
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    await db.update(projects).set({ ...project, updatedAt: new Date() }).where(eq(projects.id, id));
    const [updatedProject] = await db.select().from(projects).where(eq(projects.id, id));
    return updatedProject || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    await db.delete(projects).where(eq(projects.id, id));
    return true;
  }

  async getReports(): Promise<Report[]> {
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async getReportsByProject(projectId: string): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.projectId, projectId))
      .orderBy(desc(reports.createdAt));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const id = crypto.randomUUID();
    const reportData = { ...report, id };
    await db.insert(reports).values(reportData);
    const [newReport] = await db.select().from(reports).where(eq(reports.id, id));
    return newReport;
  }

  async getAmenitiesByVillage(villageId: string): Promise<Amenity[]> {
    return await db
      .select()
      .from(amenities)
      .where(eq(amenities.villageId, villageId));
  }

  async updateAmenity(amenity: InsertAmenity): Promise<Amenity> {
    await db.insert(amenities).values(amenity).onDuplicateKeyUpdate({
      set: {
        available: amenity.available,
        required: amenity.required,
        updatedAt: new Date(),
      },
    });
    const [updatedAmenity] = await db.select().from(amenities).where(and(eq(amenities.villageId, amenity.villageId), eq(amenities.amenityType, amenity.amenityType)));
    return updatedAmenity;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [villageStat] = await db.select({ count: count() }).from(villages);
    const [activeStat] = await db.select({ count: count() }).from(projects).where(eq(projects.status, 'ongoing'));
    const [completedStat] = await db.select({ count: count() }).from(projects).where(eq(projects.status, 'completed'));
    const [delayedStat] = await db.select({ count: count() }).from(projects).where(eq(projects.status, 'delayed'));

    return {
      totalVillages: villageStat.count,
      activeProjects: activeStat.count,
      completedProjects: completedStat.count,
      delayedProjects: delayedStat.count,
    };
  }
}

export const storage = new DatabaseStorage();
