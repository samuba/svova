<script module lang="ts">
	export const createDateField = (name: string, label: string) => {
		const field = {
			name,
			label,
			min: undefined as string | undefined,
			max: undefined as string | undefined,
			placeholder: undefined as string | undefined,
			defaultValue: undefined as string | undefined,
			required: false,
			readonly: false,
			hidden: false,
			helpText: undefined as string | undefined,
			exampleValue: `2023-04-01`,
			elementAttributes: {} as Record<string, string>,
			type: `date`,

			withMin(value: string) {
				this.min = value;
				return this;
			},

			withMax(value: string) {
				this.max = value;
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

				if (this.min) this.elementAttributes.min = this.min;
				if (this.max) this.elementAttributes.max = this.max;
				if (this.placeholder) this.elementAttributes.placeholder = this.placeholder;
				if (this.defaultValue) this.elementAttributes.value = this.defaultValue;
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
					min: this.min,
					max: this.max,
					placeholder: this.placeholder,
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

<div>
	<label for={name} class="block text-sm font-medium leading-6 text-gray-900">{label}</label>
	<div class="mt-2">
		<input
			type="date"
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
