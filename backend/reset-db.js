import sequelize from "./src/config/database.js";
import "./src/modules/index.js";

async function resetDB() {
    try {
        await sequelize.authenticate();
        console.log("Connected to DB.");
        await sequelize.sync({ force: true });
        console.log("Database tables dropped and re-created successfully!");
    } catch (e) {
        console.error("Failed:", e);
    } finally {
        process.exit();
    }
}

resetDB();
