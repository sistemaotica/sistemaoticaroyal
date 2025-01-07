"use server";

import { clientService } from "@/services/clientService";

export async function createClientAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());

    const client = await clientService.createClient({
      name: data.name as string,
      address: data.address as string,
      cpf: data.cpf as string,
      phone: data.phone as string,
      birthDate: data.birthDate as string,
    });

    return { success: true, client };
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido ao criar cliente.",
    };
  }
}

export async function getClientsAction() {
  try {
    const clients = await clientService.getClients();
    return clients;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    throw new Error("Erro ao buscar clientes.");
  }
}

export async function getClientByIdAction(clientId: number) {
  try {
    const client = await clientService.getClientById(clientId);
    if (!client) {
      return { success: false, message: "Cliente não encontrado." };
    }
    return { success: true, client };
  } catch (error) {
    console.error("Erro ao buscar cliente por ID:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao buscar cliente.",
    };
  }
}

export async function updateClientAction(updatedClient: {
  id: number;
  name: string;
  address: string;
  cpf: string;
  phone: string;
  birthDate: string;
}) {
  try {
    const client = await clientService.updateClient(updatedClient);
    return { success: true, client };
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao atualizar cliente.",
    };
  }
}

export async function deleteClientAction(clientId: number) {
  try {
    await clientService.deleteClient(clientId);
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao excluir cliente.",
    };
  }
}
