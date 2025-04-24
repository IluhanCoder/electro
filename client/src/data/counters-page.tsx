import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import authStore from "../auth/auth-store";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingBar from "../misc/loading-bar";
import $api from "../axios";
import { ConsumptionType, ConsumptionTypeTranslation } from "../object/object-types";

type CounterInfo = {
  _id: string;
  ip: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  object: {
    name: string;
    type: ConsumptionType;
  };
};

function ServiceCountersPage() {
  const user = authStore.user;
  const [counters, setCounters] = useState<CounterInfo[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCounters = async () => {
    try {
      setLoading(true);
      const response = await $api.get("/data/counters"); // припускаємо, що твій ендпоінт саме такий
      setCounters(response.data as CounterInfo[]);
    } catch (err) {
      toast.error("Не вдалося завантажити лічильники");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "service") {
      fetchCounters();
    }
  }, [user]);

  if (!user || user.role !== "service") {
    return (
      <div className="text-center text-lg mt-10 text-red-600">
        У вас немає доступу до цієї сторінки.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Усі лічильники
      </h2>

      {loading && <LoadingBar />}

      {!loading && counters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {counters.map((counter) => (
            <div key={counter._id} className="border rounded-xl p-4 shadow">
              <div><strong>Ip:</strong> {counter.ip}</div>
              <div><strong>Користувач:</strong> {counter.user.name} ({counter.user.email})</div>
              <div><strong>Обʼєкт:</strong> {counter.object.name}</div>
              <div className="flex gap-2">
                <strong>Тип:</strong>
                <div>{ConsumptionTypeTranslation[counter.object.type]}</div>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Створено: {new Date(counter.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default observer(ServiceCountersPage);
