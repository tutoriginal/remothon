// dependencies
const mongoose = require('mongoose');
const config = require('../config.json');



// mongoose connection

mongoose
	.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
	.catch(err => log("could not connect to database"));


// student shema
const StudentSchema = new mongoose.Schema({

	discord_id: { type: String, unique: true, required: true },

	discord_tag: { type: String, required: true },

	login: { type: String, required: true },

	logtime: { type: Number, default: 0 }

}, { collection: 'students' });

const Student = mongoose.model('Student', StudentSchema);

module.exports.Student = Student;