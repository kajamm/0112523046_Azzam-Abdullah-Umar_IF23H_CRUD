import { Router, Request, Response } from "express";
import db from "../config/database";

const router = Router();

// READ ALL (dari MySQL)
router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM mahasiswa ORDER BY id DESC"
    );

    res.json({
      message: "Data mahasiswa berhasil diambil dari database",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
});

// READ DETAIL (Latihan Pertemuan 3)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows]: any = await db.execute(
      "SELECT * FROM mahasiswa WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Mahasiswa tidak ditemukan",
      });
    }

    res.json({
      message: "Detail mahasiswa berhasil diambil",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
});

// CREATE (Latihan Pertemuan 3)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nim, nama, prodi, angkatan } = req.body;

    // Validasi input sederhana
    if (!nim || !nama || !prodi || !angkatan) {
      return res.status(400).json({
        message: "NIM, nama, prodi, dan angkatan wajib diisi",
      });
    }

    if (String(nama).trim().length < 3) {
      return res.status(400).json({
        message: "Nama minimal harus 3 karakter",
      });
    }

    const [result]: any = await db.execute(
      "INSERT INTO mahasiswa (nim, nama, prodi, angkatan) VALUES (?, ?, ?, ?)",
      [nim, nama, prodi, angkatan]
    );

    res.status(201).json({
      message: "Mahasiswa berhasil ditambahkan",
      data: {
        id: result.insertId,
        nim,
        nama,
        prodi,
        angkatan,
      },
    });
  } catch (error: any) {
    console.error(error);

    // Error duplikasi NIM (UNIQUE constraint di tabel)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "NIM sudah digunakan",
      });
    }

    res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
});

export default router;