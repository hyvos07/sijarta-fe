import { NextResponse } from 'next/server';
import { getUser } from '../../functions/auth/getUser';
import fs from 'fs';
import path from 'path';

// Fungsi untuk memuat file JSON dengan validasi
const loadJSON = (filePath: string): any[] => {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading JSON from ${filePath}:`, error);
    return [];
  }
};

// Path file JSON
const workersFilePath = path.join(process.cwd(), 'db/mocks/pekerja.json');

// Muat data dari file JSON
const workers = loadJSON(workersFilePath);

// API GET Handler
export async function GET(request: Request) {
  try {
    // Mendapatkan user dari token
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan atau tidak memiliki autentikasi' }, { status: 401 });
    }

    // Mengecek apakah user adalah pekerja
    const worker = workers.find((w: any) => w.Id === user.id);
    if (worker) {
      return NextResponse.json({ role: 'pekerja', data: worker });
    }

    // Jika user adalah pengguna biasa
    return NextResponse.json({ role: 'pengguna', data: user });
  } catch (error: any) {
    console.error('Error handling GET request:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
