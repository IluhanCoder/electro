import { useEffect, useState } from "react";
import authStore from "../auth/auth-store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RedButtonStyle, SubmitButtonStyle } from "../styles/button-styles";
import authService from "../auth/auth-service";
import { observer } from "mobx-react";

export default observer(function ProfilePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  }

  if (isLoading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  const user = authStore.user;

  return (
    <div className="max-w-3xl mt-20 mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Профіль користувача</h2>
        <p className="text-sm text-gray-500">Інформація про ваш акаунт</p>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Ім'я та прізвище */}
          <div className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-left">
              <p className="text-lg font-semibold text-gray-800">Ім'я та прізвище</p>
              <p className="text-sm text-gray-500">{user?.name} {user?.surname}</p>
            </div>
          </div>

          {/* Нікнейм */}
          <div className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-left">
              <p className="text-lg font-semibold text-gray-800">Нікнейм</p>
              <p className="text-sm text-gray-500">{user?.nickname}</p>
            </div>
          </div>

          {/* Email */}
<div className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
  <div className="text-left">
    <p className="text-lg font-semibold text-gray-800">Email</p>
    <p className="text-sm text-gray-500">{user?.email}</p>
    <p className={`text-sm mt-1 ${user?.emailSubmited ? "text-green-600" : "text-red-600"}`}>
      {user?.emailSubmited ? "✅ Email підтверджено" : "❌ Email не підтверджено"}
    </p>
  </div>
</div>


          {/* Роль */}
          <div className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-left">
              <p className="text-lg font-semibold text-gray-800">Роль</p>
              <p className="text-sm text-gray-500">{user?.role}</p>
            </div>
          </div>

          {/* ID користувача */}
          <div className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-left">
              <p className="text-lg font-semibold text-gray-800">ID користувача</p>
              <p className="text-sm text-gray-500">{user?._id}</p>
            </div>
          </div>
        </div>

                {/* Кнопка підтвердження email */}
                <div className="mt-4 text-center">
          <button
            type="button"
            onClick={async () => {
              try {
                await authService.sendEmailConfirmation();
                toast.success("Лист надіслано. Перевірте пошту.");
              } catch (error) {
                toast.error("Не вдалося надіслати лист.");
              }
            }}
            className={SubmitButtonStyle}
          >
            отримувати листи
          </button>
        </div>


        <div className="mt-6 text-center">
            <button type="button" onClick={handleLogout} className={RedButtonStyle}>вийди з облікового запису</button>
        </div>
      </div>
    </div>
  );
})