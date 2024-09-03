<script module lang="ts">
	export function createBooleanField(
		name: string,
		label: string,
		args: {
			defaultValue?: boolean;
			readonly?: boolean;
			hidden?: boolean;
			helpText?: string;
		}
	) {
		args.defaultValue = args.defaultValue ?? false;

		const elementAttributes = {
			type: 'checkbox'
		} as Record<string, string>;

		if (args.defaultValue) elementAttributes.checked = ``;
		if (args.readonly) elementAttributes.readonly = ``;
		if (args.hidden) {
			elementAttributes.hidden = ``;
			elementAttributes.style = `display: none;`;
		}

		return {
			name,
			label,
			exampleValue: true,
			type: 'checkbox',
			elementAttributes,
			value: args.defaultValue,
			...args
		};
	}
</script>

<script lang="ts">
	import type { InputFieldProps } from '$lib/svova/common';

	let { attributes, name, label, helpText, value = $bindable() }: InputFieldProps = $props();

	const labelId = `${name}-` + crypto.randomUUID();
</script>

<div class="flex items-center">
	<input
		type="checkbox"
		id={labelId}
		{...attributes}
		bind:checked={value}
		class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
	/>
	<label for={labelId} class="ml-2 block text-sm font-medium leading-6 text-gray-900">{label}</label
	>

	<!-- see https://stackoverflow.com/questions/3746678/force-a-checkbox-to-always-submit-even-when-unchecked -->
	<input type="hidden" {name} value={value ? 'true' : 'false'} />
</div>
{#if helpText}
	<p class="mt-2 text-sm text-gray-500">{helpText}</p>
{/if}
