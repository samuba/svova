<script lang="ts">
	import { getNameFromPath } from '$lib/svova/common.js';

	const { data } = $props();
</script>

<div class="flex flex-col flex-wrap gap-6 p-6">
	{#each data.formSchemas as formSchema}
		<a
			href={formSchema.path}
			class="inline-flex w-fit items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		>
			{getNameFromPath(formSchema.path)}
		</a>
	{/each}
</div>
