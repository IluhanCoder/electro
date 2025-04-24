import { Link, useNavigate } from "react-router-dom";
import DateFormater from "../misc/date-formatter";
import { FormContainerStyle, inputStyle } from "../styles/form-styles";
import Object, { ConsumptionTypeTranslation } from "./object-types";
import { SmalleRedButtonStyle, SubmitButtonStyle } from "../styles/button-styles";
import objectService from "./object-service";
import { toast } from "react-toastify";
import serviceErrorHandler from "../service-error-handler";
import { useState } from "react";
import authStore from "../auth/auth-store";
import { observer } from "mobx-react";

interface LocalParams {
  object: Object;
  callBack?: () => void;
}

function ObjectCard({ object, callBack }: LocalParams) {
  const [deleteDialogue, setDeleteDialogue] = useState<boolean>(false);
  const [limitDialogue, setLimitDialogue] = useState<boolean>(false);
  const [limitInputValue, setLimitInputVaue] = useState<number>();

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      toast("триває процес видалення...");
      setTimeout(async () => {
        await objectService.deleteObjectById(object._id);
        if (callBack) callBack();
      }, 2000);
    } catch (error: any) {
      const handled = serviceErrorHandler(error, navigate);
      if (!handled) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    }
  };

  const handleLimitSet = async () => {
    try {
      if(limitInputValue) {
        await objectService.setLimit(object._id, limitInputValue);
        setLimitDialogue(false);
        toast.success("ліміт успішно встановлено");
        if(callBack) callBack();
      }
    } catch (error: any) {
      const handled = serviceErrorHandler(error, navigate);
      if (!handled) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    }
  }

  const user = authStore.user;

  return (
    <div
      className={
        FormContainerStyle +
        " h-fit flex flex-col p-4 bg-white relative"
      }
    >
      <Link to={`/data/${object._id}`}>
        <div className="font-semibold text-xl text-center">{object.name}</div>
        <div className="flex text-gray-700 gap-2">
          <div>тип обʼєкту:</div>
          {ConsumptionTypeTranslation[object.type]}
        </div>
        <div className="flex text-gray-700 gap-2">
          <div>створено:</div>
          <DateFormater dayOfWeek value={object.createdAt} />
        </div>
        {!limitDialogue && object.limit && 
        <div className="flex text-gray-700 gap-2">
          <div>{`встановлений ліміт споживання: ${object.limit} кВт/год`}</div>
          </div>}
      </Link>
      { user?.role !== "admin" && (!limitDialogue && <div>
            <button onClick={() => {setLimitDialogue(true)}} type="button" className="underline">{object.limit ? `змінити` : `встановити`} ліміт споживання</button>
          </div>
          ||
          <div className="flex gap-2 p-2">
            <input placeholder="ліміт споживання в кВт/год" value={limitInputValue} className={inputStyle + " w-1/3"} type="number" onChange={(e) => setLimitInputVaue(+e.target.value)}/>
            <button type="button" onClick={handleLimitSet} className={SubmitButtonStyle}>встановити</button>
          </div>)}
      <div className="flex pt-4 text-gray-700 justify-center">
        {deleteDialogue ? (
          <div className="flex text-red-600 font-bold flex-col gap-2">
            <div>
              ви точно хочете видалити обʼєкт, та всі повʼязані з ним
              данні?
            </div>
            <div className="flex gap-4 justify-center px-10 py-4">
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 rounded hover:bg-red-700 text-white px-4 py-1"
              >
                так
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteDialogue(false);
                }}
                className="bg-gray-300 rounded hover:bg-gray-400 text-white px-4 py-1"
              >
                ні
              </button>
            </div>
          </div>
        ) : (
          <button
            className={SmalleRedButtonStyle}
            type="button"
            onClick={() => {
              setDeleteDialogue(true);
            }}
          >
            видалити
          </button>
        )}
      </div>
    </div>
  );
}

export default observer(ObjectCard);