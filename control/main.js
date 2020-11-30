// dependencies
const discord = require('discord.js');
const cron = require('cron');
const countdown = require('countdown');
const db = require('../shared/database');
const log = require('../shared/log');
const commands = require('./commands');
const api = require('../shared/api');
const config = require('../config.json');




// discord setup
const client = new discord.Client();

client.login(config.control.token);

client.on("ready", () => {

	client.user.setPresence({
		status: 'dnd',
		activity: {
			name: 'REMOTHON',
			type: 'COMPETING'
		},
	});

	control.start();
});



// control loop (called every 15 seconds)
var control = new cron.CronJob('*/15 * * * * *', () => {

	if (Date.now() < config.shared.eventStart) { // event has not yet started

		statusStartCountdown();

	} else if (Date.now() < config.shared.eventStart + 86400000) { // event is ongoing

		statusEndCountdown();
		listVoiceChannelUsers();

	} else { // event is finished

		statusFinished();

	}

}, null, false, "Europe/Brussels");



// countdown to the start of the event in the bot status
function statusStartCountdown() {
	const time = countdown(null, config.shared.eventStart, countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, 1, 0).toString();
	client.user.setPresence({
		status: 'dnd',
		activity: {
			name: 'REMOTHON | starting in ' + time,
			type: 'COMPETING'
		},
	});
}



// countdown to the end of the event in the bot status
function statusEndCountdown() {
	const time = countdown(null, config.shared.eventStart + 86400000, countdown.HOURS | countdown.MINUTES | countdown.SECONDS, 1, 0).toString();
	client.user.setPresence({
		status: 'online',
		activity: {
			name: 'REMOTHON | ending in ' + time,
			type: 'COMPETING'
		},
	});
}



// end message in the bot status
function statusFinished() {
	client.user.setPresence({
		status: 'idle',
		activity: {
			name: 'REMOTHON | finished',
			type: 'COMPETING'
		},
	});
}



function listVoiceChannelUsers() {
	const activeUsers = client.guilds.cache.get(config.control.guild).voiceStates.cache.filter(state => state.channel && state.channelID != state.guild.afkChannelID && !state.deaf)
	activeUsers.forEach(state => { // iterate through every user connected to any voice channel (except afk) and not deafened

		const nick = (state.member.nickname ? state.member.nickname : state.member.user.username).split("|")[0].trim();

		db.Student.findOne({ $or: [{ discord_id: state.id }, { ft_login: nick }] }) // find user in database
			.then(student => {

				if (student) { // user already exists

					student.logtime += 15000;
					student.discord_id = state.id;
					student.discord_tag = state.member.user.tag;
					student.discord_nick = nick;
					student.save()
						.catch(err => {

							log("error trying to update the user " + state.member.user.tag + " in the database: " + err);

						});

				} else { // user does not exist yet

					db.Student.create({ discord_id: state.id, discord_tag: state.member.user.tag, discord_nick: nick, logtime: 15000 })
						.catch(err => {

							log("error trying to create the user " + state.member.user.tag + " in the database: " + err);

						});

				}
			})
			.catch(err => {

				log("error trying to find the user " + state.member.user.tag + " in the database: " + err);

			});

	});
}



// commands handler
client.on('message', commands.router);
