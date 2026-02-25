# Frontend + Python Backend Debugging Task

Welcome to the debugging interview task! This is a full-stack task manager application with intentional bugs that you'll need to find and fix.

## Overview

This application consists of:
- **Frontend**: React application with TanStack Query (port 3000)
- **Backend Service**:
  - Python/FastAPI API (port 5000)
- **Database**:
  - PostgreSQL (port 5433)

## Setup

### Prerequisites
- Docker and Docker Compose installed
- No other services running on ports 3000, 5000, or 5433

### Running the Application

```bash
docker-compose up
```

Wait for all services to start (you'll see logs from all containers). Then open your browser to:

**http://localhost:3000**

## Your Task

The application has several bugs that need to be fixed. Your goal is to:

1. **Identify** the bugs through debugging
2. **Fix** the bugs in the code
3. **Test** that your fixes work

## Debugging Tools

### Browser Tools
- **Console**: Check for JavaScript errors and logs
- **Network Tab**: Monitor API requests and responses
- **React DevTools**: Inspect component state and props (optional)

### Backend Logs
View logs for each service:

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend-python
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f backend-python
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
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styles
│   │   └── index.js        # Entry point
│   └── package.json
│
├── backend-python/
│   ├── app.py              # FastAPI server with task/search/analytics endpoints
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
- **Backend Python**: Uses uvicorn with --reload flag

No need to rebuild containers after code changes!

## Restarting Services

If you need to restart a specific service:

```bash
# Restart a service
docker-compose restart frontend
docker-compose restart backend-python

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
6. Fix bugs one at a time and test each fix
7. Some bugs may be related - fixing one might reveal another

## Expected Behavior

When working correctly, the application should:
- Load without console errors
- Display a list of users in the dropdown
- Show tasks, stats, and analytics for the selected user
- Allow searching tasks with partial text matches
- Update the UI immediately when tasks are modified or deleted
- Show the correct completion percentage
- Display high-priority tasks correctly

## Questions?

If you have questions about the expected behavior or need clarification, please ask your interviewer.

Good luck!
