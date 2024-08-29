
export interface FormSchema {
    fields: Record<string, { exampleValue: unknown }>;
    FieldsType: Record<string, unknown>;
}

export function createFieldsType<T extends Record<string, { exampleValue: unknown }>>(fields: T) {
    return {} as {
        [K in keyof T]: T[K]['exampleValue'];
    };
}

export function extractFields<T extends FormSchema>(data: FormData, schema: T) {
    const fields = {} as Record<string, unknown>;
    for (const [key, value] of data.entries()) {
        if (typeof schema.fields[key].exampleValue === "string") {
            fields[key] = value.toString();
        } else if (typeof schema.fields[key].exampleValue === "number") {
            fields[key] = Number(value);
        }
    }
    return fields as T['FieldsType'];
}

export type InputFieldProps = {
    attributes: Record<string, string>;
    name: string;
    label: string;
    helpText: string;
    value: string;
}