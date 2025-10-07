export async function GET(req) {
  try {
    const bucketUrl = "https://bmqsongs.s3.us-east-2.amazonaws.com/audio/music-files.json";
    console.log("Fetching music files from:", bucketUrl);
    
    const response = await fetch(bucketUrl);

    if (!response.ok) {
      console.error(`S3 fetch failed: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch music files: ${response.status} ${response.statusText}`);
    }

    const musicFiles = await response.json();
    console.log("Music files loaded successfully. Genres:", Object.keys(musicFiles));

    return new Response(JSON.stringify(musicFiles), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300" // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("Error fetching music files:", error);
    
    // Fallback: Return empty structure to prevent crashes
    const fallbackData = {
      "waltz": [],
      "foxtrot": [],
      "tango": [],
      "quickstep": [],
      "viennese-waltz": [],
      "cha-cha": [],
      "rumba": [],
      "samba": [],
      "jive": [],
      "paso-doble": []
    };
    
    return new Response(JSON.stringify(fallbackData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}