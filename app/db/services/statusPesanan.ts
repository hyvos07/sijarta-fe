import { StatusPesanan, Convert } from "../types/statusPesanan";
import statusPesananJson from "../mocks/statusPesanan.json";

export const statusPesananService = {
    getNamaStatusById: async (idStatus: string): Promise<string | null> => {
        const jsonString = JSON.stringify(statusPesananJson);
        const statuses = Convert.toStatusPesanan(jsonString);

        const status = statuses.find((s) => s.id === idStatus);

        return status?.status ?? 'Tidak Diketahui';
    }
};