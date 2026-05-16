# Gscope — Technical Requirements Document

## 1. Project Overview

Gscope is a full-stack gym management platform that enables gym owners to manage memberships, track attendance, record sessions, handle finances, and generate analytics reports.

### Goals

- Provide a centralized dashboard for day-to-day gym operations.
- Automate financial tracking (bank balance updates on member signups, sessions, and expenses).
- Offer real-time and historical analytics (revenue, member growth, session breakdowns).
- Support offer/promotion management with automatic member count tracking.
- Implement secure authentication with email-based OTP verification.

---

## 2. System Architecture

```
┌─────────────┐     HTTP/JSON     ┌──────────────┐     SQL     ┌──────────┐
│   Frontend   │ ────────────────> │   Backend    │ ──────────> │  SQLite  │
│  React + Vite │ <──────────────── │  Express 5   │ <────────── │   (DB)   │
│  TypeScript   │      CORS         │  TypeScript  │             └──────────┘
│  Tailwind CSS │                   │              │     Redis   ┌──────────┐
└─────────────┘                    │              │ <──────────> │  Redis   │
                                   │              │  (sessions)  │ (cache)  │
                                   └──────────────┘             └──────────┘
                                              │
                                              │ Nodemailer
                                              ▼
                                         ┌──────────┐
                                         │  Gmail   │
                                         │  SMTP    │
                                         └──────────┘
```

### 2.1 Frontend

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4
- **Routing:** React Router 7
- **Animations:** GSAP
- **HTTP Client:** fetch (native)
- **Forms:** Formik

### 2.2 Backend

- **Runtime:** Node.js 20+
- **Framework:** Express 5 with TypeScript
- **Database:** SQLite (via `sqlite3` + `sqlite` wrapper)
- **Cache/Sessions:** Redis
- **Auth:** JWT (stored in HTTP-only cookie) + bcrypt password hashing
- **Email:** Nodemailer (Gmail SMTP)
- **API Docs:** Swagger (swagger-jsdoc + swagger-ui-express)
- **Real-time:** Server-Sent Events (SSE) for monitoring
- **Rate Limiting:** express-rate-limit

### 2.3 Database

- **Primary:** SQLite (file-based, zero-config)
- **Secondary:** Redis (OTP sessions, password reset tokens)
- **Migrations:** Automatic via `sqlite` package migration files

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-01 | Gym owner must sign up with name, email, phone, password | High |
| AUTH-02 | Email OTP must be sent and verified before account activation | High |
| AUTH-03 | Owner must sign in with email + password to receive JWT cookie | High |
| AUTH-04 | Owner can request password reset via email OTP | Medium |
| AUTH-05 | Rate limiting on sign-in (5 attempts per 15 minutes per IP) | Medium |
| AUTH-06 | All API routes except auth, Swagger, and monitor require valid JWT | High |
| AUTH-07 | OTP expires after 5 minutes (Redis TTL) | High |

### 3.2 Member Management

| ID | Requirement | Priority |
|----|-------------|----------|
| MEM-01 | Add member with name, phone, months, price, notes, optional offer_id | High |
| MEM-02 | List all members of a gym | High |
| MEM-03 | Filter members by name | Medium |
| MEM-04 | Get member by ID | High |
| MEM-05 | Update member months and price (recalculates start/end dates) | High |
| MEM-06 | Delete member | High |
| MEM-07 | Adding a member automatically updates bank balance (+price) | High |
| MEM-08 | Updating a member price passes exchange (difference) to bank update | High |

### 3.3 Session Tracking

| ID | Requirement | Priority |
|----|-------------|----------|
| SES-01 | Record session with member_name, phone, session_type, price, date | High |
| SES-02 | Session types: gym, football, swimming | High |
| SES-03 | List all sessions | Medium |
| SES-04 | Adding a session automatically updates bank balance (+price) | High |

### 3.4 Attendance Logs

