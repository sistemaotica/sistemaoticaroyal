import { z } from "zod";

export const sellerSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório."),
    cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos."),
    phone: z.string().min(10, "Telefone deve ter no mínimo 10 caracteres."),
    birthDate: z.string().refine(
        (value) => !isNaN(new Date(value).getTime()),
        "Data de nascimento inválida."
    ),
    email: z.string().email("E-mail inválido."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export const sellerListSchema = z.array(
    z.object({
        id: z.number(),
        name: z.string(),
        cpf: z.string(),
        phone: z.string(),
        birthDate: z.string().or(z.date()),
    })
);
