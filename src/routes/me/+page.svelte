<script>
	import { SignedIn } from 'sveltefire';
	import { firestore } from '$lib';
	import Messenger from '$lib/Messenger.svelte';
</script>

<SignedIn>
	<!-- TODO: messaging interface -->
	<Messenger {firestore} />
</SignedIn>
