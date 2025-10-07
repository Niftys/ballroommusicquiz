import { db } from "../../../lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export async function GET(req) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const livesFilter = searchParams.get('lives');
    const durationFilter = searchParams.get('duration');

    // Create base query
    let q = query(
      collection(db, "leaderboard"),
      orderBy("score", "desc"),
      limit(50)
    );

    // Get all scores
    const querySnapshot = await getDocs(q);
    let scores = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scores.push({
        id: doc.id,
        name: data.name,
        score: data.score,
        lives: data.lives,
        duration: data.duration,
        timestamp: data.timestamp
      });
    });

    // Apply filters
    if (livesFilter && livesFilter !== "all") {
      if (livesFilter === "unlimited") {
        scores = scores.filter(score => score.lives === -1);
      } else {
        scores = scores.filter(score => score.lives === parseInt(livesFilter));
      }
    }

    if (durationFilter && durationFilter !== "all") {
      scores = scores.filter(score => score.duration === parseInt(durationFilter));
    }

    // Sort by score (descending) and limit to top 10
    scores = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return new Response(JSON.stringify(scores), {
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
