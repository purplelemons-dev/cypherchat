
<main>
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

    <input type="text" bind:value={inputText}/>

    <textarea id="encryptedarea" cols="32" rows="4" bind:value={encryptedValue}></textarea>

    <button on:click={doEncrypt}>encrypt</button>

    <button on:click={async() => {
        try {
            await navigator.clipboard.writeText(encryptedValue);
        } catch (err) {
            console.log("Failed to copy, probably because the clipboard api is disabled.");
        }
    }}>copy</button>

    <button on:click={() => {
        delMany(['privateKey', 'publicKey']);
        privateKey = '';
        publicKey = '';
        console.log("deleted keys");
    }}>revoke</button>
</main>

<script lang="ts">
    import { onMount } from "svelte";
    import * as openpgp from "openpgp";
    import {set, get, delMany} from "idb-keyval";

    const MASTER_KEY = "password";
    
    const doEncrypt = async () => {
        console.log("encrypting");
        openpgp.encrypt({
            message: await openpgp.createMessage({text: inputText}),
            encryptionKeys: (await openpgp.readKeys({ armoredKeys: publicKey })),
            signingKeys: (await openpgp.decryptKey({ privateKey: (await openpgp.readPrivateKey({ armoredKey: privateKey })), passphrase: MASTER_KEY })),
        }).then(ciphertext => {
            console.log(ciphertext);
            encryptedValue = ciphertext.toString();
        });
    }

    let inputText = "";
    let encryptedValue = "";
    $: console.log(`input text: ${inputText}`);

    let privateKey:string, publicKey:string;

    onMount(async ()=>{
        privateKey = await get("privateKey") ?? "";
        publicKey = await get("publicKey") ?? "";
        if (!(privateKey && publicKey)) {
            const keypair = await openpgp.generateKey({
                userIDs: [{ name:"Josh Smith", email:"jsmith@purplelemons.dev"}],
                curve: "ed25519",
                rsaBits: 4096,
                type: "ecc",
                passphrase: MASTER_KEY
            });
            privateKey = keypair.privateKey;
            publicKey = keypair.publicKey;

            set("privateKey", privateKey);
            set("publicKey", publicKey);
        } else {
            console.log("got keys from idb");
        }
    });
</script>

<style>
    input, textarea {
        display: block;
        margin: 10px;
    }
</style>
