import { DataSource } from 'typeorm';
import path from 'path';
import { fileURLToPath } from 'url';
import { UsuarioSchema } from '../entities/Usuario.js';
import { CargoSchema } from '../entities/Cargo.js';
import { TicketSchema } from '../entities/Ticket.js';
import { ServicoSchema } from '../entities/Servico.js';
import { DemandaSchema } from '../entities/Demanda.js';
import { StatusSchema } from '../entities/Status.js';
import { StatusNomeSchema } from '../entities/StatusNome.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: path.join(__dirname, 'database.db'),
  synchronize: true,
  logging: false,
  entities: [
    UsuarioSchema,
    CargoSchema,
    TicketSchema,
    ServicoSchema,
    DemandaSchema,
    StatusSchema,
    StatusNomeSchema
  ]
});
