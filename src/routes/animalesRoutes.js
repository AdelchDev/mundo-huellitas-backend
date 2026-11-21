import express from "express";

import {
    createAnimalController,
    getAnimalsController,
    getAnimalByIdController,
    getMisAnimalesController,
    updateAnimalController,
    deleteAnimalController
} from "../controller/animalesController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRefugio } from "../middleware/requireRefugio.js";

const router = express.Router();

router.get("/", getAnimalsController);

router.get("/mis-animales", authMiddleware, requireRefugio, getMisAnimalesController);

router.get("/:id", getAnimalByIdController);

router.post("/", authMiddleware, requireRefugio, createAnimalController);

router.put("/:id", authMiddleware, requireRefugio, updateAnimalController);

router.delete("/:id", authMiddleware, requireRefugio, deleteAnimalController);

export default router;
