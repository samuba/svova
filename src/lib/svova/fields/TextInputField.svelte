<script module lang="ts">
	export function createTextField<T extends boolean>(
		name: string,
		label: string,
		args: {
			required: T;
			maxLength?: number;
			minLength?: number;
			placeholder?: string;
			defaultValue?: string;
			readonly?: boolean;
			pattern?: string;
			helpText?: string;
			hidden?: boolean;
			asEmail?: boolean;
			asPassword?: boolean;
		}
	) {
		const elementAttributes = {
			name: name,
			id: name,
			type: 'text'
		} as Record<string, string>;
		if (args.maxLength) elementAttributes.maxlength = `${args.maxLength}`;
		if (args.minLength) elementAttributes.minlength = `${args.minLength}`;
		if (args.placeholder) elementAttributes.placeholder = args.placeholder;
		if (args.defaultValue) elementAttributes.value = args.defaultValue;
		if (args.required) elementAttributes.required = ``;
		if (args.readonly) elementAttributes.readonly = ``;
		if (args.pattern) elementAttributes.pattern = args.pattern;
		if (args.asEmail) elementAttributes.type = `email`;
		if (args.asPassword) elementAttributes.type = `password`;
		if (args.hidden) {
			elementAttributes.hidden = ``;
			elementAttributes.style = `display: none;`;
		}

		return {
			name,
			label,
			exampleValue: 'foo' as T extends true ? string : string | null | undefined,
			type: 'text',
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
