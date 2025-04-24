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
import { AnalyticsResponse } from "./analytics-types";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { uk } from "date-fns/locale/uk";
registerLocale("ua", uk);


interface LocalParams {
  name: string;
  data: AnalyticsResponse[];
  width?: number;
  height?: number;
}

const AnalyticsGraph = ({ data, name, width = 1000, height = 300 }: LocalParams) => {
  const formatLabel = (entry: AnalyticsResponse) => {
    if (entry.hour !== undefined) {
      return `${entry.day}/${entry.month} ${entry.hour}:${String(entry.minute ?? 0).padStart(2, "0")}`;
    }
    return `${entry.day}/${entry.month}`;
  };

  const chartData = data.map(entry => ({
    name: formatLabel(entry),
    amount: entry.amount
  }));

  return (
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
        <Line
          type="monotone"
          dataKey="amount"
          name={name}
          stroke="#8884d8"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsGraph;
