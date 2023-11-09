<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as openpgp from 'openpgp';
	import { set as idbSet, get as idbGet, delMany } from 'idb-keyval';
	import { SignedIn, userStore, collectionStore } from 'sveltefire';
	import { signOut } from 'firebase/auth';
    import { addDoc, collection } from "firebase/firestore";
	import { auth, MASTER_KEY, doEncrypt, firestore, type Messages } from '$lib';

	const doLogout = async () => {
		await signOut(auth);
	};

	let inputText = '';
	let encryptedValue = '';
	const userstore = userStore(auth);
	let privateKey: string, publicKey: string;
	let userstoreUnsubscribe: () => void;
    const fsMessages = collectionStore<Messages>(firestore, 'messages');

    const sendMessage = async () => {
        const messageCollection = collection(firestore, 'messages');
        await addDoc(messageCollection, {
            content: 'test' + (Math.random() * 100),
            author: $userstore?.email,
            sentAt: Date.now()
        });
    };

	onDestroy(() => {
		if (userstoreUnsubscribe) userstoreUnsubscribe();
	});

	onMount(async () => {
		userstoreUnsubscribe = auth.onAuthStateChanged((user) => {
			if (!user) {
				location.assign('/login');
			}
		});

		privateKey = (await idbGet('privateKey')) ?? '';
		publicKey = (await idbGet('publicKey')) ?? '';
		if (!(privateKey && publicKey)) {
			const keypair = await openpgp.generateKey({
				userIDs: [{ name: 'Josh Smith', email: 'jsmith@purplelemons.dev' }],
				curve: 'ed25519',
				rsaBits: 4096,
				type: 'ecc',
				passphrase: MASTER_KEY
			});
			privateKey = keypair.privateKey;
			publicKey = keypair.publicKey;

			idbSet('privateKey', privateKey);
			idbSet('publicKey', publicKey);
		}
	});
</script>

<main>
	<SignedIn let:user>
		<h1>Welcome to SvelteKit</h1>
		<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

		<p>email: {$userstore?.email}</p>

        {#each $fsMessages as message}
            <p>Author: {message.author}</p>
            <p>Message: {message.content}</p>
        {/each}

        <button on:click={sendMessage}>testbutton</button>
        

		<button on:click={doLogout}>logout</button>

		<input type="text" bind:value={inputText} />

		<textarea id="encryptedarea" cols="32" rows="4" bind:value={encryptedValue} />

		<button
			on:click={async () => {
				encryptedValue = await doEncrypt(inputText, publicKey, privateKey);
			}}>encrypt</button
		>

		<button
			on:click={async () => {
				try {
					await navigator.clipboard.writeText(encryptedValue);
				} catch (err) {
					console.log('Failed to copy, probably because the clipboard api is disabled.');
				}
			}}>copy</button
		>

		<button
			on:click={() => {
				delMany(['privateKey', 'publicKey']);
				privateKey = '';
				publicKey = '';
				console.log('deleted keys');
			}}>revoke</button
		>
	</SignedIn>
	<style>
		input,
		textarea,
        p {
			display: block;
			margin: 10px;
		}
	</style>
</main>
