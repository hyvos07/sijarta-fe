// path : sijarta-fe/src/db/models/metodeBayar.ts

import { MetodeBayar, Convert } from '../types/metodeBayar';
import metodeBayarJson from '../mocks/metodeBayar.json';
import { BaseModel } from '../model';

export class MetodeBayarModel extends BaseModel<MetodeBayar> {
    constructor() {
        super('metode_bayar', Convert);
    }

    async getNamaMetodeBayar(idMetodeBayar: string): Promise<string> {
        const metodeBayar = await this.getById(idMetodeBayar);
        return metodeBayar!.nama ?? 'Tidak Diketahui';
    }
}