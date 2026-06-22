import { Router, Request, Response } from "express";
import { mahasiswa, Mahasiswa } from "../data/mahasiswa.data";

const router = Router();

// READ ALL
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Data mahasiswa berhasil diambil",
    data: mahasiswa,
  });
});

// SEARCH BY KEYWORD (Latihan Pertemuan 2)
// Diletakkan SEBELUM route /:id agar "search" tidak dianggap sebagai id
router.get("/search/:keyword", (req: Request, res: Response) => {
  const { keyword } = req.params;

  const hasil = mahasiswa.filter((item) =>
    item.nama.toLowerCase().includes(keyword.toLowerCase())
  );

  res.json({
    message: `Hasil pencarian untuk "${keyword}"`,
    data: hasil,
  });
});

// READ DETAIL
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = mahasiswa.find((item) => item.id === id);

  if (!data) {
    return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
  }

  res.json({
    message: "Detail mahasiswa berhasil diambil",
    data,
  });
});

// CREATE
router.post("/", (req: Request, res: Response) => {
  const { nim, nama, prodi, angkatan } = req.body;

  if (!nim || !nama || !prodi || !angkatan) {
    return res.status(400).json({
      message: "NIM, nama, prodi, dan angkatan wajib diisi",
    });
  }

  // Validasi nama minimal 3 karakter (Latihan Pertemuan 2)
  if (String(nama).trim().length < 3) {
    return res.status(400).json({
      message: "Nama minimal harus 3 karakter",
    });
  }

  // Cek NIM tidak boleh duplikat (Latihan Pertemuan 2)
  const nimSudahAda = mahasiswa.some((item) => item.nim === nim);
  if (nimSudahAda) {
    return res.status(400).json({
      message: "NIM sudah digunakan, gunakan NIM lain",
    });
  }

  const newMahasiswa: Mahasiswa = {
    id: mahasiswa.length + 1,
    nim,
    nama,
    prodi,
    angkatan: Number(angkatan),
  };

  mahasiswa.push(newMahasiswa);

  res.status(201).json({
    message: "Mahasiswa berhasil ditambahkan",
    data: newMahasiswa,
  });
});

// UPDATE
router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nim, nama, prodi, angkatan } = req.body;

  const index = mahasiswa.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
  }

  if (nama && String(nama).trim().length < 3) {
    return res.status(400).json({
      message: "Nama minimal harus 3 karakter",
    });
  }

  // Cek NIM duplikat terhadap mahasiswa LAIN (selain dirinya sendiri)
  const nimDipakaiOrangLain = mahasiswa.some(
    (item) => item.nim === nim && item.id !== id
  );
  if (nimDipakaiOrangLain) {
    return res.status(400).json({
      message: "NIM sudah digunakan oleh mahasiswa lain",
    });
  }

  mahasiswa[index] = {
    id,
    nim,
    nama,
    prodi,
    angkatan: Number(angkatan),
  };

  res.json({
    message: "Mahasiswa berhasil diperbarui",
    data: mahasiswa[index],
  });
});

// DELETE
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = mahasiswa.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
  }

  const deletedData = mahasiswa.splice(index, 1);

  res.json({
    message: "Mahasiswa berhasil dihapus",
    data: deletedData[0],
  });
});

export default router;