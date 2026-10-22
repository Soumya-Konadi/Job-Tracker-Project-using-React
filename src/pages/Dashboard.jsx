
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard({
  jobs,
  counts,
  statusData,
  monthlyData,
  openAddForm,
}) {
  const navigate = useNavigate();

  const successRate =
    counts.Total === 0
      ? 0
      : Math.round((counts.Selected / counts.Total) * 100);

  const responseCount =
    counts.Interview + counts.Selected + counts.Rejected;

  const responseRate =
    counts.Total === 0
      ? 0
      : Math.round((responseCount / counts.Total) * 100);

  const stats = [
    {
      label: "Total Applications",
      value: counts.Total,
      icon: "▤",
      caption: "View all applications",
      filter: "All",
    },
    {
      label: "Applied",
      value: counts.Applied,
      icon: "↗",
      caption: "Awaiting a response",
      filter: "Applied",
    },
    {
      label: "Interviews",
      value: counts.Interview,
      icon: "◷",
      caption: "Interview opportunities",
      filter: "Interview",
    },
    {
      label: "Selected",
      value: counts.Selected,
      icon: "✓",
      caption: "Successful applications",
      filter: "Selected",
    },
    {
      label: "Selection Rate",
      value: `${successRate}%`,
      icon: "%",
      caption: "Applications marked Selected",
      filter: "Selected",
    },
    {
      label: "Response Rate",
      value: `${responseRate}%`,
      icon: "↗",
      caption: "View all applications",
      filter: "All",
    },
  ];

  function openFilteredApplications(filter) {
    navigate("/applications", {
      state: { filter },
    });
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">YOUR CAREER WORKSPACE</p>
          <h1>Job Application Tracker</h1>
          <p className="subtitle">
            Keep your job search organized, one application at a time.
          </p>
        </div>

        <button className="primary-btn" onClick={openAddForm}>
          + Add application
        </button>
      </header>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article
            className="stat-card interactive-stat"
            key={stat.label}
            role="button"
            tabIndex={0}
            title={`View ${stat.label}`}
            onClick={() => openFilteredApplications(stat.filter)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openFilteredApplications(stat.filter);
              }
            }}
          >
            <div className="stat-top">
              <span>{stat.label}</span>
              <span className="stat-icon">{stat.icon}</span>
            </div>

            <strong className="stat-number">{stat.value}</strong>

            <span className="stat-caption">{stat.caption}</span>
          </article>
        ))}
      </section>

      <section className="charts-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Application Status</h2>
              <p>Distribution of your job applications.</p>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="chart-empty">
              Add applications to see your chart.
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    onClick={(entry) =>
                      openFilteredApplications(entry.name)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.fill}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    onClick={(entry) =>
                      openFilteredApplications(entry.value)
                    }
                    wrapperStyle={{ cursor: "pointer" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>

        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Application Timeline</h2>
              <p>Number of applications by month.</p>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="chart-empty">
              Add applications to see your timeline.
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e9edf4"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 10,
                      fill: "#8490a3",
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 10,
                      fill: "#8490a3",
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="applications"
                    name="Applications"
                    fill="#5368e8"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>
      </section>
    </>
  );
}
