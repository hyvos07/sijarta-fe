import { TrPemesananStatus, Convert } from '../types/trPemesananStatus';
import trPemesananStatusJson from '../mocks/trPemesananStatus.json';
import { statusPesananService } from './statusPesanan';

export const trPemesananStatusService = {
    getStatusById: async (idPesanan: string): Promise<string | null> => {
        const jsonString = JSON.stringify(trPemesananStatusJson);
        const statuses = Convert.toTrPemesananStatus(jsonString);

        const idStatus = statuses.find((s) => s.idTrPemesanan === idPesanan)?.idStatus;

        return statusPesananService.getNamaStatusById(idStatus ?? '');
    }
};