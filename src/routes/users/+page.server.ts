import { extractFields } from '$lib/svova/common';
import type { Actions, PageServerLoad } from './$types';
import { formSchema, } from './schema';

export const load = (async () => {
    return {
        form: formSchema,
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        const fields = extractFields(await request.formData(), formSchema);

        console.log("this got posted", { fields });
    },
} satisfies Actions;

