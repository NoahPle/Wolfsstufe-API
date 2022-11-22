import * as fs from 'fs';
import * as crypto from 'crypto';

export class CypherService {
    public static encrypt(data: string) {
        const publicKey = fs.readFileSync('public.pem', 'utf8');
        const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(data));
        return encrypted.toString('base64');
    }

    public static decrypt(data: string) {
        const privateKey = fs.readFileSync('private.pem', 'utf8');

        const decrypted = crypto.privateDecrypt(
            {
                key: privateKey,
                passphrase: '',
            },
            Buffer.from(data, 'base64'),
        );

        return decrypted.toString('utf8');
    }
}
