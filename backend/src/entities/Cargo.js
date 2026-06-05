import { EntitySchema } from 'typeorm';

export const CargoSchema = new EntitySchema({
  name: 'Cargo',
  tableName: 'cargo',
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
    usuarios: {
      target: 'Usuario',
      type: 'one-to-many',
      inverseSide: 'cargo',
      eager: false
    },
    servicos: {
      target: 'Servico',
      type: 'one-to-many',
      inverseSide: 'cargo',
      eager: false
    }
  }
});
