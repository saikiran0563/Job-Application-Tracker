import api from "../services/api";
import "./JobTable.css";

function JobTable({ jobs, onJobDeleted, onJobEdit }) {
    const handleDelete = async (jobId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/jobs/${jobId}`);

            if (onJobDeleted) {
                onJobDeleted();
            }
        } catch (err) {
            console.error(err);
            alert("Unable to delete job application.");
        }
    };

    if (!jobs || jobs.length === 0) {
        return (
            <div className="job-table-empty">
                <h3>No job applications found</h3>
                <p>Try changing your search or filter.</p>
            </div>
        );
    }

    return (
        <div className="job-table-container">
            <div className="job-table-header">
                <div>
                    <h2>Job Applications</h2>
                    <p>Manage and track your applications.</p>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="job-table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Job Title</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Applied On</th>
                            <th>Source</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.id}>
                                <td className="company-cell">
                                    {job.company_name}
                                </td>

                                <td className="job-title-cell">
                                    {job.job_url ? (
                                        <a
                                            href={job.job_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {job.job_title}
                                        </a>
                                    ) : (
                                        job.job_title
                                    )}
                                </td>

                                <td>
                                    {job.location || "-"}
                                </td>

                                <td>
                                    {job.job_type || "-"}
                                </td>

                                <td>
                                    <span
                                        className={`status-badge status-${job.status
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")}`}
                                    >
                                        {job.status}
                                    </span>
                                </td>

                                <td>
                                    {job.application_date}
                                </td>

                                <td>
                                    {job.source || "-"}
                                </td>

                                <td>
                                    {job.salary || "-"}
                                </td>

                                <td>
                                    <div className="action-buttons">
                                        <button
                                            type="button"
                                            className="edit-button"
                                            onClick={() => onJobEdit(job)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() =>
                                                handleDelete(job.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default JobTable;