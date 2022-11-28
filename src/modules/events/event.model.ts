import { FirestoreModel } from '../../core/firestore/firestore.model';

export enum Department {
    STVO = 'stvo',
    SM = 'sm',
    BOTH = 'both',
}

export class Event extends FirestoreModel {
    collection = 'events';

    constructor() {
        super();
        FirestoreModel.addField(this, 'id');
        FirestoreModel.addField(this, 'name');
        FirestoreModel.addField(this, 'motto');
        FirestoreModel.addField(this, 'start');
        FirestoreModel.addField(this, 'end');
        FirestoreModel.addField(this, 'department');
        FirestoreModel.addField(this, 'city');
        FirestoreModel.addField(this, 'responsible');
    }
}
