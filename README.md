# CareerConnect

### A Full-Stack Job and Internship Management Platform

CareerConnect is a full-stack web application designed to streamline recruitment by connecting students and job seekers with recruiters through a centralized digital platform. Built using the **MERN stack (MongoDB, Express.js, React.js, and Node.js)**, the application supports job discovery, resume management, application tracking, and recruitment workflow management.

The platform provides role-specific functionality for students and recruiters, enabling candidates to manage their applications while allowing recruiters to oversee job postings, evaluate applicants, and coordinate interviews through a structured workflow.

---

## Overview

CareerConnect addresses common challenges in the recruitment process by consolidating job listings, applications, and recruitment activities within a single platform.

The application provides two primary user roles:

* **Students:** Discover relevant job opportunities, submit applications, manage resumes, and monitor application progress.
* **Recruiters:** Publish job openings, review applicants, manage application statuses, and schedule interviews.

## Core Features

### 1. Authentication and Access Control

* User registration and login.
* JWT-based authentication.
* Password hashing using bcrypt.
* Role-based authorization for student and recruiter functionality.
* Protected routes and profile management.

### 2. Job Discovery and Management

* Create, update, close, and delete job postings through recruiter functionality.
* Search opportunities using keywords.
* Filter listings by employment type, work mode, location, and required skills.
* Paginated job listings.

### 3. Resume Management

* Resume upload through Multer.
* Support for PDF and Word documents, subject to the configured validation rules.
* Resume reuse when submitting job applications.
* File-size validation with a configured maximum of 2 MB.

### 4. Application Lifecycle Management

* Submit applications with a resume and cover note.
* View submitted applications and their current statuses.
* Withdraw applications where permitted.
* Track recruitment progress through defined application stages.

**Application workflow**

`Applied → Under Review → Shortlisted → Interview Scheduled → Selected / Rejected`

### 5. Recruiter Dashboard

* Manage job postings.
* View applicants for individual positions.
* Review application information.
* Update candidate application statuses.
* Access recruitment pipeline statistics.
* Schedule interviews.

### 6. Notification Management

* In-app notifications for application status changes.
* Notification retrieval and read-status management.
* Centralized visibility into recruitment updates.

---

## Technology Stack

| Component         | Technology            | Purpose                                          |
| ----------------- | --------------------- | ------------------------------------------------ |
| Frontend          | React.js              | User interface development                       |
| Frontend Tooling  | Vite                  | Development server and build tooling             |
| Backend           | Node.js               | Server-side JavaScript runtime                   |
| API Framework     | Express.js            | REST API development                             |
| Database          | MongoDB               | Persistent data storage                          |
| ODM               | Mongoose              | MongoDB data modelling and interaction           |
| Authentication    | JSON Web Tokens (JWT) | Authentication and session-related authorization |
| Password Security | bcrypt                | Password hashing                                 |
| File Handling     | Multer                | Resume upload processing                         |
| API Architecture  | REST                  | Client-server communication                      |
| Version Control   | Git and GitHub        | Source code management                           |

---

## System Architecture

CareerConnect follows a client-server architecture.

```text
                  ┌────────────────────────┐
                  │       End Users        │
                  │   Students / Recruiters│
                  └────────────┬───────────┘
                               │
                               ▼
                  ┌────────────────────────┐
                  │    React.js + Vite     │
                  │     Frontend Client    │
                  └────────────┬───────────┘
                               │
                         REST API Requests
                               │
                               ▼
                  ┌────────────────────────┐
                  │    Node.js + Express   │
                  │     Backend Server     │
                  └────────────┬───────────┘
                               │
                   ┌───────────┴───────────┐
                   │                       │
                   ▼                       ▼
        ┌──────────────────┐    ┌──────────────────┐
        │ Authentication & │    │   Application    │
        │ Business Logic   │    │   File Handling  │
        └─────────┬────────┘    └──────────────────┘
                  │
                  ▼
        ┌────────────────────────┐
        │   MongoDB Database     │
        │ Users, Jobs,           │
        │ Applications, Alerts   │
        └────────────────────────┘
```

The frontend communicates with the backend through REST API endpoints. The backend processes requests, applies authentication and authorization rules, and interacts with MongoDB through Mongoose.

---

## Project Structure

```text
CareerConnect/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── api.js
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

*The directory structure is representative. Actual filenames and folders may vary depending on the implementation.*

---

## Installation and Setup

### Prerequisites

Ensure the following are available in your development environment:

* Node.js 18 or later.
* npm.
* A MongoDB local instance or MongoDB Atlas account.
* Git, if cloning and managing the repository through the command line.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/careerconnect.git
cd careerconnect
```

