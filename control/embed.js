// Dependencies
const discord = require("discord.js");



// discord message embeds
module.exports.errorEmbed = (message) => {
	return new discord.MessageEmbed({
		"color": 16711680,
		"fields": [
			{
				"name": "🚫 Error",
				"value": "**" + message + "**"
			},
			{
				"name": "Need help ?",
				"value": "*type `sudo help` to see all available commands*"
			}
		]
	});
}

module.exports.helpEmbed = (cmdList) => {
	return new discord.MessageEmbed({
		"title": "Commands:",
		"description": "Type `sudo [command] [arguments]` to call a command",
		"color": 16776958,
		"fields": cmdList
	});
}

module.exports.pingEmbed = () => {
	return new discord.MessageEmbed({
		"color": 2096896,
		"title": "🏓 Pong !"
	});
}

module.exports.broadcastEmbed = (msg, author, timestamp) => {
	return new discord.MessageEmbed({
		"title": "Announcement",
		"description": msg,
		"color": 16776958,
		"footer": {
			"text": author
		},
		"timestamp": new Date(timestamp).toISOString()
	});
}

