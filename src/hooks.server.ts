import { sequence } from '@sveltejs/kit/hooks';
import { render } from 'svelte/server';
import Page from '$lib/svova/CrudPage.svelte';
import Layout from "./routes/+layout.svelte";
import { readFileSync } from 'fs';
import { redirect } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '$lib/server/db/schema';
import { DATABASE_URL } from '$env/static/private';


function handleSvova({ event, resolve }) {
    if (!event.url.pathname.startsWith(formSchema.path)) {
        return resolve(event);
    }

    const view = event.url.pathname.split('/').pop();
    let all = [];
    let one = undefined;

    if (view === 'create') {
        // nothing to do
    } else if (view?.match(/\d/)) {
        if (typeof formSchema.fields.id.exampleValue === 'number') {
            one = loaders.one(parseInt(view));
        } else {
            one = loaders.one(view);
        }
    } else if (view === 'list') {
        all = loaders.list();
    } else {
        throw redirect(302, `${formSchema.path}/list`);
    }

    const html = renderWithLayout(Page, {
        props: {
            data: {
                form: formSchema,
                view: view,
                data: all,
                one
            }
        }
    });

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html'
        }
    });
}


function handleDrizzleInitialization({ event, resolve }) {
    if (event.locals.db) return resolve(event);

    const sqlite = new Database(DATABASE_URL);
    const db = drizzle(sqlite, { schema });
    event.locals.db = db;

    return resolve(event);
}

export const handle = sequence(
    //handleSvova,
    handleDrizzleInitialization
);

function renderWithLayout(Component, props = {}) {
    const page = render(Component, props);

    const { body: layoutHtml, head: layoutHead } = render(Layout, {
        props: {
            $$slots: { default: () => page.body },
            $$scope: {}
        }
    });

    const head = layoutHead + page.head;
    const appCss = readFileSync("src/app.css", 'utf8');

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          ${head}
          <style>${appCss}</style>
        </head>
        <body>
          ${layoutHtml}
        </body>
      </html>
    `;
}