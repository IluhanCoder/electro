import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import $api from "../axios";

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const {userId} = useParams();


  useEffect(() => {


    if (!userId) {
      setStatus("error");
      return;
    }

    $api
      .get(`/user/confirm-email/${userId}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {status === "pending" && <p>Підтвердження пошти...</p>}
      {status === "success" && (
        <div>
          <h2 className="text-xl font-bold text-green-600">Пошта успішно підтверджена ✅</h2>
          <p className="mt-4">
            Ви можете <a href="/login" className="text-blue-600 underline">увійти</a> у свій акаунт.
          </p>
        </div>
      )}
      {status === "error" && (
        <div>
          <h2 className="text-xl font-bold text-red-600">Помилка підтвердження ❌</h2>
          <p className="mt-4">Спробуйте ще раз або зверніться до підтримки.</p>
        </div>
      )}
    </div>
  );
}
