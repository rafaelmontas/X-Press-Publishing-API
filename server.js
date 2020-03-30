const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const errorhandler = require("errorhandler");
const apiRouter = require("./api/api");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.use("/api", apiRouter);

app.use(errorhandler());


app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});

module.exports = app;