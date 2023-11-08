<script>
	export let email = '';
	export let password = '';
</script>

<p>
	<label>
		Email:
		<input type="email" bind:value={email} placeholder="you@example.com" required />
	</label>
</p>
<p>
	<label>
		Password:
		<input type="password" bind:value={password} required />
	</label>
	<slot />
</p>
