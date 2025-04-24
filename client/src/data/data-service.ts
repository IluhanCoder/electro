import $api from "../axios";
import { DataCredentials, DataResponse, DetailedDataResponse } from "./data-types";

interface DataRequestResponse {
    data: DataResponse[],
    message: string
}

interface DataRequestDetailedResponse {
    data: DetailedDataResponse[],
    message: string
}   

export default new class DataService {
    async createData(credentials: DataCredentials): Promise<{message: string}> {
        return (await $api.post("/data", {credentials})).data as {message: string};
    }

    async fetchUserData() {
        return ((await $api.get("/data")).data) as DataRequestResponse;
    }

    async fetchDataForAdmin() {
        return ((await $api.get("/data/admin")).data) as DataRequestDetailedResponse;
    }

    async getDataByDateRange(startDate: Date, endDate: Date) {
        return ((await $api.post("/data/date-range", {startDate, endDate})).data) as DataRequestResponse;
    }

    async deleteDataById(dataId: string) {
        return ((await $api.delete(`/data/${dataId}`)).data) as {message: string};
    }

    async generateDataForUser(objectId: string, counterIp: string) {
        return ((await $api.post(`/data/generate/${objectId}`, {counterIp})).data) as {message: string};
    }

    async generateInstantDataForUser(objectId: string) {
        return ((await $api.get(`/data/generate-instant/${objectId}`)).data) as {message: string};
    }
}