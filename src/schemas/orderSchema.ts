import { z } from "zod";

const parseNumberString = (value: string) => {
  const normalizedValue = value.replace(/\./g, "").replace(",", ".");
  if (isNaN(parseFloat(normalizedValue))) {
    throw new Error("Valor inválido");
  }
  return parseFloat(normalizedValue);
};

export const lensDetailsSchema = z.object({
  longeOdSpherical: z.string().optional(),
  longeOdCylindrical: z.string().optional(),
  longeOdAxis: z.string().optional(),
  longeOdPrism: z.string().optional(),
  longeOdDnp: z.string().optional(),
  longeOeSpherical: z.string().optional(),
  longeOeCylindrical: z.string().optional(),
  longeOeAxis: z.string().optional(),
  longeOePrism: z.string().optional(),
  longeOeDnp: z.string().optional(),
  pertoOdSpherical: z.string().optional(),
  pertoOdCylindrical: z.string().optional(),
  pertoOdAxis: z.string().optional(),
  pertoOdPrism: z.string().optional(),
  pertoOdDnp: z.string().optional(),
  pertoOeSpherical: z.string().optional(),
  pertoOeCylindrical: z.string().optional(),
  pertoOeAxis: z.string().optional(),
  pertoOePrism: z.string().optional(),
  pertoOeDnp: z.string().optional(),
  addition: z.string().optional(),
  dp: z.string().optional(),
  height: z.string().optional(),
  frameDescription: z.string().optional(),
  frameColor: z.string().optional(),
  lensType: z.string().optional(),
  lensCategory: z.string().optional(),
});

export const createOrderSchema = z.object({
  orderNumber: z.string(),
  clientId: z.string().min(1, "Cliente é obrigatório"),
  sellerId: z.string().min(1, "Vendedor é obrigatório"),
  examiner: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data inválida" }),
  totalValue: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val.replace(/\./g, "").replace(",", "."))),
      { message: "Valor inválido" }
    )
    .transform((val) => parseNumberString(val)),
  amountPaid: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val.replace(/\./g, "").replace(",", "."))),
      { message: "Valor inválido" }
    )
    .transform((val) => parseNumberString(val)),
  amountDue: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val.replace(/\./g, "").replace(",", "."))),
      { message: "Valor inválido" }
    )
    .transform((val) => parseNumberString(val)),
  deliveryDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data inválida" }),
  observations: z.string().optional(),
  lensDetails: lensDetailsSchema,
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
