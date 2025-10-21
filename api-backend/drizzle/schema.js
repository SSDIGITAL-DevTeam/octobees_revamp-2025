import { relations, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  double,
  json,
  mysqlEnum,
  mysqlTable,
  varchar,
  text,
  timestamp,
  int,
} from "drizzle-orm/mysql-core";
import { v4 as uuidv7 } from "uuid";

// Enums
export const userStatusEnum = mysqlEnum("status", [
  "Draft",
  "Active",
  "NonActive",
]);

export const blogStatusEnum = mysqlEnum("status", [
  "Published",
  "Takedown",
  "Draft",
]);

export const careerStatusEnum = mysqlEnum("status", [
  "Rejected",
  "Review",
  "Accepted",
]);

export const affiliateStatusEnum = mysqlEnum("status", ["pending", "approved", "rejected"]);

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  status: userStatusEnum.notNull(),
  refreshToken: text("refresh_token"),
  role: varchar("role", { length: 50 }).notNull(),
  features: json("features"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const planService = mysqlTable("planservice", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 191 }).notNull(),
  type: mysqlEnum("type", ["Standard", "Premium"]).notNull(),
  showPrice: boolean("showPrice").notNull().default(true),
  status: mysqlEnum("status", ["Draft", "Active", "NonActive"]).notNull(),
  options: varchar("options", { length: 191 }).notNull(),
  descriptions: varchar("descriptions", { length: 191 }).notNull(),
  categoryId: varchar("categoryId", { length: 191 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoryService = mysqlTable("categoryservice", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 191 }).notNull().unique(),
  heading: varchar("heading", { length: 191 }).notNull(),
  description: varchar("description", { length: 191 }).notNull(),
  status: mysqlEnum("status", ["Draft", "Active", "NonActive"]).notNull().default("Draft"),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const price = mysqlTable("price", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  curr: mysqlEnum("curr", ["IDR", "SGR", "MYR"]).notNull(),
  amount: double("amount").notNull(),
  discount: double("discount").notNull(),
  idPlan: varchar("idPlan", { length: 191 }).notNull(),
});

export const benefit = mysqlTable("benefit", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  value: varchar("value", { length: 191 }).notNull(),
  idPlan: varchar("idPlan", { length: 191 }).notNull(),
});

export const role = mysqlTable("role", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  password: varchar("password", { length: 191 }).notNull(),
  status: mysqlEnum("status", ["Draft", "Active", "NonActive"]).notNull(),
  refreshToken: varchar("refreshToken", { length: 191 }),
  role: varchar("role", { length: 191 }).notNull(),
  features: json("features").notNull(),
});

export const blogCategory = mysqlTable("blog_category", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  status: boolean("status").notNull(),
});