| ID | Requirement | Priority |
|----|-------------|----------|
| LOG-01 | Check-in member by member ID (records timestamp) | High |
| LOG-02 | Get all logs for a specific member | Medium |
| LOG-03 | Get last check-in time and duration since last attendance | Medium |
| LOG-04 | Get all logs for the gym (joined with member name/phone) | Medium |

### 3.5 Offer Management

| ID | Requirement | Priority |
|----|-------------|----------|
| OFR-01 | Create offer with name, end_date, price, months | High |
| OFR-02 | List all offers | Medium |
| OFR-03 | List only available (non-expired) offers | High |
| OFR-04 | Auto-increment member_count when a member signs up with an offer | Medium |

### 3.6 Expense Management

| ID | Requirement | Priority |
|----|-------------|----------|
| EXP-01 | Create expense with title, amount, date, category, notes | High |
| EXP-02 | List all expenses | Medium |
| EXP-03 | Get expense by ID | Medium |
| EXP-04 | Update expense | Medium |
| EXP-05 | Delete expense | Medium |
| EXP-06 | Report: total expenses, by date range, by category | Medium |

### 3.7 Bank / Financial

| ID | Requirement | Priority |
|----|-------------|----------|
| BNK-01 | Get current bank balance | High |
| BNK-02 | Bank is automatically credited on member add/update and session add | High |
| BNK-03 | No manual bank adjustment endpoint (fully automated) | Medium |

### 3.8 Reports & Analytics

| ID | Requirement | Priority |
|----|-------------|----------|
| RPT-01 | Basic dashboard: today's revenue, month revenue, today's sessions/members, active members, members logged today, total members, expiring soon | High |
| RPT-02 | Advanced month analysis: revenue breakdown (total/members/sessions), members list, sessions list for a specific month | High |
| RPT-03 | Advanced day analysis: same breakdown for a specific date | High |
| RPT-04 | Filter sessions by type (gym/football/swimming) in advanced analysis | Medium |
| RPT-05 | Members by day/month count | Medium |
| RPT-06 | Sessions by day/month count | Medium |
| RPT-07 | Revenue by day/month (total + members + sessions) | High |
| RPT-08 | Active members count (end_date >= today) | Medium |
| RPT-09 | Members expiring within 4 days | Low |

### 3.9 Real-time Monitoring

| ID | Requirement | Priority |
|----|-------------|----------|
| MON-01 | SSE endpoint emits gym events (member add, session add, expense, errors) | Low |
| MON-02 | Monitor dashboard at /monitor displays live events | Low |

---

## 4. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Response time for API calls | < 500ms (p95) |
| NFR-02 | Concurrent users supported | 50+ simultaneous gym owners |
| NFR-03 | Database persistence | SQLite file (durable) |
| NFR-04 | Session store availability | Redis required (fail = no OTP auth) |
| NFR-05 | Password storage | bcrypt with salt rounds ≥ 10 |
| NFR-06 | JWT token expiry | 24 hours (no refresh token) |
| NFR-07 | OTP expiry | 5 minutes (Redis TTL) |
| NFR-08 | Frontend bundle size | < 500KB (gzipped) |
| NFR-09 | CORS origin restriction | Only frontend dev server allowed |
| NFR-10 | API rate limiting | 5 req/15min on sign-in |

---

## 5. Database Schema

### 5.1 Tables

#### companies
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| name | TEXT | NOT NULL |
| email | TEXT | NOT NULL UNIQUE |
| phone | TEXT | NOT NULL |
| password | TEXT | NOT NULL (bcrypt hash) |
| created_at | TEXT | NOT NULL |
| updated_at | TEXT | NOT NULL |

#### members
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| gym_id | INTEGER | NOT NULL FK → companies(id) ON DELETE CASCADE |
| name | TEXT | NOT NULL |
| phone | TEXT | NOT NULL |
| months | INTEGER | NOT NULL |
| price | REAL | NOT NULL |
| start_date | TEXT | NOT NULL |
| end_date | TEXT | NOT NULL |
| notes | TEXT | DEFAULT '' |

