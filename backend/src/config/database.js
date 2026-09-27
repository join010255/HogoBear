import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 1. T3rif __dirname bach tkhdm f Node.js v18
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. St3ml __dirname f بلاصة import.meta.dirname
dotenv.config({ path: path.join(__dirname, "../../.env") });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
    }
);

export default sequelize;