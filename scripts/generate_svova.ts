import { walk } from "https://deno.land/std@0.182.0/fs/mod.ts";
import { Select } from "jsr:@cliffy/prompt@^1.0.0-rc.5";
import { Table } from "jsr:@cliffy/table@^1.0.0-rc.5";
import * as esbuild from "https://deno.land/x/esbuild@v0.17.11/mod.js";
import * as path from "https://deno.land/std@0.182.0/path/mod.ts";
import * as fs from "https://deno.land/std@0.182.0/fs/mod.ts";

async function findSchemaFile(): Promise<string | null> {
    // if present use drizzle config
    const drizzleConfigPath = `./drizzle.config.ts`;
    if (await Deno.stat(drizzleConfigPath).catch(() => null)) {
        const content = await Deno.readTextFile(drizzleConfigPath);
        const match = content.match(/schema:\s*['"](.+)['"]/);
        if (match) {
            return match[1];
        }
    }

    for await (const entry of walk(`.`, {
        exts: [`.ts`],
        skip: [/^node_modules/]
    })) {
        if (entry.name.includes(`schema`) && entry.isFile) {
            const content = await Deno.readTextFile(entry.path);
            if (content.includes(`import`) && content.includes(`drizzle-orm`)) {
                return entry.path;
            }
        }
    }
    return null;
}

async function parseSchema(schemaPath: string): Promise<{ name: string; columns: { name: string; type: string; mode?: string; foreignKey?: string }[] }[]> {
    const content = await Deno.readTextFile(schemaPath);

    // Use esbuild to bundle the schema file
    const result = await esbuild.build({
        stdin: {
            contents: content,
            resolveDir: path.dirname(schemaPath),
        },
        bundle: true,
        write: false,
        format: `esm`,
        target: `esnext`,
    });

    const bundledCode = result.outputFiles[0].text;

    // Use Deno's built-in JavaScript parser
    const module = await import(`data:application/javascript,${encodeURIComponent(bundledCode)}`);

    const tables: { name: string; columns: { name: string; type: string; mode?: string; foreignKey?: string }[] }[] = [];
    for (const [key, value] of Object.entries(module)) {
        if (typeof value === `object` && value !== null) {
            const tableName = key;
            const columns: { name: string; type: string; mode?: string; foreignKey?: string }[] = [];

            // console.log(value);

            for (const [columnName, columnDef] of Object.entries(value)) {
                if (columnName === `sqliteTable` || columnName === `mysqlTable` || columnName === `pgTable` || columnName === `table` || typeof columnDef !== `object` || columnDef === null) {
                    continue;
                }

                const columnType = columnDef.dataType;
                const mode = columnDef.mode;
                const notNull = columnDef.notNull;
                const foreignKey = "TODO" //columnDef.table?.[Symbol("drizzle:SQLiteInlineForeignKeys")]?.map(fk => fk.reference.toString()) || undefined;
                columns.push({ name: columnName, type: columnType, mode, foreignKey, notNull });

                // TODO: foreign keys
                // if (columnDef.table[Symbol.for("drizzle:SQLiteInlineForeignKeys")]?.[0]?.table?.[Symbol.for("drizzle:Name")]) {
                //     console.log(tableName + ":" + columnName, columnDef.table[Symbol.for("drizzle:SQLiteInlineForeignKeys")]?.[0]?.table?.[Symbol.for("drizzle:Name")]);
                //     console.log(tableName + ":" + columnName, columnDef.table[Symbol.for("drizzle:SQLiteInlineForeignKeys")]?.[1]?.reference.toString());
                // }
            }

            tables.push({ name: tableName, columns });
        }
    }

    return tables;
}

async function promptUserForTables(tables: { name: string; columns: { name: string; type: string; mode?: string; foreignKey?: string }[] }[]): Promise<{ name: string; columns: { name: string; type: string; mode?: string; foreignKey?: string }[] }[]> {
    const selectedTableNames = await Select.prompt({
        message: `Select tables to generate Svova files for:`,
        options: tables.map(table => ({ name: table.name, value: table.name })),
        search: true,
    });

    return tables.filter(table => selectedTableNames.includes(table.name));
}

async function generateViewFiles(table: { name: string; columns: { name: string; type: string; mode?: string; foreignKey?: string, notNull?: boolean }[] }) {
    const pageDotSvelte = `
<script lang="ts">
	import CrudPage from '$lib/svova/CrudPage.svelte';

	const { data } = $props();
</script>

<CrudPage {data} />
`;

    const pageDotServer = `
    import { error, redirect, type RequestEvent } from '@sveltejs/kit';
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
        } else if (view.match(/\\d/)) {
            const id: any = typeof formSchema.fields.id.exampleValue === 'number' ? parseInt(view) : view
            one = await loaders.one(id, event);
            if (!one) error(404)
        } else if (view === 'list') {
            all = await loaders.list(event);
        } else {
            redirect(302, formSchema.path + "/list");
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
            redirect(307, formSchema.path + "/list");
        },
        update: async (event: RequestEvent) => {
            const fields = await extractFields(event.request, formSchema.fields);
            await writers.update(fields, event);
            redirect(307, formSchema.path + "/list");
        },
        delete: async (event: RequestEvent) => {
            const fields = await extractFields(event.request, formSchema.fields);
            await writers.delete(fields.id as number, event);
            redirect(307, formSchema.path + "/list");
        },
        ...Object.fromEntries(svovaActions.map(x => ([x.name, x.handle(x.params)])))
    } satisfies Actions;
`

    const outputDir = `./src/routes/${table.name}/[...view]`;
    await fs.ensureDir(outputDir)
    await Deno.writeTextFile(`${outputDir}/+page.svelte`, pageDotSvelte);
    await Deno.writeTextFile(`${outputDir}/+page.server.ts`, pageDotServer);
}

async function generateDefinitionsFile(table: { name: string; columns: { name: string; type: string; mode?: string; foreignKey?: string, notNull?: boolean }[] }) {
    const tableName = table.name;
    const outputDir = `./src/routes/${tableName}`;
    const outputFile = `${outputDir}/definitions.ts`;

    await fs.ensureDir(outputDir);

    let content = `
import { extractActionParams, getRoutePathToFile, type FieldsType, type FormSchema, type Loaders, type Writers } from "$lib/svova/common";
import { type RequestEvent } from "@sveltejs/kit";
import * as s from "$lib/server/db/schema";
import { eq, inArray, type Simplify } from "drizzle-orm";
import { createBooleanField, createIdField, createNumberField, createTextField } from "$lib/svova/fields";

const fields = {
`;

    for (const column of table.columns) {
        const fieldName = column.name;
        let fieldDefinition = ``;

        switch (column.type) {
            case `number`:
            case `integer`:
                if (fieldName === `id`) {
                    fieldDefinition = `createIdField({ dataType: 'number' }),`;
                } else {
                    fieldDefinition = `createNumberField(\`${fieldName}\`, \`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}\`, {
        required: ${column.notNull},
        placeholder: \`Enter ${fieldName}\`,
        helpText: \`Please provide ${fieldName}\`,
    }),`;
                }
                break;
            case `text`:
                fieldDefinition = `createTextField(\`${fieldName}\`, \`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}\`, {
        required: ${column.notNull},
        maxLength: 100,
        placeholder: \`Enter ${fieldName}\`,
        helpText: \`Please provide ${fieldName}\`,
    }),`;
                break;
            case `real`:
                fieldDefinition = `createNumberField(\`${fieldName}\`, \`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}\`, {
        required: ${column.notNull},
        placeholder: \`Enter ${fieldName}\`,
        helpText: \`Please provide ${fieldName}\`,
    }),`;
                break;
            case `boolean`:
                fieldDefinition = `createBooleanField(\`${fieldName}\`, \`Is ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}\`, {
        defaultValue: false,
    }),`;
                break;
            default:
                fieldDefinition = `createTextField(\`${fieldName}\`, \`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}\`, {
        required: ${column.notNull},
        placeholder: \`Enter ${fieldName}\`,
        helpText: \`Please provide ${fieldName}\`,
    }),`;
        }

        content += `    ${fieldName}: ${fieldDefinition}\n`;
    }

    content += `
} satisfies FormSchema['fields']

export const actions = [
    // Add custom actions here if needed
] as const

export const formSchema = {
    fields,
    FieldsType: {} as Simplify<FieldsType<typeof fields>>,
    path: getRoutePathToFile(import.meta) // \`/${tableName}\`
} satisfies FormSchema;

export type FormFields = typeof formSchema.FieldsType;

export const loaders = {
    list: async ({ locals: { db } }) => {
        return await db.select().from(s.${tableName});
    },
    one: async (id, { locals: { db } }) => {
        return await db.select().from(s.${tableName}).where(eq(s.${tableName}.id, id)).get();
    }
} satisfies Loaders<typeof formSchema>;

export const writers = {
    create: async (fields, { locals: { db } }) => {
        await db.insert(s.${tableName}).values(fields).run();
    },
    update: async (fields, { locals: { db } }) => {
        await db.update(s.${tableName}).set(fields).where(eq(s.${tableName}.id, fields.id)).run();
    },
    delete: async (id, { locals: { db } }) => {
        await db.delete(s.${tableName}).where(eq(s.${tableName}.id, id)).run();
    }
} satisfies Writers<typeof formSchema>;
`;

    await Deno.writeTextFile(outputFile, content);
    console.log(`Generated definitions file: ${outputFile}`);
}

async function main() {
    const schemaPath = await findSchemaFile();
    if (!schemaPath) {
        console.error(`Schema file not found.`);
        return;
    }

    console.log(`Found schema file: ${schemaPath}`);
    const tables = await parseSchema(schemaPath);

    if (tables.length === 0) {
        console.log(`No tables found in the schema.`);
        return;
    }

    const selectedTables = await promptUserForTables(tables);
    console.log(`Selected tables:`);
    selectedTables.forEach(table => {
        console.log(`\n\x1b[1m${table.name}\x1b[0m`);
        new Table()
            .header([`Column`, `Type`, `Mode`, `Foreign Key`])
            .body(table.columns.map(column => [column.name, column.type + (column.notNull ? "" : "?"), column.mode || ``, column.foreignKey || ``]))
            .border(true)
            .render();
    });

    for (const table of selectedTables) {
        await generateDefinitionsFile(table);
        await generateViewFiles(table);
    }
}

await main();