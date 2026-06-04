import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { rodarInsertsIniciais } from './insertData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export async function initDatabase() {
  db = await open({
    filename: path.join(__dirname, 'database.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Usuario (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Nome TEXT NOT NULL,
      Email TEXT NOT NULL UNIQUE,
      Senha TEXT NOT NULL,
      Cargo INTEGER,
      Ativo BOOLEAN NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS Cargo (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Nome TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Ticket (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Titulo TEXT NOT NULL,
      Prioridade INTEGER,
      Descricao TEXT,
      Status INTEGER,
      Id_Servico INTEGER
    );

    CREATE TABLE IF NOT EXISTS Servico (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Servico TEXT NOT NULL,
      Cargo_Id INTEGER
    );

    CREATE TABLE IF NOT EXISTS Demanda (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Id_Usuario_created INTEGER NOT NULL,
      Id_Usuario_master INTEGER
    );

    CREATE TABLE IF NOT EXISTS Status (
      Ticket_Id INTEGER PRIMARY KEY,
      Status_Id INTEGER NOT NULL,
      Data TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS Status_Nome (
      Status_Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Nome TEXT NOT NULL
    );
  `);

  await rodarInsertsIniciais(db);

  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}