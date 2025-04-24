export enum ConsumptionType {
    HOUSE = 'house',
    APARTAMENT = 'apartament',
    OFFICE = 'office',
    ENTERPRISE = 'enterprise'
}

export enum ConsumptionTypeTranslation {
    "house" = "будинок",
    'apartament' = "квартира",
    'office' = "офіс",
    'enterprise' = "підприємство"
}

export default interface Object {
    _id: string,
    owner: string,
    type: ConsumptionType,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    limit?: string
}

export interface ObjectCredentials extends Omit<Object, "_id" | "createdAt" | "updatedAt" | "owner" | "limit"> {
    owner: string
}