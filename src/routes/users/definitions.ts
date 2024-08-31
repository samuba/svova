import { fakeDb } from "$lib/server/fakeDb";
import { extractActionParams, extractFields, finalizeRequest, sleep, type FieldsType, type FormSchema, type Loaders, type SvovaActions } from "$lib/svova/common";
import { createIdField } from "$lib/svova/fields/IdInputField.svelte";
import { createNumberField } from "$lib/svova/fields/NumberInputField.svelte";
import { createTextField } from "$lib/svova/fields/TextInputField.svelte";
import { type Actions, type RequestEvent } from "@sveltejs/kit";

const fields = {
    id: createIdField().build(),

    email: createTextField(`email`, `Email Address`)
        .max(100)
        .isRequired()
        .asEmail()
        .withPlaceholder(`Enter your email`)
        .withPattern(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`)
        .build(),

    password: createTextField(`password`, `Password`)
        .min(8)
        .isRequired()
        .asPassword()
        .withPlaceholder(`Enter your password`)
        .withHelpText(`Password must be at least 8 characters long`)
        .build(),

    income: createNumberField(`income`, `Income`)
        .withMin(0)
        .withHelpText(`Be real. How much money do you make in a year?`)
        .build(),


} satisfies FormSchema['fields'];

export const formSchema = {
    fields,
    FieldsType: {} as FieldsType<typeof fields>,
    path: `/users`
} satisfies FormSchema;

export type FormFields = typeof formSchema.FieldsType;

export const loaders = {
    list: async () => {
        return fakeDb.users;
    },
    one: async (id: number) => {
        return fakeDb.users.find(user => user.id === id);
    }
} satisfies Loaders<typeof formSchema.FieldsType>;

export const writers = {
    create: async ({ request }) => {
        const fields = await extractFields(request, formSchema.fields);
        console.log("create this", { fields });

        fakeDb.users.push({
            ...fields,
            id: fakeDb.users.length + 1
        });

        await finalizeRequest(request, formSchema);
    },
    update: async ({ request }) => {
        const fields = await extractFields(request, formSchema.fields);
        console.log("update this", { fields });

        const id = parseInt(fields.id as string);
        const userIndex = fakeDb.users.findIndex(user => user.id === id);

        if (userIndex === -1) {
            return {
                status: 404,
                body: { message: `User with id ${id} not found` }
            };
        }

        fakeDb.users[userIndex] = { ...fakeDb.users[userIndex], ...fields };

        await finalizeRequest(request, formSchema);
    },
    delete: async ({ request }) => {
        const id = (await request.formData()).get('id');
        console.log("delete", { id });

        fakeDb.users = fakeDb.users.filter(user => user.id !== parseInt(id));

        await finalizeRequest(request, formSchema);
    }
} satisfies Actions;


export const actions = [
    {
        name: "resendRegistrationEmail",
        label: "Resend Registration Email",
        params: {
            title: createTextField(`title`, `Title to use in Email`)
                .withPlaceholder("Professor")
                .build(),
        },
        handle(params: typeof this.params) {
            return async ({ request }: RequestEvent) => {
                const { modelIds, title } = await extractActionParams(request, params, formSchema);
                const models = fakeDb.getUsers(modelIds as number[]);

                console.log(`executing resendRegistrationEmail. title=${title} models=`, models);
                await sleep(2000);
            }
        },
    },
    {
        name: "blowCandles",
        label: "Blow Candles on the Cake",
        params: {
            strength: createNumberField(`strength`, `Strength of Blow`)
                .withMax(10)
                .withHelpText("0 is no strength, 10 is a strong blow")
                .build(),
        },
        handle(params: typeof this.params) {
            return async ({ request }: RequestEvent) => {
                const { modelIds, strength } = await extractActionParams(request, params, formSchema);
                const models = fakeDb.getUsers(modelIds as number[]);

                console.log(`executing resendRegistrationEmail. strength=${strength} models=`, models);
                await sleep(2000);
            }
        },
    }

]

