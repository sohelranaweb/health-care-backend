import { z } from "zod";

const create = z.object({
  title: z.string({
    error: "Title is required!",
  }),
  description: z.string({ error: "Description is required" }),
});

export const SymptomsValidtaion = {
  create,
};
