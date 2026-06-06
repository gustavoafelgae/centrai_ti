import { getDb } from '../config/database.js';

export class ServicoRepository {
  async insertServicosPadrao() {
    const repository = getDb().getRepository('Servico');
    
    const servicoCheck = await repository.find();
    
    if (servicoCheck.length === 0) {
      console.log('... Populando Servicos iniciais ...');
      const servicos = [
        { servico: 'Suporte Tecnico', cargoId: 1 },
        { servico: 'Email Coporativo', cargoId: 1 },
        { servico: 'Segurança Cibernetica', cargoId: 2 },
        { servico: 'Backup e recover', cargoId: 2 },
        { servico: 'Infraestrutura de rede', cargoId: 3 },
        { servico: 'Manutenção de servidor', cargoId: 3 },
        { servico: 'Cloud Computing', cargoId: 4 },
        { servico: 'Gestão de banco de dados', cargoId: 4 }
      ];

      for (const servico of servicos) {
        await repository.insert(servico);
      }

      console.log('✔ Tabela Servico populada com sucesso!');
    }
  }

  async findById(id) {
    const repository = getDb().getRepository('Servico');
    return repository.findOne({ 
      where: { id },
      relations: ['cargo', 'tickets']
    });
  }

  async findAll() {
    const repository = getDb().getRepository('Servico');
    return repository.find({
      relations: ['cargo', 'tickets']
    });
  }

  async create(servico) {
    const repository = getDb().getRepository('Servico');
    return repository.save(servico);
  }

  async update(id, servico) {
    const repository = getDb().getRepository('Servico');
    await repository.update(id, servico);
    return this.findById(id);
  }

  async delete(id) {
    const repository = getDb().getRepository('Servico');
    return repository.delete(id);
  }

  async obterTicketsDoServico(id) {
    const repository = getDb().getRepository('Servico');
    const servico = await repository.findOne({
      where: { id },
      relations: ['tickets']
    });
    return servico ? servico.tickets : [];
  }
}

export const servicoRepository = new ServicoRepository();
