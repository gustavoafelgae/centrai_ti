import express from 'express';
import usuarioRoutes from './usuario.js';
import cargosRoutes from './cargos.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Sistema inicializado com Sucesso!' });
});

router.use('/usuarios', usuarioRoutes);
router.use('/cargos', cargosRoutes);

export default router;
