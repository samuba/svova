
<script lang="ts">
	import CrudPage from '$lib/svova/CrudPage.svelte';

	const { data } = $props();
</script>

<CrudPage {data} />
