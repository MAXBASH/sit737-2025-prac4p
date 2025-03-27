const express = require("express");
const winston = require("winston");
const app = express();
const PORT = process.env.PORT || 3000;

//Configuring Winston Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "calculator-microservice" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

app.use(express.json());

//Logging request details
app.use((req, res, next) => {
  logger.log({
    level: "info",
    message: `Incoming ${req.method} request to ${req.url}`,
    metadata: {
      ip: req.ip,
      headers: req.headers,
      body: req.body,
    },
  });
  next();
});

//Validate input numbers
function validateNumbers(num1, num2) {
  if (num1 === undefined || num2 === undefined) {
    throw new Error("Both numbers are required");
  }

  const parsedNum1 = Number(num1);
  const parsedNum2 = Number(num2);

  if (isNaN(parsedNum1) || isNaN(parsedNum2)) {
    throw new Error("Invalid input - Both parameters must be numbers");
  }

  return [parsedNum1, parsedNum2];
}

//Addition
app.get("/add", (req, res) => {
  try {
    const { num1, num2 } = req.query;
    const [a, b] = validateNumbers(num1, num2);
    const result = a + b;

    logger.log({
      level: "info",
      message: `New Addition operation requested: ${a} + ${b} = ${result}`,
    });

    res.json({ result });
  } catch (error) {
    logger.log({
      level: "error",
      message: error.message,
    });
    res.status(400).json({ error: error.message });
  }
});

//Subtraction
app.get("/subtract", (req, res) => {
  try {
    const { num1, num2 } = req.query;
    const [a, b] = validateNumbers(num1, num2);
    const result = a - b;

    logger.log({
      level: "info",
      message: `New Subtraction operation requested: ${a} - ${b} = ${result}`,
    });

    res.json({ result });
  } catch (error) {
    logger.log({
      level: "error",
      message: error.message,
    });
    res.status(400).json({ error: error.message });
  }
});

//Multiplication
app.get("/multiply", (req, res) => {
  try {
    const { num1, num2 } = req.query;
    const [a, b] = validateNumbers(num1, num2);
    const result = a * b;

    logger.log({
      level: "info",
      message: `New Multiplication operation requested: ${a} * ${b} = ${result}`,
    });

    res.json({ result });
  } catch (error) {
    logger.log({
      level: "error",
      message: error.message,
    });
    res.status(400).json({ error: error.message });
  }
});

//Division
app.get("/divide", (req, res) => {
  try {
    const { num1, num2 } = req.query;
    const [a, b] = validateNumbers(num1, num2);

    if (b === 0) {
      throw new Error("Division by zero is not allowed");
    }

    const result = a / b;

    logger.log({
      level: "info",
      message: `Division operation: ${a} / ${b} = ${result}`,
    });

    res.json({ result });
  } catch (error) {
    logger.log({
      level: "error",
      message: error.message,
    });
    res.status(400).json({ error: error.message });
  }
});

//Error handler
app.use((err, req, res, next) => {
  logger.log({
    level: "error",
    message: `Unhandled error: ${err.message}`,
    metadata: {
      stack: err.stack,
    },
  });
  res.status(500).json({ error: "Internal Server Error" });
});

//Starting server
app.listen(PORT, () => {
  logger.log({
    level: "info",
    message: `Calculator microservice running on port ${PORT}`,
  });
  console.log(`Server is running on port ${PORT}`);
});
