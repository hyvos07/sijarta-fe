// path : sijarta-fe/app/_components/mypay/transaksi/TransaksiFOrm.tsx

"use client"
import TopupForm from "./forms/TopupForm";
import BayarForm from "./forms/BayarForm";
import TransferForm from "./forms/TransferForm";
import WithdrawForm from "./forms/WithdrawForm";

export default function TransaksiForm({ type, isPekerja }: { type: string, isPekerja: boolean }) {
    return (
        <form name="transaksi" className="md:mt-4 md:w-[770px] w-full">
            {type === "none" &&
                <p className="text-lg font-semibold text-zinc-500 text-center my-32">Silakan pilih tipe transaksi yang diinginkan.</p>
            }
            {type === "topup" && <TopupForm />}
            {type === "bayar" && !isPekerja && <BayarForm />}
            {type === "transfer" && <TransferForm />}
            {type === "withdraw" && <WithdrawForm />}
        </form>
    );
}