#### sessions
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| gym_id | INTEGER | NOT NULL FK → companies(id) ON DELETE CASCADE |
| session_date | TEXT | NOT NULL |
| session_type | TEXT | NOT NULL CHECK (gym/football/else) |
| price | REAL | NOT NULL |
| member_name | TEXT | NOT NULL |

#### offers
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| gym_id | INTEGER | NOT NULL FK → companies(id) ON DELETE CASCADE |
| name | TEXT | NOT NULL |
| offer_end_date | TEXT | NOT NULL |
| price | REAL | NOT NULL |
| months | INTEGER | NOT NULL |
| member_count | INTEGER | DEFAULT 0 |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP |

#### attendance_logs
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| member_id | INTEGER | NOT NULL FK → members(id) ON DELETE CASCADE |
| gym_id | INTEGER | NOT NULL FK → companies(id) ON DELETE CASCADE |
| check_in_time | TEXT | NOT NULL |

#### bank
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| gym_id | INTEGER | NOT NULL FK → companies(id) ON DELETE CASCADE UNIQUE |
| money | REAL | NOT NULL DEFAULT 0 |

#### expenses
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| gym_id | INTEGER | NOT NULL FK → companies(id) ON DELETE CASCADE |
| title | TEXT | NOT NULL |
| amount | REAL | NOT NULL |
| date | TEXT | NOT NULL |
| category | TEXT | NOT NULL |
| notes | TEXT | DEFAULT '' |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP |

---

## 6. API Endpoints

### 6.1 Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/v1/auth/signin | No | Sign in, returns JWT cookie |
| POST | /api/v1/auth/signup | No | Register, sends OTP email |
| POST | /api/v1/auth/validateotp | No | Verify OTP, activate account |
| POST | /api/v1/auth/forgotpassword | No | Send OTP for password reset |
| POST | /api/v1/auth/restorepassword | No | Reset password |
| POST | /api/v1/auth/resendotp | No | Resend OTP |

### 6.2 Members

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/members | Yes | List all members |
| POST | /api/v1/members | Yes | Add member (+bank) |
| GET | /api/v1/members/filter | Yes | Filter by name |
| GET | /api/v1/members/:id | Yes | Get member by ID |
| PUT | /api/v1/members/:id | Yes | Update member (+bank exchange) |
| DELETE | /api/v1/members/:id | Yes | Delete member |

### 6.3 Sessions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/sessions | Yes | List all sessions |
| POST | /api/v1/sessions | Yes | Add session (+bank) |

### 6.4 Attendance Logs

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/logs | Yes | All logs |
| POST | /api/v1/logs/:member_id | Yes | Check-in member |
| GET | /api/v1/logs/:member_id | Yes | Logs for member |
| GET | /api/v1/logs/:member_id/last-attendance | Yes | Last attendance |

### 6.5 Offers

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/offers | Yes | List all offers |
| POST | /api/v1/offers | Yes | Create offer |
| GET | /api/v1/offers/available | Yes | Available offers |

### 6.6 Expenses

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/expenses | Yes | List expenses |
| POST | /api/v1/expenses | Yes | Create expense |
| GET | /api/v1/expenses/:id | Yes | Get expense |
| PUT | /api/v1/expenses/:id | Yes | Update expense |
| DELETE | /api/v1/expenses/:id | Yes | Delete expense |

### 6.7 Bank

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/bank | Yes | Get balance |

### 6.8 Reports

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/reports | Yes | Basic dashboard stats |
| GET | /api/v1/reports/members/day | Yes | Members by day |
| GET | /api/v1/reports/members/month | Yes | Members by month |
| GET | /api/v1/reports/sessions/day | Yes | Sessions by day |
| GET | /api/v1/reports/sessions/month | Yes | Sessions by month |
| GET | /api/v1/reports/sessions/day/type | Yes | Sessions by day + type |
| GET | /api/v1/reports/sessions/month/type | Yes | Sessions by month + type |
| GET | /api/v1/reports/revenue/day | Yes | Revenue by day |
| GET | /api/v1/reports/revenue/month | Yes | Revenue by month |

