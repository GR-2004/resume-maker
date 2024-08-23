import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import app from "./app.js";

const PORT = process.env.PORT || 3000;

import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// import { connectDB } from "./db/index.db.js";.


// connectDB()
//   .then(() => {
    // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.log("MongoDB connection failed", err);
//   });
