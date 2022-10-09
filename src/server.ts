import dotenv from "dotenv";
import app from "./app";
import db from "./db";
import { checkEnvironment, Environment, getEnv } from "./utils";

dotenv.config();

checkEnvironment();

const PORT = getEnv(Environment.PORT);

app.listen(PORT, async () => {
    // connect to db
    await db.$connect();
    // server started.
    console.log(`Server started and listening and running on port ${PORT}`);
});
