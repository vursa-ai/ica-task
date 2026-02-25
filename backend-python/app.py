from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import logging
from typing import Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    conn = psycopg2.connect(
        os.environ.get('DATABASE_URL'),
        cursor_factory=RealDictCursor
    )
    return conn

@app.get('/health')
def health():
    return {'status': 'ok', 'service': 'python'}

@app.get('/api/users')
def get_users():
    try:
        logger.info('Fetching all users...')
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM users ORDER BY id')
        users = cur.fetchall()
        cur.close()
        conn.close()
        return users
    except Exception as e:
        logger.error(f'Error fetching users: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to fetch users')

@app.get('/api/users/{user_id}')
def get_user(user_id: int):
    try:
        logger.info(f'Fetching user with id: {user_id}')
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM users WHERE id = %s', (user_id,))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if not user:
            raise HTTPException(status_code=404, detail='User not found')

        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f'Error fetching user: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to fetch user')

@app.get('/api/users/{user_id}/tasks')
def get_user_tasks(user_id: int):
    try:
        logger.info(f'Fetching tasks for user: {user_id}')
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            'SELECT * FROM tasks WHERE user_id = %s ORDER BY priority, created_at DESC',
            (user_id,)
        )
        tasks = cur.fetchall()

        cur.close()
        conn.close()
        return tasks
    except Exception as e:
        logger.error(f'Error fetching tasks: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to fetch tasks')

@app.patch('/api/tasks/{task_id}/status')
def update_task_status(task_id: int, payload: dict):
    try:
        status = payload.get('status')
        logger.info(f'Updating task {task_id} status to: {status}')

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'UPDATE tasks SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *',
            (status, task_id),
        )
        updated_task = cur.fetchone()

        conn.commit()
        cur.close()
        conn.close()

        if not updated_task:
            raise HTTPException(status_code=404, detail='Task not found')

        return updated_task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f'Error updating task: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to update task')

@app.get('/api/users/{user_id}/stats')
def get_user_stats(user_id: int):
    try:
        logger.info(f'Fetching stats for user {user_id}')

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            '''
            SELECT
                COUNT(*) as total_tasks,
                COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
                COUNT(*) FILTER (WHERE status = 'pending') as pending_tasks
            FROM tasks
            WHERE user_id = %s
            ''',
            (user_id,),
        )
        stats = cur.fetchone()
        cur.close()
        conn.close()

        if not stats:
            raise HTTPException(status_code=404, detail='User stats not found')

        return stats
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f'Error fetching user stats: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to fetch stats')

@app.delete('/api/tasks/{task_id}')
def delete_task(task_id: int):
    try:
        logger.info(f'Deleting task: {task_id}')

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM tasks WHERE id = %s RETURNING *', (task_id,))
        conn.commit()
        cur.close()
        conn.close()

        return {'message': 'Task deleted successfully'}
    except Exception as e:
        logger.error(f'Error deleting task: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to delete task')

@app.get('/api/search/tasks')
def search_tasks(
    q: str = Query(default=''),
    user_id: Optional[int] = Query(default=None)
):
    """Search tasks by title or description"""
    try:
        logger.info(f'Searching tasks with query: {q}, user_id: {user_id}')

        conn = get_db_connection()
        cur = conn.cursor()

        sql = "SELECT * FROM tasks WHERE (title LIKE %s OR description LIKE %s)"
        params = [f'%{q}%', f'%{q}%']

        if user_id:
            sql += " AND user_id = %s"
            params.append(user_id)

        sql += " ORDER BY created_at DESC"

        cur.execute(sql, params)
        tasks = cur.fetchall()

        cur.close()
        conn.close()

        return tasks
    except Exception as e:
        logger.error(f'Error searching tasks: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to search tasks')

@app.get('/api/analytics/user/{user_id}')
def get_user_analytics(user_id: int):
    """Get detailed analytics for a user"""
    try:
        logger.info(f'Fetching analytics for user {user_id}')

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute('''
            SELECT
                COUNT(*) as total_tasks,
                COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
                COUNT(*) FILTER (WHERE status = 'pending') as pending_tasks,
                ROUND((COUNT(*) FILTER (WHERE status = 'completed')::numeric /
                       NULLIF(COUNT(*), 0)), 2) as completion_rate
            FROM tasks
            WHERE user_id = %s
        ''', (user_id,))

        analytics = cur.fetchone()

        cur.execute('''
            SELECT priority, COUNT(*) as count
            FROM tasks
            WHERE user_id = %s
            GROUP BY priority
            ORDER BY priority
        ''', (user_id,))

        priority_breakdown = cur.fetchall()

        cur.close()
        conn.close()

        result = dict(analytics)
        result['priority_breakdown'] = priority_breakdown

        return result
    except Exception as e:
        logger.error(f'Error fetching analytics: {str(e)}')
        raise HTTPException(status_code=500, detail='Failed to fetch analytics')

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5000)
