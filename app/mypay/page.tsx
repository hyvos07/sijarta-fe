// path : sijarta-fe/app/mypay/page.tsx

import MyPayContent from "./MyPayContent";
import NavBar from "@/app/_components/NavBar";
import { KategoriTrMyPayModel } from "@/src/db/models/kategoriTrMypay";
import { getUser } from "@/src/functions/getUser";

export default async function Page() {
    const user = await getUser();
    const kategoriAll = await new KategoriTrMyPayModel().getAll();

    return (
        <main>
            <NavBar />
            <MyPayContent user={user} kategoriAll={kategoriAll} />
        </main>
    );
}