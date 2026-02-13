import { db } from "./db";
import { scans, reports, users, type User, type InsertUser, type Scan, type InsertScan, type Report } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Scans
  createScan(scan: InsertScan): Promise<Scan>;
  getScan(id: number): Promise<Scan | undefined>;
  getUserScans(userId: string): Promise<Scan[]>;
  
  // Reports
  createReport(report: { scanId: number; pdfUrl: string }): Promise<Report>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods (required for existing auth setup even if using replit auth integration primarily)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Replit auth uses email/id, this is a fallback/compat method
    // In replit auth schema, we don't have 'username' but 'email'
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Scan methods
  async createScan(scan: InsertScan): Promise<Scan> {
    const [newScan] = await db.insert(scans).values(scan).returning();
    return newScan;
  }

  async getScan(id: number): Promise<Scan | undefined> {
    const [scan] = await db.select().from(scans).where(eq(scans.id, id));
    return scan;
  }

  async getUserScans(userId: string): Promise<Scan[]> {
    return await db.select()
      .from(scans)
      .where(eq(scans.userId, userId))
      .orderBy(desc(scans.createdAt));
  }

  async createReport(report: { scanId: number; pdfUrl: string }): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }
}

export const storage = new DatabaseStorage();
