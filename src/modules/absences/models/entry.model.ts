import { FirestoreModel } from '../../../core/firestore/firestore.model';
import { AbsenceList } from './absence-list.model';

export enum EntryType {
    leader = 'leader',
    member = 'member',
}

export class AbsenceEntry extends FirestoreModel {
    collection = 'entries';
    parentModel = new AbsenceList();

    constructor() {
        super();
        FirestoreModel.addField(this, 'id');
        FirestoreModel.addField(this, 'present', false);
        FirestoreModel.addField(this, 'excused', false);
        FirestoreModel.addField(this, 'type', 'member');
    }
}
