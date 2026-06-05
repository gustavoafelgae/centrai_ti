import path from 'path';
import { fileURLToPath } from 'url';
import { AppDataSource } from './dataSource.js';

export async function initDatabase() {
  try {
    // Inicializar a conexão com TypeORM
    await AppDataSource.initialize();
    console.log('✓ Database initialized successfully with TypeORM');

    // Sincronizar as entidades com o banco de dados
    if (AppDataSource.isInitialized) {
      console.log('✓ Database entities synchronized');
    }


    return AppDataSource;
  } catch (error) {
    console.error('✗ Error initializing database:', error);
    throw error;
  }
}

export function getDb() {
  if (!AppDataSource.isInitialized) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return AppDataSource;
}