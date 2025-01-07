import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

interface CreateSellerData {
    name: string;
    cpf: string;
    phone: string;
    birthDate: string;
    email: string;
    password: string;
}

interface UpdateSellerData {
    id: number;
    name: string;
    cpf: string;
    phone: string;
    birthDate: string;
    email: string;
    password: string;
}

export const sellerService = {
    async createSeller(data: CreateSellerData) {
        try {
            const seller = await prisma.user.create({
                data: {
                    name: data.name,
                    cpf: data.cpf,
                    phone: data.phone,
                    birthDate: new Date(data.birthDate),
                    email: data.email,
                    password: data.password,
                    role: Role.SELLER,
                },
            });
            return seller;
        } catch (error) {
            console.error("Erro ao criar vendedor no banco:", error);
            throw new Error("Erro ao salvar vendedor no banco de dados.");
        }
    },

    async getSellers() {
        try {
            const sellers = await prisma.user.findMany({
                where: { role: Role.SELLER },
                select: {
                    id: true,
                    name: true,
                    cpf: true,
                    phone: true,
                    birthDate: true,
                    email: true,
                },
            });
            return sellers;
        } catch (error) {
            console.error("Erro ao buscar vendedores no banco:", error);
            throw new Error("Erro ao buscar vendedores no banco de dados.");
        }
    },

    async getSellerById(sellerId: number) {
        try {
            const seller = await prisma.user.findUnique({
                where: { id: sellerId },
                select: {
                    id: true,
                    name: true,
                    cpf: true,
                    phone: true,
                    birthDate: true,
                    email: true,
                    password: true,
                },
            });
            return seller;
        } catch (error) {
            console.error("Erro ao buscar vendedor no banco:", error);
            throw new Error("Erro ao buscar vendedor no banco de dados.");
        }
    },

    async updateSeller(data: UpdateSellerData) {
        try {
            const updatedSeller = await prisma.user.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    cpf: data.cpf,
                    phone: data.phone,
                    birthDate: new Date(data.birthDate),
                    email: data.email,
                    password: data.password,
                },
            });
            return updatedSeller;
        } catch (error) {
            console.error("Erro ao atualizar vendedor no banco:", error);
            throw new Error("Erro ao atualizar vendedor no banco de dados.");
        }
    },

    async deleteSeller(sellerId: number) {
        try {
            await prisma.user.delete({
                where: { id: sellerId },
            });
        } catch (error) {
            console.error("Erro ao excluir vendedor do banco:", error);
            throw new Error("Erro ao excluir vendedor no banco de dados.");
        }
    },
};
