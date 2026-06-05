import { EntitySchema } from 'typeorm';

export const StatusNomeSchema = new EntitySchema({
  name: 'StatusNome',
  tableName: 'status_nome',
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: true
    },
    nome: {
      type: 'varchar',
      length: 255,
      nullable: false
    }
  },
  relations: {
    statuses: {
      target: 'Status',
      type: 'one-to-many',
      inverseSide: 'statusNome',
      eager: false
    }
  }
});
