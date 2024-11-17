import fs from 'fs';
import path from 'path';
import { Convert as convertPromo } from '@/app/db/types/promo';
import { Convert as convertVoucher } from '@/app/db/types/voucher';
// Get promo data from file
export async function GET() {
  const promoFilePath = path.resolve('app/db/mocks/promo.json');
  const voucherFilePath = path.resolve('app/db/mocks/voucher.json');

  try {
    const promosData = (fs.readFileSync(promoFilePath, 'utf-8'));
    const vouchersData = (fs.readFileSync(voucherFilePath, 'utf-8'));

    const vouchers = convertVoucher.toVoucher(vouchersData);
    const promos = convertPromo.toPromo(promosData);
    return new Response(JSON.stringify({ promos, vouchers }), { status: 200 });
  } catch (error) {
    return new Response('Error reading data', { status: 500 });
  }
}
