// dependencies
const util = require('util');



// logging function
function log(data) {

	process.stdout.write(util.format('[' + new Date() + '] - ' + data) + '\n');

}

module.exports = log;
