import { db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const { name, score, lives, duration } = await req.json();

    // Validate input
    if (!name || typeof score !== 'number' || typeof lives !== 'number' || typeof duration !== 'number') {
      return new Response(JSON.stringify({ error: "Invalid input data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Add score to Firestore
    const docRef = await addDoc(collection(db, "leaderboard"), {
      name: name.trim(),
      score: score,
      lives: lives,
      duration: duration,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });

    console.log("Score saved with ID:", docRef.id);

    return new Response(JSON.stringify({ 
      message: "Score saved successfully!",
      id: docRef.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Firestore error:", error);
    return new Response(JSON.stringify({ error: "Failed to save score." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
