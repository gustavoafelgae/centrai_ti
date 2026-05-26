import { getDb } from '../database/index.js';

export async function listUsers(req, res) {
  try {
    const db = getDb();
    const users = await db.all('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createUser(req, res) {
  try {
    const { fullName, email, password, userType, status } = req.body;
    const statusValue = status !== undefined ? Number(status) : 1;

    if (!fullName || !email || !password || !userType) {
      return res.status(400).json({
        error: 'Os campos fullName, email, password e userType são obrigatórios.'
      });
    }

    if (!['A', 'P'].includes(userType)) {
      return res.status(400).json({
        error: "O campo userType deve ser 'A' (admin) ou 'P' (padrão)."
      });
    }

    if (statusValue !== 1 && statusValue !== 2) {
      return res.status(400).json({
        error: 'O campo status deve ser 1 (ativo) ou 2 (inativo).'
      });
    }

    const db = getDb();
    const result = await db.run(
      'INSERT INTO users (fullName, email, password, userType, status) VALUES (?, ?, ?, ?, ?)',
      fullName,
      email,
      password,
      userType,
      statusValue
    );

    const user = await db.get('SELECT * FROM users WHERE id = ?', result.lastID);

    return res.status(201).json({
      message: 'Usuário criado com sucesso.',
      user
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'O email já está em uso.' });
    }
    res.status(500).json({ error: error.message });
  }
}
