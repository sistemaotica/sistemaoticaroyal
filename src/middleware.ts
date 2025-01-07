import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/clientes", "/criar-os", "/ordens-servico", "/vendedores", "/vendedores/criar-vendedores", "/clientes/criar-cliente"];
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "minha_chave_secreta");

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    const token = request.cookies.get("token")?.value;

    if (!token) {
        console.log("Token ausente. Redirecionando para /login.");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        await jwtVerify(token, SECRET_KEY);
        console.log("Token válido. Permissão concedida.");
        return NextResponse.next();
    } catch (error) {
        console.error("Token inválido:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/clientes", "/criar-os", "/ordens-servico", "/vendedores", "/vendedores/criar-vendedores", "/clientes/criar-cliente"],
};
