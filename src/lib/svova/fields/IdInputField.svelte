<script module lang="ts">
	export function createIdField<T extends 'string' | 'number'>(args: {
		dataType: T;
		hidden?: boolean;
		readonly?: boolean;
		name?: string;
	}) {
		args.name = args.name ?? 'id';
		const elementAttributes = {
			name: args.name,
			id: args.name,
			type: 'text'
		} as Record<string, string>;

		if (args.readonly) elementAttributes.readonly = `true`;
		if (args.hidden) {
			elementAttributes.hidden = `true`;
			elementAttributes.style = `display: none;`;
		}

		return {
			name: args.name,
			exampleValue: (args.dataType === 'number' ? 2 : '2') as T extends 'number' ? number : string,
			type: 'id',
			elementAttributes,
			hidden: args.hidden ?? true,
			readonly: args.readonly ?? true
		};
	}

	export type IdInputField = ReturnType<typeof createIdField>;
</script>

<script lang="ts">
	import type { InputFieldProps } from '$lib/svova/common';

	let { attributes, name, label, helpText, value = $bindable() }: InputFieldProps = $props();
</script>

<input
	type="text"
	{name}
	{...attributes}
	bind:value
	class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
/>
