import { cookies } from "next/headers";
import { jwtService } from "./jwtService";

export async function getCurrentUser() {
    const cookieStore = cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
        return null;
    }

    const decoded = await jwtService.verifyToken(token);

    if (decoded && typeof decoded.id === "number") {
        return decoded;
    }

    console.error("ID do usuário não é um número válido.");
    return null;
}
