import { relations, sql } from 'drizzle-orm'
import { boolean, datetime, double, json, mysqlEnum, mysqlTable, varchar,text ,timestamp} from 'drizzle-orm/mysql-core'
import { v4 as uuidv7 } from 'uuid';
// Enums
export const userStatusEnum = mysqlEnum('status', ['Draft', 'Active', 'NonActive']);
export const blogStatusEnum = mysqlEnum('status', ['Published', 'Takedown', 'Draft']);
export const careerStatusEnum = mysqlEnum('status', ['Rejected', 'Review', 'Accepted']);


export const user = mysqlTable('user', {
	id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	password: varchar('password', { length: 255 }).notNull(),
	status: userStatusEnum.notNull(),
	refreshToken: text('refresh_token'),
	role: varchar('role', { length: 50 }).notNull(),
	features: json('features'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
  });

  
export const planService = mysqlTable('planservice', {
	//id: varchar('id', { length: 191 }).notNull().primaryKey().default(sql`uuid(4)`),
	id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
	name: varchar('name', { length: 191 }).notNull(),
	type: mysqlEnum('type', ['Standard', 'Premium']).notNull(),
	showPrice: boolean('showPrice').notNull().default(true),
	status: mysqlEnum('status', ['Draft', 'Active', 'NonActive']).notNull(),
	options: varchar('options', { length: 191 }).notNull(),
	descriptions: varchar('descriptions', { length: 191 }).notNull(),
	categoryId: varchar('categoryId', { length: 191 }).notNull()
});

export const categoryService = mysqlTable('categoryservice', {
	id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
	name: varchar('name', { length: 191 }).notNull().unique(),
	heading: varchar('heading', { length: 191 }).notNull(),
	description: varchar('description', { length: 191 }).notNull(),
	status: mysqlEnum('status', ['Draft', 'Active', 'NonActive']).notNull(),
	slug: varchar('slug', { length: 191 }).notNull().unique()
});

export const price = mysqlTable('price', {
	id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
	curr: mysqlEnum('curr', ['IDR', 'SGR', 'MYR']).notNull(),
	amount: double('amount').notNull(),
	discount: double('discount').notNull(),
	idPlan: varchar('idPlan', { length: 191 }).notNull()
});

export const benefit = mysqlTable('benefit', {
	id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
	value: varchar('value', { length: 191 }).notNull(),
	idPlan: varchar('idPlan', { length: 191 }).notNull()
});

export const role = mysqlTable('role', {
	id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
	name: varchar('name', { length: 191 }).notNull(),
	email: varchar('email', { length: 191 }).notNull().unique(),
	password: varchar('password', { length: 191 }).notNull(),
	status: mysqlEnum('status', ['Draft', 'Active', 'NonActive']).notNull(),
	refreshToken: varchar('refreshToken', { length: 191 }),
	role: varchar('role', { length: 191 }).notNull(),
	features: json('features').notNull()
});

export const blogCategory = mysqlTable('blog_category', {
	id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
	name: varchar('name', { length: 255 }).notNull().unique(),
	slug: varchar('slug', { length: 255 }).notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	status: boolean('status').notNull(),
  });
  
  export const blog = mysqlTable('blog', {
	id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
	title: varchar('title', { length: 255 }).notNull(),
	image: text('image').notNull(),
	content: text('content').notNull(),
	slug: varchar('slug', { length: 255 }).notNull().unique(),
	status: blogStatusEnum.notNull(),
	favorite: boolean('favorite').notNull(),
	categoryId: varchar('category_id', { length: 36 })
	  .notNull()
	  .references(() => blogCategory.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	userId: varchar('user_id', { length: 36 })
	  .notNull()
	  .references(() => user.id, { onDelete: 'cascade' }),
  });
  

export const pages = mysqlTable('pages', {
	id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
	page: varchar('page', { length: 191 }).notNull(),
	slug: varchar('slug', { length: 191 }).notNull().unique(),
	categoryServiceId: varchar('categoryServiceId', { length: 191 }).unique()
});

export const metaTag = mysqlTable('metatag', {
	id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
	key: varchar('key', { length: 191 }).notNull(),
	value: varchar('value', { length: 191 }).notNull(),
	content: varchar('content', { length: 191 }).notNull(),
	slug: varchar('slug', { length: 191 }).notNull()
});

export const order = mysqlTable('order', {
	id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
	amount: double('amount').notNull(),
	bussiness: varchar('bussiness', { length: 191 }).notNull(),
	categoryId: varchar('categoryId', { length: 191 }).notNull(),
	date: varchar('date', { length: 191 }).notNull(),
	email: varchar('email', { length: 191 }).notNull(),
	message: varchar('message', { length: 191 }).notNull(),
	name: varchar('name', { length: 191 }).notNull(),
	phoneNumber: varchar('phoneNumber', { length: 191 }).notNull(),
	idPlan: varchar('idPlan', { length: 191 }).notNull(),
	time: varchar('time', { length: 191 }).notNull()
});

export const career = mysqlTable('career', {
	id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	phoneNumber: varchar('phoneNumber', { length: 255 }).notNull(),
	position: varchar('position', { length: 255 }).notNull(),
	resume: text('resume').notNull(),
	portfolio: varchar('portfolio', { length: 255 }).notNull(),
	message: text('message'),
	status: careerStatusEnum.notNull().$defaultFn(() => 'Review'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
  });

// Relations

export const planServiceRelations = relations(planService, ({ many, one }) => ({
	prices: many(price, { relationName: 'PlanServiceToPrice' }),
	benefits: many(benefit, { relationName: 'BenefitToPlanService' }),
	category: one(categoryService, {
		relationName: 'CategoryServiceToPlanService',
		fields: [planService.categoryId],
		references: [categoryService.id]
	}),
	orders: many(order, { relationName: 'OrderToPlanService' })
}));

export const categoryServiceRelations = relations(categoryService, ({ many }) => ({
	plans: many(planService, { relationName: 'CategoryServiceToPlanService' }),
	orders: many(order, { relationName: 'CategoryServiceToOrder' }),
	pages: many(pages, { relationName: 'CategoryServiceToPages' })
}));

export const priceRelations = relations(price, ({ one }) => ({
	plan: one(planService, {
		relationName: 'PlanServiceToPrice',
		fields: [price.idPlan],
		references: [planService.id]
	})
}));

export const benefitRelations = relations(benefit, ({ one }) => ({
	plan: one(planService, {
		relationName: 'BenefitToPlanService',
		fields: [benefit.idPlan],
		references: [planService.id]
	})
}));

export const roleRelations = relations(role, ({ many }) => ({
	blogs: many(blog, { relationName: 'BlogToRole' })
}));

// export const blogRelations = relations(blog, ({ one }) => ({
// 	category: one(blogCategory, {
// 		relationName: 'BlogToBlogCategory',
// 		fields: [blog.categoryId],
// 		references: [blogCategory.id]
// 	}),
// 	role: one(role, {
// 		relationName: 'BlogToRole',
// 		fields: [blog.roleId],
// 		references: [role.id]
// 	})
// }));

// export const blogCategoryRelations = relations(blogCategory, ({ many }) => ({
// 	blogs: many(blog, { relationName: 'BlogToBlogCategory' })
// }));

export const pagesRelations = relations(pages, ({ many, one }) => ({
	meta: many(metaTag, { relationName: 'MetaTagToPages' }),
	categoryService: one(categoryService, {
		relationName: 'CategoryServiceToPages',
		fields: [pages.categoryServiceId],
		references: [categoryService.id]
	})
}));

export const metaTagRelations = relations(metaTag, ({ one }) => ({
	pages: one(pages, {
		relationName: 'MetaTagToPages',
		fields: [metaTag.slug],
		references: [pages.slug]
	})
}));

export const orderRelations = relations(order, ({ one }) => ({
	category: one(categoryService, {
		relationName: 'CategoryServiceToOrder',
		fields: [order.categoryId],
		references: [categoryService.id]
	}),
	plan: one(planService, {
		relationName: 'OrderToPlanService',
		fields: [order.idPlan],
		references: [planService.id]
	})
}));
