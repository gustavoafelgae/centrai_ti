import { EntitySchema } from 'typeorm';

export const DemandaSchema = new EntitySchema({
  name: 'Demanda',
  tableName: 'demanda',
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: true
    },
    idUsuarioCreated: {
      type: 'integer',
      nullable: false,
      name: 'id_usuario_created'
    },
    idUsuarioResolved: {
      type: 'integer',
      nullable: true,
      name: 'id_usuario_resolved'
    },
    idTicket: {
      type: 'integer',
      nullable: true,
      name: 'id_ticket',
      unique: true
    }
  },
  relations: {
    ticket: {
      target: 'Ticket',
      type: 'one-to-one',
      joinColumn: {
        name: 'id_ticket'
      },
      eager: false
    }
  }
});
