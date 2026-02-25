# Frontend + Express Debugging Task

Welcome to the debugging interview task! This is a task manager application with intentional bugs in the **React frontend** and **Express backend** that you'll need to find and fix.

## Overview

This application consists of:
- **Frontend**: React application with TanStack Query (port 3000)
- **Express Backend**: Node/Express API for CRUD operations (port 3001) — **has bugs to fix**
- **Python Backend**: FastAPI service for analytics and search (port 5000) — working correctly
- **Database**: PostgreSQL (port 5433)

## Setup

### Prerequisites
- Docker and Docker Compose installed
- No other services running on ports 3000, 3001, 5000, or 5433

### Running the Application

```bash
docker-compose up
```

Wait for all services to start (you'll see logs from all containers). Then open your browser to:

**http://localhost:3000**

## Your Task

The application has bugs in the **frontend** and **Express backend**. Your goal is to:

1. **Find** the bugs through debugging
2. **Fix** each bug
3. **Verify** that your fixes work

See `INTERVIEW_TICKETS.md` for the full list of tickets with symptoms and acceptance criteria.

### What's in scope
- `frontend/src/App.js` — React bugs (main focus)
- `backend-express/index.js` — Express bugs (basic)

### What's NOT in scope
- `backend-python/` — the Python service works correctly
- `database/` — the schema and seed data are correct

## Debugging Tools

### Browser Tools
- **Console**: Check for JavaScript errors and logs
- **Network Tab**: Monitor API requests and responses
- **React DevTools**: Inspect component state and props (optional)

### Backend Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend-express
docker-compose logs backend-python

# Follow logs in real-time
docker-compose logs -f backend-express
```

## Application Features to Test

1. **User Selection**: Select a user from the dropdown
2. **View Tasks**: See tasks for the selected user
3. **Task Statistics**: View total, completed, and pending task counts
4. **Analytics**: See completion rate and priority breakdown
5. **Search**: Search for tasks by title or description
6. **Update Status**: Mark tasks as complete or reopen them
7. **Delete Tasks**: Remove tasks

## Code Structure

```
.
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component (bugs here)
│   │   ├── App.css         # Styles
│   │   └── index.js        # Entry point
│   └── package.json
│
├── backend-express/
│   ├── index.js            # Express server (bugs here)
│   └── package.json
│
├── backend-python/
│   ├── app.py              # FastAPI server (working correctly)
│   └── requirements.txt
│
├── database/
│   └── init/
│       └── 01-schema.sql   # Database schema and seed data
│
└── docker-compose.yml
```

## Making Changes

All code directories are mounted as volumes, so changes you make will be reflected immediately:
- **Frontend**: Changes trigger automatic reload
- **Express**: Uses nodemon with auto-reload
- **Python**: Uses uvicorn with --reload flag

No need to rebuild containers after code changes!

## Restarting Services

```bash
# Restart a service
docker-compose restart frontend
docker-compose restart backend-express

# Restart all services
docker-compose restart
```

## Cleaning Up

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (resets database)
docker-compose down -v
```

## Tips

1. Start by checking if the application loads at all
2. Open the browser console immediately to see any errors
3. Try each feature systematically
4. Check backend logs when frontend requests fail
5. Look for patterns in errors
6. Fix bugs one at a time and verify each fix
7. Some bugs may be related — fixing one might reveal another

## Questions?

If you have questions about the expected behavior or need clarification, please ask your interviewer.

Good luck!
