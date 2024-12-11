const fs = require("fs");
const path = require("path");

// Base URL for your S3 bucket
const S3_BASE_URL = "https://bmqsongs.s3.us-east-2.amazonaws.com";

// Local path to your "audio" folder
const LOCAL_AUDIO_DIR = path.resolve(__dirname); // Adjusted to point to "audio" in "public"

function getMusicFiles(folderPath, baseUrl) {
  const musicFiles = {};
  console.log(`Reading directory: ${folderPath}`);

  const items = fs.readdirSync(folderPath, { withFileTypes: true });

  items.forEach((item) => {
    if (item.isDirectory()) {
      const genre = item.name;
      const genrePath = path.join(folderPath, genre);
      console.log(`Processing genre: ${genre}`);
      const files = fs.readdirSync(genrePath).filter((file) => /\.(mp3|wav|ogg)$/i.test(file));

      if (files.length > 0) {
        console.log(`Found files in ${genre}:`, files);
        musicFiles[genre] = files.map(
          (file) => `${baseUrl}/audio/${encodeURIComponent(genre)}/${encodeURIComponent(file)}`
        );
      } else {
        console.log(`No valid audio files found in ${genre}`);
      }
    } else {
      console.log(`Skipping non-directory item: ${item.name}`);
    }
  });

  return musicFiles;
}

try {
  const musicFiles = getMusicFiles(LOCAL_AUDIO_DIR, S3_BASE_URL);
  const outputPath = path.join(__dirname, "music-files.json");

  fs.writeFileSync(outputPath, JSON.stringify(musicFiles, null, 2), "utf-8");
  console.log(`music-files.json generated successfully at ${outputPath}`);
} catch (error) {
  console.error("Error generating music-files.json:", error);
}
