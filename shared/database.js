// dependencies
const mongoose = require('mongoose');
const log = require('./log');
const config = require('../config.json');



// mongoose connection
mongoose
	.connect(config.shared.uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
	.catch(err => {
		log("could not connect to database: " + err);
		process.exit(1);
	});



// student shema
const StudentSchema = new mongoose.Schema({

	ft_id: { type: String },

	ft_login: { type: String },

	discord_id: { type: String },

	discord_tag: { type: String },

	discord_nick: { type: String },

	admin: { type: Boolean, default: false },

	logtime: { type: Number, default: 0 }

}, { collection: 'students' });

const Student = mongoose.model('Student', StudentSchema);



// exports
module.exports.Student = Student;
module.exports.connection = mongoose.connection;
