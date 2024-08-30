import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { writers, formSchema, loaders, actions as svovaActions } from '../definitions';
import { extractActionParams, extractFields, type FormSchemaFields, type SvovaActions } from '$lib/svova/common';

export const load = (async ({ params: { view } }) => {
    const form = formSchema;
    let all = [] as Awaited<ReturnType<typeof loaders.list>>;
    let one = undefined as Awaited<ReturnType<typeof loaders.one>>;

    console.log({ view })

    if (view === 'new') {
        // nothing to do
    } else if (view.match(/\d/)) {
        if (typeof formSchema.fields.id.exampleValue === 'number') {
            one = await loaders.one(parseInt(view));
        } else {
            one = await loaders.one(view);
        }
    } else if (view === 'list') {
        all = await loaders.list();
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

// const convertedSvovaActions = Object.fromEntries(
//     Object.entries(svovaActions).map(([key, { handler }]) => {
//         return [key, handler]
//     })
// );

const convertedSvovaActions = Object.fromEntries(
    svovaActions.map(x => ([x.name, x.handle(x.params)]))
);

console.log({ convertedSvovaActions })


export const actions = {
    ...writers,
    ...convertedSvovaActions
} satisfies Actions;

