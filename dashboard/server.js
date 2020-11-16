// dependencies
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const exphbs = require('express-handlebars');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const passport = require('passport');
const FortyTwoStrategy = require('passport-42').Strategy;
const db = require('../shared/database');
const config = require('../config.json');



// passport setup
passport.use(new FortyTwoStrategy({
	clientID: config.shared.clientId,
	clientSecret: config.shared.clientSecret,
	callbackURL: config.dashboard.callbackUrl,
}, (accessToken, refreshToken, profile, cb) => {

	const p = JSON.parse(profile._raw);

	if (p.campus.length > 0 && p.campus[0].id != 12) return cb("You are not part of the 19 campus", false);

	db.Student.findOne({ $or: [{ ft_id: p.id }, { discord_nick: p.login }] }) // find user in database
		.then(student => {

			if (student) { // user already exists

				student.ft_id = p.id;
				student.ft_login = p.login;
				student.save()
					.then(s => {
						return cb(null, s);
					})
					.catch(err => {
						return cb("Server error (code 1)", false);
					});

			} else { // user does not exist yet

				const isAdmin = (p['staff?'] || (p.groups.length > 0 && p.groups.find((val) => { return val.id == 19; }) != undefined)); // check if user is tutor or staff

				db.Student.create({ ft_id: p.id, ft_login: p.login, admin: isAdmin })
					.then(s => {
						return cb(null, s);
					})
					.catch(err => {
						console.log(err)
						return cb("Server error (code 2)", false);
					});

			}
		})
		.catch(err => {
			return cb("Server error (code 0)", false);
		});

}));

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});



// server setup
const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(session({
	secret: config.dashboard.sessionSecret,
	store: new MongoStore({
		collection: "sessions",
		mongooseConnection: db.connection
	}),
	resave: false,
	saveUninitialized: true
}));

server.use(passport.initialize());
server.use(passport.session());

server.engine('.hbs', exphbs({ extname: '.hbs', partialsDir: path.join(__dirname, 'views', 'assets') }));
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', '.hbs');

server.use('/public', express.static(path.join(__dirname, 'public')));
server.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

server.get('/auth', (req, res) => {
	if (req.isAuthenticated()) return res.redirect('/');
	res.render("auth.hbs");
});

server.get('/auth/login', passport.authenticate('42'));

server.get('/auth/callback', passport.authenticate('42', { failureRedirect: '/auth' }), (req, res) => {
	res.redirect("/");
});

server.get('/auth/logout', (req, res) => {
	if (req.isAuthenticated()) req.session.destroy();
	res.redirect('/');
});

server.use('/', require('./routes/index'));

server.use((req, res) => {
	res.status(404).send("not found");
});

server.listen(config.dashboard.port);
