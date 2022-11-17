import { FirestoreService } from './firestore.service';
import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class FirestoreModel {
    abstract collection;
    protected parentModel: FirestoreModel;

    [key: string]: any;

    public getJson() {
        const object: object = { ...this };
        delete object['collection'];
        delete object['parentModel'];
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
        return FirestoreService.getInstance().collection(this.getCollectionPath());
    }

    public getCollectionPath() {
        if (this.parentModel) {
            return `${this.parentModel.getCollectionPath()}/${this.parentModel.id}/${this.collection}`;
        } else {
            return this.collection;
        }
    }

    public setFields(fields = {}) {
        const object = this.getJson();

        for (const field of Object.keys(fields)) {
            if (object.hasOwnProperty(field)) {
                this[field] = fields[field];
            }
        }
    }

    public setParentId(id: string) {
        if (this.parentModel) {
            this.parentModel.id = id;
        } else {
            throw new HttpException('parentModel not set', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public hasParent() {
        return !!this.parentModel;
    }

    protected static addField(object, fieldname, defaultValue = null) {
        object[fieldname] = defaultValue;
        Object.defineProperty(object, fieldname, {});
    }
}
