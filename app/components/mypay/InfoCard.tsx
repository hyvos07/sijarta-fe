interface InfoCardProps {
    noHP: string;
    saldoMyPay: number;
}

export default function InfoCard({ noHP, saldoMyPay }: InfoCardProps) {
    return (
        <div className="flex px-8 py-8 rounded-[24px] border border-zinc-700 bg-zinc-900 mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                <div className="flex w-full md:w-auto">
                    <div className="flex flex-col md:w-auto md:mb-0 mb-7 mr-16 w-full">
                        <h1 className="text-lg md:text-2xl font-semibold mb-2">
                            Nomor Hp
                        </h1>
                        <p className="text-lg font-semibold text-stone-300">
                            {noHP}
                        </p>
                    </div>
                    <div className="flex flex-col md:w-auto md:mb-0 mb-10 w-full hidden md:block">
                        <h1 className="text-lg md:text-2xl font-semibold mb-2">
                            Saldo MyPay
                        </h1>
                        <p className="text-lg text-green-500 font-semibold">
                            Rp {saldoMyPay.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:w-auto md:mb-0 mb-10 w-full md:hidden">
                    <h1 className="text-lg md:text-2xl font-semibold mb-2">
                        Saldo MyPay
                    </h1>
                    <p className="text-lg text-green-500 font-semibold">
                        Rp {saldoMyPay.toLocaleString('id-ID')}
                    </p>
                </div>
                <button className="bg-zinc-200 px-6 py-3 md:text-lg text-black font-semibold rounded" onClick={() => { window.location.href = '/mypay/transaksi'; }}>
                    Lakukan Transaksi
                </button>
            </div>
        </div>
    );
}