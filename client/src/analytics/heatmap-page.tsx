import { useEffect, useState } from "react";
import analyticsService from "./analytics-service";
import ObjectSelector from "../object/object-selector";
import { HeatmapPoint } from "./analytics-service"; 
import { HeatmapCredentials } from "./analytics-types";
import { toast } from "react-toastify";
import { format } from "date-fns";  // імпортуємо для форматування дат
import { SubmitButtonStyle } from "../styles/button-styles";
import generatePDF from "../misc/generate-pdf";

const weekdays = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

export default function HeatmapPage() {
    const [objectId, setObjectId] = useState<string | undefined>(undefined);
    const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
    const [loading, setLoading] = useState(false);

    // Додамо startDate та endDate
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 7);  // Наприклад, беремо останні 7 днів

    const fetchData = async () => {
        if (!objectId) return;
        setLoading(true);
        try {
            const credentials: HeatmapCredentials = {
                objectId,
                startDate,
                endDate
            };
            const res = await analyticsService.getHeatMap(credentials);
            setHeatmapData(res.data);
        } catch (error) {
            toast.error("Помилка при завантаженні даних");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [objectId]);

    // Створимо 2D матрицю [weekday][hour] → amount
    const matrix: number[][] = Array(7).fill(null).map(() => Array(24).fill(0));
    heatmapData.forEach(point => {
        matrix[point.weekday][point.hour] = point.totalAmount;
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Теплова карта пікових навантажень</h1>

            <ObjectSelector
                value={objectId}
                onChange={setObjectId}
                setInitialValue={setObjectId}
                className="mb-4 p-2 border rounded"
            />

            {loading ? (
                <p>Завантаження...</p>
            ) : (
                <div id="graph-section" className="overflow-auto">
                    <table className="border-collapse w-full">
                        <thead>
                            <tr>
                                <th className="border p-2 bg-gray-100">День / Година</th>
                                {hours.map(h => <th key={h} className="border p-2 bg-gray-100">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row, weekdayIdx) => (
                                <tr key={weekdayIdx}>
                                    <td className="border p-2 bg-gray-50 font-semibold">{weekdays[weekdayIdx]}</td>
                                    {row.map((val, hourIdx) => {
                                        const intensity = Math.min(255, Math.floor((val / 100) * 255));
                                        const bgColor = `rgba(0, 128, 255, ${intensity / 255})`;
                                        return (
                                            <td
                                                key={hourIdx}
                                                className="border text-center text-white"
                                                style={{ backgroundColor: bgColor }}
                                            >
                                                {val > 0 ? val.toFixed(0) : ""}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {heatmapData && (<div className="flex justify-center mt-4">
                              <button type="button" className={SubmitButtonStyle} onClick={generatePDF}>генерувати PDF звіт</button>
                          </div>)}
                  
                  </div>

    );
}
