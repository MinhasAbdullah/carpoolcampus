# CarpoolCampus Frontend

React/Vite frontend for the merged CarpoolCampus Django backend. The UI uses Axios for REST requests and native WebSockets for Django Channels. No seeded ride, user, match, report, rating, trip, or notification data is used.

## Features

- Public landing page
- Rider and driver signup/sign-in
- Role-aware dashboard/navigation
- Route posting with client-side geocoding
- Route matching and ride requests
- Driver request approval/decline
- Trip list and live trip room
- Trip lifecycle controls: scheduled → in progress → completed/cancelled
- Driver location sharing
- Emergency contacts
- Driver profile
- Post-trip ratings
- User reporting
- Admin moderation queue
- Admin verification queue
- Realtime notification stream

## Install and run

```bash
npm install
npm run dev
```

The Vite development server proxies:

- `/api` → `http://127.0.0.1:8000`
- `/ws` → `ws://127.0.0.1:8000`

So run the Django backend on port `8000` before testing the frontend.

## Environment

Development defaults are in `.env.example`:

```env
VITE_API_BASE_URL=/api
VITE_WS_BASE_URL=ws://localhost:5173/ws
VITE_GEOCODER_URL=https://nominatim.openstreetmap.org
```

For production, copy `.env.production.example` to `.env.production` and configure the public API/WebSocket host.

## Production build

```bash
npm install
npm run build
```

Deploy the generated `dist/` directory. React Router requires all unknown frontend routes to fall back to `index.html`; Netlify and Nginx examples are included.

## REST endpoint contract

Axios is configured in `src/lib/api.js`.

### Authentication

- `POST /api/token/`
- `POST /api/token/refresh/`
- `POST /api/users/signup/`

### Users / moderation

- `POST /api/users/driver-profile/`
- `GET /api/users/driver-profile/me/`
- `POST /api/users/emergency-contact/`
- `GET /api/users/emergency-contact/list/`
- `POST /api/users/reports/`
- `GET /api/users/admin/reports/queue/`
- `POST /api/users/admin/reports/:id/action/`
  - body: `{ "status": "reviewed|dismissed", "comment": "..." }`
- `GET /api/users/admin/users/`
- `POST /api/users/admin/users/:id/verify/`
  - body: `{ "is_verified": true|false }`

### Routes

- `POST /api/routes/`
- `GET /api/routes/mine/`
- `GET/PATCH/DELETE /api/routes/:id/`
- `POST /api/routes/pause/`

### Matching

- `GET /api/matching/find/?route_id=:id`
- `POST /api/matching/generate/`
- `POST /api/matching/request/`
- `GET /api/matching/mine/`

### Trips

- `GET /api/trips/mine/`
- `POST /api/trips/request/:match_id/action/`
  - approve body includes `{ "action": "approve", "date": "YYYY-MM-DD" }`
  - decline body: `{ "action": "decline" }`
- `POST /api/trips/:trip_id/on-the-way/`
- `POST /api/trips/:trip_id/status/`
  - body: `{ "status": "scheduled|in_progress|completed|cancelled" }`
  - available to either the driver or rider on that trip

The Ride Requests UI includes a trip-date picker so approval sends the date required by the backend view. The Active Ride UI uses the status endpoint for Start Trip, Complete Trip and Cancel Trip actions.

### Ratings

- `POST /api/ratings/`
- `GET /api/ratings/user/:user_id/`

### Notifications

- `GET /api/notifications/`
- `GET /api/notifications/?unread_only=true`
- `POST /api/notifications/:id/read/`
- `POST /api/notifications/mark-all-read/`

## WebSockets

JWT access tokens are sent in the query string.

```text
/ws/notifications/?token=<access-token>
/ws/trips/<trip_id>/?token=<access-token>
```

The current trip consumer accepts `location_update` and `ping` messages from the client. The frontend also understands `driver_on_the_way` and `trip_status` events when they are broadcast. Because the supplied trip status REST view does not itself broadcast a WebSocket status event, the Active Ride page refreshes the current trip from `/api/trips/mine/` every few seconds while a trip is active so both participants stay in sync.

## Matching

The frontend displays the server-provided overlap result. It does not reimplement or override the backend matching decision. The supplied matching utility remains authoritative and uses its existing weighted formula for origin, destination, detour, time, and shared days.

## Trip lifecycle

The frontend follows the supplied trips API directly:

1. An approved ride request creates a trip with `scheduled` status.
2. The driver can send the existing on-the-way ping and share live coordinates.
3. Either trip participant can press **Start Trip**, which posts `in_progress`.
4. Either trip participant can press **Complete Trip**, which posts `completed`.
5. Active trips can be cancelled by posting `cancelled`.
6. Completed trips appear in Ratings and can be rated.

The frontend does not add any additional server-side transition rules beyond the supplied backend contract.

## Deployment checklist

1. Deploy Django/PostgreSQL/Redis first.
2. Ensure `/api` and `/ws` are reachable from the frontend host.
3. Use HTTPS and WSS in production.
4. Configure Django allowed hosts/CORS/CSRF environment variables.
5. Set frontend production environment variables.
6. Build with `npm run build`.
7. Test rider, driver and admin sessions separately.
