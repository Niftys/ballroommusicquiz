import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export async function POST(req) {
  try {
    const { name, score, lives, duration } = await req.json();

    const connection = await mysql.createConnection({
      host: process.env.RDS_HOST,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DB_NAME,
    });

    await connection.execute(
      "INSERT INTO leaderboard (name, score, lives, duration) VALUES (?, ?, ?, ?)",
      [name, score, lives, duration]
    );

    await connection.end();
    return new Response(JSON.stringify({ message: "Score saved successfully!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Failed to save score." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
