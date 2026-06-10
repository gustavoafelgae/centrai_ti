import express from 'express';
import { initDatabase } from './src/config/database.js';
import routes from './src/routes/routes.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { cargoRepository } from './src/repository/CargoRepository.js';
import { statusNomeRepository } from './src/repository/StatusNomeRepository.js';
import { servicoRepository } from './src/repository/ServicoRepository.js';

const app = express();
const PORT = process.env.PORT || 3000;
const IP_LINK = process.env.IP_LINK || '192.168.1.247'

app.use(express.json());

async function start() {
  await initDatabase();

  await cargoRepository.insertCargosPadrao();
  await statusNomeRepository.insertStatusNomePadrao();
  await servicoRepository.insertServicosPadrao();

  app.use(routes);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port http://${IP_LINK}:${PORT}`);
  });
}

start();

