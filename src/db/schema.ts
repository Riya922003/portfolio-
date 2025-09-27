import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  description: text('description'),
  tech: text('tech').array(), // Defines an array of strings
  link: varchar('link', { length: 256 }),
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  category: varchar('category', { length: 256 }), // e.g., 'Language', 'Framework'
});