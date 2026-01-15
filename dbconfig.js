import { MongoClient } from "mongodb";
import { MONGODB_URI, DB_NAME, COLLECTION_NAME } from "./config/env.js";

const url = MONGODB_URI;
const dbName = DB_NAME;
export const collectionName = COLLECTION_NAME;

if (!url) {
    throw new Error("Missing MONGODB_URI environment variable");
}

const client = new MongoClient(url);


export const connection = async ()=>{

    const connect = await client.connect();
    const db = await connect.db(dbName);
    return db;
}