import { FirestoreModel } from '../../../core/firestore/firestore.model';

export class AbsenceList extends FirestoreModel {
    collection = 'absences';

    constructor() {
        super();
        FirestoreModel.addField(this, 'id');
        FirestoreModel.addField(this, 'date');
    }
}
