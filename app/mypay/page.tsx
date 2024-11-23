import MyPayContent from "./MyPayContent";
import NavBar from "@/app/_components/NavBar";
import { getUser } from "@/src/functions/auth/getUser";

export default async function Page() {
    const user = await getUser();

    return (
        <main>
            <NavBar />
            <MyPayContent user={user} />
        </main>
    );
}