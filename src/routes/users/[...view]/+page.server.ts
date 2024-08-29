import { extractFields } from '$lib/svova/common';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { formSchema, } from '../schema';
import { fakeDb } from '$lib/server/fakeDb';

export const load = (async ({ params: { view } }) => {
    const form = formSchema;
    let all = [] as typeof fakeDb.users;
    let one = undefined as typeof fakeDb.users[number] | undefined;

    console.log({ view })

    if (view === 'new') {
        // nothing to do
    } else if (view.match(/\d/)) {
        one = fakeDb.users.find(x => x.id === parseInt(view));
    } else if (view === 'list') {
        all = fakeDb.users
    } else {
        redirect(302, 'users/list');
    }

    return {
        form,
        view,
        data: all,
        one
    };
}) satisfies PageServerLoad;

export const actions = {
    create: async ({ request }) => {
        const fields = extractFields(await request.formData(), formSchema);
        console.log("create this", { fields });

        fakeDb.users.push({
            ...fields,
            id: fakeDb.users.length + 1
        });

        redirect(307, '/users/list');
    },
    update: async ({ request }) => {
        const fields = extractFields(await request.formData(), formSchema);
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

        redirect(307, '/users/list');
    },
    delete: async ({ request }) => {
        const id = (await request.formData()).get('id');
        console.log("delete", { id });

        fakeDb.users = fakeDb.users.filter(user => user.id !== parseInt(id));

        redirect(307, '/users/list');

    }
} satisfies Actions;

