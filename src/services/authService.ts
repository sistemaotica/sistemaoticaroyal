import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { jwtService } from "./jwtService";

export const authService = {
    authenticate: async (email: string, password: string) => {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new Error("E-mail ou senha inválidos");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("E-mail ou senha inválidos");
        }

        const token = await jwtService.generateToken({
            id: user.id,
            email: user.email,
            role: user.role, 
        });

        return { token, user };
    },

    decodeToken: async (token: string) => {
        try {
            return await jwtService.verifyToken(token); 
        } catch (error) {
            console.error("Erro ao decodificar token:", error);
            return null;
        }
    },
};
