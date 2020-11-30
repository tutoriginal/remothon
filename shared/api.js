// dependencies
const request = require('request');
const config = require('../config.json');


const token_url = "https://api.intra.42.fr/oauth/token?client_id=" + config.shared.clientId + "&client_secret=" + config.shared.clientSecret + "&grant_type=client_credentials"

function requestToken(callback) {
	request.post(token_url, (err, res) => {
		if (err) return callback(null);
		return callback(JSON.parse(res.body).access_token);
	});
}

function SearchUser(login, callback) {
	requestToken(token => {
		if (!token) return callback("no login provided", null);
		request.get('https://api.intra.42.fr/v2/campus/12/users?filter[login]=' + login + "&access_token=" + token, (err, res) => {
			if (err) return callback(err, null);
			if (!res.body) return callback(false, 0);
			return callback(false, JSON.parse(res.body).length > 0);
		});
	});
}

module.exports.SearchUser = SearchUser;