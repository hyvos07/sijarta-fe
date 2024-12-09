// path: sijarta-fe/src/db/models/user.ts

import { User, Convert } from '../types/user';
import { BaseModel } from '../model';
import pool from '../db';

interface UpdateUserData {
  nama?: string;
  noHP?: string;
  jenisKelamin?: 'L' | 'P';
  tglLahir?: string;
  alamat?: string;
}

export class UserModel extends BaseModel<User> {
    constructor() {
        super('"user"', Convert);
    }

    async getUserByPhone(noHP: string): Promise<User | null> {
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT * FROM ${this.table}
            WHERE no_hp = '${noHP}'
        `);
        client.release();
        return (this.converter.toTypes(JSON.stringify(rows)) as User[])[0] ?? null;
    }

    async updateSaldo(id: string, nominal: number): Promise<void> {
        const client = await pool.connect();
        await client.query(`
            UPDATE ${this.table}
            SET saldo_mypay = saldo_mypay + ${nominal}
            WHERE id = '${id}'
        `);
        client.release();
    }

    async updateUser(id: string, data: UpdateUserData): Promise<void> {
        const client = await pool.connect();
        const setClauses = [];
        
        if (data.nama !== undefined) setClauses.push(`nama = '${data.nama}'`);
        if (data.noHP !== undefined) setClauses.push(`no_hp = '${data.noHP}'`);
        if (data.jenisKelamin !== undefined) setClauses.push(`jenis_kelamin = '${data.jenisKelamin}'`);
        if (data.tglLahir !== undefined) setClauses.push(`tgl_lahir = '${data.tglLahir}'`);
        if (data.alamat !== undefined) setClauses.push(`alamat = '${data.alamat}'`);

        if (setClauses.length > 0) {
            const query = `
                UPDATE ${this.table}
                SET ${setClauses.join(', ')}
                WHERE id = '${id}'
            `;
            await client.query(query);
        }
        
        client.release();
    }
}