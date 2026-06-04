export async function rodarInsertsIniciais(db) {
  try {
    // 1. Popula a tabela Servico apenas se ela estiver vazia
    const servicoCheck = await db.get("SELECT COUNT(*) as count FROM Servico");
    if (servicoCheck.count === 0) {
      await db.run(`
        INSERT INTO Servico (Servico, Cargo_Id) VALUES
        ('Suporte Tecnico', 1),
        ('Email Coporativo', 1),
        ('Segurança Cibernetica', 2),
        ('Backup e recover', 2),
        ('Infraestrutura de rede', 3),
        ('manutenção de servidor', 3),
        ('Cloud Computing', 4),
        ('Gestão de banco de dados', 4)
      `);
      console.log('✔ Tabela Servico populada com sucesso!');
    }

    const cargoCheck = await db.get("SELECT COUNT(*) as count FROM Cargo");
    if (cargoCheck.count === 0) {
      await db.run(`
        INSERT INTO Cargo (Id, Nome) VALUES
        (1, 'Auxiliar de Suporte'),
        (2, 'Analista de Segurança'),
        (3, 'tecnico de infra'),
        (4, 'Arquiteto Cloud')
      `);
      console.log('✔ Tabela Cargo populada com sucesso!');
    }

    // 2. Popula a tabela Status_Nome apenas se ela estiver vazia
    const statusCheck = await db.get("SELECT COUNT(*) as count FROM Status_Nome");
    if (statusCheck.count === 0) {
      await db.run(`
        INSERT INTO Status_Nome (Nome) VALUES
        ('Aberto'),
        ('Em Andamento'),
        ('Finalizado'),
        ('Cancelado')
      `);
      console.log('✔ Tabela Status_Nome populada com sucesso!');
    }

  } catch (error) {
    console.error('Erro ao rodar os inserts iniciais:', error);
  }
}