import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
export const collectionName = process.env.COLLECTION_NAME;

if (!url) {
    throw new Error("Missing MONGODB_URI environment variable");
}

const client = new MongoClient(url);


export const connection = async ()=>{

    const connect = await client.connect();
    const db = await connect.db(dbName);
    return db;
}