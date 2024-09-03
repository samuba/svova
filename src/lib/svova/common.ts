import { redirect, type RequestEvent } from "@sveltejs/kit";

export type FormSchemaFields = Record<string, {
    exampleValue: any
    elementAttributes: Record<string, string>;
    type: string;
    name: string;
    helpText?: string | undefined;
    label?: string | undefined;
    hidden?: boolean | undefined;
}>;

export interface FormSchema {
    fields: FormSchemaFields;
    path: string;
    FieldsType: Record<string, unknown>;
}

export function createFieldsType<T extends Record<string, { exampleValue: unknown }>>(fields: T) {
    return {} as {
        [K in keyof T]: T[K]['exampleValue'];
    };
}

export type FieldsType<T extends FormSchemaFields> = Simplify<{
    [K in keyof T]: T[K]['exampleValue'];
}>;

export async function extractFields<T extends FormSchemaFields>(request: Request, schemaFields: T) {
    const data = await request.clone().formData();
    const fields = {} as Record<string, unknown>;
    for (const [key, value] of data.entries()) {
        if (key === "modelIds") {
            fields[key] = JSON.parse(value.toString());
        } else if (typeof schemaFields[key].exampleValue === "string") {
            fields[key] = value.toString();
        } else if (typeof schemaFields[key].exampleValue === "number") {
            fields[key] = Number(value);
        } else if (typeof schemaFields[key].exampleValue === "boolean") {
            fields[key] = value == "true";
        }
    }

    return fields as Simplify<FieldsType<T>>;
}

export async function extractActionParams<T extends FormSchemaFields, T2 extends FormSchema>(request: Request, paramsSchema: T, formSchema: T2) {
    const actionParamsSchema = { ...paramsSchema, modelIds: { exampleValue: formSchema.fields.id.exampleValue } }
    const res = await extractFields<T>(request, actionParamsSchema);
    return res as typeof res & { modelIds: (number | string)[] };
}

export async function finalizeRequest(request: Request, schema: FormSchema) {
    redirect(307, `${schema.path}/list`);
}

export type InputFieldProps = {
    attributes: Record<string, string>;
    name: string;
    label: string;
    helpText: string;
    value: string;
}

export type Loaders<T extends FormSchema> = {
    list: (event: RequestEvent) => Promise<T['FieldsType'][]>;
    one: (id: number, event: RequestEvent) => Promise<T['FieldsType'] | undefined>;
}


export type SvovaActions = Array<{
    name: string,
    label: string,
    params: unknown,
    handle: (params: unknown) => (event: RequestEvent) => Promise<void>
}>

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));

}

export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

export type Writers<T extends FormSchema> = {
    create: (fields: Simplify<Omit<T['FieldsType'], 'id'>>, event: RequestEvent) => Promise<void>;
    update: (fields: T['FieldsType'], event: RequestEvent) => Promise<void>;
    delete: (id: T['FieldsType']['id'], event: RequestEvent) => Promise<void>;
};

export function getRoutePathToFile(meta: { dirname: string, filename: string }) {
    const route = meta.dirname.match(/src\/routes(.*)/)?.[1];
    if (!route) throw new Error(`Could not find route for file ${meta.filename}`);
    return route
}

export function getNameFromPath(path: string) {
    const lastPart = path.split('/')?.pop()
    return lastPart?.charAt(0)?.toUpperCase() + lastPart?.slice(1);
}