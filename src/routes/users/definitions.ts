import { fakeDb } from "$lib/server/fakeDb";
import { extractActionParams, extractFields, finalizeRequest, sleep, type FieldsType, type FormSchema, type Loaders, type SvovaActions } from "$lib/svova/common";
import { createIdField } from "$lib/svova/fields/IdInputField.svelte";
import { createNumberField } from "$lib/svova/fields/NumberInputField.svelte";
import { createTextField } from "$lib/svova/fields/TextInputField.svelte";
import { type Actions, type RequestEvent } from "@sveltejs/kit";
import * as s from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

const fields = {
    id: createIdField().build(),

    name: createTextField(`name`, `Full Name`)
        .max(100)
        .isRequired()
        .withPlaceholder(`Enter your full name`)
        .withHelpText(`Please provide your full name`)
        .build(),

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
    list: async ({ locals: { db } }) => {
        return await db.select().from(s.users).all();
    },
    one: async (id, { locals: { db } }) => {
        return await db.select().from(s.users).where(eq(s.users.id, id)).get();
    }
} satisfies Loaders<typeof formSchema.FieldsType>;

export const writers = {
    create: async ({ request, locals: { db } }) => {
        const fields = await extractFields(request, formSchema.fields);

        await db.insert(s.users).values({
            name: fields.name,
            email: fields.email,
            password: fields.password,
            income: fields.income
        }).run();

        await finalizeRequest(request, formSchema);
    },
    update: async ({ request, locals: { db } }) => {
        const fields = await extractFields(request, formSchema.fields);
        const id = parseInt(fields.id as string);

        await db.update(s.users).set({
            name: fields.name,
            email: fields.email,
            password: fields.password,
            income: fields.income
        }).where(eq(s.users.id, id)).run();

        await finalizeRequest(request, formSchema);
    },
    delete: async ({ request, locals: { db } }) => {
        const id = (await request.formData()).get('id');

        await db.delete(s.users).where(eq(s.users.id, parseInt(id as string))).run();

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

        },
        handle(params: typeof this.params) {
            return async ({ request }: RequestEvent) => {
                const { modelIds } = await extractActionParams(request, params, formSchema);
                const models = fakeDb.getUsers(modelIds as number[]);

                console.log(`executing blow candles.  models=`, models);
                await sleep(2000);
            }
        },
    }

] as const