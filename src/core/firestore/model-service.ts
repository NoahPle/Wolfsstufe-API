import { FirestoreModel } from './firestore.model';
import { FirestoreService } from './firestore.service';
import { firestore } from 'firebase-admin';
import DocumentReference = firestore.DocumentReference;

export abstract class ModelService {
    protected async add(model: FirestoreModel): Promise<string> {
        return (await this.bulkAdd([model]))[0];
    }

    protected async addWithDto(dto = {}, modelRef: typeof FirestoreModel, parentId?: string): Promise<string> {
        return (await this.bulkAddWithDto([dto], modelRef, parentId))[0];
    }

    protected async bulkAddWithDto(dtos = [], modelRef: typeof FirestoreModel, parentId?: string): Promise<string[]> {
        return await this.bulkAdd(this.generateModels(dtos, modelRef, parentId));
    }

    protected async addWithId(dto = {}, modelRef: typeof FirestoreModel, parentId?: string) {
        await this.bulkAddWithId([dto], modelRef, parentId);
    }

    protected async bulkAddWithId(dtos = [], modelRef: typeof FirestoreModel, parentId?: string) {
        await this.bulkSet(this.generateModels(dtos, modelRef, parentId), false);
    }

    protected async bulkAdd(models: FirestoreModel[]): Promise<string[]> {
        const batch = FirestoreService.getInstance().batch();
        const ids = [];

        for (const model of models) {
            const ref = model.getCollection().doc();

            batch.create(ref, {
                ...model.getJson(),
                id: ref.id,
            });
            ids.push(ref.id);
        }

        await batch.commit();
        return ids;
    }

    protected async set(model: FirestoreModel) {
        await this.bulkSet([model]);
    }

    protected async setWithDto(dto = {}, modelRef: typeof FirestoreModel, parentId?: string) {
        await this.bulkSetWithDto([dto], modelRef, parentId);
    }

    protected async bulkSetWithDto(dtos = [], modelRef: typeof FirestoreModel, parentId?: string) {
        await this.bulkSet(this.generateModels(dtos, modelRef, parentId));
    }

    protected async bulkSet(models: FirestoreModel[], removeNull = true) {
        const batch = FirestoreService.getInstance().batch();

        for (const model of models) {
            if (model.id) {
                const ref = model.getCollection().doc(model.id);
                const json = model.getJson();

                if (removeNull) {
                    for (const key of Object.keys(json)) {
                        if (json[key] === null || json[key] === undefined) {
                            delete json[key];
                        }
                    }
                }

                batch.set(ref, json, { merge: true });
            }
        }

        await batch.commit();
    }

    protected async delete(id: string, modelRef: typeof FirestoreModel) {
        await this.bulkDelete([id], modelRef);
    }

    protected async bulkDelete(ids: string[], modelRef: typeof FirestoreModel) {
        const batch = FirestoreService.getInstance().batch();
        // @ts-ignore
        const model = new modelRef();

        for (const id of ids) {
            const ref = model.getCollection().doc(id);
            batch.delete(ref);
        }

        await batch.commit();
    }

    protected async recursiveDelete(id: string, modelRef: typeof FirestoreModel) {
        // @ts-ignore
        const model = new modelRef();
        const ref = model.getCollection().doc(id);
        const subRefs = await this.recursiveDeleteByDocument(ref);
        const batch = FirestoreService.getInstance().batch();
        for (const subRef of subRefs) batch.delete(subRef);
        batch.delete(ref);
        await batch.commit();
    }

    private async recursiveDeleteByDocument(ref: DocumentReference): Promise<DocumentReference[]> {
        const subCollections = await ref.listCollections();
        const refs: DocumentReference[] = [ref];

        if (subCollections.length) {
            await Promise.all(
                subCollections.map(async (collection) => {
                    const snapshot = await collection.get();
                    const data = await Promise.all(snapshot.docs.map((doc) => this.recursiveDeleteByDocument(doc.ref)));
                    for (const subRefs of data) {
                        refs.push(...subRefs);
                    }
                }),
            );
        }

        return refs;
    }

    private generateModels(dtos = [], modelRef: typeof FirestoreModel, parentId?: string): FirestoreModel[] {
        const models: FirestoreModel[] = [];

        for (const dto of dtos) {
            // @ts-ignore
            const model = new modelRef();

            if (parentId && model.hasParent()) {
                model.setParentId(parentId);
            }

            model.setFields(dto);
            models.push(model);
        }

        return models;
    }
}
