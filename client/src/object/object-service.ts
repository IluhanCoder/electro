import $api from "../axios";
import Object, { ObjectCredentials } from "./object-types";

interface ObjectRequestResponse {
    objects: Object[],
    message: string
}

export default new class ObjectService {
    async createObject(credentials: ObjectCredentials): Promise<{message: string}> {
        return ((await $api.post("/object", {credentials})).data) as {message: string};
    }

    async getUserObjects() {
        return ((await $api.get("/object/user")).data) as ObjectRequestResponse;
    }

    async getObjectData(objectId: string) {
        return ((await $api.get(`/object/data/${objectId}`)).data) as ObjectRequestResponse;
    };

    async deleteObjectById(objectId: string) {
        return ((await $api.delete(`/object/${objectId}`)).data) as ObjectRequestResponse;
    }

    async setLimit(obejctId: string, limit: number) {
        return((await $api.patch(`/object/limit/${obejctId}`, {limit})).data);
    }
}