const config = require('./config.json');

if (config.control.run) require('./control/main');
if (config.dashboard.run) require('./dashboard/server');
