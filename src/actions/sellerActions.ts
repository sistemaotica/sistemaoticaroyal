"use server";

import { sellerSchema, sellerListSchema } from "@/schemas/sellerSchema";
import { sellerService } from "@/services/sellerService";
import bcrypt from "bcrypt";

export async function createSellerAction(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const parsedData = sellerSchema.parse({
            name: data.name,
            cpf: data.cpf,
            phone: data.phone,
            birthDate: data.birthDate,
            email: data.email,
            password: data.password,
        });

        const hashedPassword = await bcrypt.hash(parsedData.password, 10);

        const seller = await sellerService.createSeller({
            ...parsedData,
            password: hashedPassword,
        });

        return { success: true, seller };
    } catch (error) {
        console.error("Erro ao criar vendedor:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido ao criar vendedor.",
        };
    }
}

export async function getSellersAction() {
    try {
        const sellers = await sellerService.getSellers();
        const validatedSellers = sellerListSchema.parse(sellers);

        return validatedSellers;
    } catch (error) {
        console.error("Erro ao buscar vendedores:", error);
        throw new Error("Erro ao buscar vendedores.");
    }
}

export async function getSellerByIdAction(sellerId: number) {
    try {
        const seller = await sellerService.getSellerById(sellerId);
        if (!seller) {
            throw new Error("Vendedor não encontrado.");
        }
        return { success: true, seller };
    } catch (error) {
        console.error("Erro ao buscar vendedor por ID:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Erro ao buscar vendedor.",
        };
    }
}

export async function updateSellerAction(updatedSeller: {
    id: number;
    name: string;
    cpf: string;
    phone: string;
    birthDate: string;
    email: string;
    password: string;
}) {
    try {
        const parsedData = {
            id: updatedSeller.id,
            name: updatedSeller.name,
            cpf: updatedSeller.cpf,
            phone: updatedSeller.phone,
            birthDate: updatedSeller.birthDate,
            email: updatedSeller.email,
            password: updatedSeller.password,
        };

        const seller = await sellerService.updateSeller(parsedData);

        return { success: true, seller };
    } catch (error) {
        console.error("Erro ao atualizar vendedor:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Erro ao atualizar vendedor.",
        };
    }
}

export async function deleteSellerAction(sellerId: number) {
    try {
        await sellerService.deleteSeller(sellerId);
        return { success: true };
    } catch (error) {
        console.error("Erro ao excluir vendedor:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido ao excluir vendedor.",
        };
    }
}
