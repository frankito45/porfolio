import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    category: z.string(),
    image: z.string().optional(),
    demo: z.string().url().optional(),
    github: z.string().url().optional(),
  })
});


const blogs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    image: z.string().optional(),
  })
})

export const collections = { projects, blogs };

