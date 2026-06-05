import express from 'express';
import usuarioRoutes from './usuario.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Sistema inicializado com Sucesso!' });
});

router.use('/usuarios', usuarioRoutes);

export default router;
