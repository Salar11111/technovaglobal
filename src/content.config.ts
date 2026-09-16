import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

const changelog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/changelog' }),
  schema: z.object({
    version: z.string(),
    date: z.date(),
    title: z.string(),
    changes: z.array(z.object({
      type: z.enum(['added', 'changed', 'fixed', 'removed', 'security']),
      description: z.string(),
    })),
  }),
});

export const collections = { blog, changelog };