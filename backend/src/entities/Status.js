import { EntitySchema } from 'typeorm';

export const StatusSchema = new EntitySchema({
  name: 'Status',
  tableName: 'status',
  columns: {
    ticketId: {
      primary: true,
      type: 'integer',
      nullable: false,
      name: 'ticket_id'
    },
    statusNomeId: {
      type: 'integer',
      nullable: false,
      name: 'status_nome_id'
    },
    data: {
      primary: true,
      type: 'text',
      nullable: true,
      default: () => "datetime('now')"
    }
  },
  relations: {
    statusNome: {
      target: 'StatusNome',
      type: 'many-to-one',
      joinColumn: {
        name: 'status_nome_id'
      },
      eager: false
    },
    ticket: {
      target: 'Ticket',
      type: 'many-to-one',
      joinColumn: {
        name: 'ticket_id'
      },
      eager: false
    }
  }
});
