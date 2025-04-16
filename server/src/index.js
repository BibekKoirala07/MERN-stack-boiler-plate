const connectDB = require("./db/db");

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    process.on("uncaughtException", (err) => {
      console.error(`Error: ${err.message}`);
      console.log("Shutting down the server due to Uncaught Exception");
      process.exit(1);
    });

    process.on("unhandledRejection", (err) => {
      console.error(`Error: ${err.message}`);
      console.log(
        "Shutting down the server due to Unhandled Promise Rejection"
      );

      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((error) => {
    console.log("Error while connecting to database:", error);
  });
