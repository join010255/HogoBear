import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// T3rif __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// St3ml __dirname hna
dotenv.config({ path: path.join(__dirname, '../.env') }); 

import sequelize from "./config/database.js";
import "./modules/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const main = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected");

        await sequelize.sync({alter : true});

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Database or server startup error:", error);
    }
};

main().catch((err) => {
    console.error("Error:", err);
});