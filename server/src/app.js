const express = require("express");
const cors = require("cors");
console.log("real", process.env.PORT);

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

console.log("process.env", process.env.NODE_ENV);

const app = express();

// this enable hackers to not know about the technology we are using
app.disable("x-powered-by"); // less hackers know about our stack

// helmet
const helmet = require("helmet");
const allRoutes = require("./routes/api");
const errorHandler = require("./middlewares/errorHandler");
const { NotFoundException } = require("./utils/errors/HttpExceptions");
// this returs a function and we would like to use it for our middleware
// it sets the header to our request
// it is better to use helmet at the top of middleware so that security headers
// become set at the start of the response
app.use(helmet()); // add security
// check in postman, without helment we would normally have 7-10 headers while with helment
// we would have 15-20 header added such as Cross Origin Resource policy, Referrer policy etc
// rate limit
// rate limti is a function . when we call that function it is going to return another function
// that is going to be middleware function
// const rateLimit = require("express-rate-limit");
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 500, // limit each IP to 100 requests per windowMs
//   handler: (req, res) => {
//     res.status(429).json({
//       success: false,
//       statusCode: 429,
//       error: "Too many requests. Please try again later.",
//     });
//   },
// });

// app.use("/api", limiter); // works on all api routes that starts with /api
// it helps in preventing Brute force attacks and denail of Service

// Middleware
app.disable("x-powered-by"); // Hide stack information
// app.use(cookieParser()); // decipher cookie in middlewares
app.use(express.json()); // it is necessary to set it to prevent DOS attacks
// app.use(express.json({ limit: "10kb" })); // it is necessary to set it to prevent DOS attacks

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/v1", allRoutes);

app.use(errorHandler);

app.use((req, res, next) => {
  console.log(`No route matched for ${req.method} ${req.originalUrl}`);
  throw new NotFoundException("Route Not Found");
});

module.exports = app;
