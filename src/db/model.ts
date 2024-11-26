import pool from './db';

// The basic structure of a model's types
interface Types {
  [key: string]: any;
}

export abstract class BaseModel<T extends Types> {
  public table: string;

  constructor(table: string) {
    this.table = table;
  }

  async getAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.table}`;
    const { rows } = await pool.query(query);
    return rows as T[];
  }
}