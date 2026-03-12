-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (username, email) VALUES
    ('john_doe', 'john@example.com'),
    ('jane_smith', 'jane@example.com'),
    ('bob_wilson', 'bob@example.com');

-- Insert sample tasks
INSERT INTO tasks (user_id, title, description, status, priority) VALUES
    -- John Doe's tasks (user_id = 1) - 8 tasks
    (1, 'Complete project proposal', 'Write and submit the Q1 project proposal', 'pending', 1),
    (1, 'Review code changes', 'Review PR #123 for the authentication module', 'completed', 2),
    (1, 'Update documentation', 'Add API documentation for new endpoints', 'pending', 3),
    (1, 'Set up CI/CD pipeline', 'Configure GitHub Actions for automated testing', 'pending', 1),
    (1, 'Database migration', 'Migrate user data to new schema', 'completed', 1),
    (1, 'Write unit tests', 'Add tests for the payment module', 'pending', 2),
    (1, 'Code review for Sarah', 'Review her refactoring PR', 'pending', 2),
    (1, 'Security audit', 'Review authentication flow for vulnerabilities', 'pending', 1),

    -- Jane Smith's tasks (user_id = 2) - 6 tasks
    (2, 'Fix bug in login flow', 'Users cannot log in with special characters in password', 'pending', 1),
    (2, 'Deploy to staging', 'Deploy latest changes to staging environment', 'completed', 2),
    (2, 'Design system update', 'Update color palette for accessibility', 'pending', 1),
    (2, 'Performance optimization', 'Reduce bundle size by 30%', 'pending', 2),
    (2, 'API rate limiting', 'Implement rate limiting for public endpoints', 'completed', 1),
    (2, 'Mobile responsive fixes', 'Fix layout issues on tablet devices', 'pending', 3),

    -- Bob Wilson's tasks (user_id = 3) - 5 tasks
    (3, 'Team meeting', 'Quarterly planning meeting', 'pending', 1),
    (3, 'Onboard new developer', 'Help Alex get set up with the codebase', 'completed', 1),
    (3, 'Infrastructure review', 'Evaluate AWS costs and optimize', 'pending', 2),
    (3, 'Update dependencies', 'Upgrade React and related packages', 'pending', 2),
    (3, 'Write technical spec', 'Document the new notification system', 'pending', 1);
