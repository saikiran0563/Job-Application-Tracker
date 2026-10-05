import api from "../services/api";

function JobTable({ jobs, onJobDeleted, onJobEdit }) {
    if (!jobs || jobs.length === 0) {
        return <p>No job applications found.</p>;
    }

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

    return (
        <div>
            <h2>Job Applications</h2>

            <table>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Job Title</th>
                        <th>Location</th>
                        <th>Job Type</th>
                        <th>Status</th>
                        <th>Application Date</th>
                        <th>Source</th>
                        <th>Salary</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {jobs.map((job) => (
                        <tr key={job.id}>
                            <td>{job.company_name}</td>
                            <td>{job.job_title}</td>
                            <td>{job.location || "-"}</td>
                            <td>{job.job_type || "-"}</td>
                            <td>{job.status}</td>
                            <td>{job.application_date}</td>
                            <td>{job.source || "-"}</td>
                            <td>{job.salary || "-"}</td>

                            <td>
                                <button
                                    type="button"
                                    onClick={() => onJobEdit(job)}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(job.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default JobTable;