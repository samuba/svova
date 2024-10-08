import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull(),
	password: text('password').notNull(),
	income: integer('income').notNull(),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true)
});

export const posts = sqliteTable('posts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	published: integer('published', { mode: 'boolean' }).notNull().default(false),
	text: text('text')
});

export const comments = sqliteTable('comments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	postId: integer('post_id').notNull().references(() => posts.id),
	userId: integer('user_id').notNull().references(() => users.id),
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique()
});

export const postCategories = sqliteTable('post_categories', {
	postId: integer('post_id').notNull().references(() => posts.id),
	categoryId: integer('category_id').notNull().references(() => categories.id)
}, (table) => ({
	pk: primaryKey({ columns: [table.postId, table.categoryId] })
}));

export const likes = sqliteTable('likes', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id').notNull().references(() => users.id),
	postId: integer('post_id').notNull().references(() => posts.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});
