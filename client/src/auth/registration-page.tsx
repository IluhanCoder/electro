import { useState } from "react";
import { AuthCredentials } from "./auth-types";
import { FormContainerStyle, inputStyle } from "../styles/form-styles";
import { SubmitButtonStyle } from "../styles/button-styles";
import formHelper from "../helpers/form-helper";
import authService from "./auth-service";
import { toast } from "react-toastify";
import serviceErrorHandler from "../service-error-handler";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage() {
    const [error, setError] = useState<string | null>(null);

    interface formData {
        name: string,
        surname: string,
        nickname: string,
        email: string,
        password: string,
        passwordSubmit: string
    }

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setError(null);
        try {
            const { name, surname, nickname, email, password, passwordSubmit } = formHelper.getFormData(e) as unknown as formData;
            const credentials: AuthCredentials = {
                userCredentials: {
                    name,
                    surname,
                    nickname,
                    email
                },
                password,
                passwordSubmit
            }
            await authService.register(credentials);
            toast.success("ви успішно зареєструвалися в системі!");
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

    return <div className="flex h-full justify-center">
        <div className="flex flex-col justify-center w-3/4 lg:w-1/3">
            <div className={`flex flex-col gap-4 p-8 ${FormContainerStyle}`}>
                <div className="text-xl font-bold">Реєстрація в системі</div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <input className={inputStyle} type="text" name="name" placeholder="імʼя"/>
                            <input className={inputStyle} type="text" name="surname" placeholder="прізвище"/>
                            <input className={inputStyle} type="text" name="nickname" placeholder="нікнейм"/>
                            <input className={inputStyle} type="email" name="email" placeholder="email"/>
                            <input className={inputStyle} type="password" name="password" placeholder="пароль"/>
                            <input className={inputStyle} type="password" name="passwordSubmit" placeholder="підтвердження паролю"/>
                        </div>
                        <div className="flex justify-center">
                            <button className={SubmitButtonStyle}>
                                зареєструватися
                            </button>
                        </div>
                    </form>
                    {error && <div className="text-red-500 flex justify-center">
                        {error}
                    </div>}
            </div>
        </div>
    </div>
}