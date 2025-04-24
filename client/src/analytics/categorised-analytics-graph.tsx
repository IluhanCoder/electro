import {
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
    ResponsiveContainer
  } from "recharts";
  import { CategorisedAnalyticsResponse } from "./analytics-types";
  import { ConsumptionCategoryTranslation } from "../data/data-types";
import { SubmitButtonStyle } from "../styles/button-styles";
import generatePDF from "../misc/generate-pdf";
  
  interface GraphProps {
    data: CategorisedAnalyticsResponse[];
    width?: number;
    height?: number;
  }
  
  const COLORS: Record<string, string> = {
    heating: "#FF6B6B",
    lighting: "#FFD93D",
    household: "#6BCB77",
    media: "#4D96FF"
  };
  
  const CategorisedAnalyticsGraph = ({ data, width = 1000, height = 300 }: GraphProps) => {
    const formatLabel = (entry: CategorisedAnalyticsResponse) => {
      if (entry.hour !== undefined) {
        return `${entry.day}/${entry.month} ${entry.hour}:${String(entry.minute ?? 0).padStart(2, "0")}`;
      }
      return `${entry.day}/${entry.month}`;
    };
  
    const chartData = data.map(entry => ({
      name: formatLabel(entry),
      ...entry
    }));
  
    return (
        <div id="graph-section">
      <ResponsiveContainer width={width} height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(COLORS).map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={(ConsumptionCategoryTranslation as any)[key] ?? key}
              stroke={COLORS[key]}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {data && (<div className="flex justify-center mt-4">
                  <button type="button" className={SubmitButtonStyle} onClick={generatePDF}>генерувати PDF звіт</button>
              </div>)}
      
      </div>
      
    );
  };
  
  export default CategorisedAnalyticsGraph;
  