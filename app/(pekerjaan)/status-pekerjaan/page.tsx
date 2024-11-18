import NavBar from "../../components/NavBar";
import { pekerjaKategoriJasaService } from "../../db/services/pekerjaKategoriJasa";
import { subkategoriJasaService } from "../../db/services/subkategoriJasa";
import { getUser } from "../../functions/auth/getUser";

export default async function Page() {
    const user = await getUser();
    const pekerjaKategoriJasa = await pekerjaKategoriJasaService.getMapKategoriJasaByID(user.id);

    const subkategoriMap = new Map();
    for (const [id, _] of pekerjaKategoriJasa) {
        const subkategori = await subkategoriJasaService.getAllSubkategori(id);
        subkategoriMap.set(id, subkategori);
    }

    return (
        <main className="min-h-screen">
            <NavBar />
        </main>
    )
}