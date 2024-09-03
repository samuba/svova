<script lang="ts">
	import TextInputField from './TextInputField.svelte';
	import NumberInputField from './NumberInputField.svelte';
	import IdInputField from './IdInputField.svelte';
	import BoolInputField from './BooleanInputField.svelte';
	import type { InputFieldProps } from '../common';

	let {
		attributes,
		name,
		label = undefined,
		helpText = undefined,
		value = $bindable(),
		type
	}: InputFieldProps & { type: string } = $props();

	let Component = $state() as any;

	if (type === `id`) {
		Component = IdInputField;
	} else if (type === `text` || type === `email` || type === `password`) {
		Component = TextInputField;
	} else if (type === `number`) {
		Component = NumberInputField;
	} else if (type === `checkbox`) {
		Component = BoolInputField;
	}
</script>

{#if Component}
	<Component {attributes} bind:value {name} {label} {helpText} />
{/if}
