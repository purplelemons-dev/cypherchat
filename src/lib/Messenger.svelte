<script lang="ts">
	import { Firestore, addDoc, collection } from 'firebase/firestore';
	//import { userstore } from '$lib';
	import { SignedIn } from 'sveltefire';
	import type { User } from 'firebase/auth';
	export let firestore: Firestore;

	let messageContent = '';
	let sendTo = '';

	const sendMessage = async (user: User) => {
		let temp = messageContent;
		messageContent = '';
		const messageCollection = collection(firestore, `users/${sendTo}/messages`);
		await addDoc(messageCollection, {
			content: temp,
			author: user.email, //$userstore?.email,
			sentAt: Date.now()
		});
	};
</script>

<SignedIn let:user>
	<input bind:value={sendTo} type="text" placeholder="Recipient" />

	<input
		on:keypress={(k) => {
			if (k.key === 'Enter') {
				sendMessage(user);
			}
		}}
		type="text"
		placeholder="message"
		bind:value={messageContent}
	/>
	<button
		on:click={() => {
			sendMessage(user);
		}}>Send</button
	>
</SignedIn>
