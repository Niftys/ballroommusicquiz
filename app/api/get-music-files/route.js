import { readdirSync, statSync } from "fs";
import path from "path";

// Handle GET requests
export async function GET(req) {
  try {
    const audioDir = path.join(process.cwd(), "public/audio");
    const folders = readdirSync(audioDir, { withFileTypes: true });

    const musicFiles = {};

    folders.forEach((folder) => {
      const folderPath = path.join(audioDir, folder.name);

      // Only process directories
      if (statSync(folderPath).isDirectory()) {
        const files = readdirSync(folderPath)
          .filter((file) => /\.(mp3|wav|ogg)$/i.test(file)) // Include only audio files
          .map((file) => file); // Keep file names
        musicFiles[folder.name] = files;
      }
    });

    return new Response(JSON.stringify(musicFiles), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch music files" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
