// dependencies
const express = require('express');
const router = express.Router();
const countdown = require('countdown');
const db = require('../../shared/database');
const config = require('../../config.json');

router.get('/', isAuthenticated, (req, res) => {
	var description, count;
	if (Date.now() < config.shared.eventStart) {
		description = "starting in";
		count = countdown(null, config.shared.eventStart, countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, 4, 0).toString();
	} else if (Date.now() < config.shared.eventStart + 86400000) {
		description = "ending in";
		count = countdown(null, config.shared.eventStart + 86400000, countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, 4, 0).toString();
	} else {
		description = "finished since";
		count = countdown(config.shared.eventStart + 86400000, null, countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, 4, 0).toString();

	}
	res.render('index.hbs', { isAdmin: req.user.admin, countdownDescription: description, countdown: count });
});

router.get('/planning', isAuthenticated, (req, res) => {
	res.render('planning.hbs', { isAdmin: req.user.admin });
});

router.get('/stats', isAuthenticated, (req, res) => {
	db.Student.findOne({ft_id: req.user.ft_id})
		.then(user => {
			res.render('stats.hbs', { isAdmin: user.admin, login: user.ft_login, discord: user.discord_tag, logtime: countdown(0, user.logtime, countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, 4, 0).toString() });
		})
		.catch(err => {
			res.send("Server error")
		}
		);
});

router.get('/admin', isAdmin, (req, res) => {
	var students = [];
	db.Student.find()
		.then(docs => {
			docs.forEach(d => {
				console.log
				students.push({
					login: d.ft_login,
					discord: d.discord_tag,
					logtime: countdown(0, d.logtime, countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, 4, 0).toString()
				});
			});
			res.render('admin.hbs', { isAdmin: req.user.admin, student: students });
		})
		.catch(err => {
			res.send("server error");
		});
});

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) next();
	else res.redirect('/auth');
}

function isAdmin(req, res, next) {
	if (req.isAuthenticated() && req.user.admin) next();
	else res.redirect('/');
}

module.exports = router;

