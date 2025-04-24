import Object from "../object/object-types";
import { DetailedUserResponse, UserResponse } from "../user/user-types";

export enum ConsumptionCategory {
    HEATING = 'heating',
    LIGHTING = 'lighting',
    HOUSEHOLD = 'household',
    MEDIA = 'media'
}

export enum ConsumptionCategoryTranslation {
    'heating' = "обігрів",
    'lighting' = "освітлення",
    'household' = "побутова техніка",
    'media' = "медіа, або компʼютерна техніка"
}

//можливо додати I в назві
export default interface Data {
    _id: string,
    object: string,
    user: string,
    amount: number,
    category: ConsumptionCategory,
    comment?: string,
    date: Date
}

export interface DataCredentials extends Omit<Data, "_id" | "user" | "object"> {
    objectId: string,
    user: string
}

export interface DataResponse extends Omit<Data, "user" | "object"> {
    _id: string,
    user: string,
    object: Object
}

export interface DetailedDataResponse extends Omit<Data, "user" | "object"> {
    _id: string,
    object: Object,
    user: DetailedUserResponse
}

export function isDetailedDataResponse(data: any): data is DetailedDataResponse {
  return (
    data &&
    typeof data === "object" &&
    "_id" in data &&
    "object" in data &&
    data.object &&
    typeof data.object === "object" &&
    "user" in data &&
    data.user &&
    typeof data.user === "object" &&
    "email" in data.user
  );
}
