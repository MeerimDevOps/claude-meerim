const express = require('express');
const { Pool } = require('pg');
const client = require('prom-client');

client.collectDefaultMetrics();
const app = express();

const pool = new Pool({
  host: 'database-1.cdoa24eaqy1p.us-east-2.rds.amazonaws.com',
  user: 'postgres',
  password: 'J9eZcO-xMc9K[vUs:Gs7<5#qQ#i]',
  database: 'postgres',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('Backend Service Running');
});

app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      message: 'Database Connected Successfully',
      database_time: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
app.get('/api/courses', async (req, res) => {

});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Backend running on port 3000');
});

