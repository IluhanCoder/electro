import { observer } from "mobx-react";
import authStore from "../auth/auth-store";
import { useEffect, useState } from "react";
import { analyticsCredentials, AnalyticsResponse, CategorisedAnalyticsResponse } from "./analytics-types";
import serviceErrorHandler from "../service-error-handler";
import { toast } from "react-toastify";
import analyticsService from "./analytics-service";
import CategorisedAnalyticsGraph from "./categorised-analytics-graph";
import ObjectSelector from "../object/object-selector";
import dataService from "../data/data-service";
import { inputStyle } from "../styles/form-styles";
import LoadingBar from "../misc/loading-bar";
import AnalyticsGraph from "./graph";
import { useNavigate } from "react-router-dom";

function RealTimeGraph() {
    const user = authStore.user;
    const now = new Date();

    const [loading, setLoading] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date>(new Date(now.getTime() - 2 * 60 * 1000));
    const [endDate, setEndDate] = useState<Date>(now);
    const [data, setData] = useState<CategorisedAnalyticsResponse[]>();
    const [selectedObjectId, setSelectedObjectId] = useState<string>();

    const [averagedData, setAveragedData] = useState<AnalyticsResponse[]>();
    const [totalData, setTotalData] = useState<AnalyticsResponse[]>();

    const getData = async (start: Date, end: Date) => {
        if (!user || !selectedObjectId) return;
        try {
            const credentials: analyticsCredentials = {
                startDate: start,
                endDate: end,
                daily: false,
                userId: user._id,
                objectId: selectedObjectId
            };

            const result = await analyticsService.calculateAmountCategorised(credentials);
            setData([...result.analytics]);

            // === Обчислюємо середнє значення всіх категорій ===
            const averaged: AnalyticsResponse[] = result.analytics.map(entry => {
                const categories = [entry.heating, entry.lighting, entry.household, entry.media];
                const sum = categories.reduce((acc, val) => acc + val, 0);
                const avg = sum / categories.length;

                return {
                    second: entry.second,
                    minute: entry.minute,
                    hour: entry.hour,
                    day: entry.day,
                    month: entry.month,
                    amount: avg,
                };
            });

            setAveragedData(averaged);

            // Обчислюємо сумарне значення всіх категорій
            const total: AnalyticsResponse[] = result.analytics.map(entry => {
                const categories = [entry.heating, entry.lighting, entry.household, entry.media];
                const sum = categories.reduce((acc, val) => acc + val, 0);

                return {
                    second: entry.second,
                    minute: entry.minute,
                    hour: entry.hour,
                    day: entry.day,
                    month: entry.month,
                    amount: sum,
                };
            });

            setTotalData(total);

        } catch (error) {
            const handled = serviceErrorHandler(error);
            if (!handled) {
                toast.error("щось пішло не так...");
                console.error(error);
            }
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        if(!user) return;
        if(user?.role === "admin") {
            navigate("/data");
            return;
        }

        let interval: NodeJS.Timeout;
    
        const fetchInitialData = async () => {
            if (!user || !selectedObjectId) return;
    
            try {
                setLoading(true);
                await dataService.generateInstantDataForUser(selectedObjectId);
                await getData(startDate, endDate);
            } catch (error) {
                const handled = serviceErrorHandler(error);
                if (!handled) {
                    toast.error("щось пішло не так...");
                    console.error(error);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchInitialData(); // Запускаємо одразу при маунті
    
        interval = setInterval(async () => {
            try {
                setLoading(true);
    
                const newStart = new Date(startDate.getTime() + 20000);
                const newEnd = new Date(endDate.getTime() + 20000);
    
                setStartDate(newStart);
                setEndDate(newEnd);
    
                if (user && selectedObjectId) {
                    await dataService.generateInstantDataForUser(selectedObjectId);
                    await getData(newStart, newEnd);
                }
    
            } catch (error) {
                const handled = serviceErrorHandler(error);
                if (!handled) {
                    toast.error("щось пішло не так...");
                    console.error(error);
                }
            } finally {
                setLoading(false);
            }
        }, 20000);
    
        return () => clearInterval(interval);
    }, [startDate, endDate, selectedObjectId]);
    

    const onObjectChange = (newId: string) => {
        setSelectedObjectId(newId);
        getData(startDate, endDate);
    };

    return (
        <div>
            <div className="flex justify-center gap-20 p-4 bg-stone-100">
                <div className="flex flex-col gap-2">
                    <div className="flex h-full gap-2">
                        <div className="text-md mt-2">обʼєкт:</div>
                        <ObjectSelector
                            className={inputStyle}
                            value={selectedObjectId}
                            onChange={onObjectChange}
                            setInitialValue={setSelectedObjectId}
                        />
                    </div>
                </div>
                {loading && (
                    <div className="max-w-64 text-wrap text-gray-700 mt-1">
                        триває оновлення даних, може зайняти певний час...
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-10 p-8">
                <div className="flex text-2xl justify-center">споживання кВт</div>
                <div className="flex justify-center">
                    {data ? <CategorisedAnalyticsGraph data={data} /> : <LoadingBar />}
                </div>
            </div>
            {averagedData && (
                <div className="flex flex-col gap-6">
                    <div className="text-center text-xl text-gray-700">Середнє споживання між категоріями</div>
                    <div className="flex justify-center">
                        <AnalyticsGraph
                            data={averagedData}
                            name="Середнє споживання"
                            width={1000}
                            height={300}
                        />
                    </div>
                </div>
            )}
            {totalData && (
                <div className="flex flex-col gap-6 mt-10">
                    <div className="text-center text-xl text-gray-700">Сумарне споживання між категоріями</div>
                    <div className="flex justify-center">
                        <AnalyticsGraph
                            data={totalData}
                            name="Сумарне споживання"
                            width={1000}
                            height={300}
                        />
                    </div>
                </div>
            )}


        </div>
    );
}

export default observer(RealTimeGraph);
