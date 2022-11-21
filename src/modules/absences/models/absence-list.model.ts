import { FirestoreModel } from '../../../core/firestore/firestore.model';
import * as moment from 'moment';
import { convertFirestoreDate } from '../../../core/utils/utils';

export class AbsenceList extends FirestoreModel {
    collection = 'absences';

    constructor() {
        super();
        FirestoreModel.addField(this, 'id');
        FirestoreModel.addField(this, 'date');
    }

    public static async findByDate(date: moment.Moment) {
        const snapshot = await this.getModel(AbsenceList)
            .getCollection()
            .where('date', '==', date.startOf('day').toDate())
            .get();

        if (snapshot.docs.length) {
            const data = snapshot.docs[0].data();
            convertFirestoreDate(data);
            return FirestoreModel.firestoreToModel(data, AbsenceList);
        } else {
            return null;
        }
    }
}
