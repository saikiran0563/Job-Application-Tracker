# Job Application Tracker & Analytics

A full-stack web application for tracking job applications, monitoring application statuses, and visualizing job-search progress.

## Features

- User registration and login using JWT authentication
- Create, view, update, and delete job applications
- Search applications by company or job title
- Filter applications by status
- Paginated application lists
- Dashboard metrics for application statuses
- Application status distribution chart
- Monthly application activity chart
- User-specific application access controls

## Technology Stack

**Frontend**
- React
- Vite
- JavaScript
- Axios
- Recharts
- CSS

**Backend**
- Python
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-CORS

**Database**
- MySQL

## Project Structure

```text
Job Application Tracker/
├── backend/
│   ├── app.py
│   ├── auth_routes.py
│   ├── analytics_routes.py
│   ├── job_routes.py
│   ├── models.py
│   ├── config.py
│   ├── extensions.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Prerequisites

- Python
- Node.js and npm
- MySQL Server

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/saikiran0563/Job-Application-Tracker.git
cd Job-Application-Tracker
```

### 2. Configure the backend

Open a terminal in the project root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Create `backend/.env` using `backend/.env.example` as a reference. Set your own MySQL credentials and a strong, private JWT secret. Create the `job_tracker` database in MySQL before starting the application.

### 3. Start the backend

From the `backend` directory, with the virtual environment activated:

```powershell
python app.py
```

### 4. Configure and start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`.

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve the authenticated user |
| GET | `/api/jobs` | List the user's applications |
| POST | `/api/jobs` | Create an application |
| GET | `/api/jobs/<id>` | Retrieve an application |
| PUT | `/api/jobs/<id>` | Update an application |
| DELETE | `/api/jobs/<id>` | Delete an application |
| GET | `/api/analytics` | Retrieve dashboard analytics |

Protected endpoints require a valid JWT access token.

## Security Notes

- Never commit `.env` files or real credentials.
- Use a strong, private JWT secret.
- Application access is restricted to the authenticated user.
- Use HTTPS and production-grade configuration when deploying.

## Project Status

The authentication flow, application management, search, status filters, pagination, and analytics charts have been implemented. Frontend production build and Python dependency checks have passed. Further regression testing and deployment preparation remain ongoing.