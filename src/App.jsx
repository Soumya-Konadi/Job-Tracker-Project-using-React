
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";

const STATUSES = ["Applied", "Interview", "Selected", "Rejected"];

const EMPTY_FORM = {
  company: "",
  role: "",
  location: "",
  date: new Date().toISOString().slice(0, 10),
  status: "Applied",
  link: "",
  notes: "",
};

const INITIAL_JOBS = [
  {
    id: 1,
    company: "Google",
    role: "Frontend Developer Intern",
    location: "Bengaluru",
    date: "2026-10-15",
    status: "Applied",
    link: "",
    notes: "Applied through the careers page.",
  },
  {
    id: 2,
    company: "Infosys",
    role: "React Developer",
    location: "Mysuru",
    date: "2026-10-18",
    status: "Interview",
    link: "",
    notes: "Prepare JavaScript and React questions.",
  },
];

function readJobs() {
  try {
    const saved = localStorage.getItem("job-tracker-applications");
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  } catch {
    return INITIAL_JOBS;
  }
}

function AppContent() {
  const [jobs, setJobs] = useState(readJobs);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "job-tracker-applications",
      JSON.stringify(jobs)
    );
  }, [jobs]);

  const counts = {
    Total: jobs.length,
    Applied: jobs.filter((job) => job.status === "Applied").length,
    Interview: jobs.filter((job) => job.status === "Interview").length,
    Selected: jobs.filter((job) => job.status === "Selected").length,
    Rejected: jobs.filter((job) => job.status === "Rejected").length,
  };

  const chartColors = {
    Applied: "#5368e8",
    Interview: "#f0b429",
    Selected: "#21a675",
    Rejected: "#e45b68",
  };

  const statusData = STATUSES.map((status) => ({
    name: status,
    value: counts[status],
    fill: chartColors[status],
  }));

  const monthlyData = Object.values(
    jobs.reduce((result, job) => {
      const month = job.date ? job.date.slice(0, 7) : "Unknown";

      if (!result[month]) {
        result[month] = { month, applications: 0 };
      }

      result[month].applications += 1;
      return result;
    }, {})
  ).sort((a, b) => a.month.localeCompare(b.month));

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function openAddForm() {
    setForm({
      ...EMPTY_FORM,
      date: new Date().toISOString().slice(0, 10),
    });
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(job) {
    setForm({
      company: job.company,
      role: job.role,
      location: job.location || "",
      date: job.date || "",
      status: job.status,
      link: job.link || "",
      notes: job.notes || "",
    });

    setEditingId(job.id);
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.company.trim() || !form.role.trim()) return;

    if (editingId !== null) {
      setJobs((previous) =>
        previous.map((job) =>
          job.id === editingId ? { ...form, id: editingId } : job
        )
      );
    } else {
      setJobs((previous) => [
        { ...form, id: Date.now() },
        ...previous,
      ]);
    }

    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function deleteJob(id) {
    if (window.confirm("Delete this job application?")) {
      setJobs((previous) =>
        previous.filter((job) => job.id !== id)
      );
    }
  }

  function changeStatus(id, status) {
    setJobs((previous) =>
      previous.map((job) =>
        job.id === id ? { ...job, status } : job
      )
    );
  }

  function exportApplications() {
    const headers = [
      "Company",
      "Role",
      "Location",
      "Application Date",
      "Status",
      "Job Link",
      "Notes",
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = jobs.map((job) => [
      job.company,
      job.role,
      job.location,
      job.date,
      job.status,
      job.link,
      job.notes,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "job-applications.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const pageProps = {
    jobs,
    counts,
    statusData,
    monthlyData,
    openAddForm,
    openEditForm,
    deleteJob,
    changeStatus,
    search,
    setSearch,
    filter,
    setFilter,
    sort,
    setSort,
    exportApplications,
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">J</span>
          <span>JobTrack</span>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          ▦ &nbsp; Dashboard
        </NavLink>

        <NavLink
          to="/applications"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          ▤ &nbsp; Applications
        </NavLink>

        <div className="sidebar-bottom">
          <div className="profile-avatar">JD</div>
          <div>
            <strong>Job Seeker</strong>
            <p>Career workspace</p>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<Dashboard {...pageProps} />}
          />

          <Route
            path="/applications"
            element={<Applications {...pageProps} />}
          />

          <Route
            path="*"
            element={
              <section className="panel" style={{ padding: 25 }}>
                <h2>Page not found</h2>
                <NavLink to="/">Return to Dashboard</NavLink>
              </section>
            }
          />
        </Routes>

        <footer className="page-footer">
          JobTrack <span>·</span> Built with React
          <span className="storage-note">
            Data saved in this browser
          </span>
        </footer>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
          >
            <div className="modal-heading">
              <div>
                <h2 id="form-title">
                  {editingId !== null
                    ? "Edit application"
                    : "Add application"}
                </h2>
                <p>Enter the details of your job opportunity.</p>
              </div>

              <button
                type="button"
                className="icon-btn close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Company name *
                  <input
                    name="company"
                    value={form.company}
                    onChange={updateField}
                    placeholder="e.g. Infosys"
                    required
                  />
                </label>

                <label>
                  Job role *
                  <input
                    name="role"
                    value={form.role}
                    onChange={updateField}
                    placeholder="e.g. React Developer"
                    required
                  />
                </label>

                <label>
                  Location
                  <input
                    name="location"
                    value={form.location}
                    onChange={updateField}
                    placeholder="e.g. Bengaluru"
                  />
                </label>

                <label>
                  Application date
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={updateField}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Job link
                  <input
                    type="url"
                    name="link"
                    value={form.link}
                    onChange={updateField}
                    placeholder="https://..."
                  />
                </label>

                <label className="full-width">
                  Notes
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={updateField}
                    placeholder="Interview details, follow-up reminders..."
                    rows="3"
                  />
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {editingId !== null
                    ? "Save changes"
                    : "Add application"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
