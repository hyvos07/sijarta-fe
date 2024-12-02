import { MetodeBayar, Convert } from '../types/metodeBayar';
import metodeBayarJson from '../mocks/metodeBayar.json';
import { BaseModel } from '../model';

export class MetodeBayarModel extends BaseModel<MetodeBayar> {
    constructor() {
        super('metode_bayar', Convert);
    }

    async getNamaMetodeBayar(idMetodeBayar: string): Promise<string> {
        const metodeBayar = await this.getById(idMetodeBayar);
        return this.converter.toTypes<MetodeBayar>(JSON.stringify(metodeBayar))[0].nama ?? 'Tidak Diketahui';
    }
}