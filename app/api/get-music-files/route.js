export async function GET(req) {
  try {
    const bucketUrl = "https://bmqsongs.s3.us-east-2.amazonaws.com/audio/music-files.json";
    const response = await fetch(bucketUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch music files: ${response.statusText}`);
    }

    const musicFiles = await response.json();

    return new Response(JSON.stringify(musicFiles), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching music files:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch music files" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
