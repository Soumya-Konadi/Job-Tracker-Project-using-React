
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Applications({
  jobs,
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
}) {
  const location = useLocation();

  // Apply a status filter when navigating from the dashboard
  useEffect(() => {
    if (location.state?.filter) {
      setFilter(location.state.filter);
    }
  }, [location.key, location.state, setFilter]);

  // Search, filter, and sort applications
  const filteredJobs = jobs
    .filter((job) => {
      const term = search.toLowerCase();

      const matchesSearch =
        job.company.toLowerCase().includes(term) ||
        job.role.toLowerCase().includes(term) ||
        (job.location || "").toLowerCase().includes(term);

      const matchesStatus =
        filter === "All" || job.status === filter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) =>
      sort === "newest"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    );

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">YOUR CAREER WORKSPACE</p>
          <h1>Applications</h1>
          <p className="subtitle">
            Manage and track every job opportunity.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="secondary-btn"
            onClick={exportApplications}
            disabled={jobs.length === 0}
          >
            ↓ Export CSV
          </button>

          <button className="primary-btn" onClick={openAddForm}>
            + Add application
          </button>
        </div>
      </header>

      <section className="panel applications-panel">
        <div className="panel-heading">
          <div>
            <h2>All applications</h2>
            <p>{filteredJobs.length} applications found</p>
          </div>
        </div>

        <div className="table-toolbar">
          <input
            type="search"
            placeholder="Search company, role, or location..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search applications"
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort by date"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div className="table-scroll">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Company &amp; role</th>
                <th>Location</th>
                <th>Applied on</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div className="company-cell">
                      <div className="company-avatar">
                        {job.company.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <strong>{job.company}</strong>
                        <p>{job.role}</p>
                      </div>
                    </div>
                  </td>

                  <td>{job.location || "—"}</td>
                  <td>{job.date || "—"}</td>

                  <td>
                    <select
                      className={`status-select status-${job.status.toLowerCase()}`}
                      value={job.status}
                      onChange={(event) =>
                        changeStatus(job.id, event.target.value)
                      }
                      aria-label={`Change status for ${job.company}`}
                    >
                      {[
                        "Applied",
                        "Interview",
                        "Selected",
                        "Rejected",
                      ].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <div className="actions">
                      <button
                        className="icon-btn"
                        title="Edit"
                        aria-label={`Edit ${job.company}`}
                        onClick={() => openEditForm(job)}
                      >
                        ✎
                      </button>

                      <button
                        className="icon-btn delete-btn"
                        title="Delete"
                        aria-label={`Delete ${job.company}`}
                        onClick={() => deleteJob(job.id)}
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredJobs.length === 0 && (
            <div className="empty-state">
              <h3>No applications found</h3>
              <p>
                Try changing your search or filters, or add a new application.
              </p>

              <button className="primary-btn" onClick={openAddForm}>
                + Add application
              </button>
            </div>
          )}
        </div>

        <div className="table-footer">
          {jobs.length} total applications tracked
        </div>
      </section>
    </>
  );
}
