import { Status } from "types";
import { z } from "zod";

export const zodFilterSchema = {
  status: z.coerce
    .string()
    .transform((status) => {
      const stringToList = status.split(";");

      const listOfStatus = stringToList
        .filter((status) => status)
        .map((status) => status as Status);

      return listOfStatus;
    })
    .optional(),
  sorterBy: z.string().optional(),
  sorterOrder: z
    .string()
    .transform((order) => (order === "descend" ? "desc" : "asc"))
    .optional()
    .default("desc"),
  page: z.coerce.number().min(1).optional().default(1),
  perPage: z.coerce.number().optional().default(20),
};
