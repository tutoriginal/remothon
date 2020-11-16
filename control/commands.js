// dependencies
const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const embed = require('./embed');



// commands router
function commandRouter(message) {

	if (message.channel.id != config.control.commandChannel) { return; }

	if (!message.content.startsWith(config.control.commandPrefix)) { return; }

	try {

		const args = message.content.slice(config.control.commandPrefix.length).split(' ');
		args.shift();

		if (args.length < 1)
			throw new Error("Command not specified");

		let cmd = commands.find(c => {
			return c.name == args[0].toLowerCase();
		});

		if (!cmd)
			throw new Error("`" + args[0] + "` is not a valid command");

		if (cmd.requiredRole && !message.member.roles.find('id', cmd.requiredRole))
			throw new Error("You do not have the permission to use this command");

		args.shift();

		if (cmd.requiredArgs != null && cmd.requiredArgs != args.length) {
			throw new Error("Invalid number of arguments");
		}

		cmd.execute(message, args, err => {

			if (err) throw new Error(err);
			message.react('✅');

		});

	}
	catch (err) {

		message.react('🚫');
		message.channel.send(embed.errorEmbed(err.message));

	}

}



// commands array
const commands = [
	{
		name: "help",
		description: "Get list of available commands",
		requiredArgs: 0,
		requiredRole: null,
		execute(message, args, done) {

			const cmdList = [];

			commands.forEach(cmd => {
				cmdList.push({
					"name": cmd.name,
					"value": cmd.description
				})
			})

			message.channel.send(embed.helpEmbed(cmdList));

			done(null);

		},
	},
	{
		name: "ping",
		description: "Checks the bot's availability.",
		requiredArgs: 0,
		requiredRole: null,
		execute(message, args, done) {

			message.channel.send(embed.pingEmbed());

			done(null);

		},
	},
	{
		name: "setstart",
		description: "Update the event start timestamp (epoch, in miliseconds).",
		requiredArgs: 1,
		requiredRole: null,
		execute(message, args, done) {

			if (isNaN(args[0])) throw new Error("Argument is not a number.");

			const nbr = parseInt(args[0]);
			config.shared.eventStart = nbr;
			fs.writeFile(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 4), (err) => {
				done(err);
			});

		},
	},
	{
		name: "broadcast",
		description: "Broadcast a message as the bot.",
		requiredArgs: null,
		requiredRole: null,
		execute(message, args, done) {

			message.guild.channels.cache.get(config.control.broadcastChannel).send(embed.broadcastEmbed(message.content.slice(config.control.commandPrefix.length + "broadcast".length + 1), message.member.nickname, Date.now()));

			done(null);
		},
	}
];

module.exports.router = commandRouter;
