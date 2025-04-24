import { useEffect, useState } from "react"
import { ConsumptionCategory, ConsumptionCategoryTranslation } from "./data-types";
import { inputStyle } from "../styles/form-styles";
import ConsObject from "../object/object-types";
import objectService from "../object/object-service";
import serviceErrorHandler from "../service-error-handler";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export interface SearchParameters {
    category: ConsumptionCategory | undefined,
    objectId: string | undefined
}

interface LocalParams {
    filterState: [SearchParameters, React.Dispatch<React.SetStateAction<SearchParameters>>],
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DataSearchBar({filterState, setLoading}: LocalParams) {
    const [filter, setFilter] = filterState;
    const [objects, setObjects] = useState<ConsObject[]>();

    const navigate = useNavigate();

    const getObject = async () => {
        setLoading(true);
        try {
            const result = await objectService.getUserObjects();
            setObjects(result.objects);
        } catch (error) {
            const handled = serviceErrorHandler(error, navigate);
            if(!handled) {
                toast.error("щось пішло не так...");
                console.log(error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getObject();
    }, []);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value; 
        const newValue = value === "" ? undefined : ConsumptionCategory[value as keyof typeof ConsumptionCategory];
        setFilter({...filter, category: newValue});
    }

    const handleObjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value; 
        const newValue = value === "" ? undefined : value
        setFilter({...filter, objectId: newValue});
    }

    return <div className="flex w-3/4 px-20 gap-10 justify-center">
        <div className="grow flex flex-col gap-2">
            <div>категорія споживання:</div>
            <select className={inputStyle + " w-full"} onChange={handleCategoryChange}>
                <option value="">будь-яка</option>
                {(Object.entries(ConsumptionCategory).map(([key, value]) => 
                    <option value={key}>{ConsumptionCategoryTranslation[value]}</option>
                ))}
            </select>
        </div>
        <div className="grow flex flex-col gap-2">
            <div>обʼєкт:</div>
            <select value={filter.objectId ?? ""} className={inputStyle  + " w-full"} onChange={handleObjectChange}>
                <option value="">будь-який</option>
                {objects && objects.map((object: ConsObject) => 
                    <option key={object._id} value={object._id}>{object.name}</option>
                )}
            </select>
        </div>
    </div>
}