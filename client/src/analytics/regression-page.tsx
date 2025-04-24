import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ObjectSelector from "../object/object-selector";
import AnalyticsService from "../analytics/analytics-service";
import authStore from "../auth/auth-store";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SubmitButtonStyle } from "../styles/button-styles";
import generatePDF from "../misc/generate-pdf";

interface RegressionResponse {
  prediction: number;
  slope: number;
  intercept: number;
}

export default observer(function RegressionPage() {
  const [objectId, setObjectId] = useState<string | undefined>();
  const [regression, setRegression] = useState<RegressionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const getRegression = async () => {
    if (!authStore.user || !objectId) return;
    try {
      setLoading(true);
      const result = await AnalyticsService.getRegression(authStore.user._id, objectId);
      setRegression(result);
    } catch (error) {
      console.error("Помилка при завантаженні регресії:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRegression();
  }, [objectId]);

  const chartData = regression ? Array.from({ length: 30 }, (_, i) => ({
    x: i,
    y: regression.slope * i + regression.intercept,
  })) : [];

  return (
    <div id="graph-section" className="p-8">
      <h1 className="text-2xl font-bold mb-4">Прогноз споживання</h1>
      <div className="mb-6">
        <ObjectSelector value={objectId} onChange={setObjectId} className="p-2 border rounded" setInitialValue={setObjectId} />
      </div>
      {loading && <div>Завантаження...</div>}
      {!loading && regression && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" label={{ value: "День", position: "insideBottomRight", offset: 0 }} />
            <YAxis label={{ value: "Прогноз (кВт/год)", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#f59e0b" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
      {regression && (<div className="flex justify-center mt-4">
                        <button type="button" className={SubmitButtonStyle} onClick={generatePDF}>генерувати PDF звіт</button>
                    </div>)}
            
          
    </div>
  );
})