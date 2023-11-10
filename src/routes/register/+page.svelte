<script lang="ts">
	import { getCypherUser } from '$lib';
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
			const cypherUser = await getCypherUser(username);
			if (!cypherUser.exists()) {
				await createUserWithEmailAndPassword(auth, email, password).then(async ({ user }) => {
					if (user) {
						await updateProfile(user, { displayName: username });
						await sendEmailVerification(user);
						alert('Verification email sent');
					}
				});
			} else {
				alert(`Username "${username}" taken`);
				username = '';
			}
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
			on:submit|preventDefault={async () => {
				if (!passwordsOK) {
					alert('Passwords do not match');
					return;
				}
				await register(auth);
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
