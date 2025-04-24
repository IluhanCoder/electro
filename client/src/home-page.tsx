import { useEffect } from "react"
import $api from "./axios"
import serviceErrorHandler from "./service-error-handler";
import { toast } from "react-toastify";
import { observer } from "mobx-react";
import LoadingBar from "./misc/loading-bar";

export default observer(function HomePage() {
    // const test = async () => {
    //     try {
    //         await $api.get("/test");
    //     } catch (error: any) {
    //         const handled = serviceErrorHandler(error);
    //         if (!handled) {
    //             const message = error?.response?.data?.message || "Невідома помилка";
    //             toast.error(message);
    //         }
    //     }
    // }
    
    // useEffect(() => {test()}, []);

    return <div>
        welcome page
        <LoadingBar/>
    </div>
})