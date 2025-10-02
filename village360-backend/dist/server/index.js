import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});
registerRoutes(app).then(() => {
    // Error handling middleware
    app.use((err, _req, res, _next) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
    });
    const port = parseInt(process.env.PORT || "3000", 10);
    app.listen(port, () => {
        console.log(`Backend running on port ${port}`);
    });
});
