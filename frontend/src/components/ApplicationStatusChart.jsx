import "./ApplicationStatusChart.css";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const STATUS_COLORS = {
  Applied: "#3B82F6",
  Interview: "#8B5CF6",
  Rejected: "#EF4444",
  Selected: "#10B981",
};

function ApplicationStatusChart({ analytics }) {
  const data = [
    { name: "Applied", value: Number(analytics?.applied ?? 0) },
    { name: "Interview", value: Number(analytics?.interview ?? 0) },
    { name: "Rejected", value: Number(analytics?.rejected ?? 0) },
    { name: "Selected", value: Number(analytics?.selected ?? 0) },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="status-chart-card">
      <div className="status-chart-heading">
        <div>
          <h3>Application Status</h3>
          <p>Distribution of your tracked applications</p>
        </div>
        <span className="status-chart-total">{total} total</span>
      </div>

      {total === 0 ? (
        <div className="status-chart-empty">
          No applications to visualize yet.
        </div>
      ) : (
        <div className="status-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.filter((item) => item.value > 0)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
              >
                {data
                  .filter((item) => item.value > 0)
                  .map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name]}
                    />
                  ))}
              </Pie>

              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ApplicationStatusChart;
