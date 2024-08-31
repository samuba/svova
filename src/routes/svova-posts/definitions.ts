
import { extractActionParams, extractFields, finalizeRequest, type FieldsType, type FormSchema, type Loaders } from "$lib/svova/common";
import { createIdField } from "$lib/svova/fields/IdInputField.svelte";
import { createNumberField } from "$lib/svova/fields/NumberInputField.svelte";
import { createTextField } from "$lib/svova/fields/TextInputField.svelte";
import { createBooleanField } from "$lib/svova/fields/BooleanInputField.svelte";
import { createDateField } from "$lib/svova/fields/DateInputField.svelte";
import { type Actions } from "@sveltejs/kit";
import * as s from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

const fields = {
    id: createTextField(`id`, `Id`)
        .isRequired()
        .build(),
    title: createTextField(`title`, `Title`)
        .isRequired()
        .build(),
    published: createBooleanField(`published`, `Published`)
        .isRequired()
        .build(),
    text: createTextField(`text`, `Text`)
        .isRequired()
        .build(),

} satisfies FormSchema['fields'];

export const formSchema = {
    fields,
    FieldsType: {} as FieldsType<typeof fields>,
    path: `/posts`
} satisfies FormSchema;

export type FormFields = typeof formSchema.FieldsType;

export const loaders = {
    list: async ({ locals: { db } }) => {
        return await db.select().from(s.posts).all();
    },
    one: async (id, { locals: { db } }) => {
        return await db.select().from(s.posts).where(eq(s.posts.id, id)).get();
    }
} satisfies Loaders<typeof formSchema.FieldsType>;

export const writers = {
    create: async ({ request, locals: { db } }) => {
        const fields = await extractFields(request, formSchema.fields);

        await db.insert(s.posts).values(fields).run();

        await finalizeRequest(request, formSchema);
    },
    update: async ({ request, locals: { db } }) => {
        const fields = await extractFields(request, formSchema.fields);
        const id = parseInt(fields.id as string);

        await db.update(s.posts).set(fields).where(eq(s.posts.id, id)).run();

        await finalizeRequest(request, formSchema);
    },
    delete: async ({ request, locals: { db } }) => {
        const id = (await request.formData()).get('id');

        await db.delete(s.posts).where(eq(s.posts.id, parseInt(id as string))).run();

        await finalizeRequest(request, formSchema);
    }
} satisfies Actions;

export const actions = [
    // TODO: Add custom actions if needed
] as const;
