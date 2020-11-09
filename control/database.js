// dependencies
const mongoose = require('mongoose');
const config = require('../config.json');



// mongoose connection
mongoose
	.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
	.catch(err => log("could not connect to database"));



// student shema
const StudentSchema = new mongoose.Schema({

	ft_id: { type: String },
	
	ft_login: { type: String },

	discord_id: { type: String },

	discord_tag: { type: String },

	discord_nick: { type: String },

	admin: { type: Boolean, default: true },

	logtime: { type: Number, default: 0 }

}, { collection: 'students' });

const Student = mongoose.model('Student', StudentSchema);



// exports
module.exports.Student = Student;
module.exports.connection = mongoose.connection;
