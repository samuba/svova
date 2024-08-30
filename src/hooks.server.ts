import type { Handle } from '@sveltejs/kit';
import { formSchema, loaders } from './postDefinitions';
import { render } from 'svelte/server';
import Page from '$lib/svova/Page.svelte';
import Layout from "./routes/+layout.svelte";
import { readFileSync } from 'fs';

export const handle: Handle = async ({ event, resolve }) => {

    if (event.url.pathname.startsWith(formSchema.path)) {
        console.log({ pathname: event.url.pathname })
        const view = event.url.pathname.split('/').pop();

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

        const html = await renderWithLayout(Page, {
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

    const response = await resolve(event);

    return response;
};


export async function renderWithLayout(Component: any, props = {}) {
    console.log("renderWithLayout")
    const page = render(Component, props);


    const { body: layoutHtml, head: layoutHead } = render(Layout, {
        props: {
            $$slots: { default: () => page.body },
            $$scope: {}
        }
    });
    console.log("page.head", layoutHead)

    const head = layoutHead + page.body;
    const appCss = await readFileSync("src/app.css", 'utf8');
    console.log({ appCss })
    // const css = layoutCss.code + pageCss.code;

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