import { useEffect, useMemo, useState } from "react";
import Data, { ConsumptionCategory, DataResponse, DetailedDataResponse } from "./data-types";
import LoadingBar from "../misc/loading-bar";
import dataService from "./data-service";
import serviceErrorHandler from "../service-error-handler";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { SubmitButtonStyle } from "../styles/button-styles";
import { ConsumptionType } from "../object/object-types";
import { DataCard } from "./data-card";
import DataSearchBar, { SearchParameters } from "./data-search-bar";
import DatePicker from "../misc/date-picker";
import authStore from "../auth/auth-store";

export default function DataPage() {
    const [data, setData] = useState<DataResponse[] | DetailedDataResponse[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const {defaultObjectId} = useParams();

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const [startDate, setStartDate] = useState<Date>(threeMonthsAgo);
    const [endDate, setEndDate] = useState<Date>(new Date());

    const handleStartDateChange = (date: Date | null) => {
        if(!date) return;
        if (date >= endDate) return;
        setStartDate(date);
    }

    const handleEndDateChange = (date: Date | null) => {
        if(!date) return;
        if (date <= startDate) return;
        setEndDate(date);
    }

    const defaultFilter = defaultObjectId ? {category: undefined, objectId: defaultObjectId} : {category: undefined, objectId: undefined};

    const filterState = useState<SearchParameters>(defaultFilter);
    const [filter, setFilter] = filterState;

    const filteredData = useMemo(() => {
        if (!data) return undefined;
    
        return (data as (DataResponse | DetailedDataResponse)[]).filter((entry: DataResponse | DetailedDataResponse) => {
            const categoryMatches = !filter.category || entry.category === filter.category;
            const objectMatches = !filter.objectId || entry.object._id === filter.objectId;
            return categoryMatches && objectMatches;
        });
    }, [data, filter]);
    

    const navigate = useNavigate();

    const getData = async () => {
        if(!authStore.user) return;
        try {
            setLoading(true);
            const result = (authStore.user?.role === "admin") ? await dataService.fetchDataForAdmin() : await dataService.getDataByDateRange(startDate, endDate);
            console.log(result);
            setData([...result.data] as DataResponse[] | DetailedDataResponse[]);
            setLoading(false);
        } catch (error: any) {
            const handled = serviceErrorHandler(error, navigate);
            if(!handled) {
                toast.error(error.response.data.message);
                console.log(error);
            }
        }
    }

    useEffect(() => { getData() }, [authStore.user, startDate, endDate]);

    return <div className="flex h-full w-full justify-center p-8">
        <div className="h-full w-full flex flex-col gap-2">
            <div className="flex justify-center">
                <div className="text-2xl font-semibold">данні про ваше споживання електроенергії</div>
            </div>
            <div className="w-full flex justify-center">
                <DataSearchBar setLoading={setLoading} filterState={filterState}/>
            </div>
            <div className="flex justify-center mt-2">
                <DatePicker className="flex gap-2" startDate={startDate} endDate={endDate} handleStart={handleStartDateChange} handleEnd={handleEndDateChange}/>
            </div>
            <div className="grow pt-10 w-full flex flex-col">
                {filteredData && 
                ( (filteredData!.length === 0) &&
                    <div className="flex justify-center pb-72 ">
                        <div className="flex flex-col gap-6">
                            <div className="text-3xl text-center text-teal-400">данні відсутні</div>
                            <div className="flex gap-2 justify-center">
                                <Link to="/create-data" className={SubmitButtonStyle}>додати данні</Link>
                                <Link to="/generation" className={`rounded px-4 py-2 text-white bg-gray-300 hover:bg-gray-400`}>зчитати з лічильника</Link>
                            </div>
                        </div>
                    </div> ||
                    <div className="flex w-full shadow-md">
                    <div className="flex flex-col w-full max-h-[600px] overflow-y-auto">
                        <div className="lg:grid lg:grid-cols-2 flex flex-col gap-4">
                            {filteredData.map((data: DataResponse | DetailedDataResponse) => 
                                <DataCard key={data._id} data={data} deleteCallback={getData}/>
                            )}
                        </div>
                    </div>
                    </div>
                )
                ||
                    <div className="h-full pb-72">
                        <LoadingBar/>    
                    </div>}
            </div>
            {filteredData && filteredData.length !== 0 && <div className="flex justify-center gap-2 pt-4">
                <Link to="/create-data" className={SubmitButtonStyle}>додати данні</Link>
                <Link to="/generation" className={SubmitButtonStyle + " bg-gray-300 hover:bg-gray-400"}>зчитати з лічильника</Link>
            </div>}
        </div>
    </div>
}