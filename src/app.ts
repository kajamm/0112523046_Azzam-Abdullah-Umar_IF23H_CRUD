import express, { Request, Response } from "express";
import cors from "cors";
import mahasiswaRoutes from "./routes/mahasiswa.route";
import mahasiswaDbRoutes from "./routes/mahasiswa-db.route";

const app = express();

// CORS disiapkan untuk frontend Next.js (Modul lanjutan, port 3001)
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// Middleware logging sederhana (Pertemuan 2)
app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ===== Endpoint dasar (Pertemuan 1) =====
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "API Express CRUD berjalan",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    service: "Express CRUD API",
  });
});

app.get("/profile", (req: Request, res: Response) => {
  res.json({
    nama: "Nama Mahasiswa",
    peran: "Backend Developer (Latihan)",
  });
});

app.get("/about", (req: Request, res: Response) => {
  res.json({
    tentang:
      "API ini dibuat untuk latihan Express.js, TypeScript, dan MySQL manual tanpa ORM.",
  });
});

// ===== Routes CRUD =====
// Versi array (data sementara, Pertemuan 2)
app.use("/api/mahasiswa", mahasiswaRoutes);

// Versi database MySQL (Pertemuan 3)
app.use("/api/db/mahasiswa", mahasiswaDbRoutes);

export default app;