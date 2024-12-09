// path : sijarta-fe/src/db/types/model.ts

import pool from './db';
import { Converter } from './types/_convert';
import { Types } from './types/_types';

export abstract class BaseModel<T extends Types> {
  public table: string;
  public converter: typeof Converter<T>;

  constructor(table: string, converter: typeof Converter<T>) {
    this.table = table;
    this.converter = converter;
  }

  async getAll(): Promise<T[]> {
    const client = await pool.connect();
    const { rows } = await client.query(`SELECT * FROM ${this.table}`);
    client.release();
    return this.converter.toTypes<T>(JSON.stringify(rows));
  }

  // NOTE: Not all tables have primary key named 'id', please adjust this method if needed
  async getById(id: string): Promise<T | null> {
    const client = await pool.connect();
    const { rows } = await client.query(`SELECT * FROM ${this.table} WHERE id = '${id}'`);
    client.release();

    if (rows.length === 0) {
      return null;
    }
    return (this.converter.toTypes<T>(JSON.stringify(rows)) as T[])[0];
  }
}