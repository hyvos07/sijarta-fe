"use client"

export default function TransferForm() {
    return (
        <div className="flex flex-col md:my-2 my-6">
            <p className="text-lg font-semibold my-3">Nomor HP Tujuan</p>
            <input type="number" id="noHP" name="noHP"
                className="py-3 px-3 border border-gray-600 rounded-lg bg-transparent text-base focus:outline focus:outline-blue-500 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className="text-lg font-semibold my-3 mt-6">Nominal</p>
            <input type="number" id="nominal" name="nominal"
                className="py-3 px-3 border border-gray-600 rounded-lg bg-transparent text-base focus:outline focus:outline-blue-500 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="flex md:justify-end mt-10 md:mt-8" >
                <button
                    type="submit"
                    className="md:w-36 w-full py-3 bg-zinc-100 text-black font-semibold rounded-2xl shadow-lg hover:bg-white"
                    onClick={(e) => { e.preventDefault(); alert('done'); }}
                >
                    Transfer
                </button>
            </div>
        </div>
    );
}