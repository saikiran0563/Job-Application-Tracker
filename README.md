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
- python-dotenv

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

```powershell
git clone https://github.com/saikiran0563/Job-Application-Tracker.git
cd Job-Application-Tracker
```

### 2. Create the database

Start MySQL and create the application database:

```sql
CREATE DATABASE job_tracker;
```

### 3. Configure and install the backend

Run these commands from the project root in PowerShell:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` and set your actual MySQL credentials. Replace `JWT_SECRET_KEY=change_this_later` with a strong, private secret. Generate one with:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

Copy the generated value into `JWT_SECRET_KEY` in `backend/.env`. Do not commit this file or share the secret. The backend intentionally refuses to start if the JWT secret is missing or still set to the example placeholder.

### 4. Start the backend

Keep the terminal in the `backend` directory with the virtual environment activated:

```powershell
python app.py
```

The API runs at `http://127.0.0.1:5000`. The health endpoint is `http://127.0.0.1:5000/api/health`.

### 5. Start the frontend

Open a second terminal at the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`.

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check API health |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve the authenticated user |
| GET | `/api/jobs` | List the user's applications |
| POST | `/api/jobs` | Create an application |
| GET | `/api/jobs/<id>` | Retrieve an application |
| PUT | `/api/jobs/<id>` | Update an application |
| DELETE | `/api/jobs/<id>` | Delete an application |
| GET | `/api/analytics` | Retrieve dashboard analytics |

Protected endpoints require a valid JWT access token. Job records are scoped to the authenticated user.

## Security Notes

- Never commit `.env` files or real credentials.
- Use a unique, strong JWT secret and keep it private.
- The backend loads `backend/.env` using an explicit file path, regardless of the terminal's current directory.
- Database credentials are assembled with SQLAlchemy's URL helper to support special characters safely.
- Use HTTPS, a production WSGI server, restricted CORS origins, and production-grade configuration when deploying.
- The built-in Flask development server is for local development only.

## Project Status

Authentication, application management, search, status filters, pagination, and analytics charts have been implemented. Frontend production build and Python dependency checks previously passed. Regression testing and deployment preparation remain ongoing.
