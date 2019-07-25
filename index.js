const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://fantasyfootballcalculator.com/adp';

const pfrDict = {
	'SF': 'sfo',
	'NE': 'nwe',
	'MIA': 'mia',
	'BUF': 'buf',
	'NYJ': 'nyj',
	'BAL': 'rav',
	'PIT': 'pit',
	'CLE': 'cle',
	'CIN': 'cin',
	'HOU': 'htx',
	'IND': 'clt',
	'TEN': 'oti',
	'JAX': 'jax',
	'KC': 'kan',
	'GB': 'gnb',
	'LAC': 'sdg',
	'DEN': 'den',
	'OAK': 'rai',
	'DAL': 'dal',
	'PHI': 'phi',
	'WAS': 'was',
	'NYG': 'nyg',
	'CHI': 'chi',
	'MIN': 'min',
	'DET': 'det',
	'NO': 'nor',
	'ATL': 'atl',
	'CAR': 'car',
	'TB': 'tam',
	'LAR': 'ram',
	'SEA': 'sea',
	'ARI': 'crd'
}

let scrapeADP = (html) => {
	let players = {
		RB: [],
		QB: [],
		WR: [],
		DEF: [],
		PK: [],
		TE: []
	};


	const $ = cheerio.load(html)

	$('tr').each((i, elem) => {
		let position = $(elem).find('td').eq(3).text();
		if (position == 'RB') {
			players.RB.push({
				name: $(elem).find('td').eq(2).text(),
				pos: position,
				pick: $(elem).find('td').eq(0).text(),
				team: $(elem).find('td').eq(4).text(),
				bye: $(elem).find('td').eq(5).text()
			});
		} else if (position == 'WR') {
			players.WR.push({
				name: $(elem).find('td').eq(2).text(),
				pos: position,
				pick: $(elem).find('td').eq(0).text(),
				team: $(elem).find('td').eq(4).text(),
				bye: $(elem).find('td').eq(5).text()
			});
		} else if (position == 'QB') {
			players.QB.push({
				name: $(elem).find('td').eq(2).text(),
				pos: position,
				pick: $(elem).find('td').eq(0).text(),
				team: $(elem).find('td').eq(4).text(),
				bye: $(elem).find('td').eq(5).text()
			});
		} else if (position == 'TE') {
			players.TE.push({
				name: $(elem).find('td').eq(2).text(),
				pos: position,
				pick: $(elem).find('td').eq(0).text(),
				team: $(elem).find('td').eq(4).text(),
				bye: $(elem).find('td').eq(5).text()
			});
		} else if (position == 'PK') {
			players.PK.push({
				name: $(elem).find('td').eq(2).text(),
				pos: position,
				pick: $(elem).find('td').eq(0).text(),
				team: $(elem).find('td').eq(4).text(),
				bye: $(elem).find('td').eq(5).text()
			});
		} else if (position == 'DEF') {
			players.DEF.push({
				name: $(elem).find('td').eq(2).text(),
				pos: position,
				pick: $(elem).find('td').eq(0).text(),
				team: $(elem).find('td').eq(4).text(),
				bye: $(elem).find('td').eq(5).text()
			});
		} else {
			return null;
		}
	});
	return players
};

let scrapePlayerStats = (player, html) => {
	let playerStats = {
		name: player.name,
		year: {}
	};
	let $ = cheerio.load(html);
	let years = $('#rushing_and_receiving tr.full_table');

	years.each((i, obj) => {
		let row = $(obj).find('td');
		let year = years.find('th').eq(i).text().substring(0,4);
		playerStats.year[year] = {
			age: $(obj).find('td').eq(0).text(),
			team: $(obj).find('td').eq(1).text(),
			position: player.pos,
			number: $(obj).find('td').eq(3).text(),
			games: $(obj).find('td').eq(4).text(),
			games_started: $(obj).find('td').eq(5).text(),
			rushing: {
				attempts: $(obj).find('td').eq(6).text(),
				yards: $(obj).find('td').eq(7).text(),
				touchdowns: $(obj).find('td').eq(8).text(),
				longest_attempt: $(obj).find('td').eq(9).text(),
				yards_per_attempt: $(obj).find('td').eq(10).text(),
				yards_per_game: $(obj).find('td').eq(11).text(),
				attempts_per_game: $(obj).find('td').eq(12).text()
			},
			receiving: {
				targets: $(obj).find('td').eq(13).text(),
				receptions: $(obj).find('td').eq(14).text(),
				yards: $(obj).find('td').eq(15).text(),
				yard_per_reception: $(obj).find('td').eq(16).text(),
				touchdowns: $(obj).find('td').eq(17).text(),
				longest_reception: $(obj).find('td').eq(18).text(),
				receptions_per_game: $(obj).find('td').eq(19).text(),
				yards_per_game: $(obj).find('td').eq(20).text(),
				catch_percentage: $(obj).find('td').eq(21).text(),
				yards_per_target: $(obj).find('td').eq(22).text()
			},
			summary: {
				touches: $(obj).find('td').eq(23).text(),
				yards_per_touch: $(obj).find('td').eq(24).text(),
				scrimmage: $(obj).find('td').eq(25).text(),
				total_touchdowns: $(obj).find('td').eq(26).text(),
			},
			fumbles: $(obj).find('td').eq(27).text(),
		}
	})

	return(playerStats);
}

let getADP = () => {
	return new Promise((resolve, reject) => {
		axios.get(url)
		.then(resp => {
			let players = scrapeADP(resp.data);
			if (players) {
				resolve(players);
			} else {
				reject('Found player that was not in a known position!');
			}
		})
		.catch(err => {
			reject(err);
		});
	});
};

let getPlayerStats = (player) => {
	let pfr = 'https://www.pro-football-reference.com';
	let team = pfrDict[player.team];
	let teamPage = `${pfr}/teams/${team}`;
	return new Promise((resolve, reject) => {
		axios.get(teamPage)
		.then(res => {
			let teamSum = cheerio.load(res.data);
			teamSum('#bottom_nav_container li a').each((i, obj) => {
				if (teamSum(obj).text() == 'Starting Lineups') {
					year = teamSum(obj).attr('href');
					let teamYearURL = `${pfr}${year}`;
					axios.get(teamYearURL)
					.then(res => {
						let $ = cheerio.load(res.data);
						$('a').each((i, obj) => {
							if ($(obj).text() == player.name) {
								let statsPageRef = $(obj).attr('href');
								let statsPageURL = `${pfr}${statsPageRef}`;
								axios.get(statsPageURL)
								.then(res => {
									resolve(scrapePlayerStats(player, res.data));
								})
								.catch(err => {
									reject(err);
								});
							}
						});
					})
					.catch(err => {
						reject(err);
					});
				}
			}, () => { reject('Didnt Find URL!'); });
		})
		.catch(err => {
			reject(err);
		});
	});
};

module.exports = {getADP, getPlayerStats};