import { useEffect, useState } from "react";
import authStore from "../auth/auth-store";
import ObjectSelector from "../object/object-selector";
import analyticsService, { HistoricalComparisonResponse } from "./analytics-service";
import { inputStyle } from "../styles/form-styles";

export default function TipsPage() {
    const [objectId, setObjectId] = useState<string>();
    const [tips, setTips] = useState<string[]>([]);

    const fetchTips = async () => {
        if (!objectId || !authStore.user) return;
        const result = await analyticsService.getOptimizationTips(authStore.user._id, objectId);
        setTips(result.tips);
    };

    const [comparison, setComparison] = useState<HistoricalComparisonResponse>();

const fetchComparison = async () => {
    if (!objectId|| !authStore.user) return;
    const result = await analyticsService.getHistoricalComparison(authStore.user._id, objectId);
    setComparison(result);
};

    
useEffect(() => {
    if (objectId) {
        fetchTips();
        fetchComparison();
    }
}, [objectId]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Поради щодо оптимізації</h1>
            <ObjectSelector className={inputStyle} value={objectId} onChange={setObjectId} setInitialValue={setObjectId} />
            <div className="mt-4 space-y-3">
                {tips.map((tip, index) => (
                    <div key={index} className="bg-blue-100 border border-blue-300 rounded-xl p-3 text-blue-800 shadow">
                        {tip}
                    </div>
                ))}
            </div>
            {comparison && (
    <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-xl p-4 text-yellow-900 shadow">
        Поточне середнє споживання ({comparison.recentAverage.toFixed(2)}) є <b>{comparison.status}</b> за середнє за попередній період ({comparison.historicalAverage.toFixed(2)}).
    </div>
)}
        </div>
    );
}
