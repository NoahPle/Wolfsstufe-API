import { FirestoreModel } from './firestore.model';
import { FirestoreService } from './firestore.service';

export abstract class ModelService {
    protected async add(model: FirestoreModel) {
        await this.bulkAdd([model]);
    }

    protected async set(model: FirestoreModel) {
        await this.bulkSet([model]);
    }

    protected async delete(id: string, modelRef: typeof FirestoreModel) {
        await this.bulkDelete([id], modelRef);
    }

    protected async bulkAdd(models: FirestoreModel[]) {
        const batch = FirestoreService.getInstance().batch();

        for (const model of models) {
            const ref = model.getCollection().doc();

            batch.create(ref, {
                ...model.getJson(),
                id: ref.id,
            });
        }

        await batch.commit();
    }

    protected async bulkSet(models: FirestoreModel[]) {
        const batch = FirestoreService.getInstance().batch();

        for (const model of models) {
            if (model.id) {
                const ref = model.getCollection().doc(model.id);
                const json = model.getJson();

                for (const key of Object.keys(json)) {
                    if (!json[key]) {
                        delete json[key];
                    }
                }

                batch.set(ref, json, { merge: true });
            }
        }

        await batch.commit();
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

    protected async setWithDto(dto = {}, modelRef: typeof FirestoreModel, parentId?: string) {
        await this.bulkSetWithDto([dto], modelRef, parentId);
    }

    protected async bulkSetWithDto(dtos = [], modelRef: typeof FirestoreModel, parentId?: string) {
        await this.bulkSet(this.generateModels(dtos, modelRef, parentId));
    }

    protected async addWithDto(dto = {}, modelRef: typeof FirestoreModel, parentId?: string) {
        await this.bulkAddWithDto([dto], modelRef, parentId);
    }

    protected async bulkAddWithDto(dtos = [], modelRef: typeof FirestoreModel, parentId?: string) {
        await this.bulkAdd(this.generateModels(dtos, modelRef, parentId));
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
