import express from 'express';
import {listarCargos} from '../controllers/cargosController.js';
import { validateData } from "../middlewares/validateData.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get('/listarCargos', 
    asyncHandler(listarCargos)
);

export default router;