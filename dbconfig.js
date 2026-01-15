import { MongoClient } from "mongodb";

const url ="mongodb+srv://shahidhammad179_db_user:NodejsTesting@clusternodejs.tdkxdo5.mongodb.net/?appName=ClusterNodejs";
const dbName ="todo-backend";
export const collectionName ="todo";
const client = new MongoClient(url);


export const connection = async ()=>{

    const connect = await client.connect();
    const db = await connect.db(dbName);
    return db;
}