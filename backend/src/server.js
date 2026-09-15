import dotenv from "dotenv";
import sequelize from "./config/database.js";
import "./modules/index.js";
import app from "./app.js";
import path from "path";

dotenv.config({ path: path.join(import.meta.dirname, '../.env') }); 
const PORT = process.env.PORT || 3000;

const main = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected");

        await sequelize.sync();

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