Replace `YOUR-USERNAME` with the GitHub account that owns the repository.

### 2. Install Dependencies

From the project root directory, execute:

```bash
npm run install:all
```

This command assumes the root `package.json` defines an `install:all` script.

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory and provide the environment variables required by the backend.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
```

Use the exact variable names expected by your implementation. Keep database credentials, JWT secrets, and other sensitive configuration values out of source control.

### 4. Initialize Demo Data (Optional)

If the project includes a database seeding script, run:

```bash
npm run seed
```

Review the script before execution to determine whether it creates, modifies, or deletes records in the configured database. Use a development database for testing.

### 5. Start the Backend

Open a terminal in the project root and run:

```bash
npm run server
```

Expected local backend address:

`http://localhost:5000`

### 6. Start the Frontend

Open a separate terminal and run:

```bash
npm run client
```

Expected local frontend address:

`http://localhost:5173`

The commands and addresses above assume they match the scripts and configuration in your project.

---

## API Reference

The following table summarizes the principal API routes described by the project.

| HTTP Method | Endpoint                          | Access Level  | Description                           |
| ----------- | --------------------------------- | ------------- | ------------------------------------- |
| POST        | `/api/auth/register`              | Public        | Register a user                       |
| POST        | `/api/auth/login`                 | Public        | Authenticate a user                   |
| GET         | `/api/auth/me`                    | Authenticated | Retrieve the current user             |
| PUT         | `/api/auth/profile`               | Authenticated | Update profile information            |
| GET         | `/api/jobs`                       | Public        | Retrieve and filter job listings      |
| POST        | `/api/jobs`                       | Recruiter     | Create a job posting                  |
| PUT         | `/api/jobs/:id`                   | Recruiter     | Update a job posting                  |
| DELETE      | `/api/jobs/:id`                   | Recruiter     | Delete a job posting                  |
| GET         | `/api/jobs/mine`                  | Recruiter     | Retrieve the recruiter's job postings |
| POST        | `/api/applications/:jobId`        | Student       | Submit a job application              |
| GET         | `/api/applications/mine`          | Student       | Retrieve personal applications        |
| DELETE      | `/api/applications/:id`           | Student       | Withdraw an application               |
| GET         | `/api/applications/stats`         | Recruiter     | Retrieve application statistics       |
| GET         | `/api/applications/job/:jobId`    | Recruiter     | Retrieve applicants for a job         |
| PUT         | `/api/applications/:id/status`    | Recruiter     | Update application status             |
| PUT         | `/api/applications/:id/interview` | Recruiter     | Schedule an interview                 |
| GET         | `/api/notifications`              | Authenticated | Retrieve notifications                |
| PUT         | `/api/notifications/read-all`     | Authenticated | Mark notifications as read            |

*This is a documentation summary, not a verified API specification. Confirm endpoint paths, HTTP methods, and authorization requirements against the implemented backend.*

---

## Security Considerations

The application incorporates several security-related mechanisms:

* Password hashing with bcrypt.
* JWT-based authentication.
* Role-based access control.
* Resume upload handling and file-size restrictions.
* Environment-based configuration for sensitive values.

For production deployment, additional validation and security controls should be reviewed, including file-type verification, upload storage permissions, rate limiting, input validation, secure token handling, and appropriate CORS configuration.

---

## Future Enhancements

Potential areas for further development include:

* Email notifications for application and interview updates.
* Cloud-based resume storage using Cloudinary or Amazon S3.
* Real-time updates using Socket.IO.
* Administrative tools for user and job-posting management.
* Saved jobs and personalized job recommendations.
* Automated backend and frontend testing.
* Docker-based development and deployment.
* Production deployment with managed database services.

---

## Intended Audience

CareerConnect is designed for:

* **Students and job seekers** looking for internships and entry-level employment.
* **Recruiters and hiring teams** managing vacancies and candidate applications.
* **Developers and students** exploring full-stack development using the MERN stack.

---

## Project Details

| Attribute        | Details                            |
| ---------------- | ---------------------------------- |
| Project Name     | CareerConnect                      |
| Project Category | Full-Stack Web Application         |
| Domain           | Recruitment and Career Development |
| Architecture     | Client-Server                      |
| Technology       | MERN Stack                         |
| Primary Users    | Students an                        |
