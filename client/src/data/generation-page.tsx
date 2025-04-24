import { useState } from "react";
import { FormContainerStyle, inputStyle } from "../styles/form-styles";
import { SubmitButtonStyle } from "../styles/button-styles";
import { useNavigate } from "react-router-dom";
import serviceErrorHandler from "../service-error-handler";
import { toast } from "react-toastify";
import dataService from "./data-service";
import ObjectSelector from "../object/object-selector";

export default function GenerationPage() {
    const [connected, setConnected] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedObjectId, setSelectedObjectId] = useState<string>();

    const navigate = useNavigate();

    const handleConnect = () => {
        try {
            setError(null);
            const ipInput = document.getElementById("ip") as HTMLInputElement | null;
            const keyInput = document.getElementById("key") as HTMLInputElement | null;
            if (!ipInput?.value || ipInput?.value === "" || !keyInput?.value || keyInput?.value === "" || !selectedObjectId || selectedObjectId === "") {
                setError("ви маєте заповнити всі поля");
                return;
            }
            setConnected(true);
            setTimeout(async () => {
                await dataService.generateDataForUser(selectedObjectId, ipInput.value);
                toast.success("данні успішно перенесено");
                navigate("/data");
            }, 5500);
        } catch (error) {
            const handled = serviceErrorHandler(error, navigate);
            if(!handled) {
                toast.error("щось пішло не так...");
                console.log(error);
            }
        }
    }

    return <div className="flex w-full h-full justify-center">
        <div className="flex flex-col justify-center">
            <div className={FormContainerStyle + " flex flex-col gap-6 p-8 h-fit"}>
                    <div className="flex flex-col gap-2"> 
                        <h3 className="text-xl font-bold">Підключення до розумного лічильника</h3>
                        <div className="text-xs text-gray-400">підключення до лічильника дозволить зчитати з нього данні для подальшого аналізу</div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <input 
                            placeholder="IP-адреса (наприклад 192.168.1.42)" 
                            name="ip"
                            id="ip"
                            className={inputStyle}
                        />
                        <input 
                            placeholder="Ключ автентифікації" 
                            name="key"
                            id="key"
                            className={inputStyle}
                        />
                        <ObjectSelector className={inputStyle} value={selectedObjectId} onChange={(newId: string) => setSelectedObjectId(newId)} setInitialValue={setSelectedObjectId}/>
                        </div>
                        {error && <div className="text-center text-red-600">{error}</div>}
                    <button 
                        onClick={handleConnect} 
                        className={SubmitButtonStyle}
                    >
                        Підключитися
                    </button>

                    {connected && <div className="text-center mt-4 text-green-600">
                        ✅ Лічильник підключено! Дані оновлюються...
                    </div>}
            </div>
        </div>
    </div>
}