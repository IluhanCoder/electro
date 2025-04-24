import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";

export default function serviceErrorHandler(error: any, navigate?: NavigateFunction): boolean {
    if (error.code) {
        if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
            toast.error("Проблема із зʼєднанням до сервера");
            return true;
        }
        const status = error.response?.status;
        if (!status || status >= 500) {
            toast.error("Помилка на стороні сервера. Спробуйте пізніше");
            return true;
        }
        if(status === 401) {
            toast.error(error.response.data.message);
            if(navigate) navigate("/login");
            return true;
        }

    }
    return false; // не оброблена — показувати якось інакше
}
