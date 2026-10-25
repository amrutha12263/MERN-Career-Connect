# CareerConnect — Job and Internship Portal (MERN)

Connects students with recruiters for internships and entry-level jobs.

## Features
- Student and recruiter roles (JWT auth, bcrypt, role-based route protection)
- Resume upload (PDF/Word, 2 MB, Multer) — saved to profile and reused when applying
- Job search with filters (keyword, type, mode, location, skills) and pagination
- Application tracking (Applied → Under Review → Shortlisted → Interview Scheduled → Selected / Rejected)
- Recruiter dashboard: post/close/delete jobs, pipeline stats, applicant list, status updates
- Interview scheduling with in-app notifications for every status change

## Run locally
Requires Node 18+ and MongoDB running locally (or an Atlas URI in `server/.env`).

```bash
npm run install:all
npm run seed        # optional demo data
npm run server      # terminal 1 -> http://localhost:5000
npm run client      # terminal 2 -> http://localhost:5173
```
Demo logins after seeding (password `demo123`): `student@demo.com`, `recruiter@demo.com`.

## API
| Method | Route | Role | Purpose |
|---|---|---|---|
| POST | /api/auth/register, /login | public | Sign up / log in |
| GET/PUT | /api/auth/me, /profile | any | Profile + resume upload |
| GET | /api/jobs?q&type&mode&location&skills&page | public | Search jobs |
| POST/PUT/DELETE | /api/jobs, /api/jobs/:id | recruiter | Manage own jobs |
| GET | /api/jobs/mine | recruiter | Own jobs + applicant counts |
| POST | /api/applications/:jobId | student | Apply (resume + cover note) |
| GET | /api/applications/mine | student | Track applications |
| DELETE | /api/applications/:id | student | Withdraw |
| GET | /api/applications/stats, /job/:jobId | recruiter | Stats, applicants |
| PUT | /api/applications/:id/status, /interview | recruiter | Update status, schedule interview |
| GET/PUT | /api/notifications, /read-all | any | Notifications |

## Structure
```
server/  config, models (User, Job, Application, Notification), middleware, routes
client/  React + Vite: pages, components, AuthContext, api.js
```

## Ideas to extend (for placements/interviews)
Email notifications (Nodemailer), Cloudinary/S3 for resumes, Socket.io live alerts, admin role, saved jobs, Jest + Supertest tests, Docker, deployment (Render + Vercel + Atlas).
