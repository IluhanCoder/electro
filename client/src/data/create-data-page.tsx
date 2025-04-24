import { useEffect, useState } from "react";
import { ConsumptionCategory, ConsumptionCategoryTranslation, DataCredentials } from "./data-types";
import { FormContainerStyle, inputStyle } from "../styles/form-styles";
import { SubmitButtonStyle } from "../styles/button-styles";
import serviceErrorHandler from "../service-error-handler";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import objectService from "../object/object-service";
import ConsObject from "../object/object-types";
import dataService from "./data-service";
import formHelper from "../helpers/form-helper";
import { formatISO, parse, parseISO } from "date-fns";

interface StringedDateCredentials extends Omit<DataCredentials, "date"> { date: string };

export default function CreateDataPage() {
    const [error, setError] = useState<string>();
    const [dateInput, setDateInput] = useState<Date>(new Date());
    const [objectOptions, setObjectOptions] = useState<ConsObject[]>();

    const getObjects = async () => {
        try {
            setObjectOptions(undefined);
            const result = await objectService.getUserObjects();
            setObjectOptions([...result.objects]);
        } catch (error: any) {
            const handled = serviceErrorHandler(error);
            if (!handled && error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    }

    useEffect(() => {
        getObjects();
    }, []);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            const credentials = formHelper.getFormData(e) as unknown as StringedDateCredentials;
            const convertedDate = new Date(credentials.date); // або parseISO(credentials.date)
            await dataService.createData({ ...credentials, date: convertedDate });
            toast.success("данні успішно додано");
            navigate("/data");
        } catch (error: any) {
            const handled = serviceErrorHandler(error);
            if (!handled && error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = parseISO(e.target.value);
        setDateInput(newDate);
    };

    return <div className="flex flex-col justify-center w-full h-full">
        <div className="flex justify-center w-full pb-64">
            <form onSubmit={e => { handleSubmit(e) }} className={FormContainerStyle + " flex flex-col gap-4 p-8 w-1/3"}>
                <div className="text-center text-xl font-bold">додання даних</div>
                <div>
                    <input type="number" name="amount" placeholder="споживання (КВт/год)" className={inputStyle + " w-full"} />
                </div>
                <div className="flex flex-col gap-2">
                    <div>Дата:</div>
                    <input
                        type="datetime-local"
                        name="date" // ← ДОДАЙ ЦЕ
                        className={inputStyle}
                        value={formatISO(dateInput).slice(0, 16)}
                        onChange={handleDateChange}
                    />

                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-md">категорія споживання:</div>
                    <select name="category" className={inputStyle + " w-full"}>
                        {Object.entries(ConsumptionCategory).map(([key, label]) =>
                            <option value={label}>
                                {ConsumptionCategoryTranslation[label]}
                            </option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-md">обʼєкт:</div>
                    <select name="object" className={inputStyle + " w-full"}>
                        {objectOptions?.map((object: ConsObject) =>
                            <option value={object._id}>
                                {object.name}
                            </option>)}
                    </select>
                </div>
                <div className="flex justify-center pt-4">
                    <button type="submit" className={SubmitButtonStyle}>додати</button>
                </div>
                <div className="text-red-600 text-center">
                    {error}
                </div>
            </form>
        </div>
    </div>
}