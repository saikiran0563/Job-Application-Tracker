import { useEffect, useState } from "react";
import api from "../services/api";
import "./AddJobForm.css";

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
        <section className="job-form-card">
            <div className="job-form-header">
                <div>
                    <h2>
                        {editingJob
                            ? "Edit Job Application"
                            : "Add Job Application"}
                    </h2>

                    <p>
                        {editingJob
                            ? "Update the details of this application."
                            : "Keep your job search organized by adding a new application."}
                    </p>
                </div>

                <div className="job-form-icon">
                    {editingJob ? "✎" : "+"}
                </div>
            </div>

            {message && (
                <div className="form-message success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="form-message error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="job-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="company_name">
                            Company Name <span>*</span>
                        </label>

                        <input
                            id="company_name"
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            placeholder="e.g. TCS"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="job_title">
                            Job Title <span>*</span>
                        </label>

                        <input
                            id="job_title"
                            type="text"
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleChange}
                            placeholder="e.g. Python Developer"
                            required
                        />
                    </div>

                    <div className="form-group form-group-full">
                        <label htmlFor="job_url">
                            Job URL
                        </label>

                        <input
                            id="job_url"
                            type="url"
                            name="job_url"
                            value={formData.job_url}
                            onChange={handleChange}
                            placeholder="https://company.com/jobs/..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">
                            Location
                        </label>

                        <input
                            id="location"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Hyderabad"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="job_type">
                            Job Type
                        </label>

                        <select
                            id="job_type"
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

                    <div className="form-group">
                        <label htmlFor="status">
                            Application Status
                        </label>

                        <select
                            id="status"
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

                    <div className="form-group">
                        <label htmlFor="application_date">
                            Application Date <span>*</span>
                        </label>

                        <input
                            id="application_date"
                            type="date"
                            name="application_date"
                            value={formData.application_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="source">
                            Source
                        </label>

                        <input
                            id="source"
                            type="text"
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                            placeholder="LinkedIn, Naukri, Indeed..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="salary">
                            Expected Salary
                        </label>

                        <input
                            id="salary"
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="e.g. 5 LPA"
                        />
                    </div>

                    <div className="form-group form-group-full">
                        <label htmlFor="notes">
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add interview details, recruiter notes, follow-up reminders..."
                            rows="4"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    {editingJob && (
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        className="submit-button"
                    >
                        {editingJob
                            ? "Update Application"
                            : "Add Application"}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default AddJobForm;