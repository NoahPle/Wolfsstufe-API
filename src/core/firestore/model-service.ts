import { FirestoreModel } from './firestore.model';

export abstract class ModelService {
    protected abstract model: FirestoreModel;

    protected async set(id: string, fields = {}) {
        await this.model.getCollection().doc(id).set(fields, { merge: true });
    }
}
