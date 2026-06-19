const express = require('express');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  host: 'database-1.cncau0ouey06.us-east-2.rds.amazonaws.com',
  user: 'postgres',
  password: 'J9eZcO-xMc9K[vUs:Gs7<5#qQ#i]',
  database: 'postgres',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
}
});

app.get('/', (req, res) => {
  res.send('Course Service Running');
});

app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      service: 'course-service',
      message: 'Course Service connected to PostgreSQL',
      database_time: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      service: 'course-service',
      error: err.message
    });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Course service running on port 3000');
});
