<script lang="ts">
	import { Firestore, addDoc, collection } from 'firebase/firestore';
	import { doEncrypt, getCypherUser } from '$lib';
	import { SignedIn } from 'sveltefire';
	import type { User } from 'firebase/auth';
	import { get as idbGet } from 'idb-keyval';
	export let firestore: Firestore;

	let messageContent = '';
	let sendTo = '';

	const sendMessage = async (user: User) => {
		const recipient = await getCypherUser(sendTo);
		const privateKey = await idbGet('privateKey');
		if (recipient.exists() && privateKey) {
			let encryptedText = await doEncrypt(messageContent, recipient.get('publicKey'), privateKey);
			messageContent = '';
			const messageCollection = collection(firestore, `users/${sendTo}/messages`);
			await addDoc(messageCollection, {
				content: encryptedText,
				author: user.displayName,
				sentAt: Date.now()
			});
		}
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
