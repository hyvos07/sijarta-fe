import { Pelanggan, Convert } from '../types/pelanggan';
import { BaseModel } from '../model';

export class PelangganModel extends BaseModel<Pelanggan> {
    constructor() {
        super('"pelanggan"', Convert);
    }
}