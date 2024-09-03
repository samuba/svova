
import { extractActionParams, getRoutePathToFile, sleep, type FieldsType, type FormSchema, type Loaders, type Writers } from "$lib/svova/common";
import { type RequestEvent } from "@sveltejs/kit";
import * as s from "$lib/server/db/schema";
import { eq, inArray, type Simplify } from "drizzle-orm";
import { createBooleanField, createIdField, createNumberField, createTextField } from "$lib/svova/fields";

const fields = {
    id: createIdField({ dataType: 'number' }),
    title: createTextField(`title`, `Title`, {
        required: true,
        placeholder: `Enter title`,
        helpText: `Please provide title`,
    }),
    published: createBooleanField(`published`, `Is Published`, {
        defaultValue: false,
    }),
    text: createTextField(`text`, `Text`, {
        required: false,
        placeholder: `Enter text`,
        helpText: `Please provide text`,
    }),

} satisfies FormSchema['fields']

export const actions = [
    // Add custom actions here if needed
] as const

export const formSchema = {
    fields,
    FieldsType: {} as Simplify<FieldsType<typeof fields>>,
    path: getRoutePathToFile(import.meta) // `/posts`
} satisfies FormSchema;

export type FormFields = typeof formSchema.FieldsType;

export const loaders = {
    list: async ({ locals: { db } }) => {
        return await db.select().from(s.posts);
    },
    one: async (id, { locals: { db } }) => {
        return await db.select().from(s.posts).where(eq(s.posts.id, id)).get();
    }
} satisfies Loaders<typeof formSchema>;

export const writers = {
    create: async (fields, { locals: { db } }) => {
        await db.insert(s.posts).values(fields).run();
    },
    update: async (fields, { locals: { db } }) => {
        await db.update(s.posts).set(fields).where(eq(s.posts.id, fields.id as number)).run();
    },
    delete: async (id, { locals: { db } }) => {
        await db.delete(s.posts).where(eq(s.posts.id, id)).run();
    }
} satisfies Writers<typeof formSchema>;
