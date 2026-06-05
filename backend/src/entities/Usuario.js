import { EntitySchema } from 'typeorm';

export const UsuarioSchema = new EntitySchema({
  name: 'Usuario',
  tableName: 'usuario',
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
    },
    email: {
      type: 'varchar',
      length: 80,
      nullable: false,
      unique: true
    },
    telefone: {
      type: 'varchar',
      length: 11,
      nullable: false,
      unique: false
    },
    senha: {
      type: 'varchar',
      nullable: false
    },
    idCargo: {
      type: 'integer',
      nullable: false,
      name: 'id_cargo'
    },
    ativo: {
      type: 'boolean',
      nullable: false,
      default: true
    }
  },
  relations: {
    cargo: {
      target: 'Cargo',
      type: 'many-to-one',
      joinColumn: {
        name: 'id_cargo'
      },
      eager: false
    }
  }
});
