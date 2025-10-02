import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { registerRoutes } from "./routes.js";
dotenv.config({ path: path.join(process.cwd(), ".env") });
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});
await registerRoutes(app);
// Error handling middleware
app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
});
// Export the app for Vercel serverless deployment
export default app;
