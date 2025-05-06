import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { groupBy } from "lodash";
import { format } from "date-fns";
import { useState } from "react";

interface ProductiveModel {
  updatedAt: string;
  name: string;
  productivity?: number;
}

interface Props {
  productivity: {
    lastSeven: ProductiveModel[];
    lastThirty: ProductiveModel[];
    lastSixtyFive: ProductiveModel[];
  };
}

const ProductivityTrends = ({ productivity }: Props) => {
  const [range, setRange] = useState<
    "lastSeven" | "lastThirty" | "lastSixtyFive"
  >("lastSeven");

  const getLabel = (key: string) => {
    if (key === "lastSeven") return "Last 7 Days";
    if (key === "lastThirty") return "Last 30 Days";
    return "Last Year";
  };

  const formattedData = useMemo(() => {
    const currentData = productivity[range] || [];

    const dateFormat =
      range === "lastSeven"
        ? "yyyy-MM-dd"
        : range === "lastThirty"
        ? "MMM dd"
        : "MMM yyyy";

    const grouped = groupBy(currentData, (entry) =>
      format(new Date(entry.updatedAt), dateFormat)
    );

    return Object.entries(grouped)
      .map(([date, entries]) => ({
        formattedDate: date,
        productivity: entries.length,
      }))
      .sort(
        (a, b) =>
          new Date(a.formattedDate).getTime() -
          new Date(b.formattedDate).getTime()
      );
  }, [range, productivity]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-zinc-800 mb-6">
      <div className="flex justify-between items-center mb-4 flex flex-wrap gap-2">
        <h2 className="text-lg font-semibold">Productivity Trends</h2>
        <div className="flex space-x-2 text-xs sm:text-sm">
          {(["lastSeven", "lastThirty", "lastSixtyFive"] as const).map(
            (key) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                className={`px-8 py-2 text-sm font-medium transition ${
                  range === key
                    ? "bg-blue-500 text-white border-blue-500 rounded-full"
                    : "bg-white dark:bg-zinc-800 dark:text-white text-gray-800 border-gray-300 hover:rounded-full hover:bg-gray-100 dark:hover:bg-zinc-600 "
                }`}
              >
                {getLabel(key)}
              </button>
            )
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="formattedDate" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="productivity"
            stroke="#60A5FA"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductivityTrends;
