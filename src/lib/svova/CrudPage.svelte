<script lang="ts">
	import PageCreateEntry from '$lib/svova/PageCreateEntry.svelte';
	import PageListEntries from '$lib/svova/PageListEntries.svelte';
	import PageUpdateEntry from '$lib/svova/PageUpdateEntry.svelte';

	const { data }: { data: any } = $props();
</script>

<div class="my-6">
	{#if data.view === 'create'}
		<PageCreateEntry {...data} />
	{:else if data.view === 'list'}
		<PageListEntries {...data} />
	{:else if data.view.match(/\d/)}
		<PageUpdateEntry {...data} />
	{/if}
</div>
