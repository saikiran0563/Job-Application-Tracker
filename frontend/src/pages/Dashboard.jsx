import { useEffect, useState } from "react";
import api from "../services/api";
import AddJobForm from "../components/AddJobForm";
import JobTable from "../components/JobTable";

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
                page: page,
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
        <div>
            <h1>Job Application Tracker</h1>

            <AddJobForm
                onJobAdded={handleJobAdded}
                editingJob={editingJob}
                onJobUpdated={handleJobUpdated}
                onCancelEdit={() => {
                    setEditingJob(null);
                }}
            />

            <div>
                <h2>Search & Filter</h2>

                <input
                    type="text"
                    placeholder="Search company or job title..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <select
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
                    type="button"
                    onClick={handleClearFilters}
                >
                    Clear Filters
                </button>
            </div>

            {analytics && (
                <div>
                    <h2>Application Overview</h2>

                    <p>
                        Total Applications:{" "}
                        {analytics.total_applications}
                    </p>

                    <p>Applied: {analytics.applied}</p>
                    <p>Interviews: {analytics.interview}</p>
                    <p>Rejected: {analytics.rejected}</p>
                    <p>Selected: {analytics.selected}</p>

                    <p>
                        Interview Rate: {analytics.interview_rate}%
                    </p>

                    <p>
                        Rejection Rate: {analytics.rejection_rate}%
                    </p>

                    <p>
                        Selection Rate: {analytics.selection_rate}%
                    </p>
                </div>
            )}

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
    );
}

export default Dashboard;
