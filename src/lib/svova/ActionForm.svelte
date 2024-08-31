<script lang="ts">
	import GenericInputField from './fields/GenericInputField.svelte';
	import type { SvovaActions } from './common';
	import { enhance } from '$app/forms';

	let {
		action,
		modelIds,
		enabled
	}: { action: SvovaActions<any>[string]; modelIds: (number | string)[]; enabled: boolean } =
		$props();

	let isDialogOpen = $state(false);
	let isSubmitting = $state(false);

	let ids = $derived(JSON.stringify(modelIds));
</script>

<button
	type="button"
	onclick={() => {
		if (enabled) isDialogOpen = true;
	}}
	class={`w-fit rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
		enabled
			? `bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600`
			: `cursor-not-allowed bg-gray-100 text-gray-400`
	}`}
	disabled={!enabled}
>
	{action.label}
</button>

{#if isDialogOpen}
	<div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
		<div class="w-[500px] rounded-lg bg-white p-6 shadow-xl">
			<h2 class="mb-4 text-lg font-semibold">{action.label}</h2>
			<form
				use:enhance={() => {
					isSubmitting = true;
					return ({ update }) => {
						update();
						isSubmitting = false;
						isDialogOpen = false;
					};
				}}
				action="?/{action.name}"
				class="flex flex-col gap-4"
				method="POST"
			>
				<input name="modelIds" value={ids} type="text" hidden class="hidden" />
				{#each Object.entries(action.params) as [key, field]}
					<GenericInputField {...field} />
				{/each}
				<div class="mt-4 flex justify-end gap-4">
					<button
						type="button"
						onclick={() => (isDialogOpen = false)}
						class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						disabled={isSubmitting}
					>
						{#if isSubmitting}
							Loading...
						{:else}
							Execute
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
