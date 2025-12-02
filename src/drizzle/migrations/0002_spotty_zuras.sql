CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '',
	"completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
