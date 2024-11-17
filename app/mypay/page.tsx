import { trMyPayService } from "../db/services/trMypay";
import MyPayContent from "./MyPayContent";
import NavBar from "../components/NavBar";
import { getUser } from "../functions/auth/getUser";

export default async function Page() {
    const user = await getUser();
    const transaksi = await trMyPayService.getAllTransaksi(user!.id);
    const saldoMyPay = user?.saldoMyPay || 0;

    return (
        <main>
            <NavBar />
            <MyPayContent 
                user={user!} 
                transaksi={transaksi} 
                saldoMyPay={saldoMyPay} 
            />
        </main>
    );
}