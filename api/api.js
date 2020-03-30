const express = require("express");
const apiRouter = express.Router();
const artistsRouter = require("./artists.js");

apiRouter.use("/artists", artistsRouter);

module.exports = apiRouter;