import { z } from "zod";

export const clientSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório."),
    address: z.string().min(1, "Endereço é obrigatório."),
    cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos."),
    phone: z.string().min(10, "Telefone deve ter no mínimo 10 caracteres."),
    birthDate: z.string().refine(
        (value) => !isNaN(new Date(value).getTime()),
        "Data de nascimento inválida."
    ),
});
