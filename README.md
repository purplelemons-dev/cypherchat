
# Cypherchat

totally stealing this idea from [my friend](https://github.com/The-Noah), but i think i can approach this a bit differently than him.

i'm also essentially taking my other project, [discord-pke](https://github.com/purplelemons-dev/discord-pke), to its logical conclusion. it was honestly way too hard to impliment such an advanced wrapper like that on top of discord.

## motive

whatsapp and signal are sellouts, nuff said. the market of truly trustworthy e2ee apps is dwindling.

## Capabilities

* first order of business is simple user set up (with public keys (probably gonna try and go with pgp))
* then, key exchange / message request / friend request
* then text encryption / sending messages
* then media encryption
* voice chat and maybe video chat? (encrypted, of course)
* group chat encryption (do the binary tree dual ratchet thing)

## future aspirations

* become a verification entity (e.g., if a developer wants their app to have a verification service, they can use cypher's services)
* facilitate and streamline decentralized payments.
* host large communities like how discord does.
