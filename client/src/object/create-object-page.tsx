import { useState } from "react";
import { ConsumptionType, ConsumptionTypeTranslation, ObjectCredentials } from "./object-types";
import { FormContainerStyle, inputStyle } from "../styles/form-styles";
import { SubmitButtonStyle } from "../styles/button-styles";
import serviceErrorHandler from "../service-error-handler";
import { toast } from "react-toastify";
import objectService from "./object-service";
import { useNavigate } from "react-router-dom";
import formHelper from "../helpers/form-helper";

export default function CreateObjectPage() {
    const [error, setError] = useState<string>();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            const credentials = formHelper.getFormData(e) as unknown as ObjectCredentials;
            await objectService.createObject(credentials);
            toast.success("обʼєкт успішно додано!");
            navigate("/objects");
        } catch (error: any) {
            const handled = serviceErrorHandler(error);
            if (!handled && error.response?.data?.message) {
               setError(error.response.data.message); 
            } else {
               console.error("Unexpected error:", error);
            }
        }
    }

    return <div className="flex flex-col justify-center w-full h-full">
        <div className="flex justify-center w-full pb-64">
            <form onSubmit={e => {handleSubmit(e)}} className={FormContainerStyle + " flex flex-col gap-4 p-8 w-1/3"}>
                <div className="text-center text-xl font-bold">створення обʼєкту</div>
                <div>
                    <input type="text" name="name" placeholder="назва обʼєкту" className={inputStyle + " w-full"}/>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-md">тип обʼєкту:</div>
                    <select name="type" className={inputStyle + " w-full"}>
                        {Object.entries(ConsumptionType).map(([key, label]) => 
                            <option value={label}>
                                {ConsumptionTypeTranslation[label]}
                            </option>)}
                    </select>
                </div>
                <div className="flex justify-center pt-4">
                    <button type="submit" className={SubmitButtonStyle}>створити</button>
                </div>
                <div className="text-red-600 text-center">
                    {error}
                </div>
            </form>
        </div>
    </div>
}