<script lang="ts">
	import ActionForm from './ActionForm.svelte';
	import type { FormSchema, SvovaActions } from './common';

	let { form, data, svovaActions }: { form: FormSchema; data: any[]; svovaActions: SvovaActions } =
		$props();

	let selectedRows: (number | string)[] = $state([]);

	function toggleRow(id: number | string) {
		if (selectedRows.includes(id)) {
			selectedRows = selectedRows.filter((rowId) => rowId !== id);
		} else {
			selectedRows = [...selectedRows, id];
		}
	}
</script>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-base font-semibold leading-6 text-gray-900">Users</h1>
			<p class="mt-2 text-sm text-gray-700">
				A list of all the users in your account including their name, title, email and role.
			</p>
		</div>
		<div class="mt-4 flex gap-4 sm:ml-16 sm:mt-0">
			{#each svovaActions as action}
				<ActionForm {action} modelIds={selectedRows} enabled={selectedRows.length > 0} />
			{/each}

			<a
				href="create"
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
								<th scope="col" class="relative py-3.5 pl-4 pr-3 sm:pl-6">
									<span class="sr-only">Select</span>
								</th>
								{#each Object.values(form.fields) as field}
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
							{#each data as entry (entry.id)}
								<tr>
									<td class="relative py-4 pl-4 pr-3 sm:pl-6">
										<input
											type="checkbox"
											class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
											checked={selectedRows.includes(entry.id)}
											on:change={() => toggleRow(entry.id)}
										/>
									</td>
									{#each Object.values(form.fields) as field}
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
										<a href="{form.path}/{entry.id}" class="text-indigo-600 hover:text-indigo-900">
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
