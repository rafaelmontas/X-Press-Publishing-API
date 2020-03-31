const express = require("express");
const seriesRouter = express.Router();

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(process.env.TEST_DATABASE || "./database.sqlite");

// Middleware
seriesRouter.param("seriesId", (req, res, next, seriesId) => {
	db.get("SELECT * FROM Series WHERE id = $seriesId", {$seriesId: seriesId}, (err, series) => {
		if(err) {
			next(err);
		} else if(series) {
			req.series = series;
			next();
		} else {
			res.status(404).send();
		}
	});
});

// Routes
seriesRouter.get("/", (req, res, next) => {
	db.all("SELECT * FROM Series", (err, series) => {
		if(err) {
			next(err);
		} else {
			res.status(200).json({ series: series });
		}
	});
});

seriesRouter.get("/:seriesId", (req, res, next) => {
	res.status(200).json({ series: req.series });
});

seriesRouter.post("/", (req, res, next) => {
	const name = req.body.series.name;
	const description = req.body.series.description;
	if(!name || !description) {
		return res.status(400).send();
	}
	db.run("INSERT INTO SERIES (name, description) VALUES ($name, $description)", {$name: name, $description: description}, function(err) {
		if(err) {
			next(err);
		} else {
			db.get(`SELECT * FROM Series WHERE id = ${this.lastID}`, (err, series) => {
				res.status(201).json({ series: series });
			});
		}
	});
});

seriesRouter.put("/:seriesId", (req, res, next) => {
	const name = req.body.series.name;
	const description = req.body.series.description;
	if(!name || !description) {
		return res.status(400).send();
	}
	db.run("UPDATE Series SET name = $name, description = $description WHERE id = $seriesId", {$name: name, $description: description, $seriesId: req.params.seriesId}, (err) => {
		if(err) {
			next(err);
		} else {
			db.get(`SELECT * FROM Series WHERE id = ${req.params.seriesId}`, (err, series) => {
				res.status(200).json({ series: series });
			})
		}
	});
});

module.exports = seriesRouter;