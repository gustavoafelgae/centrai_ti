import express from 'express';
import { initDatabase } from './src/database/index.js';
import routes from './src/routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function start() {
  await initDatabase();

  app.use(routes);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();

