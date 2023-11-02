import {db} from "../configs";
import userSeeder from "@/seeders/UserSeeder";
import categorySeeder from "@/seeders/CategorySeeder";

async function seed() {
    try {
        await db.connect();
        await userSeeder()
        await categorySeeder()
        console.log("Seed done.");
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

seed();
