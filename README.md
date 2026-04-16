# Physiotherapy Patient Report Management Portal

## Overview

This project is a web-based portal designed for physiotherapists to manage patient cases and track treatment progress over time. It provides a structured way to record sessions, monitor recovery, and analyze treatment effectiveness based on measurable parameters.

The system focuses on organizing patient data in a way that makes it easy to retrieve past cases, compare treatments, and make more informed clinical decisions.

---

## Features

* User authentication using JWT and bcrypt
* Create and manage patient cases
* Store patient details along with injury information
* Add multiple sessions for each case
* Search cases by patient name
* Search cases by injury type
* View all cases in a structured format
* Session-wise tracking of:

  * Pain
  * Mobility
  * Strength
  * Motor control
* Graph-based analysis to visualize recovery trends

---

## Tech Stack

**Frontend**
React (Vite), Axios

**Backend**
Node.js, Express

**Database**
MySQL (XAMPP)

**Authentication**
JWT, bcrypt

---

## Project Structure

```
project/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── Database/
│   ├── middleware/
│   ├── server.js
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── Components/
│   └── api/
```

---

## Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/PrashantSinghSisodia123/PhysioFriendly-.git
cd PhysioFriendly-
```

---

### 2. Backend Setup

```
cd backend
npm install
```

Create a `.env` file inside the backend folder using the following format:

```
JWT_SECRET=your_secret_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=physiofriendly
PORT=4000
```

---

### 3. Database Setup

1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a database named:

```
physiofriendly
```

3. Click on **Import**
4. Upload the SQL file located at:

```
backend/Database/physiofriendly.sql
```

---

### 4. Run Backend

```
npm run server
```

---

### 5. Frontend Setup

```
cd ../frontend
npm install
npm run dev
```

---

## Access

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:4000
```

---

## Notes

* Update `DB_PASSWORD` in `.env` if your MySQL setup uses a password
* Ensure the database name in `.env` matches exactly with the one created in phpMyAdmin
* Do not commit the `.env` file

---

## Future Scope

* Export reports as downloadable files
* Advanced analytics for treatment effectiveness
* Multi-user roles and access control
* Automated session summaries

---

## Author

Prashant Singh Sisodia
