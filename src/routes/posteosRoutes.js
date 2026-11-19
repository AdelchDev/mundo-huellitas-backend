
import express from "express";

import {
    createPosteoController,
    getPosteosController,
    getPosteoByIdController,
    getMisPosteosController,
    updatePosteoController,
    deletePosteoController
} from "../controller/posteosController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRefugio } from "../middleware/requireRefugio.js";

const router = express.Router();

// Consultas públicas
router.get("/", getPosteosController);

// Consultar posteos del refugio autenticado
router.get(
    "/mis-posteos",
    authMiddleware,
    requireRefugio,
    getMisPosteosController
);

// Consultar un posteo específico
router.get("/:id", getPosteoByIdController);

// Operaciones exclusivas de refugios
router.post(
    "/",
    authMiddleware,
    requireRefugio,
    createPosteoController
);

router.put(
    "/:id",
    authMiddleware,
    requireRefugio,
    updatePosteoController
);

router.delete(
    "/:id",
    authMiddleware,
    requireRefugio,
    deletePosteoController
);

export default router;
