const { MongoClient } = require("mongodb");
const winston = require("winston");

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Connection URI
const uri =
  "mongodb://mongo1:30001,mongo2:30002,mongo3:30003/Ronaldo?replicaSet=MyReplicaDb";
const username = "admin";
const password = "admin";

// Retry settings
const maxRetries = 3;
let retryCount = 0;

// Function to connect to MongoDB and perform the query
async function queryDatabase() {
  try {
    const client = new MongoClient(uri, {
      auth: { username: username, password: password },
    });

    await client.connect();

    const database = client.db("Ronaldo");
    const collection = database.collection("Stats");

    const result = await collection.find({}).toArray();

    logger.info(JSON.stringify(result, null, 2)); // Pretty print JSON
    logger.info("--------------");
    logger.info(uri);

    // Close the connection
    await client.close();

    // Reset retry count on successful query
    retryCount = 0;
  } catch (error) {
    logger.error(`Error querying database: ${error.message}`);

    // Retry logic
    if (retryCount < maxRetries) {
      retryCount++;
      logger.info(`Retrying... (Attempt ${retryCount})`);
      setTimeout(queryDatabase, 1000); // Retry after 1 second
    } else {
      logger.error("Max retry attempts reached. Exiting...");
      process.exit(1);
    }
  }
}

// Call the queryDatabase function every second
setInterval(queryDatabase, 2000);
