
import { extractActionParams, extractFields, finalizeRequest, type FieldsType, type FormSchema, type Loaders } from "$lib/svova/common";
import { createIdField } from "$lib/svova/fields/IdInputField.svelte";
import { createNumberField } from "$lib/svova/fields/NumberInputField.svelte";
import { createTextField } from "$lib/svova/fields/TextInputField.svelte";
import { createBooleanField } from "$lib/svova/fields/BooleanInputField.svelte";
import { createDateField } from "$lib/svova/fields/DateInputField.svelte";
import { type Actions } from "@sveltejs/kit";

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
    list: async () => {
        // TODO: Implement list loader
        return [];
    },
    one: async (id: number) => {
        // TODO: Implement one loader
        return null;
    }
} satisfies Loaders<typeof formSchema.FieldsType>;

export const writers = {
    create: async ({ request, locals: { db } }) => {
        const fields = await extractFields(request, formSchema.fields);
        console.log("create this", { fields });
        // TODO: Implement create writer
        await finalizeRequest(request, formSchema);
    },
    update: async ({ request }) => {
        const fields = await extractFields(request, formSchema.fields);
        console.log("update this", { fields });
        // TODO: Implement update writer
        await finalizeRequest(request, formSchema);
    },
    delete: async ({ request }) => {
        const id = (await request.formData()).get('id');
        console.log("delete", { id });
        // TODO: Implement delete writer
        await finalizeRequest(request, formSchema);
    }
} satisfies Actions;

export const actions = [
    // TODO: Add custom actions if needed
] as const;
