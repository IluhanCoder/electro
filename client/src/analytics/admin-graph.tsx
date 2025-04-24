import { observer } from "mobx-react";
import authStore from "../auth/auth-store";
import { useEffect, useState } from "react";
import DatePicker from "../misc/date-picker";
import { analyticsCredentials, AnalyticsResponse } from "./analytics-types";
import serviceErrorHandler from "../service-error-handler";
import { toast } from "react-toastify";
import analyticsService from "./analytics-service";
import ConsObject from "../object/object-types";
import objectService from "../object/object-service";
import { inputStyle } from "../styles/form-styles";
import AnalyticsGraph from "./graph";
import { convertArray } from "./convert-array";
import ObjectSelector from "../object/object-selector";
import { formatISO, parseISO } from "date-fns";
import { SubmitButtonStyle } from "../styles/button-styles";
import LoadingBar from "../misc/loading-bar";

function AdminGraph() {
    const user = authStore.user;
    const [daily, setDaily] = useState<boolean>(false);
    const now = new Date();

    const [loading, setLoading] = useState<boolean>(false);

    const defaultStart = new Date(now.getTime() - 8 * 60 * 1000);
    const defaultEnd = now;

    const [startDate, setStartDate] = useState<Date>(defaultStart);
    const [endDate, setEndDate] = useState<Date>(defaultEnd);

    const [data, setData] = useState<AnalyticsResponse[]>();
    const [selectedObjectId, setSelectedObjectId] = useState<string>();

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = parseISO(e.target.value);
        if (newDate >= endDate) return;
        if ((endDate.getTime() - newDate.getTime()) > 24 * 60 * 60 * 1000) return;
        setStartDate(newDate);
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = parseISO(e.target.value);
        if (newDate <= startDate) return;
        if ((newDate.getTime() - startDate.getTime()) > 24 * 60 * 60 * 1000) return;
        setEndDate(newDate);
    };

    const getData = async () => {
        try {
            const credentials = {
                startDate,
                endDate,
                daily,
                userId: user?._id,
                objectId: selectedObjectId
            } as analyticsCredentials;

            setLoading(true);
            const result = await analyticsService.calculateAmount(credentials);
            setData([...result.analytics]);
        } catch (error) {
            const handled = serviceErrorHandler(error);
            if (!handled) {
                toast.error("щось пішло не так...");
                console.log(error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && selectedObjectId) getData();
    }, [user]);

    useEffect(() => {
        if (!daily) {
            const now = new Date();
            const anHourAgo = new Date(now.getTime() - 8 * 60 * 1000);
            setStartDate(anHourAgo);
            setEndDate(now);
        }
        if (daily) {
            const now = new Date();
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            setStartDate(weekAgo);
            setEndDate(now);
        }
    }, [daily]);
    

    return <div>
        <div className="flex justify-center gap-20 p-4 bg-stone-100">
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                    <input type="checkbox" checked={daily} onChange={() => setDaily(!daily)} />
                    <div>щоденна статистика</div>
                </div>

                <div className="flex h-full gap-2">
                    <div className="text-md mt-2">обʼєкт:</div>
                    <ObjectSelector
                        className={inputStyle}
                        value={selectedObjectId}
                        onChange={(newId) => {
                            setSelectedObjectId(newId);
                            getData();
                        }}
                        setInitialValue={setSelectedObjectId}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div>діапазон {daily ? "дат" : "часу (до 24 годин)"}</div>
                {daily ? (
                    <DatePicker
                        className="flex gap-4"
                        startDate={startDate}
                        endDate={endDate}
                        handleStart={(date) => {
                            if (!date || date >= endDate) return;
                            setStartDate(date);
                        }}
                        handleEnd={(date) => {
                            if (!date || date <= startDate) return;
                            setEndDate(date);
                        }}
                    />
                ) : (
                    <div className="flex gap-2 flex-col md:flex-row">
                        <div className="flex gap-2 items-center">
                            <label className="mt-1">Від:</label>
                            <input
                                type="datetime-local"
                                className={inputStyle}
                                value={formatISO(startDate).slice(0, 16)}
                                onChange={handleStartTimeChange}
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            <label className="mt-1">До:</label>
                            <input
                                type="datetime-local"
                                className={inputStyle}
                                value={formatISO(endDate).slice(0, 16)}
                                onChange={handleEndTimeChange}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-center">
                <button className={SubmitButtonStyle} onClick={getData}>оновити</button>
            </div>

            {loading && <div className="max-w-64 text-wrap text-gray-700 mt-1">триває оновлення даних, може зайняти певний час...</div>}

        </div>

        <div className="flex flex-col gap-10 p-8">
            <div className="flex text-2xl justify-center">споживання кВт</div>
            <div className="flex justify-center">
                {data && <AnalyticsGraph name="КВт" data={data} /> || <LoadingBar/>}
            </div>
        </div>
    </div>
}


export default observer(AdminGraph);