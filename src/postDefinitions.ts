import { fakeDb } from "$lib/server/fakeDb";
import { createFieldsType, extractFields, finalizeRequest, type FormSchema, type Loaders } from "$lib/svova/common";
import { createIdField } from "$lib/svova/fields/IdInputField.svelte";
import { createTextField } from "$lib/svova/fields/TextInputField.svelte";
import { type Actions } from "@sveltejs/kit";

const fields = {
    id: createIdField<number>({ dataType: 'number' }).build(),

    title: createTextField(`title`, `Title`)
        .max(100)
        .isRequired()
        .asEmail()
        .withPlaceholder(`Enter your email`)
        .withPattern(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`)
        .build(),

    content: createTextField(`content`, `Content`)
        .min(8)
        .isRequired()
        .asPassword()
        .withPlaceholder(`Enter your password`)
        .withHelpText(`Password must be at least 8 characters long`)
        .build(),


} satisfies FormSchema['fields'];

export const formSchema = {
    fields,
    FieldsType: createFieldsType(fields),
    path: `/posts`
} satisfies FormSchema;

export const loaders = {
    list: async () => {
        return fakeDb.posts;
    },
    one: async (id: number) => {
        return fakeDb.posts.find(user => user.id === id);
    }
} satisfies Loaders<typeof formSchema.FieldsType>;

export const actions = {
    create: async ({ request }) => {
        const fields = await extractFields(request, formSchema);
        console.log("create this", { fields });

        fakeDb.posts.push({
            ...fields,
            id: fakeDb.posts.length + 1
        });

        await finalizeRequest(request, formSchema);
    },
    update: async ({ request }) => {
        const fields = await extractFields(request, formSchema);
        console.log("update this", { fields });

        const id = parseInt(fields.id as string);
        const index = fakeDb.posts.findIndex(user => user.id === id);

        if (index === -1) {
            return {
                status: 404,
                body: { message: `Post with id ${id} not found` }
            };
        }

        fakeDb.posts[index] = { ...fakeDb.posts[index], ...fields };

        await finalizeRequest(request, formSchema);
    },
    delete: async ({ request }) => {
        const id = (await request.formData()).get('id');
        console.log("delete", { id });

        fakeDb.posts = fakeDb.posts.filter(user => user.id !== parseInt(id));

        await finalizeRequest(request, formSchema);
    }
} satisfies Actions;

