"use server";

import { z } from "zod";
import { createOrderSchema } from "@/schemas/orderSchema";
import {
  createOrderService,
  getOrdersService,
  getOrderByIdService,
  deleteOrderService,
  getNextOrderNumber
} from "@/services/orderService";

export async function createOrderAction(formData: FormData) {
  try {
    // Obter o próximo número da ordem
    const nextOrderNumber = await getNextOrderNumber();

    const data = Object.fromEntries(formData.entries());

    const lensDetails = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        key.startsWith("longe") ||
        key.startsWith("perto") ||
        ["addition", "dp", "height", "frameDescription", "frameColor", "lensType", "lensCategory"].includes(key)
      )
    );

    const validatedData = createOrderSchema.parse({
      ...data,
      orderNumber: nextOrderNumber, 
      lensDetails,
    });

    const newOrder = await createOrderService(validatedData);

    return {
      success: true,
      order: newOrder,
    };
  } catch (error) {
    console.error("Erro ao criar ordem:", error);

    return {
      success: false,
      message: error instanceof z.ZodError ? error.errors : "Erro inesperado",
    };
  }
}

export async function getOrdersAction() {
  try {
    const orders = await getOrdersService();
    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.error("Erro ao buscar ordens de serviço:", error);
    return {
      success: false,
      message: "Erro ao buscar ordens de serviço.",
    };
  }
}

export async function getOrderByIdAction(orderId: number) {
  try {
    const order = await getOrderByIdService(orderId);

    if (!order) {
      return {
        success: false,
        message: "Ordem de serviço não encontrada.",
      };
    }

    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error("Erro ao buscar ordem de serviço:", error);
    return {
      success: false,
      message: "Erro ao buscar ordem de serviço.",
    };
  }
}

export async function getNextOrderNumberAction() {
  try {
    const nextNumber = await getNextOrderNumber();
    return nextNumber;
  } catch (error) {
    console.error("Erro ao buscar o próximo número de OS:", error);
    throw new Error("Erro ao buscar o próximo número de OS");
  }
}

export async function deleteOrderAction(orderId: number) {
  try {
    const result = await deleteOrderService(orderId);
    return result;
  } catch (error) {
    console.error("Erro ao excluir ordem:", error);
    return {
      success: false,
      message: "Erro ao excluir ordem.",
    };
  }
}
