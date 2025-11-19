CREATE TABLE "feedbacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"feedback" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(256),
	"message" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"description" text,
	"tech" text[],
	"link" varchar(256),
	"image" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"category" varchar(256)
);
