<script lang="ts">
	import { onMount } from 'svelte';
	import * as openpgp from 'openpgp';
	import { set, get, delMany } from 'idb-keyval';
	import { SignedIn, SignedOut, User, userStore } from 'sveltefire';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib';
    import { goto } from '$app/navigation';

	const MASTER_KEY = 'password';

	const doEncrypt = async () => {
		//console.log('encrypting');
		openpgp
			.encrypt({
				message: await openpgp.createMessage({ text: inputText }),
				encryptionKeys: await openpgp.readKeys({ armoredKeys: publicKey }),
				signingKeys: await openpgp.decryptKey({
					privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
					passphrase: MASTER_KEY
				})
			})
			.then((ciphertext) => {
				console.log(ciphertext);
				encryptedValue = ciphertext.toString();
			});
	};

	const doLogout = async () => {
		await signOut(auth);
	};

	let inputText = '';
	let encryptedValue = '';
	$: console.log(`input text: ${inputText}`);

	let privateKey: string, publicKey: string;

	onMount(async () => {
		privateKey = (await get('privateKey')) ?? '';
		publicKey = (await get('publicKey')) ?? '';
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

			set('privateKey', privateKey);
			set('publicKey', publicKey);
		} else {
			//console.log('got keys from idb');
		}
	});
</script>

<main>
	<SignedIn>
		<h1>Welcome to SvelteKit</h1>
		<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

        <button on:click={doLogout}>logout</button>

		<input type="text" bind:value={inputText} />

		<textarea id="encryptedarea" cols="32" rows="4" bind:value={encryptedValue} />

		<button on:click={doEncrypt}>encrypt</button>

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
	<SignedOut>
		<script>
			location.assign("/login");
		</script>
	</SignedOut>

	<style>
		input,
		textarea {
			display: block;
			margin: 10px;
		}
	</style>
</main>
