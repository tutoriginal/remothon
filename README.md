<h1 align="center"><code>Remothon</code></h1>

<div align="center">
	<sub>Created by <a href="https://github.com/30c27b">Antoine Coulon</a></sub>
</div>
<div align="center">
	<sub>For <a href="https://github.com/tutoriginal">Tutoriginal</a></sub>
</div>

---

## Description

This project saves the logtime of discord users and provides a web interface for the **Remothon** event.

## Requirements

* A [Discord application](https://discord.com/developers/applications) configured with a bot.
* A [42 Intranet API](https://api.intra.42.fr) application
* A [MongoDB](https://www.mongodb.com/) database
* [Node.js](https://nodejs.org/)

## Installation

1. Clone the repository
```shell
$ git clone https://github.com/tutoriginal/remothon.git
```

2. Install npm dependencies
```shell
$ cd remothon
$ npm install
```

3. Create a config from the template
```shell
$ cp ./config-template.json ./config.json
```

4. Fill the config file as follows
```js
{
	"shared": {
		"uri": "", // MongoDB connection URI
		"clientId": "", // 42 API application client ID
		"clientSecret": "", // 42 API application client secret
		"eventStart": 0 // start of the event in epoch time (milliseconds)
	},
	"control": {
		"run": true, // set to false to only run the web interface
		"token": "", // Discord application bot token
		"guild": "", // Discord server ID (snowflake ID)
		"commandChannel": "", // Discord commands channel ID (snowflake ID)
		"broadcastChannel": "", // Discord announcements channel ID (snowflake ID)
		"commandPrefix": "sudo"
	},
	"dashboard": {
		"run": true, // set to false to only run the discord bot
		"port": 8080, // web interface port
		"callbackUrl": "http://localhost:8080/auth/callback", // 42 API callback URL
		"sessionSecret": "" // replace with random string
	}
}
```

5. Run the application
```shell
$ node ./index.js
```

# License

This reposidory is distributed under the [ISC license](/LICENSE).

