import fs from 'fs';
import path from 'path';
import { toPemesanan } from '@/app/db/types/pemesanan';

export async function GET() {
  const pemesananFilePath = path.resolve('app/db/mocks/pemesanan.json');

  try {
    const pemesananData = fs.readFileSync(pemesananFilePath, 'utf-8');

    const pemesanans = toPemesanan(pemesananData);

    return new Response(JSON.stringify({ pemesanans }), { status: 200 });
  } catch (error) {

    return new Response('Error reading data', { status: 500 });
  }
}