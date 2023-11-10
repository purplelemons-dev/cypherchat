<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as openpgp from 'openpgp';
	import { set as idbSet, get as idbGet, delMany } from 'idb-keyval';
	import { Collection, SignedIn, collectionStore, docStore } from 'sveltefire';
	import { signOut } from 'firebase/auth';
	import { auth, MASTER_KEY, doEncrypt, firestore, queryBuilder } from '$lib';
	import Messenger from '$lib/Messenger.svelte';
	import MessageDisplay from '$lib/MessageDisplay.svelte';
	import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';

	const doLogout = async () => {
		await signOut(auth);
	};

	const q = collectionStore(firestore, `users/${auth.currentUser?.displayName}/messages`);
	const clearChat = async () => {
		for (const doc of $q) {
			deleteDoc((doc as any).ref);
		}
	};

	let inputText = '';
	let encryptedValue = '';
	let privateKey: string, publicKey: string;
	let userstoreUnsubscribe: () => void;

	onDestroy(() => {
		if (userstoreUnsubscribe) userstoreUnsubscribe();
	});

	onMount(async () => {
		userstoreUnsubscribe = auth.onAuthStateChanged(async (user) => {
			if (!user) {
				location.assign('/login');
			} else if (user) {
				privateKey = (await idbGet('privateKey')) ?? '';
				publicKey = (await idbGet('publicKey')) ?? '';

				if (!(privateKey && publicKey) && user.email && user.displayName) {
					const keypair = await openpgp.generateKey({
						userIDs: [{ name: user.displayName, email: user.email }],
						curve: 'ed25519',
						rsaBits: 4096,
						type: 'ecc',
						passphrase: MASTER_KEY
					});
					privateKey = keypair.privateKey;
					publicKey = keypair.publicKey;

					idbSet('privateKey', privateKey);
					idbSet('publicKey', publicKey);

					setDoc(doc(firestore, `users/${user.displayName}`), {
						publicKey: publicKey
					}).then(() => {
						alert(`Public key added to database`);
					});
				}
			}
		});
	});
</script>

<main>
	<SignedIn let:user>
		<h1>Welcome to SvelteKit</h1>
		<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

		<p>Logged in as {user.displayName} ({user.email})</p>

		<Collection
			ref={queryBuilder(`users/${user.displayName}/messages`, 'sentAt')}
			let:data={dataList}
		>
			<MessageDisplay {dataList} />
		</Collection>

		<Messenger {firestore} />

		<button on:click={clearChat}>clear chat</button>

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
