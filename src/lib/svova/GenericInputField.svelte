<script lang="ts">
	import TextInputField from './TextInputField.svelte';
	import NumberInputField from './NumberInputField.svelte';
	import IdInputField from './IdInputField.svelte';
	import type { InputFieldProps } from './common';

	let {
		attributes,
		name,
		label,
		helpText,
		value = $bindable(),
		type
	}: InputFieldProps & { type: string } = $props();

	let component = undefined as any;

	if (type === 'id') {
		component = IdInputField;
	}
	if (type === 'text' || type === 'email' || type === 'password') {
		component = TextInputField;
	}
	if (type === 'number') {
		component = NumberInputField;
	}
</script>

<svelte:component this={component} {attributes} bind:value {name} {label} {helpText} />
