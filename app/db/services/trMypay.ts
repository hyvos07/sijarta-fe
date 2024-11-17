import { TrMyPay, Convert } from '../types/trMypay';
import trMyPayJson from '../mocks/trMypay.json';

export const trMyPayService = {
  getAllTransaksi: async (userID: string): Promise<TrMyPay[]> => {
    const jsonString = JSON.stringify(trMyPayJson);
    const trMypay = Convert.toTrMyPay(jsonString);
    return trMypay.filter((tr) => tr.userID === userID);
  },
};