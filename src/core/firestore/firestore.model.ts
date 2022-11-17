import { FirestoreService } from './firestore.service';

export abstract class FirestoreModel {
    abstract collectionPath;
    [key: string]: any;

    public getJson() {
        const object: object = { ...this };
        delete object['collectionPath'];
        return object;
    }

    public static async queryAll(): Promise<FirestoreModel[]> {
        // @ts-ignore
        const snapshot = await new this().getCollection().get();
        return snapshot.docs.map((doc) => {
            // @ts-ignore
            const model = new this();
            model.setFields(doc.data());
            return model;
        });
    }

    public static async queryById(id: string): Promise<FirestoreModel> {
        // @ts-ignore
        const model = new this();

        const snapshot = await model.getCollection().doc(id).get();
        model.setFields(snapshot.data());

        return model;
    }

    public getCollection() {
        return FirestoreService.getInstance().collection(this.collectionPath);
    }

    public setFields(fields = {}) {
        const object = this.getJson();

        for (const field of Object.keys(fields)) {
            if (object.hasOwnProperty(field)) {
                this[field] = fields[field];
            }
        }
    }

    protected static addField(object, fieldname, defaultValue) {
        object[fieldname] = defaultValue;
        Object.defineProperty(object, fieldname, {});
    }
}
