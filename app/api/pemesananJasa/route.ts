import fs from 'fs';
import path from 'path';
import { toPemesanan } from '@/src/db/types/pemesanan';

export async function GET() {
  const pemesananFilePath = path.resolve('src/db/mocks/pemesanan.json');

  try {
    const pemesananData = fs.readFileSync(pemesananFilePath, 'utf-8');

    const pemesanans = toPemesanan(pemesananData);

    return new Response(JSON.stringify({ pemesanans }), { status: 200 });
  } catch (error) {

    return new Response('Error reading data', { status: 500 });
  }
}