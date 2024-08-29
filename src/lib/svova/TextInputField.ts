export const createTextField = (name: string, label: string) => {
    const field = {
        name,
        label,
        maxLength: null as number | null,
        minLength: null as number | null,
        placeholder: null as string | null,
        defaultValue: null as string | null,
        required: false,
        readonly: false,
        pattern: null as string | null,
        helpText: null as string | null,
        type: `text` as string,
        exampleValue: "foo",

        max(length: number) {
            this.maxLength = length;
            return this;
        },

        min(length: number) {
            this.minLength = length;
            return this;
        },

        withPlaceholder(text: string) {
            this.placeholder = text;
            return this;
        },

        withDefaultValue(value: string) {
            this.defaultValue = value;
            return this;
        },

        isRequired() {
            this.required = true;
            return this;
        },

        readOnly() {
            this.readonly = true;
            return this;
        },

        withPattern(regex: string) {
            this.pattern = regex;
            return this;
        },

        withHelpText(text: string) {
            this.helpText = text;
            return this;
        },

        asPassword() {
            this.type = `password`;
            return this;
        },

        asEmail() {
            this.type = `email`;
            return this;
        },

        render(): string {
            const attrs = [`name="${this.name}"`, `id="${this.name}"`, `type="${this.type}"`];

            if (this.maxLength) attrs.push(`maxlength="${this.maxLength}"`);
            if (this.minLength) attrs.push(`minlength="${this.minLength}"`);
            if (this.placeholder) attrs.push(`placeholder="${this.placeholder}"`);
            if (this.defaultValue) attrs.push(`value="${this.defaultValue}"`);
            if (this.required) attrs.push(`required`);
            if (this.readonly) attrs.push(`readonly`);
            if (this.pattern) attrs.push(`pattern="${this.pattern}"`);

            return `
                <div>
                    <label for="${this.name}" class="block text-sm font-medium leading-6 text-gray-900">${this.label}</label>
                    <div class="mt-2">
                        <input ${attrs.join(` `)} 
                            class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                    </div>
                    ${this.helpText ? `<p class="mt-2 text-sm text-gray-500">${this.helpText}</p>` : ``}
                </div>
            `;
        },

        build() {
            return {
                name: this.name,
                label: this.label,
                maxLength: this.maxLength,
                minLength: this.minLength,
                placeholder: this.placeholder,
                defaultValue: this.defaultValue,
                required: this.required,
                readonly: this.readonly,
                pattern: this.pattern,
                helpText: this.helpText,
                type: this.type,
                renderedHtml: this.render(),
                exampleValue: this.exampleValue
            };
        }
    };

    return field;
};