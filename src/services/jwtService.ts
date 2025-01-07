import { SignJWT, jwtVerify, JWTPayload } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "minha_chave_secreta");

export const jwtService = {
    generateToken: async (payload: Record<string, unknown>) => {
        return new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(SECRET_KEY);
    },

    verifyToken: async (token: string): Promise<JWTPayload> => {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    },
};
