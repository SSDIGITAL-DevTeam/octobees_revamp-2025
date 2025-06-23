import { z } from "zod";
const planType = ["Standard", "Premium"] as const;
const statusType = ["Draft", "Active", "NonActive"] as const;
const optionsType = ["One-time", "Monthly", "Bi-Monthly", "3 Months", "6 Months", "Yearly"] as const;

const priceSchema = z.object({
  curr: z.string().length(3),
  amount: z.number().nullable(),
  discount: z.number().nullable(),
});

const benefitSchema = z.object({
  value: z.string().nullable(),
});

const dataSchema = z.object({
  name: z.string().nonempty(),
  type: z.enum([...planType]),
  showPrice: z.boolean(),
  status: z.enum([...statusType]), 
  options: z.enum([...optionsType]),
  descriptions: z.string().nonempty(),
  categoryId: z.string().nonempty(),
  prices: z.array(priceSchema).nullable(),
  benefits: z.array(benefitSchema).nullable(),
});

export type DataSchema = z.infer<typeof dataSchema>;
export type OptionsType = typeof optionsType[number];

export {
  dataSchema,
  planType,
  statusType,
  optionsType
}