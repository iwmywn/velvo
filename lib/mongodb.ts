import {
  Collection,
  MongoClient,
  MongoClientOptions,
  OptionalId,
} from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

if (!globalThis._mongoClientPromise) {
  globalThis._mongoClientPromise = new MongoClient(uri, options).connect();
}

const clientPromise: Promise<MongoClient> = globalThis._mongoClientPromise;

async function connectToDatabase() {
  const dbName = process.env.DB_NAME;
  if (!dbName) {
    throw new Error("Environment variable DB_NAME is not set");
  }

  const client = await clientPromise;
  return client.db(dbName);
}

export async function collection<T>(
  collectionName: string,
): Promise<Collection<OptionalId<T>>> {
  const db = await connectToDatabase();
  return db.collection<OptionalId<T>>(collectionName);
}

export default clientPromise;
