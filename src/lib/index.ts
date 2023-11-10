// place files you want to import through the `$lib` alias in this folder.
export * from './firebase';
import { firestore } from "./firebase";
import * as openpgp from 'openpgp';
import { collection, orderBy, query } from "firebase/firestore";

export const MASTER_KEY = 'password';

export const doEncrypt = async (inputText: string, publicKey: string, privateKey: string) => {
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
    sentAt: number;
}

export const queryBuilder = (ref: string, orderField: string, orderDirection: 'asc' | 'desc' = "asc") => {
    return query(collection(firestore, ref), orderBy(orderField, orderDirection));
};

