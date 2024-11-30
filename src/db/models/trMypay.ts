import { TrMyPay, Convert } from '../types/trMypay';
import { BaseModel } from '../model';

export class TrMyPayModel extends BaseModel<TrMyPay> {
  constructor() {
    super('tr_mypay', Convert);
  }

  async getTransaksiByUserID(userID: string): Promise<TrMyPay[]> {
    const all = await this.getAll();
    return all.filter((transaksi) => transaksi.userID === userID);
  }
}