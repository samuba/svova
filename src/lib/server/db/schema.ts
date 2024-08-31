import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	age: integer('age')
});

export const posts = sqliteTable('posts', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	published: integer('published', { mode: 'boolean' }).notNull().default(false),
	text: text('text')
});

export const comments = sqliteTable('comments', {
	id: integer('id').primaryKey(),
	postId: integer('post_id').notNull().references(() => posts.id),
	userId: integer('user_id').notNull().references(() => users.id),
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey(),
	name: text('name').notNull().unique()
});

export const postCategories = sqliteTable('post_categories', {
	postId: integer('post_id').notNull().references(() => posts.id),
	categoryId: integer('category_id').notNull().references(() => categories.id)
}, (table) => ({
	pk: primaryKey({ columns: [table.postId, table.categoryId] })
}));

export const likes = sqliteTable('likes', {
	id: integer('id').primaryKey(),
	userId: integer('user_id').notNull().references(() => users.id),
	postId: integer('post_id').notNull().references(() => posts.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});
