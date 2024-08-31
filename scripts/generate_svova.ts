import { walk } from "https://deno.land/std@0.182.0/fs/mod.ts";
import { Select } from "jsr:@cliffy/prompt@^1.0.0-rc.5";
import { Table } from "jsr:@cliffy/table@^1.0.0-rc.5";
import * as esbuild from "https://deno.land/x/esbuild@v0.17.11/mod.js";
import * as path from "https://deno.land/std@0.182.0/path/mod.ts";

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
                const foreignKey = columnDef.table?.[Symbol("drizzle:SQLiteInlineForeignKeys")]?.map(fk => fk.reference.toString()) || undefined;
                columns.push({ name: columnName, type: columnType, mode, foreignKey });

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
            .body(table.columns.map(column => [column.name, column.type, column.mode || ``, column.foreignKey || ``]))
            .border(true)
            .render();
    });

    // TODO: Add logic to generate Svova files for selected tables
}

if (import.meta.main) {
    main();
}