// path : sijarta-fe/src/db/models/pekerja.ts

import { Pekerja, Convert } from '../types/pekerja';
import { BaseModel } from '../model';

export class PekerjaModel extends BaseModel<Pekerja> {
    constructor() {
        super('pekerja', Convert);
    }
}