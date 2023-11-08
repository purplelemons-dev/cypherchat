<script lang="ts">
	import LoginForm from '$lib/LoginForm.svelte';
	import { signInWithEmailAndPassword, type Auth, deleteUser } from 'firebase/auth';
	import { SignedIn, SignedOut } from 'sveltefire';

	async function signIn(auth: Auth) {
		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			alert(`error logging in: ${error}`);
		}
	}

	let email = '';
	let password = '';
</script>

<main>
	<SignedIn let:user let:signOut>
		<h1>Dashboard</h1>
		<p>Welcome, {user.email}</p>
		<p>User id: {user.uid}</p>
		<button on:click={signOut}>Sign out</button>
		<button
			on:click={async () => {
				if (confirm('Are you sure you want to delete your account?')) {
					try {
						await deleteUser(user);
					} catch (error) {
						alert(`error deleting user: ${error}`);
					}
				}
			}}>Delete account</button
		>
		<button
			on:click={() => {
				location.assign('/');
			}}>main page</button
		>
	</SignedIn>
	<SignedOut let:auth>
		<h1>Login</h1>
		<form
			on:submit|preventDefault={() => {
				signIn(auth);
			}}
		>
			<LoginForm bind:email bind:password />
			<button type="submit">Login</button>
		</form>
		<div>
			<p>Don't have an account? <a href="/register">Sign up</a></p>
		</div>
	</SignedOut>
</main>
