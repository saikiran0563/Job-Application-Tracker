import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import api from "../services/api";
import AddJobForm from "../components/AddJobForm";
import JobTable from "../components/JobTable";
import "./Dashboard.css";
const ApplicationStatusChart = lazy(() => import("../components/ApplicationStatusChart"));
const MonthlyApplicationsChart = lazy(() => import("../components/MonthlyApplicationsChart"));

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

    const hasLoadedDashboard = useRef(false);

    const fetchDashboardData = useCallback(async (showLoading = false) => {
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
    }, [page, search, status]);

    useEffect(() => {
        const isInitialLoad = !hasLoadedDashboard.current;
        const timer = setTimeout(() => {
            hasLoadedDashboard.current = true;
            fetchDashboardData(isInitialLoad);
        }, isInitialLoad ? 0 : 300);

        return () => clearTimeout(timer);
    }, [fetchDashboardData]);

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
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <h2>Unable to load dashboard</h2>
                <p>{error}</p>

                <button
                    type="button"
                    onClick={() => fetchDashboardData(true)}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard">

            {/* =========================
                DASHBOARD SECTION
            ========================== */}
            <section
                id="dashboard"
                className="dashboard-section dashboard-overview"
            >
                <div className="dashboard-header">
                    <div className="dashboard-header-content">
                        <span className="section-eyebrow">
                            JOB SEARCH WORKSPACE
                        </span>

                        <h1>Job Application Tracker</h1>

                        <p>
                            Track, manage and analyze your job applications
                            from one professional workspace.
                        </p>
                    </div>

                    <a
                        href="#applications"
                        className="dashboard-primary-link"
                    >
                        Manage Applications
                    </a>
                </div>

                {analytics && (
                    <div className="analytics-grid">
                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <span>Total Applications</span>
                                <div className="analytics-icon">A</div>
                            </div>

                            <p className="analytics-value">
                                {analytics.total_applications}
                            </p>

                            <p className="analytics-description">
                                Applications tracked
                            </p>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <span>Applied</span>
                                <div className="analytics-icon">P</div>
                            </div>

                            <p className="analytics-value">
                                {analytics.applied}
                            </p>

                            <p className="analytics-description">
                                Active applications
                            </p>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <span>Interviews</span>
                                <div className="analytics-icon">I</div>
                            </div>

                            <p className="analytics-value">
                                {analytics.interview}
                            </p>

                            <p className="analytics-description">
                                Interview opportunities
                            </p>
                        </div>

                        <div className="analytics-card">
                            <div className="analytics-card-header">
                                <span>Selected</span>
                                <div className="analytics-icon">S</div>
                            </div>

                            <p className="analytics-value">
                                {analytics.selected}
                            </p>

                            <p className="analytics-description">
                                Successful applications
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* =========================
                APPLICATIONS SECTION
            ========================== */}
            <section
                id="applications"
                className="dashboard-section applications-section"
            >
                <div className="section-heading">
                    <span className="section-eyebrow">
                        APPLICATION MANAGEMENT
                    </span>

                    <h2>Manage Applications</h2>

                    <p>
                        Add new opportunities, update application details,
                        search your records and track application progress.
                    </p>
                </div>

                <AddJobForm
                    key={editingJob?.id ?? "new"}
                    onJobAdded={handleJobAdded}
                    editingJob={editingJob}
                    onJobUpdated={handleJobUpdated}
                    onCancelEdit={() => {
                        setEditingJob(null);
                    }}
                />

                <div className="filters-section">
                    <div className="filters-header">
                        <div>
                            <h2>Search & Filter</h2>
                            <p>
                                Find applications by company, job title or
                                status.
                            </p>
                        </div>

                        {pagination.total > 0 && (
                            <span className="application-count">
                                {pagination.total} applications
                            </span>
                        )}
                    </div>

                    <div className="filters-row">
                        <div className="search-wrapper">
                            <span className="search-icon">⌕</span>

                            <input
                                className="search-input"
                                type="text"
                                placeholder="Search company or job title..."
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>

                        <select
                            className="status-filter"
                            value={status}
                            onChange={(event) => {
                                setStatus(event.target.value);
                                setPage(1);
                            }}
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
                        <div className="pagination-container">
                            <button
                                type="button"
                                className="pagination-button"
                                onClick={handlePreviousPage}
                                disabled={!pagination.has_previous}
                            >
                                ← Previous
                            </button>

                            <div className="pagination-info">
                                <span>
                                    Page{" "}
                                    <strong>{pagination.page}</strong>{" "}
                                    of{" "}
                                    <strong>{pagination.pages}</strong>
                                </span>

                                <span>
                                    Showing{" "}
                                    <strong>{jobs.length}</strong> of{" "}
                                    <strong>{pagination.total}</strong>{" "}
                                    applications
                                </span>
                            </div>

                            <button
                                type="button"
                                className="pagination-button"
                                onClick={handleNextPage}
                                disabled={!pagination.has_next}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* =========================
                ANALYTICS SECTION
            ========================== */}
            <section
                id="analytics"
                className="dashboard-section analytics-detail-section"
            >
                <div className="section-heading">
                    <span className="section-eyebrow">
                        PERFORMANCE INSIGHTS
                    </span>

                    <h2>Application Analytics</h2>

                    <p>
                        Understand how your applications are progressing
                        throughout your job search.
                    </p>
                </div>

                {analytics && (
                    <div className="analytics-detail-grid">
                        <div className="analytics-detail-card">
                            <div>
                                <span>Interview Rate</span>
                                <p>
                                    Percentage of applications that reached
                                    the interview stage.
                                </p>
                            </div>

                            <strong>
                                {analytics.interview_rate}%
                            </strong>
                        </div>

                        <div className="analytics-detail-card">
                            <div>
                                <span>Rejection Rate</span>
                                <p>
                                    Percentage of applications that were
                                    rejected.
                                </p>
                            </div>

                            <strong>
                                {analytics.rejection_rate}%
                            </strong>
                        </div>

                        <div className="analytics-detail-card">
                            <div>
                                <span>Selection Rate</span>
                                <p>
                                    Percentage of applications resulting
                                    in selection.
                                </p>
                            </div>

                            <strong>
                                {analytics.selection_rate}%
                            </strong>
                        </div>

                        <div className="analytics-detail-card">
                            <div>
                                <span>Total Applications</span>
                                <p>
                                    Total number of applications currently
                                    tracked.
                                </p>
                            </div>

                            <strong>
                                {analytics.total_applications}
                            </strong>
                        </div>
                    </div>
                )}
                    {analytics && (
                        <Suspense
                            fallback={
                                <div className="analytics-charts-grid" aria-live="polite">
                                    <p>Loading analytics charts...</p>
                                </div>
                            }
                        >
                            <div className="analytics-charts-grid">
                                <ApplicationStatusChart analytics={analytics} />
                                <MonthlyApplicationsChart analytics={analytics} />
                            </div>
                        </Suspense>
                    )}
            </section>

            {/* =========================
                ABOUT SECTION
            ========================== */}
            <section
                id="about"
                className="dashboard-section about-section"
            >
                <div className="section-heading">
                    <span className="section-eyebrow">
                        ABOUT THE PLATFORM
                    </span>

                    <h2>About JobTrack</h2>

                    <p>
                        A focused workspace designed to make job application
                        management easier and more organized.
                    </p>
                </div>

                <div className="about-card">
                    <div className="about-content">
                        <div className="about-logo">
                            J
                        </div>

                        <div>
                            <h3>Your personal job search workspace</h3>

                            <p>
                                JobTrack helps you organize your job
                                applications, monitor application statuses
                                and understand your job-search progress
                                through useful analytics.
                            </p>
                        </div>
                    </div>

                    <div className="about-features">
                        <div className="about-feature">
                            <strong>01</strong>
                            <span>Application Tracking</span>
                        </div>

                        <div className="about-feature">
                            <strong>02</strong>
                            <span>Search & Filtering</span>
                        </div>

                        <div className="about-feature">
                            <strong>03</strong>
                            <span>Application Analytics</span>
                        </div>

                        <div className="about-feature">
                            <strong>04</strong>
                            <span>Application Management</span>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Dashboard;