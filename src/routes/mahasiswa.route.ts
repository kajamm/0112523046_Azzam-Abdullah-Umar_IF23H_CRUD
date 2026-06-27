import { Router } from "express";
import {
  getAllMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controller/mahasiswa.controller";
import { uploadFotoMahasiswa } from "../middleware/upload.middleware";

const router = Router();

router.get("/", getAllMahasiswa);
router.post("/", uploadFotoMahasiswa.single("foto"), createMahasiswa);
router.put("/:id", uploadFotoMahasiswa.single("foto"), updateMahasiswa);
router.delete("/:id", deleteMahasiswa);

export default router;