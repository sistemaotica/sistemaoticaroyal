import { prisma } from "@/lib/prisma";

interface CreateClientData {
  name: string;
  address: string;
  cpf: string;
  phone: string;
  birthDate: string;
}

interface UpdateClientData extends CreateClientData {
  id: number;
}

export const clientService = {
  async createClient(data: CreateClientData) {
    try {
      const client = await prisma.client.create({
        data: {
          name: data.name,
          address: data.address,
          cpf: data.cpf,
          phone: data.phone,
          birthDate: new Date(data.birthDate),
        },
      });
      return client;
    } catch (error) {
      console.error("Erro ao criar cliente no banco:", error);
      throw new Error("Erro ao salvar cliente no banco de dados.");
    }
  },

  async getClients() {
    try {
      const clients = await prisma.client.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          cpf: true,
          phone: true,
          birthDate: true,
        },
      });
      return clients;
    } catch (error) {
      console.error("Erro ao buscar clientes no banco:", error);
      throw new Error("Erro ao buscar clientes no banco de dados.");
    }
  },

  async getClientById(clientId: number) {
    try {
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        select: {
          id: true,
          name: true,
          address: true,
          cpf: true,
          phone: true,
          birthDate: true,
        },
      });
      return client;
    } catch (error) {
      console.error("Erro ao buscar cliente no banco:", error);
      throw new Error("Erro ao buscar cliente no banco de dados.");
    }
  },

  async updateClient(data: UpdateClientData) {
    try {
      const updatedClient = await prisma.client.update({
        where: { id: data.id },
        data: {
          name: data.name,
          address: data.address,
          cpf: data.cpf,
          phone: data.phone,
          birthDate: new Date(data.birthDate),
        },
      });
      return updatedClient;
    } catch (error) {
      console.error("Erro ao atualizar cliente no banco:", error);
      throw new Error("Erro ao atualizar cliente no banco de dados.");
    }
  },

  async deleteClient(clientId: number) {
    try {
      await prisma.client.delete({
        where: { id: clientId },
      });
    } catch (error) {
      console.error("Erro ao excluir cliente no banco:", error);
      throw new Error("Erro ao excluir cliente no banco de dados.");
    }
  },
};
