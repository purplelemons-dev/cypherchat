<script lang="ts">
	import LoginForm from '$lib/LoginForm.svelte';
	import {
		createUserWithEmailAndPassword,
		type Auth,
		sendEmailVerification,
		updateProfile
	} from 'firebase/auth';
	import { SignedIn, SignedOut, User } from 'sveltefire';

	async function register(auth: Auth) {
		try {
			fetch(`/register/validname/${username}`).then(async (res) => {
				if (res.status === 409) {
					alert(`Username "${username}" already taken`);
					return;
				} else if (res.status === 200) {
					await createUserWithEmailAndPassword(auth, email, password).then(async ({ user }) => {
						await sendEmailVerification(user);
						await updateProfile(user, { displayName: username });
					});
				} else {
					throw new Error(`unexpected response: ${JSON.stringify(res)}`);
				}
			});
		} catch (error) {
			alert(`error registering: ${error}`);
		}
	}

	$: passwordsOK = password === confirmPassword;
	$: emoji = passwordsOK ? '✅' : '❌';

	let email = '';
	let password = '';
	let username = '';
	let confirmPassword = '';
</script>

<main>
	<SignedIn let:user let:signOut>
		<!--TODO: find a way to subscribe to $user.emailVerified-->
		<User>
			{#if user && user.emailVerified}
				<h1>Already logged in</h1>
				<p>Go <a href="/">home</a></p>
			{:else if user && !user.emailVerified}
				<h1>Please verify your email</h1>
				<p>Check your email for a verification link</p>
			{:else}
				{async () => {
					await signOut();
				}}
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
			<LoginForm bind:email bind:password bind:username>
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
