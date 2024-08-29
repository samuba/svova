<script lang="ts">
	import { enhance } from '$app/forms';

	const { data } = $props();
</script>

<div class="f p-6">
	<form method="POST" use:enhance class="flex flex-col gap-4">
		{#each Object.values(data.form.fields) as field}
			{@html field.renderedHtml}
		{/each}

		<div class="mt-4">
			<button
				type="submit"
				class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Okay
			</button>
		</div>
	</form>
</div>
