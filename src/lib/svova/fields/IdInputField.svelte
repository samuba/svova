<script module lang="ts">
	export const createIdField = (name: string = 'id', dataType: 'string' | 'number' = 'number') => {
		const field = {
			name,
			hidden: true,
			readonly: true,
			elementAttributes: {} as Record<string, string>,
			exampleValue: dataType === 'number' ? 2 : '2',
			type: 'id',

			render() {
				this.elementAttributes = {
					name: this.name,
					id: this.name,
					readonly: this.readonly ? `true` : `false`,
					hidden: this.hidden ? `true` : `false`,
					style: this.hidden ? `display: none;` : ``
				};
			},

			build() {
				this.render();
				return {
					name: this.name,
					exampleValue: this.exampleValue,
					elementAttributes: this.elementAttributes,
					hidden: this.hidden,
					type: this.type
				};
			}
		};

		return field;
	};
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
