import { FirestoreModel } from '../../core/firestore/firestore.model';

export class AdminConfigModel extends FirestoreModel {
    collection = 'admin';

    constructor() {
        super();
        FirestoreModel.addField(this, 'id');
        FirestoreModel.addField(this, 'email');
        FirestoreModel.addField(this, 'password');
    }
}
