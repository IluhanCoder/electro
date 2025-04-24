import { useState } from "react";
import { AuthCredentials, LoginCredentials } from "./auth-types";
import { FormContainerStyle, inputStyle } from "../styles/form-styles";
import { SubmitButtonStyle } from "../styles/button-styles";
import formHelper from "../helpers/form-helper";
import authService from "./auth-service";
import { toast } from "react-toastify";
import serviceErrorHandler from "../service-error-handler";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setError(null);
        try {
            const credentials = formHelper.getFormData(e) as unknown as LoginCredentials;
            const response = await authService.login(credentials);
            toast.success("ви успішно авторизувалися в системі!");
            if(response.user.role === "admin") {
                navigate("/data");
            }
            else if(response.user.role === "service") {
                navigate("/counter");
            }
            else navigate("/data");
        } catch (error: any) {
            const handled = serviceErrorHandler(error);
            if (!handled && error.response?.data?.message) {
                setError(error.response.data.message); 
            } else {
                console.error("Unexpected error:", error);
            }
        }
    }

    return <div className="flex h-full justify-center">
        <div className="flex flex-col justify-center w-3/4 lg:w-1/3">
            <div className={`flex flex-col gap-4 p-8 ${FormContainerStyle}`}>
                <div className="text-xl font-bold">Авторизація в системі</div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <input className={inputStyle} type="text" name="nicknameOrEmail" placeholder="email або нікнейм"/>
                            <input className={inputStyle} type="password" name="password" placeholder="пароль"/>
                        </div>
                        <div className="flex justify-center">
                            <button className={SubmitButtonStyle}>
                                авторизуватися
                            </button>
                        </div>
                    </form>
                    {error && <div className="text-red-500 flex justify-center">
                        {error}
                    </div>}
                    <div className="flex gap-1 justify-center">якщо нема облікового запису, ви можете<Link to="/registration" className="text-teal-500">зареєструватися</Link></div>
            </div>
        </div>
    </div>
}