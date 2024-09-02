import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { writers, formSchema, loaders, actions as svovaActions } from '../definitions';
import { extractFields } from '$lib/svova/common';

export const load = (async (event) => {
    const form = formSchema;
    let all = [] as Awaited<ReturnType<typeof loaders.list>>;
    let one = undefined as Awaited<ReturnType<typeof loaders.one>>;
    const { view } = event.params;

    if (view === 'create') {
        // nothing to do
    } else if (view.match(/\d/)) {
        const id = typeof formSchema.fields.id.exampleValue === 'number' ? parseInt(view) : view
        one = await loaders.one(id, event);
    } else if (view === 'list') {
        all = await loaders.list(event);
    } else {
        redirect(302, `${formSchema.path}/list`);
    }

    const actions = svovaActions.map(({ name, label, params }) => ({ name, label, params }));

    return {
        form,
        view,
        data: all,
        one,
        svovaActions: actions
    };
}) satisfies PageServerLoad;

export const actions = {
    create: async (event: RequestEvent) => {
        const fields = await extractFields(event.request, formSchema.fields);
        await writers.create(fields, event);
        redirect(307, `${formSchema.path}/list`);
    },
    update: async (event: RequestEvent) => {
        const fields = await extractFields(event.request, formSchema.fields);
        await writers.update(fields, event);
        redirect(307, `${formSchema.path}/list`);
    },
    delete: async (event: RequestEvent) => {
        const fields = await extractFields(event.request, formSchema.fields);
        await writers.delete(fields.id as number, event);
        redirect(307, `${formSchema.path}/list`);
    },
    ...Object.fromEntries(
        svovaActions.map(x => ([x.name, x.handle(x.params)]))
    )
} satisfies Actions;

