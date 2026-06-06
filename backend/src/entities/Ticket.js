import { EntitySchema } from 'typeorm';

export const TicketSchema = new EntitySchema({
  name: 'Ticket',
  tableName: 'ticket',
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: true
    },
    serial: {
      type: 'text',
      length: 9,
      unique: true,
      nullable: false
    },
    titulo: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    prioridade: {
      type: 'varchar',
      enum: ['Baixa', 'Media', 'Alta', 'Critica'],
      nullable: false
    },
    descricao: {
      type: 'text',
      nullable: true
    },
    idServico: {
      type: 'integer',
      nullable: false,
      name: 'id_servico'
    }
  },
  relations: {
    status: {
      target: 'Status',
      type: 'one-to-many',
      inverseSide: 'ticket',
      eager: false
    },
    servico: {
      target: 'Servico',
      type: 'many-to-one',
      joinColumn: {
        name: 'id_servico'
      },
      eager: false
    },
    demanda: {
      target: 'Demanda',
      type: 'one-to-one',
      inverseSide: 'ticket',
      eager: false
    }
  }
});