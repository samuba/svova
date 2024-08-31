import { walk } from "https://deno.land/std@0.182.0/fs/mod.ts";
import { Select } from "jsr:@cliffy/prompt@^1.0.0-rc.5";
import { Table } from "jsr:@cliffy/table@^1.0.0-rc.5";

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

async function parseSchema(schemaPath: string): Promise<{ name: string; columns: { name: string; type: string; mode?: string }[] }[]> {
    const content = await Deno.readTextFile(schemaPath);
    const tableRegex = /export const (\w+)\s*=\s*sqliteTable\([^)]+,\s*{([^}]+)}\s*\)/g;
    const tables: { name: string; columns: { name: string; type: string; mode?: string }[] }[] = [];
    let match;
    while ((match = tableRegex.exec(content)) !== null) {
        const tableName = match[1];
        const columnsString = match[2];
        const columnRegex = /(\w+):\s*(\w+)\(([^)]+)\)(\s*\.\s*\w+\([^)]*\))*/g;
        const columns: { name: string; type: string; mode?: string }[] = [];
        let columnMatch;
        while ((columnMatch = columnRegex.exec(columnsString)) !== null) {
            const columnName = columnMatch[1];
            const columnType = columnMatch[2];
            const columnOptions = columnMatch[3];
            const modeMatch = columnOptions.match(/mode:\s*['"](\w+)['"]/);
            const mode = modeMatch ? modeMatch[1] : undefined;
            columns.push({ name: columnName, type: columnType, mode });
        }
        tables.push({ name: tableName, columns });
    }
    return tables;
}

async function promptUserForTables(tables: { name: string; columns: { name: string; type: string; mode?: string }[] }[]): Promise<{ name: string; columns: { name: string; type: string; mode?: string }[] }[]> {
    const selectedTableNames = await Select.prompt({
        message: `Select tables to generate Svova files for:`,
        options: tables.map(table => table.name),
        multiple: true,
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
        console.log(`\n${table.name}:`);
        new Table()
            .header([`Column`, `Type`, `Mode`])
            .body(table.columns.map(column => [column.name, column.type, column.mode || ``]))
            .border(true)
            .render();
    });

    // TODO: Add logic to generate Svova files for selected tables
}

if (import.meta.main) {
    main();
}