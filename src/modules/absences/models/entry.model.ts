import { FirestoreModel } from '../../../core/firestore/firestore.model';
import { AbsenceList } from './absence-list.model';

export enum AttendanceState {
    present = 'present',
    absent = 'absent',
    excused = 'excused',
}

export class AbsenceEntry extends FirestoreModel {
    collection = 'entries';
    parentModel = new AbsenceList();

    constructor() {
        super();
        FirestoreModel.addField(this, 'id');
        FirestoreModel.addField(this, 'state', 'absent');
    }
}
