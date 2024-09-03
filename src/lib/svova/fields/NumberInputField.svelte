<script module lang="ts">
	export function createNumberField<T extends boolean>(
		name: string,
		label: string,
		args: {
			min?: number;
			max?: number;
			step?: number;
			placeholder?: string;
			defaultValue?: number;
			required: T;
			readonly?: boolean;
			hidden?: boolean;
			helpText?: string;
		}
	) {
		const elementAttributes = {
			name,
			id: name,
			type: 'number'
		} as Record<string, string>;

		if (args.min !== undefined) elementAttributes.min = `${args.min}`;
		if (args.max !== undefined) elementAttributes.max = `${args.max}`;
		if (args.step !== undefined) elementAttributes.step = `${args.step}`;
		if (args.placeholder) elementAttributes.placeholder = args.placeholder;
		if (args.defaultValue !== undefined) elementAttributes.value = `${args.defaultValue}`;
		if (args.required) elementAttributes.required = ``;
		if (args.readonly) elementAttributes.readonly = ``;
		if (args.hidden) {
			elementAttributes.hidden = ``;
			elementAttributes.style = `display: none;`;
		}

		return {
			name,
			label,
			exampleValue: 9000 as T extends true ? number : number | null | undefined,
			type: 'number',
			elementAttributes,
			...args
		};
	}
</script>

<script lang="ts">
	import type { InputFieldProps } from '$lib/svova/common';

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
