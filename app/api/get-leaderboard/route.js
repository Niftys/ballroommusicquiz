import mysql from "mysql2/promise";

export async function GET(req) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.RDS_HOST,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DB_NAME,
    });

    const [rows] = await connection.execute(
      "SELECT name, score, lives, duration FROM leaderboard ORDER BY score DESC LIMIT 10"
    );

    await connection.end();

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch leaderboard data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
