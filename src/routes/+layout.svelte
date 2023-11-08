
<script lang="ts">
    import { FirebaseApp } from "sveltefire";
    import {auth, firestore, storage} from "$lib";
</script>

<FirebaseApp {auth} {firestore} {storage}>
    <slot />
</FirebaseApp>
