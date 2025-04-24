import { Link, useNavigate } from "react-router-dom";
import DateFormater from "../misc/date-formatter";
import { FormContainerStyle } from "../styles/form-styles";
import Data, { ConsumptionCategoryTranslation, DataResponse, DetailedDataResponse, isDetailedDataResponse } from "./data-types";
import { SmalleRedButtonStyle } from "../styles/button-styles";
import dataService from "./data-service";
import { toast } from "react-toastify";
import serviceErrorHandler from "../service-error-handler";
import { useState } from "react";
import { ConsumptionTypeTranslation } from "../object/object-types";

interface LocalParams {
    data: DataResponse | DetailedDataResponse,
    deleteCallback?: () => void
}

export function DataCard({data, deleteCallback}: LocalParams) {
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            toast("триває процес видалення...");
            setTimeout(async () => {
                await dataService.deleteDataById(data._id);
                if(deleteCallback) deleteCallback();
            }, 2000)
        } catch (error: any) {
            const handled = serviceErrorHandler(error, navigate);
            if(!handled) {
                toast.error(error.response.data.message);
                console.log(error);                
            }
        }
    }

    return <div className={FormContainerStyle + " h-fit flex flex-col p-4 bg-white transition-transform duration-300 ease-in-out z-1"}>
            <div className="text-2xl text-center pb-3">
                <DateFormater dayOfWeek value={data.date}/>
            </div>
            {isDetailedDataResponse(data) && 
            <div className="text-teal-700">
                {`користувач: ${data.user.nickname} (${data.user.name} ${data.user.surname})`}    
            </div>}
            <div className="flex text-gray-700 gap-2">
                <div className="mt-0.5">кількість споживання:</div>
                <div className="text-xl text-teal-400">{`${data.amount} КВт/год`}</div>
            </div>
            <div className="flex text-gray-700 gap-2">
                <div>обʼєкт:</div>
                {data.object.name}
            </div>
            <div className="flex text-gray-700 gap-2">
                <div>тип обʼєкту:</div>
                {ConsumptionTypeTranslation[data.object.type]}
            </div>
            <div className="flex text-gray-700 gap-2">
                <div>категорія споживання:</div>
                {ConsumptionCategoryTranslation[data.category]}
            </div>
            
        <div className="flex pt-4 text-gray-700 justify-center">
             <button className={SmalleRedButtonStyle} type="button" onClick={handleDelete}>
                видалити
            </button>
        </div>
    </div>
}