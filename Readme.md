# Fire Department Incident Management System

A full-stack web application for managing fire and accident incidents, built for the HY-359 Web Development course at the University of Crete (2024-2025).

## Overview

A real-time incident management platform for the Fire Department of Crete, connecting Admins, Volunteers, Users, and Guests through a unified web interface. The system handles the full lifecycle of an incident — from submission and validation to dispatching volunteers and archiving results.

## User Roles

| Role | Description |
|------|-------------|
| Admin | Creates and manages incidents, accepts or rejects volunteers, views statistics |
| Volunteer (Driver/Simple) | Registers, applies for incidents, tracks participation history |
| User | Registers, views nearby active incidents, receives danger alerts |
| Guest | Submits incident reports, views public incident map |

## Core Features

- **Incident Lifecycle Management** — submitted, running, finished states with fake/real validation by Admin
- **Volunteer Dispatch System** — Admins create Driver/Simple slots per incident; volunteers apply and get accepted or declined
- **Real-time Maps** — Interactive Leaflet maps showing active fires and accidents with custom icons
- **Distance and Danger Alerts** — Users get notified if an active incident is nearby via TrueWay Matrix API
- **AI Chat Assistant** — Powered by Google Gemini API for answering incident-related questions
- **Statistics Dashboard** — Pie charts and bar charts showing incident and volunteer activity
- **Messaging System** — Public, user-to-admin, and volunteer-to-admin messaging per incident
- **History Search** — Filter past incidents by prefecture, type, date range, vehicles, firemen

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Maps:** Leaflet.js, TrueWay Matrix API
- **AI:** Google Gemini API (`@google/generative-ai`)
- **Auth:** Cookie-parser, sessions
- **Dev:** Nodemon, dotenv

## Setup Instructions

### Prerequisites
- Node.js v22+
- MySQL / MySQL Workbench

### 1. Clone the repository

```bash
git clone https://github.com/emiraldol/Project359.git
cd Project359
```

### 2. Import the database

- Open MySQL Workbench
- Create a new schema named `hy359_2024`
- Go to Server, Data Import, Import from Self-Contained File
- Select `database/hy359_2024.sql` and click Start Import
- Then run this fix to remove participants that conflict with our logic:

```sql
DELETE FROM hy359_2024.participants WHERE participant_id IN (1, 2, 3);
```

### 3. Install dependencies

```bash
cd BackEnd
npm install
```

### 4. Configure environment variables

Create `BackEnd/.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hy359_2024
DB_PORT=3306
```

### 5. Run the server

```bash
npm run dev
```

### 6. Open the application

Visit http://localhost:3000

## Project Structure

```
Project359/
├── BackEnd/
│   ├── db.js              # All REST API endpoints (50+ routes)
│   ├── .env               # Environment variables (not committed)
│   └── package.json
├── FrontEnd/
│   ├── AdminHome.html     # Admin dashboard
│   ├── AdminLogin.html    # Admin login
│   ├── form.html          # Volunteer register/login
│   ├── volunteers.html    # Volunteer dashboard
│   ├── UserForm.html      # User register/login
│   ├── User.html          # User dashboard
│   ├── Guest.html         # Guest portal
│   └── ...                # CSS and JS files
└── database/
    └── hy359_2024.sql     # MySQL schema and seed data
```

## Test Credentials

**Admin**

| Field | Value |
|-------|-------|
| Username | admin |
| Password | admiN12@*69 |

**Volunteers**

| Username | Password | Type |
|----------|----------|------|
| raphael | ab$A12cde | Driver |
| nick | ab$A12cde | Simple |
| mary | ab$A12cde | Simple |
| papas | ab$A12cde | Driver |

**Users**

| Username | Password |
|----------|----------|
| mountanton | ab$A12cde |
| tsitsip | ab$A12cde |

## Team

- Emiraldo Lamkja (AM5059)
- Antonis Kavalieros (AM5088)

## Course

HY-359 — Web Application Development  
Department of Computer Science, University of Crete — 2024-2025

> Images used in this project are AI-generated.
