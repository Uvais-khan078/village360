import { createServer } from "http";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { db } from "./db";
import { storage } from "./storage";
import { loginSchema, registerSchema, insertProjectSchema, insertVillageSchema, insertReportSchema, insertAmenitySchema } from "../shared/schema";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await storage.getUser(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        next();
    };
};
export async function registerRoutes(app) {
    // Authentication routes
    app.post("/api/auth/register", async (req, res) => {
        try {
            const validatedData = registerSchema.parse(req.body);
            const { confirmPassword, ...userData } = validatedData;
            // Check if user already exists
            const existingUser = await storage.getUserByUsername(userData.username);
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }
            const existingEmail = await storage.getUserByEmail(userData.email);
            if (existingEmail) {
                return res.status(400).json({ message: "Email already exists" });
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await storage.createUser({
                ...userData,
                password: hashedPassword,
            });
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
            res.json({
                token,
                user: { id: user.id, username: user.username, email: user.email, role: user.role }
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message || "Registration failed" });
        }
    });
    // Database connectivity check route
    app.get("/db-check", async (_req, res) => {
        try {
            await db.execute(sql `SELECT 1`);
            res.json({ db: "ok" });
        }
        catch (error) {
            res.status(500).json({ message: "Database connection failed", error: error.message });
        }
    });
    app.post("/api/auth/login", async (req, res) => {
        try {
            const { username, password } = loginSchema.parse(req.body);
            const user = await storage.getUserByUsername(username);
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
            res.json({
                token,
                user: { id: user.id, username: user.username, email: user.email, role: user.role }
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message || "Login failed" });
        }
    });
    app.get("/api/auth/me", authenticateToken, (req, res) => {
        const { password, ...userWithoutPassword } = req.user;
        res.json(userWithoutPassword);
    });
    // Dashboard routes
    app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
        try {
            const stats = await storage.getDashboardStats();
            res.json(stats);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    // Admin users route
    app.get("/api/admin/users", authenticateToken, requireRole(['admin']), async (req, res) => {
        try {
            const users = await storage.getAllUsers();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    // Village routes
    app.get("/api/villages", authenticateToken, async (req, res) => {
        try {
            const villages = await storage.getVillages();
            res.json(villages);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    app.get("/api/villages/:id", authenticateToken, async (req, res) => {
        try {
            const village = await storage.getVillageWithAmenities(req.params.id);
            if (!village) {
                return res.status(404).json({ message: "Village not found" });
            }
            res.json(village);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    app.post("/api/villages", authenticateToken, requireRole(['admin', 'district_officer']), async (req, res) => {
        try {
            const villageData = insertVillageSchema.parse(req.body);
            const village = await storage.createVillage(villageData);
            res.status(201).json(village);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
    // Project routes
    app.get("/api/projects", authenticateToken, async (req, res) => {
        try {
            const projects = await storage.getProjects();
            res.json(projects);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    app.get("/api/projects/:id", authenticateToken, async (req, res) => {
        try {
            const project = await storage.getProject(req.params.id);
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
            res.json(project);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    app.post("/api/projects", authenticateToken, requireRole(['admin', 'district_officer', 'block_officer']), async (req, res) => {
        try {
            const projectData = insertProjectSchema.parse({
                ...req.body,
                createdBy: req.user.id,
            });
            const project = await storage.createProject(projectData);
            res.status(201).json(project);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
    app.put("/api/projects/:id", authenticateToken, requireRole(['admin', 'district_officer', 'block_officer']), async (req, res) => {
        try {
            const projectData = insertProjectSchema.partial().parse(req.body);
            const project = await storage.updateProject(req.params.id, projectData);
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
            res.json(project);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
    app.delete("/api/projects/:id", authenticateToken, requireRole(['admin', 'district_officer']), async (req, res) => {
        try {
            const deleted = await storage.deleteProject(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: "Project not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    // Report routes
    app.get("/api/reports", authenticateToken, async (req, res) => {
        try {
            const reports = await storage.getReports();
            res.json(reports);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    app.post("/api/reports", authenticateToken, requireRole(['admin', 'district_officer', 'block_officer']), async (req, res) => {
        try {
            const reportData = insertReportSchema.parse({
                ...req.body,
                createdBy: req.user.id,
            });
            const report = await storage.createReport(reportData);
            res.status(201).json(report);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
    // Amenity routes
    app.get("/api/villages/:villageId/amenities", authenticateToken, async (req, res) => {
        try {
            const amenities = await storage.getAmenitiesByVillage(req.params.villageId);
            res.json(amenities);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    app.put("/api/amenities", authenticateToken, requireRole(['admin', 'district_officer', 'block_officer']), async (req, res) => {
        try {
            const amenityData = insertAmenitySchema.parse(req.body);
            const amenity = await storage.updateAmenity(amenityData);
            res.json(amenity);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
    const httpServer = createServer(app);
    return httpServer;
}