export const blog = mysqlTable("blog", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: varchar("title", { length: 255 }).notNull(),
  image: text("image").notNull(),
  content: text("content").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  status: blogStatusEnum.notNull(),
  favorite: boolean("favorite").notNull(),
  categoryId: varchar("category_id", { length: 36 })
    .notNull()
    .references(() => blogCategory.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const pages = mysqlTable("pages", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  page: varchar("page", { length: 191 }).notNull(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  source: varchar("source", { length: 191 }).notNull().default("none"),
  categoryServiceId: varchar("categoryServiceId", { length: 191 }).default(null),
  blogId: varchar("blogId", { length: 191 }).default(null), //tambahan 
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const metaTag = mysqlTable("metatag", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  key: varchar("key", { length: 191 }).notNull(),
  value: varchar("value", { length: 191 }).notNull(),
  content: varchar("content", { length: 191 }).notNull(),
  slug: varchar("slug", { length: 191 })
    .notNull()
    .references(() => pages.slug, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const order = mysqlTable("order", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  amount: double("amount").notNull(),
  currency: mysqlEnum("currency", ["IDR", "SGD", "MYR"]).default("IDR").notNull(),
  bussiness: varchar("bussiness", { length: 191 }).notNull(),
  categoryId: varchar("categoryId", { length: 191 }).notNull(),
  date: varchar("date", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull(),
  message: varchar("message", { length: 191 }).notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 191 }).notNull(),
  idPlan: varchar("idPlan", { length: 191 }).notNull(),
  time: varchar("time", { length: 191 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const position = mysqlTable("position", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  status: mysqlEnum("status", ["Active", "NonActive"])
    .notNull()
    .default("Active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const career = mysqlTable("career", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phoneNumber: varchar("phoneNumber", { length: 255 }).notNull(),
  positionId: int("positionId").references(() => position.id, {
    onDelete: "cascade",
  }),
  resume: text("resume").notNull(),
  portfolio: varchar("portfolio", { length: 255 }).notNull(),
  message: text("message"),
  status: careerStatusEnum.notNull().$defaultFn(() => "Review"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const subscription = mysqlTable("subscription", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  insight: varchar("insight", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Relations
export const positionRelations = relations(position, ({ many }) => ({
  careers: many(career),
}));

export const careerRelations = relations(career, ({ one }) => ({
  position: one(position, {
    fields: [career.positionId],
    references: [position.id],
  }),
}));

export const planServiceRelations = relations(planService, ({ many, one }) => ({
  prices: many(price, { relationName: "PlanServiceToPrice" }),
  benefits: many(benefit, { relationName: "BenefitToPlanService" }),
  category: one(categoryService, {
    relationName: "CategoryServiceToPlanService",
    fields: [planService.categoryId],
    references: [categoryService.id],
  }),
  orders: many(order, { relationName: "OrderToPlanService" }),
}));

export const categoryServiceRelations = relations(
  categoryService,
  ({ many }) => ({
    plans: many(planService, { relationName: "CategoryServiceToPlanService" }),
    orders: many(order, { relationName: "CategoryServiceToOrder" }),
    pages: many(pages, { relationName: "CategoryServiceToPages" }),
  })
);

export const priceRelations = relations(price, ({ one }) => ({
  plan: one(planService, {
    relationName: "PlanServiceToPrice",
    fields: [price.idPlan],
    references: [planService.id],
  }),
}));

export const benefitRelations = relations(benefit, ({ one }) => ({
  plan: one(planService, {
    relationName: "BenefitToPlanService",
    fields: [benefit.idPlan],
    references: [planService.id],
  }),
}));

export const roleRelations = relations(role, ({ many }) => ({
  blogs: many(blog, { relationName: "BlogToRole" }),
}));

export const pagesRelations = relations(pages, ({ many, one }) => ({
  meta: many(metaTag, { relationName: "MetaTagToPages" }),
  categoryService: one(categoryService, {
    relationName: "CategoryServiceToPages",
    fields: [pages.categoryServiceId],
    references: [categoryService.id],
  }),
  blog: one(blog, {
    relationName: "BlogToPages",
    fields: [pages.blogId],
    references: [blog.id],
  }),
}));

export const metaTagRelations = relations(metaTag, ({ one }) => ({
  pages: one(pages, {
    relationName: "MetaTagToPages",
    fields: [metaTag.slug],
    references: [pages.slug],
  }),
}));

export const orderRelations = relations(order, ({ one }) => ({
  category: one(categoryService, {
    relationName: "CategoryServiceToOrder",
    fields: [order.categoryId],
    references: [categoryService.id],
  }),
  plan: one(planService, {
    relationName: "OrderToPlanService",
    fields: [order.idPlan],
    references: [planService.id],
  }),
}));


export const metas = mysqlTable('metas', {
  id: int('id').autoincrement().primaryKey(),
  key: varchar('key', { length: 255 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  content: text('content'),
  metaableId: varchar('metaable_id', { length: 36 }).notNull(), // UUID of target
  metaableType: varchar('metaable_type', { length: 50 }).notNull(), // e.g., 'blog'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const affiliateApplication = mysqlTable("affiliate_application", {
  id: varchar("id", { length: 36 }).primaryKey(),
  fullName: varchar("full_name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull(),
  countryCode: varchar("country_code", { length: 8 }),
  phone: varchar("phone", { length: 32 }),
  phoneE164: varchar("phone_e164", { length: 32 }),
  country: varchar("country", { length: 120 }).notNull(),
  govOrBusinessId: varchar("gov_or_business_id", { length: 191 }),
  strategy: text("strategy").notNull(),
  portfolioLinks: text("portfolio_links"),
  motivation: text("motivation"),
  otherPrograms: text("other_programs"),
  status: affiliateStatusEnum.notNull().default("pending"),
  notes: text("notes"),
  reviewedAt: datetime("reviewed_at"),
  reviewerId: varchar("reviewer_id", { length: 36 }),
  ipAddress: varchar("ip_address", { length: 64 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});