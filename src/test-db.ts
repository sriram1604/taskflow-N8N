
import "dotenv/config";
import db from "./lib/db";

async function main() {
  try {
    console.log("Attempting to connect to database...");
    console.log("URL available:", !!process.env.DATABASE_URL);
    const userCount = await db.user.count();
    console.log(`Successfully connected. User count: ${userCount}`);
  } catch (e) {
    console.error("Error connecting:", e);
    process.exit(1);
  }
}

main();
