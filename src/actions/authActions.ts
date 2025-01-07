"use server";

import { loginSchema } from "../schemas/authSchema";
import { authService } from "../services/authService";
import { cookies } from "next/headers"; 

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
        return {
            success: false,
            message: parsed.error.errors.map((e) => e.message).join(", "),
        };
    }

    try {
        const { token, user } = await authService.authenticate(parsed.data.email, parsed.data.password);

        const { password: _, ...userWithoutPassword } = user;

        cookies().set({
            name: "token",
            value: token,
            httpOnly: true,
            path: "/", 
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return {
            success: true,
            user: userWithoutPassword,
            role: user.role || "SELLER",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Erro desconhecido.",
        };
    }
}
