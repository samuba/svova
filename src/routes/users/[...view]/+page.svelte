<script lang="ts">
	import { enhance } from '$app/forms';
	import GenericInputField from '$lib/svova/GenericInputField.svelte';

	const { data: p } = $props();
</script>

<div class="p-6">
	{#if p.view === 'new'}
		{@render create()}
	{:else if p.view === 'list'}
		{@render list()}
	{:else if p.view.match(/\d/)}
		{@render update()}
	{/if}
</div>

{#snippet update()}
	<div class="px-4 sm:px-6 lg:px-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h1 class="text-base font-semibold leading-6 text-gray-900">Update</h1>
			</div>
		</div>
		<form method="POST" use:enhance action="?/update" class="flex flex-col gap-4" id="update-form">
			{#each Object.values(p.form.fields) as field}
				<GenericInputField
					type={field.type}
					attributes={field.elementAttributes}
					value={p.one[field.name]}
					helpText={field.helpText}
					name={field.name}
					label={field.label}
				/>
			{/each}
		</form>
		<div class="mt-4 flex gap-4">
			<form method="POST" use:enhance action="?/delete">
				<input name="id" type="text" hidden bind:value={p.one.id} />
				<button
					type="submit"
					class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
				>
					Delete
				</button>
			</form>

			<button
				type="submit"
				form="update-form"
				class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Okay
			</button>
		</div>
	</div>
{/snippet}

{#snippet create()}
	<div class="px-4 sm:px-6 lg:px-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h1 class="text-base font-semibold leading-6 text-gray-900">Create new</h1>
			</div>
		</div>
		<form method="POST" use:enhance action="?/create" class="flex flex-col gap-4">
			{#each Object.values(p.form.fields) as field}
				<GenericInputField
					type={field.type}
					attributes={field.elementAttributes}
					value=""
					helpText={field.helpText}
					name={field.name}
					label={field.label}
				/>
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
{/snippet}

{#snippet list()}
	<div class="px-4 sm:px-6 lg:px-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h1 class="text-base font-semibold leading-6 text-gray-900">Users</h1>
				<p class="mt-2 text-sm text-gray-700">
					A list of all the users in your account including their name, title, email and role.
				</p>
			</div>
			<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
				<a
					href="new"
					class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>Add
				</a>
			</div>
		</div>

		<div class="mt-8 flow-root">
			<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
					<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
						<table class="min-w-full divide-y divide-gray-300">
							<thead class="bg-gray-50">
								<tr>
									{#each Object.values(p.form.fields) as field}
										{#if !field.hidden}
											<th
												scope="col"
												class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
											>
												{field.label}
											</th>
										{/if}
									{/each}
									<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
										<span class="sr-only">Edit</span>
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 bg-white">
								{#each p.data as entry (entry.id)}
									<tr>
										{#each Object.values(p.form.fields) as field}
											{#if !field.hidden}
												<td
													class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
												>
													{entry[field.name]}
												</td>
											{/if}
										{/each}
										<td
											class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
										>
											<a href="/users/{entry.id}" class="text-indigo-600 hover:text-indigo-900">
												Edit</a
											>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
{/snippet}
