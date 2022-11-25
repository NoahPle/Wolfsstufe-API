import { FirestoreModel } from '../../core/firestore/firestore.model';

export class Rule extends FirestoreModel {
    collection = 'rules';

    constructor() {
        super();
        FirestoreModel.addField(this, 'id');
        FirestoreModel.addField(this, 'title');
        FirestoreModel.addField(this, 'content');
        FirestoreModel.addField(this, 'index');
    }
}
