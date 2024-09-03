import type { PageServerLoad } from './$types';
import * as s from '$lib/server/db/schema';
import { SQLiteTable } from 'drizzle-orm/sqlite-core';

export const load = (async () => {
    const potentialModels = Object.entries(s).map(([key, value]) => {
        if (value instanceof SQLiteTable && value['id']) {
            return key
        }
    })
    console.log(potentialModels)

    const formSchemas = []
    for (const model of potentialModels) {
        try {
            const definitions = await import(`./${model}/definitions`)
            formSchemas.push(definitions.formSchema)
        } catch (e) {
            //
        }
    }
    return {
        formSchemas
    }
}) satisfies PageServerLoad;