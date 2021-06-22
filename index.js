const express = require('express'); 
const cors = require("cors");
const {routeNotFound, errorHandler} = require("./middlewares");


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello Express app!')
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