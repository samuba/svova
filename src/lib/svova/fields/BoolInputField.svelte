<script module lang="ts">
	export const createBoolField = (name: string, label: string) => {
		const field = {
			name,
			label,
			defaultValue: false,
			required: false,
			readonly: false,
			hidden: false,
			helpText: undefined as string | undefined,
			exampleValue: true,
			elementAttributes: {} as Record<string, string>,
			type: `checkbox`,

			withDefaultValue(value: boolean) {
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

			isHidden() {
				this.hidden = true;
				return this;
			},

			withHelpText(text: string) {
				this.helpText = text;
				return this;
			},

			render() {
				this.elementAttributes = {
					name: this.name,
					id: this.name,
					type: this.type
				};

				if (this.defaultValue) this.elementAttributes.checked = ``;
				if (this.required) this.elementAttributes.required = ``;
				if (this.readonly) this.elementAttributes.readonly = ``;
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
					defaultValue: this.defaultValue,
					required: this.required,
					readonly: this.readonly,
					hidden: this.hidden,
					helpText: this.helpText,
					exampleValue: this.exampleValue,
					elementAttributes: this.elementAttributes,
					type: this.type
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

<div class="flex items-center">
	<input
		type="checkbox"
		{name}
		{...attributes}
		bind:checked={value}
		class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
	/>
	<label for={name} class="ml-2 block text-sm font-medium leading-6 text-gray-900">{label}</label>
</div>
{#if helpText}
	<p class="mt-2 text-sm text-gray-500">{helpText}</p>
{/if}
