# CarpoolCampus — Ride-Sharing Coordination for Commuting Students

A web app where commuting students post their home ↔ campus routes and schedules, get matched with overlapping riders/drivers, and split costs automatically.

**Program:** Web App Dev Fellowship — Zeppelin Labs
**Team:** Abdullah (Lead), Hasan, Sidra, Akash, Wajih

---

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Django + Django REST Framework
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT + campus email (.edu.pk) verification
- **Real-time:** Django Channels

---

## User Roles

- **Driver** — posts a recurring route, approves/declines ride requests, sends "on my way" pings
- **Rider** — posts a route, views ranked matches, requests a seat, sees cost split
- **Admin** — verifies accounts, reviews safety reports

---

## Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:
```
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
DB_HOST=...
DB_PORT=5432
```

```bash
python manage.py migrate
python manage.py runserver
```
Runs at `http://127.0.0.1:8000`

### Create Admin User
```bash
python manage.py createsuperuser
```
Then set `role = admin` for that user via the Django admin panel (`/admin/`).

### Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

```bash
npm run dev
```
Runs at `http://localhost:5173`

---

## Key API Endpoints

| Endpoint | Method | Access |
|---|---|---|
| `/api/users/signup/` | POST | Public |
| `/api/token/` | POST | Public (login) |
| `/api/users/driver-profile/` | POST | Driver |
| `/api/routes/` | POST | Authenticated |
| `/api/routes/mine/` | GET | Authenticated |
| `/api/trips/mine/` | GET | Authenticated |
| `/api/trips/request/<match_id>/action/` | POST | Driver |
| `/api/trips/<trip_id>/status/` | POST | Driver/Rider |
| `/api/ratings/` | POST | Authenticated |
| `/api/users/admin/reports/queue/` | GET | Admin |
| `/api/users/admin/users/` | GET | Admin |

All endpoints (except signup/login) require:
```
Authorization: Bearer <access_token>
```

---

## Team

| Person | Task |
|---|---|
| Abdullah | Django models, JWT auth, admin/moderation, profile & trip endpoints, cost-split, ratings, docs |
| Wajih | Matching engine, real-time notifications, deployment |
| Hasan | React setup, admin UI, rating & trip history UI, API wiring |
| Sidra | Driver signup/profile/routes, ride request handling, admin analytics UI |
| Akash | Rider dashboard, route posting, matches UI, cost-split display, emergency contact |

---

## Deliverables

- [x] Source code + README
- [ ] ERD
- [ ] Technical write-up
- [ ] Deployed app
- [ ] Demo walkthrough
