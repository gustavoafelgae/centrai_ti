import { EntitySchema } from 'typeorm';

export const ServicoSchema = new EntitySchema({
  name: 'Servico',
  tableName: 'servico',
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: true
    },
    servico: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    cargoId: {
      type: 'integer',
      nullable: true,
      name: 'cargo_id'
    }
  },
  relations: {
    cargo: {
      target: 'Cargo',
      type: 'many-to-one',
      joinColumn: {
        name: 'cargo_id'
      },
      eager: false
    },
    tickets: {
      target: 'Ticket',
      type: 'one-to-many',
      inverseSide: 'servico',
      eager: false
    }
  }
});
