import * as admin from 'firebase-admin';
import * as firebaseAuth from 'firebase/auth';
import * as firebase from 'firebase/app';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/lib/auth';

admin.initializeApp({
    credential: admin.credential.cert('wolfsstufe-dev-firebase-adminsdk.json'),
});

firebase.initializeApp({
    apiKey: 'AIzaSyBNymQOIjtppmNtp9I0q6Zmko3ijYiRryQ',
    authDomain: 'wolfsstufe-dev.firebaseapp.com',
    projectId: 'wolfsstufe-dev',
    storageBucket: 'wolfsstufe-dev.appspot.com',
    messagingSenderId: '948113123953',
    appId: '1:948113123953:web:8dffef961d3296c4f989d0',
});

admin.firestore().settings({ timestampsInSnapshots: true });

export class FirestoreService {
    public static getInstance() {
        return admin.firestore();
    }

    public static getAuth(): admin.auth.Auth {
        return admin.auth();
    }

    static async authenticateWithEmailAndPassword(email: string, password: string) {
        try {
            const firebaseUserCredential = await firebaseAuth.signInWithEmailAndPassword(
                firebaseAuth.getAuth(),
                email,
                password,
            );

            const claims = (await this.getAuth().getUser(firebaseUserCredential.user.uid)).customClaims;
            if (claims.role === 'disabled') return null;
            return this.getAuth().createCustomToken(firebaseUserCredential.user.uid, claims);
        } catch (e) {
            return null;
        }
    }

    static async verifyIdToken(token: string): Promise<DecodedIdToken> {
        try {
            return await this.getAuth().verifyIdToken(token);
        } catch (e) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }

    static async createUser(email: string): Promise<string> {
        try {
            const firebaseUserCredential = await firebaseAuth.createUserWithEmailAndPassword(
                firebaseAuth.getAuth(),
                email,
                '2@oK5590WN$D',
            );

            await firebaseAuth.sendPasswordResetEmail(firebaseAuth.getAuth(), email);
            return firebaseUserCredential.user.uid;
        } catch (e) {
            throw new HttpException('Email already Exists', HttpStatus.BAD_REQUEST);
        }
    }

    static async setCustomClaims(uid: string, claims = {}) {
        await this.getAuth().setCustomUserClaims(uid, claims);
    }
}
