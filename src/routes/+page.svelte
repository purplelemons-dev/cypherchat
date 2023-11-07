<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<input type="text" bind:value={inputText}/>

<textarea cols="32" rows="4"></textarea>

<script lang="ts">
    import { onMount } from 'svelte';
    import * as openpgp from 'openpgp';
    

    let inputText = '';
    $: console.log(`input text: ${inputText}`);

    let keypair;

    onMount(async ()=>{
        keypair = await openpgp.generateKey({
            userIDs: [{ name:'Jon Smith', email:'jsmith@purplelemons.dev'}],
            curve: 'ed25519'
        });
        console.log(keypair);
    })

</script>

<style>
    input, textarea {
        display: block;
        margin: 10px;
    }
</style>
