import { defineCollection, z } from 'astro:content';

const noteSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
});

export const collections = {
  master: defineCollection({ type: 'data', schema: z.array(noteSchema) }),
  bachelor: defineCollection({ type: 'data', schema: z.array(noteSchema) }),
  tutorato: defineCollection({ type: 'data', schema: z.array(noteSchema) }),
};
