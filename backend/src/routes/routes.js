import express from 'express';
import usuarioRoutes from './usuario.js';
import constantesRoutes from './constantes.js';
import ticketRoutes from './ticket.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Sistema inicializado com Sucesso!' });
});

router.use('/usuarios', usuarioRoutes);
router.use('/cargos', constantesRoutes);
router.use('/servicos', constantesRoutes);
router.use('/status', constantesRoutes);
router.use('/tickets', ticketRoutes);

export default router;
