import { relations } from "drizzle-orm";
import { blog, blogCategory, user, partnerLead, partnerLeadNote } from "./schema.js";

// Relasi untuk blogCategory → blog
export const blogCategoryRelations = relations(blogCategory, ({ many }) => ({
  blogs: many(blog), // blog.categoryId → blogCategory.id
}));

// Relasi untuk user → blog
export const userRelations = relations(user, ({ many }) => ({
  blogs: many(blog), // blog.userId → user.id
}));

// Relasi untuk partnerLead → partnerLeadNote
export const partnerLeadRelations = relations(partnerLead, ({ many }) => ({
  notes: many(partnerLeadNote),
}));

export const partnerLeadNoteRelations = relations(partnerLeadNote, ({ one }) => ({
  lead: one(partnerLead, {
    fields: [partnerLeadNote.leadId],
    references: [partnerLead.id],
  }),
}));

// Relasi untuk blog → blogCategory dan user
export const blogRelations = relations(blog, ({ one }) => ({
  category: one(blogCategory, {
    fields: [blog.categoryId],
    references: [blogCategory.id],
  }),
  author: one(user, {
    fields: [blog.userId],
    references: [user.id],
  }),
}));
