import { extractActionParams, getRoutePathToFile, sleep, type FieldsType, type FormSchema, type Loaders, type Writers } from "$lib/svova/common";
import { type RequestEvent } from "@sveltejs/kit";
import * as s from "$lib/server/db/schema";
import { eq, inArray, type Simplify } from "drizzle-orm";
import { createIdField, createNumberField, createTextField } from "$lib/svova/fields";

const fields = {
    id: createIdField<number>({ dataType: 'number' }).build(),

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
            return async ({ request, locals: { db } }: RequestEvent) => {
                const { modelIds, title } = await extractActionParams(request, params, formSchema);
                const models = db.select().from(s.users).where(inArray(s.users.id, modelIds)).all();

                console.log(`executing resendRegistrationEmail. title=${title} models=`, models);
                await sleep(500);
            }
        },
    },
    {
        name: "blowCandles",
        label: "Blow Candles on the Cake",
        params: {

        },
        handle(params: typeof this.params) {
            return async ({ request, locals: { db } }: RequestEvent) => {
                const { modelIds } = await extractActionParams(request, params, formSchema);
                const models = db.select().from(s.users).where(inArray(s.users.id, modelIds)).all();

                console.log(`executing blow candles.  models=`, models);
                await sleep(500);
            }
        },
    }

] as const

export const formSchema = {
    fields,
    FieldsType: {} as Simplify<FieldsType<typeof fields>>,
    path: getRoutePathToFile(import.meta) // `/users`
} satisfies FormSchema;

export type FormFields = typeof formSchema.FieldsType;

export const loaders = {
    list: async ({ locals: { db } }) => {
        return await db.select().from(s.users);
    },
    one: async (id, { locals: { db } }) => {
        return await db.select().from(s.users).where(eq(s.users.id, id)).get();
    }
} satisfies Loaders<typeof formSchema>;

export const writers = {
    create: async (fields, { locals: { db } }) => {
        await db.insert(s.users).values(fields).run();
    },
    update: async (fields, { locals: { db } }) => {
        await db.update(s.users).set(fields).where(eq(s.users.id, fields.id as number)).run();
    },
    delete: async (id, { locals: { db } }) => {
        await db.delete(s.users).where(eq(s.users.id, id)).run();
    }
} satisfies Writers<typeof formSchema>;

