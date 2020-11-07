// dependencies
const discord = require('discord.js');
const cron = require('cron');
const countdown = require('countdown');
const config = require('../config.json');
const db = require('./database');
const log = require('./log');

// discord setup
const client = new discord.Client();

client.login(config.token);

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
var control = new cron.CronJob('*/4 * * * * *', () => {

	if (Date.now() < config.eventStart) { // event has not yet started

		statusStartCountdown();

	} else if (Date.now() < config.eventEnd) { // event is ongoing

		statusEndCountdown();
		listVoiceChannelUsers();

	} else { // event is finished

		statusFinished();

	}

}, null, false, "Europe/Brussels");



// countdown to the start of the event in the bot status
function statusStartCountdown() {
	const time = countdown(null, config.eventStart, countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, 1, 0).toString();
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
	const time = countdown(null, config.eventEnd, countdown.HOURS | countdown.MINUTES | countdown.SECONDS, 1, 0).toString();
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
	const activeUsers = client.guilds.cache.get(config.guild).voiceStates.cache.filter(state => state.channelID != state.guild.afkChannelID && !state.deaf)
	activeUsers.forEach(state => { // iterate through every user connected to any voice channel (except afk) and not deafened

		db.Student.findOne({ discord_id: state.id }) // find user in database
			.then(student => {

				if (student) { // user already exists

					student.logtime += 15000;
					student.save()
						.catch(err => {

							log("error trying to update the user " + state.member.user.tag + " in the database: " + err);

						});

				} else { // user does not exist yet

					db.Student.create({ discord_id: state.id, discord_tag: state.member.user.tag, login: state.member.user.username, logtime: 15000 })
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
