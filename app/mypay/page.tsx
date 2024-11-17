import { trMyPayService } from "../db/services/trMypay";
import MyPayContent from "./MyPayContent";
import NavBar from "../components/NavBar";
import { getUser } from "../functions/auth/getUser";
import { Convert } from "../db/types/trMypay";

export default async function Page() {
    const user = await getUser();

    return (
        <main>
            <NavBar />
            <MyPayContent user={user} />
        </main>
    );
}