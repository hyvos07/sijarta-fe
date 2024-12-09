"use client"
import TopupForm from "./forms/TopupForm";
import BayarForm from "./forms/BayarForm";
import TransferForm from "./forms/TransferForm";
import WithdrawForm from "./forms/WithdrawForm";

export default function TransaksiForm({ type, isPekerja, updateSaldo }: { type: string, isPekerja: boolean, updateSaldo: (nominal: number) => void }) {
    return (
        <form name="transaksi" className="md:mt-4 md:w-[770px] w-full">
            {type === "none" &&
                <p className="text-lg font-semibold text-zinc-500 text-center my-32">Silakan pilih tipe transaksi yang diinginkan.</p>
            }
            {type === "topup" && <TopupForm updateSaldo={updateSaldo} />}
            {type === "bayar" && !isPekerja && <BayarForm updateSaldo={updateSaldo} />}
            {type === "transfer" && <TransferForm updateSaldo={updateSaldo} />}
            {type === "withdraw" && <WithdrawForm updateSaldo={updateSaldo} />}
        </form>
    );
}