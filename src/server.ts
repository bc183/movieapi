import dotenv from "dotenv";
import app from "./app";
import { checkEnvironment, Environment, getEnv } from "./utils";

dotenv.config();

checkEnvironment();

const PORT = getEnv(Environment.PORT);

app.listen(PORT, () => {
    // server started.
    console.log(`Server started and listening and running on port ${PORT}`);
});
