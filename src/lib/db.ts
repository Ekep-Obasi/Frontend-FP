import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.warn(
    "MONGODB_URI is not set. API endpoints depending on DB will fail.",
  );
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

if (uri) {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {});
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

export async function getDb() {
  if (!clientPromise) throw new Error("MONGODB_URI not configured");
  const cli = await clientPromise;
  return cli.db(process.env.MONGODB_DB || "smart-travel-itineraries");
}
