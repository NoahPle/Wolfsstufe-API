import { FirestoreModel } from '../../core/firestore/firestore.model';

export enum UserRole {
    admin = 'admin',
    user = 'user',
    disabled = 'disabled',
}

export class User extends FirestoreModel {
    collection = 'users';

    constructor() {
        super();
        FirestoreModel.addField(this, 'id');
        FirestoreModel.addField(this, 'email');
        FirestoreModel.addField(this, 'pfadiname');
        FirestoreModel.addField(this, 'firstname');
        FirestoreModel.addField(this, 'lastname');
        FirestoreModel.addField(this, 'role', 'user');
    }
}
