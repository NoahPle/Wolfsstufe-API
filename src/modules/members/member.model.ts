import { FirestoreModel } from '../../core/firestore/firestore.model';

export class Member extends FirestoreModel {
    collection = 'members';

    constructor() {
        super();
        FirestoreModel.addField(this, 'id');
        FirestoreModel.addField(this, 'midataId');
        FirestoreModel.addField(this, 'firstname');
        FirestoreModel.addField(this, 'lastname');
        FirestoreModel.addField(this, 'pfadiname');
        FirestoreModel.addField(this, 'phone');
        FirestoreModel.addField(this, 'disabled', false);
    }

    public static override async queryAll(disabled = false) {
        const models = await super.queryAll();
        return disabled ? models : models.filter((model) => !model.disabled);
    }
}
