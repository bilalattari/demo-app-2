# HSEQ Portal — Demo Application
### Built by 12Monday Technologies for Pakistan Refinery Limited (PRL)

---

## Overview

This is a **fully functional demo** of the HSEQ Observation, Action Items & KPI Dashboard Portal. It is built with React (frontend) and Node.js/Express (backend) with mock data pre-loaded to demonstrate all features described in the Scope of Work.

**Demo URL (local):** http://localhost:3000  
**API URL (local):** http://localhost:5000

---

## Demo Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| Super Admin | admin@prl.com.pk | Admin@123 | Full system access |
| HSEQ Officer | hseq.officer@prl.com.pk | Hseq@123 | Create/Assign/Close |
| Focal Person (Ops) | focal.ops@prl.com.pk | Focal@123 | View/Close Assigned |
| Employee | employee@prl.com.pk | Emp@123 | View Only |

---

## Project Structure

```
hseq-demo/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # Login page
│   │   │   ├── layout/          # Sidebar, Header, Layout wrapper
│   │   │   ├── dashboard/       # KPI widgets & charts
│   │   │   ├── observations/    # Observation portal
│   │   │   ├── actions/         # Action items portal
│   │   │   └── admin/           # User management
│   │   ├── data/
│   │   │   └── mockData.js      # All mock data (50+ observations, actions, KPIs)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── context/             # Auth context
│   │   └── App.jsx
│   └── package.json
└── backend/                     # Node.js/Express API (optional for demo)
    ├── routes/
    ├── data/
    │   └── seed.js              # Mock database seed
    └── server.js
```

---

## Quick Start

### Frontend Only (Recommended for Demo)
```bash
cd frontend
npm install
npm run dev
```
The app runs entirely on mock data — no backend needed for demo.

### Full Stack
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev   # runs on port 5000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev   # runs on port 3000
```

---

## Features Demonstrated

1. **Role-Based Login** — 4 different user roles with different UI/permissions
2. **HSEQ Dashboard** — Real-time KPI widgets, 6 chart types, filters, Excel export
3. **Observation Portal** — Log, assign, track, close observations with file attachments
4. **Action Items Panel** — Dynamic forms per activity type, CAPA workflow
5. **Reminder System** — Manual reminder triggers, overdue indicators
6. **Admin Panel** — User management, role assignment (Super Admin only)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| UI Library | Ant Design 5.x |
| Charts | Recharts |
| State | React Context + useState |
| Icons | Ant Design Icons |
| Export | SheetJS (xlsx) |
| Routing | React Router v6 |
| HTTP | Axios (for backend mode) |
