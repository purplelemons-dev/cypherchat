
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { getCypherUser } from "$lib";

export const POST: RequestHandler = async (requestEvent) => {
    try {
        const { username }: { username: string } = await requestEvent.request.json();
        const user = await getCypherUser(username);
        return json({ exists: user.exists(), publicKey: user.get("publicKey") });
    }
    catch (e) {
        return json({ exists: false, error: e }, { status: 500 });
    }
};
