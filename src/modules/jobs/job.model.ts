import { FirestoreModel } from '../../core/firestore/firestore.model';

export class Job extends FirestoreModel {
    collection = 'jobs';

    constructor() {
        super();
        FirestoreModel.addField(this, 'id');
        FirestoreModel.addField(this, 'name');
        FirestoreModel.addField(this, 'userIds');
    }
}
