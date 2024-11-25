import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, score, lives, duration } = req.body;

    try {
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

      connection.end();
      res.status(200).json({ message: "Score saved successfully!" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save score." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
