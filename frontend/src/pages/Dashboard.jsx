import { useEffect, useState } from "react";
import api from "../services/api";
import AddJobForm from "../components/AddJobForm";
import JobTable from "../components/JobTable";
import "./Dashboard.css";

function Dashboard() {
    const [editingJob, setEditingJob] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [analytics, setAnalytics] = useState(null);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 0,
        per_page: 10,
        total: 0,
        has_next: false,
        has_previous: false,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardData(true);
    }, []);

    useEffect(() => {
        setPage(1);
    }, [search, status]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDashboardData(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [search, status, page]);

    const fetchDashboardData = async (showLoading = false) => {
        try {
            if (showLoading) {
                setLoading(true);
            }

            setError("");

            const params = {
                page,
                per_page: 10,
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            if (status) {
                params.status = status;
            }

            const [jobsResponse, analyticsResponse] = await Promise.all([
                api.get("/jobs", { params }),
                api.get("/analytics"),
            ]);

            setJobs(jobsResponse.data.jobs || []);

            setPagination(
                jobsResponse.data.pagination || {
                    page: 1,
                    pages: 0,
                    per_page: 10,
                    total: 0,
                    has_next: false,
                    has_previous: false,
                }
            );

            setAnalytics(analyticsResponse.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load dashboard data.");
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    const handleJobAdded = () => {
        setPage(1);
        fetchDashboardData(false);
    };

    const handleJobDeleted = () => {
        fetchDashboardData(false);
    };

    const handleJobUpdated = () => {
        setEditingJob(null);
        fetchDashboardData(false);
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatus("");
        setPage(1);
    };

    const handlePreviousPage = () => {
        if (pagination.has_previous) {
            setPage((previousPage) => previousPage - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination.has_next) {
            setPage((previousPage) => previousPage + 1);
        }
    };

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Job Application Tracker</h1>
                <p>
                    Track and analyze your job applications in one place.
                </p>
            </div>

            <AddJobForm
                onJobAdded={handleJobAdded}
                editingJob={editingJob}
                onJobUpdated={handleJobUpdated}
                onCancelEdit={() => {
                    setEditingJob(null);
                }}
            />

            {analytics && (
                <div className="analytics-grid">
                    <div className="analytics-card">
                        <h3>Total Applications</h3>
                        <p className="analytics-value">
                            {analytics.total_applications}
                        </p>
                    </div>

                    <div className="analytics-card">
                        <h3>Applied</h3>
                        <p className="analytics-value">
                            {analytics.applied}
                        </p>
                    </div>

                    <div className="analytics-card">
                        <h3>Interviews</h3>
                        <p className="analytics-value">
                            {analytics.interview}
                        </p>
                    </div>

                    <div className="analytics-card">
                        <h3>Selected</h3>
                        <p className="analytics-value">
                            {analytics.selected}
                        </p>
                    </div>
                </div>
            )}

            <div className="filters-section">
                <h2>Search & Filter</h2>

                <div className="filters-row">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search company or job title..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    <select
                        className="status-filter"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Selected">Selected</option>
                    </select>

                    <button
                        className="clear-button"
                        type="button"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            <div className="jobs-section">
                <JobTable
                    jobs={jobs}
                    onJobDeleted={handleJobDeleted}
                    onJobEdit={setEditingJob}
                />

                {pagination.pages > 0 && (
                    <div>
                        <button
                            type="button"
                            onClick={handlePreviousPage}
                            disabled={!pagination.has_previous}
                        >
                            Previous
                        </button>

                        <span>
                            {" "}
                            Page {pagination.page} of {pagination.pages}{" "}
                        </span>

                        <button
                            type="button"
                            onClick={handleNextPage}
                            disabled={!pagination.has_next}
                        >
                            Next
                        </button>

                        <p>
                            Showing {jobs.length} of {pagination.total} applications
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
