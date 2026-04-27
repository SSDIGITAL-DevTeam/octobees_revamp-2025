import { relations } from "drizzle-orm";
import {
  benefit,
  blog,
  blogCategory,
  career,
  categoryService,
  partnerLead,
  partnerLeadNote,
  planService,
  position,
  price,
  user,
} from "./schema.js";

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

export const categoryServiceRelations = relations(categoryService, ({ many }) => ({
  plans: many(planService),
}));

export const planServiceRelations = relations(planService, ({ one, many }) => ({
  category: one(categoryService, {
    fields: [planService.categoryId],
    references: [categoryService.id],
  }),
  prices: many(price),
  benefits: many(benefit),
}));

export const priceRelations = relations(price, ({ one }) => ({
  plan: one(planService, {
    fields: [price.idPlan],
    references: [planService.id],
  }),
}));

export const benefitRelations = relations(benefit, ({ one }) => ({
  plan: one(planService, {
    fields: [benefit.idPlan],
    references: [planService.id],
  }),
}));

export const positionRelations = relations(position, ({ many }) => ({
  careers: many(career),
}));

export const careerRelations = relations(career, ({ one }) => ({
  position: one(position, {
    fields: [career.positionId],
    references: [position.id],
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
