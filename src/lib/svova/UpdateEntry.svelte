<script lang="ts">
	import { enhance } from '$app/forms';
	import GenericInputField from './fields/GenericInputField.svelte';
	import ActionForm from './ActionForm.svelte';
	import type { FormSchema, SvovaActions } from './common';

	let { form, one, svovaActions }: { form: FormSchema; one: any; svovaActions: SvovaActions<any> } =
		$props();

	console.log({ svovaActions });
</script>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="mb-4 sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-base font-semibold leading-6 text-gray-900">Update</h1>
		</div>
	</div>

	<div class="my-4 flex justify-end gap-6">
		{#each svovaActions as action}
			<ActionForm {action} modelIds={[one.id]} enabled={true} />
		{/each}
	</div>

	<form method="POST" use:enhance action="?/update" class="flex flex-col gap-4" id="update-form">
		{#each Object.values(form.fields) as field}
			<GenericInputField
				type={field.type}
				attributes={field.elementAttributes}
				value={one[field.name]}
				helpText={field.helpText}
				name={field.name}
				label={field.label}
			/>
		{/each}
	</form>
	<div class="mt-6 flex justify-end gap-6">
		<form method="POST" use:enhance action="?/delete">
			<input name="id" type="text" hidden bind:value={one.id} />
			<button
				type="submit"
				class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
			>
				Delete
			</button>
		</form>

		<div class="w-full"></div>

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
			form="update-form"
			class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
			Okay
		</button>
	</div>
</div>
