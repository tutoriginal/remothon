// dependencies
const fs = require('fs');
const util = require('util');
const config = require('../config.json');



// logging file
var log_file = fs.createWriteStream(__dirname + '/../logs/errors.log', { flags: 'w' });

// logging function
function log(data) {

	if (config.debug) process.stdout.write(util.format('[' + new Date() + '] - ' + data) + '\n');
	else log_file.write(util.format('[' + new Date() + '] - ' + data) + '\n');

}

module.exports = log;
