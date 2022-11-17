import { FirestoreModel } from '../../core/firestore/firestore.model';

export enum UserRole {
    admin = 'admin',
    user = 'user',
    disabled = 'disabled',
}

export class User extends FirestoreModel {
    collectionPath = 'users';

    constructor() {
        super();
        FirestoreModel.addField(this, 'id', null);
        FirestoreModel.addField(this, 'email', null);
        FirestoreModel.addField(this, 'pfadiname', null);
        FirestoreModel.addField(this, 'firstname', null);
        FirestoreModel.addField(this, 'lastname', null);
        FirestoreModel.addField(this, 'role', 'user');
    }
}
