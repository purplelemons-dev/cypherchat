<script>
	export let email = '';
	export let password = '';
	export let username = '';
</script>

<p>
	<label>
		Email:
		<input type="email" bind:value={email} placeholder="you@example.com" required />
	</label>
</p>
<p>
	<label>
		Username:
		<input type="text" bind:value={username} placeholder="username" required />
	</label>
</p>
<p>
	<label>
		Password:
		<input type="password" bind:value={password} required />
	</label>
	<slot />
</p>
