import prisma from "@/lib/prisma";
import { CreateOrderInput } from "@/schemas/orderSchema";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0].split("-").reverse().join("/");
}

export async function getNextOrderNumber() {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { id: "desc" },
    select: { orderNumber: true },
  });

  if (!lastOrder || !lastOrder.orderNumber) {
    return "0001"; // Primeiro número caso não existam ordens ainda
  }

  const lastNumber = parseInt(lastOrder.orderNumber, 10);
  const nextNumber = String(lastNumber + 1).padStart(4, "0");
  return nextNumber;
}

export async function createOrderService(data: CreateOrderInput) {
  const {
    orderNumber,
    clientId,
    sellerId,
    examiner,
    date,
    totalValue,
    amountPaid,
    amountDue,
    deliveryDate,
    observations,
    lensDetails,
  } = data;

  const transformedLensDetails = {
    longeOdSpherical: lensDetails.longeOdSpherical || null,
    longeOdCylindrical: lensDetails.longeOdCylindrical || null,
    longeOdAxis: lensDetails.longeOdAxis || null,
    longeOdPrism: lensDetails.longeOdPrism || null,
    longeOdDnp: lensDetails.longeOdDnp || null,
    longeOeSpherical: lensDetails.longeOeSpherical || null,
    longeOeCylindrical: lensDetails.longeOeCylindrical || null,
    longeOeAxis: lensDetails.longeOeAxis || null,
    longeOePrism: lensDetails.longeOePrism || null,
    longeOeDnp: lensDetails.longeOeDnp || null,
    pertoOdSpherical: lensDetails.pertoOdSpherical || null,
    pertoOdCylindrical: lensDetails.pertoOdCylindrical || null,
    pertoOdAxis: lensDetails.pertoOdAxis || null,
    pertoOdPrism: lensDetails.pertoOdPrism || null,
    pertoOdDnp: lensDetails.pertoOdDnp || null,
    pertoOeSpherical: lensDetails.pertoOeSpherical || null,
    pertoOeCylindrical: lensDetails.pertoOeCylindrical || null,
    pertoOeAxis: lensDetails.pertoOeAxis || null,
    pertoOePrism: lensDetails.pertoOePrism || null,
    pertoOeDnp: lensDetails.pertoOeDnp || null,
    addition: lensDetails.addition || null,
    dp: lensDetails.dp || null,
    height: lensDetails.height || null,
    frameDescription: lensDetails.frameDescription || null,
    frameColor: lensDetails.frameColor || null,
    lensType: lensDetails.lensType || null,
    lensCategory: lensDetails.lensCategory || null,
  };

  const newOrder = await prisma.order.create({
    data: {
      orderNumber,
      clientId: parseInt(clientId, 10),
      sellerId: parseInt(sellerId, 10),
      examiner,
      date: new Date(date),
      totalValue,
      amountPaid,
      amountDue,
      deliveryDate: new Date(deliveryDate),
      observations,
      lensDetails: {
        create: transformedLensDetails,
      },
    },
    include: {
      client: true,
      seller: true,
      lensDetails: true,
    },
  });

  return newOrder;
}



