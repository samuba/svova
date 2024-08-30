import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { formSchema } from './definitions';

export const load = (async () => {
    redirect(302, `${formSchema.path}/list`);
}) satisfies PageServerLoad;

