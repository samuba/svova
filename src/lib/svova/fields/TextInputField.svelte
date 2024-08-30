<script module lang="ts">
	export const createTextField = (name: string, label: string) => {
		const field = {
			name,
			label,
			maxLength: undefined as number | undefined,
			minLength: undefined as number | undefined,
			placeholder: undefined as string | undefined,
			defaultValue: undefined as string | undefined,
			required: false,
			readonly: false,
			pattern: undefined as string | undefined,
			helpText: undefined as string | undefined,
			type: `text` as string,
			exampleValue: 'foo',
			elementAttributes: {} as Record<string, string>,
			hidden: false,

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

			isHidden() {
				this.hidden = true;
				return this;
			},

			render() {
				this.elementAttributes = {
					name: this.name,
					id: this.name,
					type: this.type
				};

				if (this.maxLength) this.elementAttributes.maxlength = `${this.maxLength}`;
				if (this.minLength) this.elementAttributes.minlength = `${this.minLength}`;
				if (this.placeholder) this.elementAttributes.placeholder = this.placeholder;
				if (this.defaultValue) this.elementAttributes.value = this.defaultValue;
				if (this.required) this.elementAttributes.required = ``;
				if (this.readonly) this.elementAttributes.readonly = ``;
				if (this.pattern) this.elementAttributes.pattern = this.pattern;
				if (this.hidden) {
					this.elementAttributes.hidden = ``;
					this.elementAttributes.style = `display: none;`;
				}
			},

			build() {
				this.render();
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
					exampleValue: this.exampleValue,
					elementAttributes: this.elementAttributes,
					hidden: this.hidden
				};
			}
		};

		return field;
	};
</script>

<script lang="ts">
	import type { InputFieldProps } from '$lib/svova/common';

	let { attributes, name, label, helpText, value = $bindable() }: InputFieldProps = $props();
</script>

<div>
	<label for={name} class="block text-sm font-medium leading-6 text-gray-900">{label}</label>
	<div class="mt-2">
		<input
			type="text"
			{name}
			{...attributes}
			bind:value
			class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
		/>
	</div>
	{#if helpText}
		<p class="mt-2 text-sm text-gray-500">{helpText}</p>
	{/if}
</div>
