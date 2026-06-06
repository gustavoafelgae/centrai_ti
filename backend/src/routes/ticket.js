import express from 'express';
import { asyncHandler } from "../utils/asyncHandler.js";
import { criarTicket,consultarTicket,atualizarTicket,consultarTicketByServico } from '../controllers/ticketController.js';
import { validateData } from '../middlewares/validateData.js';
import { criarTicketDTO,atualizarTicketDTO } from '../validations/ticketSchema.js';

const router = express.Router();

router.post('/criar', 
    validateData(criarTicketDTO),
    asyncHandler(criarTicket)
);

router.get('/:serial', 
    asyncHandler(consultarTicket)
);

router.get('/servico/:idServico', 
    asyncHandler(consultarTicketByServico)
);


router.patch('/atualizar/:serial', 
    validateData(atualizarTicketDTO),
    asyncHandler(atualizarTicket)
);

export default router;