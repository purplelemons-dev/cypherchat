// place files you want to import through the `$lib` alias in this folder.
export * from './firebase';
import * as openpgp from 'openpgp';

export const MASTER_KEY = 'password';

export const doEncrypt = async (inputText:string, publicKey:string, privateKey:string) => {
    return await openpgp
        .encrypt({
            message: await openpgp.createMessage({ text: inputText }),
            encryptionKeys: await openpgp.readKeys({ armoredKeys: publicKey }),
            signingKeys: await openpgp.decryptKey({
                privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
                passphrase: MASTER_KEY
            })
        })
        .then((ciphertext) => {
            console.log(ciphertext);
            return ciphertext.toString();
        });
};

export interface Messages {
    author: string;
    content: string;
    sentAt: Date;
}

