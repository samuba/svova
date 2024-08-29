import { createFieldsType, type FormSchema } from "$lib/svova/common";
import { createIdField } from "$lib/svova/IdInputField.svelte";
import { createNumberField } from "$lib/svova/NumberInputField.svelte";
import { createTextField } from "$lib/svova/TextInputField.svelte";

const fields = {
    id: createIdField().build(),

    email: createTextField(`email`, `Email Address`)
        .max(100)
        .isRequired()
        .asEmail()
        .withPlaceholder(`Enter your email`)
        .withPattern(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`)
        .withHelpText(`Please enter a valid email address`)
        .build(),

    password: createTextField(`password`, `Password`)
        .min(8)
        .isRequired()
        .asPassword()
        .withPlaceholder(`Enter your password`)
        .withHelpText(`Password must be at least 8 characters long`)
        .build(),

    income: createNumberField(`income`, `Income`)
        .withMin(0)
        .withHelpText(`Be real. How much money do you make in a year?`)
        .build()

} satisfies FormSchema['fields'];

export const formSchema = {
    fields,
    FieldsType: createFieldsType(fields)
} satisfies FormSchema;

