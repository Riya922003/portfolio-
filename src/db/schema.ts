import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  description: text('description'),
  tech: text('tech').array(),
  link: varchar('link', { length: 256 }),
  image: varchar('image', { length: 256 }), // <-- ADD THIS LINE
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  category: varchar('category', { length: 256 }), // e.g., 'Language', 'Framework'
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const feedbacks = pgTable('feedbacks', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').defaultNow(),
});