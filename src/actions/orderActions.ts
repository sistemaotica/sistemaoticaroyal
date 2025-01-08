"use server";

import { z } from "zod";
import { createOrderSchema } from "@/schemas/orderSchema";
import {
  createOrderService,
  getOrdersService,
  getOrderByIdService,
  deleteOrderService,
  getNextOrderNumber,
  updateOrderService,
} from "@/services/orderService";

// Função para criar ordem
export async function createOrderAction(formData: FormData) {
  try {
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

// Função para editar ordem
export async function updateOrderAction(orderId: number, formData: FormData) {
  try {
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
      lensDetails,
    });

    const updatedOrder = await updateOrderService(orderId, validatedData);

    return {
      success: true,
      order: updatedOrder,
    };
  } catch (error) {
    console.error("Erro ao editar ordem:", error);

    return {
      success: false,
      message: error instanceof z.ZodError ? error.errors : "Erro inesperado",
    };
  }
}

// Função para buscar todas as ordens
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

// Função para buscar ordem pelo ID
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

// Função para excluir ordem
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
