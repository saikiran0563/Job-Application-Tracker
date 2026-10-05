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

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardData(true);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDashboardData(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [search, status]);

    const fetchDashboardData = async (showLoading = false) => {
        try {
            if (showLoading) {
                setLoading(true);
            }

            setError("");

            const params = {};

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
        </div>
    );
}

export default Dashboard;
