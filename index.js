const express = require('express');
const cors = require("cors");
const { routeNotFound, errorHandler } = require("./middlewares");
const { connectToDatabase } = require("./db/db-connection");
const { usersRouter, postsRouter } = require("./routes");


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectToDatabase();

app.use("/users", usersRouter);
app.use("/posts", postsRouter);


app.get('/', (req, res) => {
  res.send('Backend API for Jarvis Share social media application')
});

/**
 * 404 Router Handler.
 * Do not move, this needs to be the last route.
 */
app.use(routeNotFound);

/**
 *Error Handler
 */
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});