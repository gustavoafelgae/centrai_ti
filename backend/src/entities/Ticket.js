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
    titulo: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    prioridade: {
      type: 'integer',
      nullable: true
    },
    descricao: {
      type: 'text',
      nullable: true
    },
    idStatus: {
      type: 'integer',
      nullable: true,
      name: 'id_status'
    },
    idServico: {
      type: 'integer',
      nullable: true,
      name: 'id_servico'
    }
  },
  relations: {
    status: {
      target: 'Status',
      type: 'one-to-many',
      joinColumn: {
        name: 'id_status'
      },
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
