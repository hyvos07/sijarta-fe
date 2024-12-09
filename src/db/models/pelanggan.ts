// path : sijarta-fe/src/db/models/pelanggan.ts

import { Pelanggan, Convert } from '../types/pelanggan';
import { BaseModel } from '../model';

export class PelangganModel extends BaseModel<Pelanggan> {
    constructor() {
        super('"pelanggan"', Convert);
    }
}