import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export async function GET(req) {
  try {
    const db = await mysql.createConnection({
      host: process.env.RDS_HOST,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DB_NAME,
    });

    // Query a random song
    const [rows] = await db.execute('SELECT url, style FROM songs ORDER BY RAND() LIMIT 1');
    await db.end();

    if (rows.length > 0) {
      const song = rows[0];
      // Generate a random start time between 20 and 100 seconds
      const randomStartTime = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
      song.startTime = randomStartTime; // Add startTime to the response
      return new Response(JSON.stringify(song), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'No songs found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('[ERROR] Failed to fetch song:', error);
    return new Response(JSON.stringify({ error: 'Database connection failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}