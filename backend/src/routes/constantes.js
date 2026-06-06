import express from 'express';
import {listarCargos} from '../controllers/constantesController.js';
import {listarServicos} from '../controllers/constantesController.js';
import {listarStatus} from '../controllers/constantesController.js';
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get('/listarCargos', 
    asyncHandler(listarCargos)
);

router.get('/listarServicos', 
    asyncHandler(listarServicos)
);

router.get('/listarStatusNomes', 
    asyncHandler(listarStatus)
);

export default router;