export async function getOrdersService() {
  const orders = await prisma.order.findMany({
    include: {
      client: true,
      seller: true,
      lensDetails: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    date: formatDate(order.date),
    deliveryDate: formatDate(order.deliveryDate),
    client: order.client?.name ?? "Cliente não informado",
    clientPhone: order.client?.phone ?? "Telefone não informado",
    clientAddress: order.client?.address ?? "Endereço não informado",
    clientBirthDate: order.client?.birthDate ? formatDate(order.client.birthDate) : "Data não informada",
    seller: order.seller?.name ?? "Vendedor não informado",
    totalValue: (order.totalValue / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    amountPaid: (order.amountPaid / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    amountDue: (order.amountDue / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    observations: order.observations || "",
    examiner: order.examiner,
    lensDetails: {
      longeOdSpherical: order.lensDetails?.longeOdSpherical ?? "",
      longeOdCylindrical: order.lensDetails?.longeOdCylindrical ?? "",
      longeOdAxis: order.lensDetails?.longeOdAxis ?? "",
      longeOdPrism: order.lensDetails?.longeOdPrism ?? "",
      longeOdDnp: order.lensDetails?.longeOdDnp ?? "",
      longeOeSpherical: order.lensDetails?.longeOeSpherical ?? "",
      longeOeCylindrical: order.lensDetails?.longeOeCylindrical ?? "",
      longeOeAxis: order.lensDetails?.longeOeAxis ?? "",
      longeOePrism: order.lensDetails?.longeOePrism ?? "",
      longeOeDnp: order.lensDetails?.longeOeDnp ?? "",
      pertoOdSpherical: order.lensDetails?.pertoOdSpherical ?? "",
      pertoOdCylindrical: order.lensDetails?.pertoOdCylindrical ?? "",
      pertoOdAxis: order.lensDetails?.pertoOdAxis ?? "",
      pertoOdPrism: order.lensDetails?.pertoOdPrism ?? "",
      pertoOdDnp: order.lensDetails?.pertoOdDnp ?? "",
      pertoOeSpherical: order.lensDetails?.pertoOeSpherical ?? "",
      pertoOeCylindrical: order.lensDetails?.pertoOeCylindrical ?? "",
      pertoOeAxis: order.lensDetails?.pertoOeAxis ?? "",
      pertoOePrism: order.lensDetails?.pertoOePrism ?? "",
      pertoOeDnp: order.lensDetails?.pertoOeDnp ?? "",
      addition: order.lensDetails?.addition ?? "",
      dp: order.lensDetails?.dp ?? "",
      height: order.lensDetails?.height ?? "",
      frameDescription: order.lensDetails?.frameDescription ?? "",
      frameColor: order.lensDetails?.frameColor ?? "",
      lensType: order.lensDetails?.lensType ?? "",
      lensCategory: order.lensDetails?.lensCategory ?? "",
    },
  }));
}


export async function getOrderByIdService(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      client: true,
      seller: true,
      lensDetails: true,
    },
  });

  if (!order) {
    return null;
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    date: formatDate(order.date),
    deliveryDate: formatDate(order.deliveryDate),
    client: order.client?.name ?? "Cliente não informado",
    clientPhone: order.client?.phone ?? "Telefone não informado",
    clientAddress: order.client?.address ?? "Endereço não informado",
    clientBirthDate: order.client?.birthDate ? formatDate(order.client.birthDate) : "Data não informada",
    seller: order.seller?.name ?? "Vendedor não informado",
    totalValue: (order.totalValue / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    amountPaid: (order.amountPaid / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    amountDue: (order.amountDue / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    observations: order.observations || "",
    examiner: order.examiner,
    lensDetails: {
      longeOdSpherical: order.lensDetails?.longeOdSpherical ?? "",
      longeOdCylindrical: order.lensDetails?.longeOdCylindrical ?? "",
      longeOdAxis: order.lensDetails?.longeOdAxis ?? "",
      longeOdPrism: order.lensDetails?.longeOdPrism ?? "",
      longeOdDnp: order.lensDetails?.longeOdDnp ?? "",
      longeOeSpherical: order.lensDetails?.longeOeSpherical ?? "",
      longeOeCylindrical: order.lensDetails?.longeOeCylindrical ?? "",
      longeOeAxis: order.lensDetails?.longeOeAxis ?? "",
      longeOePrism: order.lensDetails?.longeOePrism ?? "",
      longeOeDnp: order.lensDetails?.longeOeDnp ?? "",
      pertoOdSpherical: order.lensDetails?.pertoOdSpherical ?? "",
      pertoOdCylindrical: order.lensDetails?.pertoOdCylindrical ?? "",
      pertoOdAxis: order.lensDetails?.pertoOdAxis ?? "",
      pertoOdPrism: order.lensDetails?.pertoOdPrism ?? "",
      pertoOdDnp: order.lensDetails?.pertoOdDnp ?? "",
      pertoOeSpherical: order.lensDetails?.pertoOeSpherical ?? "",
      pertoOeCylindrical: order.lensDetails?.pertoOeCylindrical ?? "",
      pertoOeAxis: order.lensDetails?.pertoOeAxis ?? "",
      pertoOePrism: order.lensDetails?.pertoOePrism ?? "",
      pertoOeDnp: order.lensDetails?.pertoOeDnp ?? "",
      addition: order.lensDetails?.addition ?? "",
      dp: order.lensDetails?.dp ?? "",
      height: order.lensDetails?.height ?? "",
      frameDescription: order.lensDetails?.frameDescription ?? "",
      frameColor: order.lensDetails?.frameColor ?? "",
      lensType: order.lensDetails?.lensType ?? "",
      lensCategory: order.lensDetails?.lensCategory ?? "",
    },
  };
}

export async function deleteOrderService(orderId: number) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });

    return {
      success: true,
      message: "Ordem excluída com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao excluir ordem:", error);
    return {
      success: false,
      message: "Erro ao excluir ordem.",
    };
  }
}

  export async function updateOrderService(orderId: number, data: CreateOrderInput) {
    const {
      clientId,
      sellerId,
      examiner,
      date,
      totalValue,
      amountPaid,
      amountDue,
      deliveryDate,
      observations,
      lensDetails,
    } = data;
  
    const transformedLensDetails = {
      longeOdSpherical: lensDetails.longeOdSpherical || null,
      longeOdCylindrical: lensDetails.longeOdCylindrical || null,
      longeOdAxis: lensDetails.longeOdAxis || null,
      longeOdPrism: lensDetails.longeOdPrism || null,
      longeOdDnp: lensDetails.longeOdDnp || null,
      longeOeSpherical: lensDetails.longeOeSpherical || null,
      longeOeCylindrical: lensDetails.longeOeCylindrical || null,
      longeOeAxis: lensDetails.longeOeAxis || null,
      longeOePrism: lensDetails.longeOePrism || null,
      longeOeDnp: lensDetails.longeOeDnp || null,
      pertoOdSpherical: lensDetails.pertoOdSpherical || null,
      pertoOdCylindrical: lensDetails.pertoOdCylindrical || null,
      pertoOdAxis: lensDetails.pertoOdAxis || null,
      pertoOdPrism: lensDetails.pertoOdPrism || null,
      pertoOdDnp: lensDetails.pertoOdDnp || null,
      pertoOeSpherical: lensDetails.pertoOeSpherical || null,
      pertoOeCylindrical: lensDetails.pertoOeCylindrical || null,
      pertoOeAxis: lensDetails.pertoOeAxis || null,
      pertoOePrism: lensDetails.pertoOePrism || null,
      pertoOeDnp: lensDetails.pertoOeDnp || null,
      addition: lensDetails.addition || null,
      dp: lensDetails.dp || null,
      height: lensDetails.height || null,
      frameDescription: lensDetails.frameDescription || null,
      frameColor: lensDetails.frameColor || null,
      lensType: lensDetails.lensType || null,
      lensCategory: lensDetails.lensCategory || null,
    };
  
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        clientId: parseInt(clientId, 10),
        sellerId: parseInt(sellerId, 10),
        examiner,
        date: new Date(date),
        totalValue,
        amountPaid,
        amountDue,
        deliveryDate: new Date(deliveryDate),
        observations,
        lensDetails: {
          update: transformedLensDetails,
        },
      },
      include: {
        client: true,
        seller: true,
        lensDetails: true,
      },
    });
  
    return updatedOrder;
  }
