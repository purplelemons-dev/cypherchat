//import { error, json } from '@sveltejs/kit';
//import { firestore } from '$lib/firebase';
import { getFirebaseContext } from 'sveltefire';
import { doc, getDoc } from 'firebase/firestore';


export const GET = async ({ params }) => {
    try {

        const { username } = params;

        const { firestore } = getFirebaseContext();

        const usernameDoc = doc((firestore as any), `users/${username}`);

        if ((await getDoc(usernameDoc)).exists()) {
            return new Response(null, {
                status: 409,
                statusText: 'Username already exists'
            });
        };
        return new Response(null, {
            status: 200,
        });
    } catch (e) {
        return new Response(`Error checking username: ${e}`, { status: 500 });
    }
};
