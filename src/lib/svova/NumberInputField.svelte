<script module lang="ts">
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
			hidden: false,
			helpText: null as string | null,
			exampleValue: 9000,
			elementAttributes: {} as Record<string, string>,
			type: 'number',

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
					type: `number`
				};
				if (this.min !== null) this.elementAttributes.min = `${this.min}`;
				if (this.max !== null) this.elementAttributes.max = `${this.max}`;
				if (this.step !== null) this.elementAttributes.step = `${this.step}`;
				if (this.placeholder) this.elementAttributes.placeholder = this.placeholder;
				if (this.defaultValue !== null) this.elementAttributes.value = `${this.defaultValue}`;
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
					step: this.step,
					placeholder: this.placeholder,
					defaultValue: this.defaultValue,
					required: this.required,
					readonly: this.readonly,
					hidden: this.hidden,
					helpText: this.helpText,
					exampleValue: this.exampleValue,
					type: this.type
				};
			}
		};

		return field;
	};
</script>

<script lang="ts">
	import type { InputFieldProps } from './common';

	let { attributes, name, label, helpText, value = $bindable() }: InputFieldProps = $props();
</script>

<div>
	<label for={name} class="block text-sm font-medium leading-6 text-gray-900">{label}</label>
	<div class="mt-2">
		<input
			type="number"
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
