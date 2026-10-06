
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import "./MonthlyApplicationsChart.css";

function MonthlyApplicationsChart({ analytics }) {
  const monthlyData = (analytics?.monthly_applications ?? []).map(
    (item) => {
      const [year, month] = item.month.split("-");

      const monthLabel = new Date(
        Number(year),
        Number(month) - 1,
        1
      ).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      return {
        month: monthLabel,
        applications: Number(item.count),
      };
    }
  );

  return (
    <section className="monthly-chart-card">
      <div className="monthly-chart-heading">
        <div>
          <h3>Monthly Application Trend</h3>
          <p>Track how many applications you submit each month</p>
        </div>
      </div>

      {monthlyData.length === 0 ? (
        <div className="monthly-chart-empty">
          No monthly application data available yet.
        </div>
      ) : (
        <div className="monthly-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 12, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                width={35}
              />
              <Tooltip />
              <Bar
                dataKey="applications"
                name="Applications"
                fill="#4F46E5"
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default MonthlyApplicationsChart;
