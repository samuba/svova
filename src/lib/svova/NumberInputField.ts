export const createNumberField = (name: string, label: string) => {
    const field = {
        name,
        label,
        min: null as number | null,
        max: null as number | null,
        step: null as number | null,
        placeholder: null as string | null,
        defaultValue: null as number | null,
        required: false,
        readonly: false,
        helpText: null as string | null,
        exampleValue: 9000,

        withMin(value: number) {
            this.min = value;
            return this;
        },

        withMax(value: number) {
            this.max = value;
            return this;
        },

        withStep(value: number) {
            this.step = value;
            return this;
        },

        withPlaceholder(text: string) {
            this.placeholder = text;
            return this;
        },

        withDefaultValue(value: number) {
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

        withHelpText(text: string) {
            this.helpText = text;
            return this;
        },

        render(): string {
            const attrs = [`name="${this.name}"`, `id="${this.name}"`, `type="number"`];

            if (this.min !== null) attrs.push(`min="${this.min}"`);
            if (this.max !== null) attrs.push(`max="${this.max}"`);
            if (this.step !== null) attrs.push(`step="${this.step}"`);
            if (this.placeholder) attrs.push(`placeholder="${this.placeholder}"`);
            if (this.defaultValue !== null) attrs.push(`value="${this.defaultValue}"`);
            if (this.required) attrs.push(`required`);
            if (this.readonly) attrs.push(`readonly`);

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
                min: this.min,
                max: this.max,
                step: this.step,
                placeholder: this.placeholder,
                defaultValue: this.defaultValue,
                required: this.required,
                readonly: this.readonly,
                helpText: this.helpText,
                renderedHtml: this.render(),
                exampleValue: this.exampleValue
            };
        }
    };

    return field;
};