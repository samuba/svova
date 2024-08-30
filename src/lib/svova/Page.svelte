<script lang="ts">
	import CreateEntry from '$lib/svova/CreateEntry.svelte';
	import ListEntries from '$lib/svova/ListEntries.svelte';
	import UpdateEntry from '$lib/svova/UpdateEntry.svelte';

	const { data: p } = $props();

	console.log({ data: p });
</script>

<div class="p-6">
	{#if p.view === 'new'}
		<CreateEntry form={p.form} />
	{:else if p.view === 'list'}
		<ListEntries form={p.form} data={p.data} />
	{:else if p.view.match(/\d/)}
		<UpdateEntry form={p.form} one={p.one} />
	{/if}
</div>