---

## 7. Security Requirements

- JWT stored in HTTP-only, same-site cookie (not accessible via JavaScript).
- Passwords hashed with bcrypt (salt rounds ≥ 10).
- OTP stored in Redis with 5-minute TTL.
- Rate limiting on sign-in endpoint (5 requests per 15 minutes per IP).
- CORS restricted to frontend origin only.
- All member/session/offer/expense data scoped to the authenticated gym_id (no cross-gym access).
- No plaintext secrets in the codebase (all credentials in .env).

---

## 8. Frontend Routes & Components

### 8.1 Pages

| Route | Component | Auth | Description |
|-------|-----------|------|-------------|
| / | LandingPage | No | Landing page |
| /signin | SignInPage | No | Sign-in form |
| /signup | SignUpPage | No | Sign-up form |
| /validate-otp | ValidateOtpPage | No (session) | OTP verification |
| /forgot-password | ForgotPasswordPage | No | Request reset |
| /update-password | UpdatePasswordPage | No (session) | Set new password |
| /dashboard | DashboardPage | Yes | Main dashboard |

### 8.2 Dashboard Panes

| Pane | Component | Description |
|------|-----------|-------------|
| profiles | ProfilesPane | Member list, edit, delete |
| subscriptions | SubscriptionsPane | Check-in, create member/session, update |
| analytics | AnalyticsPane | Month/day revenue breakdowns with member/session tables |
| logs | LogsPane | Attendance log viewer |
| bank | BankPane | Bank balance display |
| offers | OffersPane | Offer CRUD |
| expenses | ExpensesPane | Expense CRUD |

---

## 9. Error Handling

- Backend returns `{ message: string }` on errors.
- HTTP status codes: 200 (success), 201 (created), 400 (bad request/validation), 401 (unauthorized), 404 (not found), 429 (rate limited), 500 (internal error).
- Frontend uses a toast notification system (`useToast`) to display error/success messages.
- Unhandled errors are logged via `res.errorMsg` and emitted via SSE events.

---

## 10. Configuration & Environment

All configuration is via environment variables in `backend/.env`:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 3000 | Backend server port |
| MAIL_USER | Yes | — | Gmail address for OTP |
| MAIL_PASSWORD | Yes | — | Gmail app password |
| JWT_SECRET | Yes | — | JWT signing secret |
| REDIS_USERNAME | Yes | — | Redis username |
| REDIS_PASSWORD | Yes | — | Redis password |
| REDIS_HOST | Yes | — | Redis host |
| REDIS_PORT | Yes | — | Redis port |
| AUTH_TOKEN | No | auth-token | JWT cookie name |

Frontend hardcodes the API base URL (`http://localhost:6969`) and proxies through Vite.

---

## 11. Deployment

- **Backend:** Node.js process (PM2, systemd, or container). SQLite file must be persisted. Redis must be reachable.
- **Frontend:** Static files served via Vite build output (`frontend/dist/`), deployable to any static host (Netlify, Vercel, S3, Nginx).
- **Environment-specific config:** Update `frontend/src/services/*.ts` server URLs for production.
- **No Dockerfile provided** — containerization is left to the deployer.

---

## 12. Testing

- **Framework:** Jest + ts-jest + supertest
- **Coverage:** Controllers (auth, member, session, bank, expense, offer, report, log)
- **Mocked:** Redis client, uuid
- **Note:** SQLite is used in test mode (in-memory or temp file)
- **Run:** `cd backend && npm test`

---

## 13. Glossary

| Term | Definition |
|------|------------|
| Gym / Company | The gym owner entity registered in the system |
| Member | A person who purchases a gym subscription |
| Session | A single visit/purchase of a gym activity type |
| OTP | One-Time Password sent via email for verification |
| JWT | JSON Web Token used for API authentication |
| Exchange | The price difference when updating a member's subscription |
| SSE | Server-Sent Events for real-time monitoring |
