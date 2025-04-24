import { useEffect, useState } from "react";
import objectService from "./object-service";
import { useNavigate } from "react-router-dom";
import serviceErrorHandler from "../service-error-handler";
import { toast } from "react-toastify";
import Object from "./object-types";

interface LocalParams {
    value?: string,
    onChange?: (objectId: string) => void,
    className?: string,
    anyOption?: boolean
    setInitialValue?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function ObjectSelector({value, onChange, className, anyOption, setInitialValue}: LocalParams) {
    const [objects, setObjects] = useState<Object[]>();

    const navigate = useNavigate();

    const getData = async () => {
        try {
            const result = await objectService.getUserObjects();
            setObjects([...result.objects]);
            if(setInitialValue) setInitialValue(result.objects[0]._id);
        } catch(error) {
            const handled = serviceErrorHandler(error, navigate);
            if(!handled) {
                toast.error("щось пішло не так...");
                console.log(error);
            }
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return <select className={className} value={value} onChange={(e) => { if(onChange) onChange(e.target.value) }}>
        {anyOption && <option value="">будь-який</option>}
        {objects && objects.map((object: Object) => <option value={object._id}>{object.name}</option>)}
    </select>
}