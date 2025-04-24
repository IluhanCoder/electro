import { useEffect, useState } from "react";
import objectService from "./object-service";
import Object from "./object-types";
import LoadingBar from "../misc/loading-bar";
import { Link } from "react-router-dom";
import { SubmitButtonStyle } from "../styles/button-styles";
import ObjectCard from "./object-card";
import authStore from "../auth/auth-store";

export default function ObjectsPage() {
    const user = authStore.user;

    const [objects, setObjects] = useState<Object[]>();

    const getObjects = async () => {
        setObjects(undefined);
        const result = await objectService.getUserObjects();
        setObjects([...result.objects]);
    }

    useEffect(() => {
        getObjects();
    }, []);

    return (
        <div className="flex h-screen w-full justify-center p-8">
          <div className="flex flex-col w-full gap-8">
            {/* Заголовок */}
            <div className="flex justify-center">
              <div className="text-2xl font-semibold">ваші обʼєкти</div>
            </div>
      
            {/* Контейнер для списку обʼєктів */}
            <div className="flex-grow overflow-hidden flex flex-col">
              {/* Секція зі скролом */}
              <div className="overflow-y-auto flex-grow">
                {objects ? (
                  objects.length === 0 ? (
                    <div className="flex justify-center pb-72">
                      <div className="flex flex-col gap-6">
                        <div className="text-3xl text-teal-400">обʼєкти відсутні</div>
                        {user && user.role !== "admin" && <div className="flex justify-center">
                          <Link to="/create-object" className={SubmitButtonStyle}>
                            створити обʼєкт
                          </Link>
                        </div>}
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full overflow-x-visible">
                      <div className="flex flex-col w-full gap-4 pb-6">
                        <div className="lg:grid lg:grid-cols-2 flex flex-col gap-4 relative">
                          {objects.map((object: Object) => (
                            <div className="">
                              <ObjectCard key={object._id} object={object} callBack={getObjects} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="pb-72">
                    <LoadingBar />
                  </div>
                )}
              </div>
            </div>
      
            {/* Кнопка додавання обʼєкта завжди внизу */}
            {user && user.role !== "admin" && <div className="flex justify-center pt-6">
              <Link to="/create-object" className={SubmitButtonStyle}>
                додати обʼєкт
              </Link>
            </div>}
          </div>
        </div>
      );
      
      
      
}