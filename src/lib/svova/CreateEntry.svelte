<script lang="ts">
	import GenericInputField from './fields/GenericInputField.svelte';
	import { enhance } from '$app/forms';
	import type { FormSchema } from './common';

	let { form }: { form: FormSchema } = $props();
</script>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="mb-6 sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-base font-semibold leading-6 text-gray-900">Create new</h1>
		</div>
	</div>
	<form method="POST" use:enhance action="?/create" class="flex flex-col gap-4">
		{#each Object.values(form.fields) as field}
			<GenericInputField
				type={field.type}
				attributes={field.elementAttributes}
				value=""
				helpText={field.helpText}
				name={field.name}
				label={field.label}
			/>
		{/each}

		<div class="mt-6 flex justify-end gap-6">
			<button
				type="button"
				onclick={() => {
					window.history.back();
				}}
				class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
			>
				Cancel
			</button>
			<button
				type="submit"
				class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Okay
			</button>
		</div>
	</form>
</div>
