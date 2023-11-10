<script lang="ts">
	import type { Messages } from '$lib';
	import type { DocumentData } from 'firebase/firestore';

	// this is a literal flaming pile of shit
	// the house is on fire and god is dead
	// lord forgive me for my sins
	export let dataList: DocumentData[] = [];
	let messages: Messages[];
	$: messages = dataList as any;
</script>

{#each messages as message, idx (message.sentAt)}
	<p>#{idx}:</p>
	<li>from: {message.author}</li>
	<li>{message.content}</li>
{/each}
