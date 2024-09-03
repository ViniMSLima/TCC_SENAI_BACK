const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // Add mongoose for MongoDB
require("dotenv").config();

const app = express();

// MongoDB connection
async function connectToDB() {
  try {
    await mongoose.connect("mongodb+srv://vinisarylima:U2FsdGVkX19KiK2gxjgwptjL1MM7axuytBzh2cvkNUc=@tcc.wvxjo.mongodb.net/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}

connectToDB(); // Call the function to connect to MongoDB

function setCorsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}

app.use(setCorsHeaders);

require("./startup/routes")(app);

const port = process.env.PORT || 8080; // Use the PORT environment variable if available
app.listen(port, () => console.log(`Server is running on port ${port}`));
