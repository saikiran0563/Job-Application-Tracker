import { useEffect, useState } from "react";
import api from "../services/api";

const initialFormData = {
    company_name: "",
    job_title: "",
    job_url: "",
    location: "",
    job_type: "Full Time",
    status: "Applied",
    application_date: "",
    source: "",
    salary: "",
    notes: "",
};

function AddJobForm({
    onJobAdded,
    editingJob,
    onJobUpdated,
    onCancelEdit,
}) {
    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (editingJob) {
            setFormData({
                company_name: editingJob.company_name || "",
                job_title: editingJob.job_title || "",
                job_url: editingJob.job_url || "",
                location: editingJob.location || "",
                job_type: editingJob.job_type || "Full Time",
                status: editingJob.status || "Applied",
                application_date: editingJob.application_date || "",
                source: editingJob.source || "",
                salary: editingJob.salary || "",
                notes: editingJob.notes || "",
            });

            setMessage("");
            setError("");
        } else {
            setFormData(initialFormData);
        }
    }, [editingJob]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setMessage("");
            setError("");

            if (editingJob) {
                await api.put(`/jobs/${editingJob.id}`, formData);

                setMessage("Job application updated successfully.");

                if (onJobUpdated) {
                    onJobUpdated();
                }
            } else {
                const response = await api.post("/jobs", formData);

                setMessage("Job application added successfully.");

                setFormData(initialFormData);

                if (onJobAdded) {
                    onJobAdded(response.data.job);
                }
            }
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.error ||
                "Unable to save job application."
            );
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setMessage("");
        setError("");

        if (onCancelEdit) {
            onCancelEdit();
        }
    };

    return (
        <div>
            <h2>
                {editingJob
                    ? "Edit Job Application"
                    : "Add Job Application"}
            </h2>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Company Name</label>
                    <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Job Title</label>
                    <input
                        type="text"
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Job URL</label>
                    <input
                        type="url"
                        name="job_url"
                        value={formData.job_url}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Job Type</label>
                    <select
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleChange}
                    >
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                    </select>
                </div>

                <div>
                    <label>Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Selected">Selected</option>
                    </select>
                </div>

                <div>
                    <label>Application Date</label>
                    <input
                        type="date"
                        name="application_date"
                        value={formData.application_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Source</label>
                    <input
                        type="text"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        placeholder="LinkedIn, Naukri, Indeed..."
                    />
                </div>

                <div>
                    <label>Salary</label>
                    <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        placeholder="5 LPA"
                    />
                </div>

                <div>
                    <label>Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">
                    {editingJob
                        ? "Update Application"
                        : "Add Application"}
                </button>

                {editingJob && (
                    <button
                        type="button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                )}
            </form>
        </div>
    );
}

export default AddJobForm;