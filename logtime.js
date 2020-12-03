const fs = require("fs");
const database = require('./shared/database');

database.Student.find({ logtime: { $gte: 14400000 } }).then(docs => {


	docs.forEach(student => {
		console.log("student")
		let login = student.ft_login;
		if (!login)
			login = student.discord_nick;
		fs.appendFileSync("challenger.txt", login + "\n");
		if (student.logtime >= 57600000)
			fs.appendFileSync("warrior.txt", login + "\n");
	});

	process.exit(0);

}).catch(err => {

	console.log(err);
	process.exit(1);

})