import {config as loadEnv} from "dotenv";
import {connect as connectToMongodb, set} from "mongoose";
import logger from "./Logger";

loadEnv();

export async function connect(debug = false) {
    try {
        await connectToMongodb(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.DB_NAME
        })
        console.info("Database - Connect successfully !!!");
        set("debug", debug);
    } catch (error) {
        console.error("Database - Connect failure!!!");
        logger.error(`${error}`);
    }
}
