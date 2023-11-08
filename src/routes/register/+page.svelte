<script lang="ts">
	import LoginForm from '$lib/LoginForm.svelte';
	import { createUserWithEmailAndPassword, type Auth, sendEmailVerification, getAuth } from 'firebase/auth';
	import { SignedIn, SignedOut, User, userStore } from 'sveltefire';
    import {app} from "$lib";

	async function register(auth: Auth) {
		try {
			await createUserWithEmailAndPassword(auth, email, password).then(async ({ user }) => {
				await sendEmailVerification(user);
			});
		} catch (error) {
			alert(`error registering: ${error}`);
		}
	}

	$: passwordsOK = password === confirmPassword;
	$: emoji = passwordsOK ? '✅' : '❌';
    

	let email = '';
	let password = '';
	let confirmPassword = '';

    const auth = getAuth(app);
    const user = userStore(auth);
</script>
<main>
	<SignedIn>
		<!--TODO: find a way to subscribe to $user.emailVerified-->
		<User>
            {#if $user && $user.emailVerified}
				<h1>Already logged in</h1>
				<p>Go <a href="/">home</a></p>
			{:else}
				<h1>Please verify your email</h1>
				<p>Check your email for a verification link</p>
			{/if}
		</User>
	</SignedIn>

	<SignedOut let:auth>
		<h1>Register</h1>
		<form
			on:submit|preventDefault={() => {
				if (!passwordsOK) {
					alert('Passwords do not match');
					return;
				}
				register(auth);
			}}
		>
			<LoginForm bind:email bind:password>
				<label>
					Confirm password:
					<input type="password" bind:value={confirmPassword} required />
				</label>
				{emoji}
			</LoginForm>
			<button type="submit" disabled={!passwordsOK}>Register</button>
		</form>
		<div>
			<p>Already have an account? <a href="/login">Login</a></p>
		</div>
	</SignedOut>
</main>
