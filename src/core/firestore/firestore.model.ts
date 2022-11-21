import { FirestoreService } from './firestore.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { convertFirestoreDate } from '../utils/utils';

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
        const snapshot = await this.getModel(this).getCollection().get();
        const models = [];

        for (const doc of snapshot.docs) {
            const data = doc.data();
            convertFirestoreDate(doc.data());
            models.push(this.firestoreToModel(data, this));
        }

        return models;
    }

    public static async queryById(id: string): Promise<FirestoreModel> {
        const snapshot = await this.getModel(this).getCollection().doc(id).get();
        const data = snapshot.data();
        convertFirestoreDate(data);
        return this.firestoreToModel(data, this);
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

    public static getModel(modelRef: typeof FirestoreModel): FirestoreModel {
        // @ts-ignore
        return new modelRef();
    }

    public static firestoreToModel(
        data: FirebaseFirestore.DocumentData,
        modelRef: typeof FirestoreModel,
    ): FirestoreModel {
        const model = this.getModel(modelRef);
        model.setFields(data);
        return model;
    }
}
