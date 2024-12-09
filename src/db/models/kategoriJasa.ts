// path : sijarta-fe/src/db/models/kategoriJasa.ts

import { KategoriJasa, Convert } from '../types/kategoriJasa';
import kategoriJasaJson from '../mocks/kategoriJasa.json';
import { BaseModel } from '../model';

export class KategoriJasaModel extends BaseModel<KategoriJasa> {
    constructor() {
        super('kategori_jasa', Convert);
    }
}