import dotenv from "dotenv";
import express from "express";
import sequelize from "./config/database.js";
import "./models/index.js";
import userRouter from "./routes/user.routes.js";



const main = async() => {
  const app = express();

  app.use(express.json());
  app.use("/api", userRouter);

  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: true });

    console.log("Tables are created");
  } catch (error) {
    console.error("Database error:", error);
  }

  server.listen(3000, () => {
    console.log(`Server is running on port http://localhost:3000`);
  });
}

main().catch(err => {
  console.error("Error:", err);
});
