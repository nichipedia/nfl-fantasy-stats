const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://cors-anywhere.herokuapp.com/https://fantasyfootballcalculator.com/adp';

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
			let name = null;
			if ($(elem).find('td').eq(2).text() == 'Pat Mahomes') {
				name = 'Patrick Mahomes';
			} else {
				name = $(elem).find('td').eq(2).text();
			}
			players.QB.push({
				name: name,
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
	var COMMENT_PSEUDO_COMMENT_OR_LT_BANG = new RegExp(
    '<!--[\\s\\S]*?(?:-->)?'
    + '<!---+>?'  // A comment with no body
    + '|<!(?![dD][oO][cC][tT][yY][pP][eE]|\\[CDATA\\[)[^>]*>?'
    + '|<[?][^>]*>?',  // A pseudo-comment
    'g');
    let data = html.replace(COMMENT_PSEUDO_COMMENT_OR_LT_BANG, "");
	let $ = cheerio.load(data);
	let picture = $('[itemscope=image]').attr('src');
	
	if (player.pos === 'DEF') {
		let row = $('#defense tfoot tr td');	
		let defStats = {
			name: player.name,
			picture: picture,
			interceptions: row.eq(5).text(),
			pick_six: row.eq(7).text(),
			sacks: row.eq(15).text(),
			forced_fumbles: row.eq(10).text(),
			safties: row.eq(21).text()	
		}
		return defStats;
	}

	let playerStats = {
		name: player.name,
		picture: picture,
		ir: {},
		career: []
	};
	let ir = $('#injury');
	if (ir) {
		let info = ir.find('p').text();
		if (info.length > 0) {
			playerStats.ir = {
				injury: info
			};
		} else {
			playerStats.ir = {
				injury: null
			};
		}
	}


	if (player.pos === 'RB' || player.pos === 'QB') {
		let years = $('#rushing_and_receiving tr.full_table');
		years.each((i, obj) => {
			let row = $(obj).find('td');
			let year = years.find('th').eq(i).text().substring(0,4);
			playerStats.career.push({
				age: row.eq(0).text(),
				team: row.eq(1).find('a').attr('title'),
				season: year,
				position: player.pos,
				number: row.eq(3).text(),
				games: row.eq(4).text(),
				games_started: row.eq(5).text(),
				skills: [
				{
					attempts: row.eq(6).text(),
					yards: row.eq(7).text(),
					touchdowns: row.eq(8).text(),
					longest_attempt: row.eq(9).text(),
					yards_per_attempt: row.eq(10).text(),
					yards_per_game: row.eq(11).text(),
					attempts_per_game: row.eq(12).text()
				},
				{
					targets: row.eq(13).text(),
					receptions: row.eq(14).text(),
					yards: row.eq(15).text(),
					yard_per_reception: row.eq(16).text(),
					touchdowns: row.eq(17).text(),
					longest_reception: row.eq(18).text(),
					receptions_per_game: row.eq(19).text(),
					yards_per_game: row.eq(20).text(),
					catch_percentage: row.eq(21).text(),
					yards_per_target: row.eq(22).text()
				}],
				summary: {
					touches: row.eq(23).text(),
					yards_per_touch: row.eq(24).text(),
					scrimmage: row.eq(25).text(),
					total_touchdowns: row.eq(26).text(),
				},
				fumbles: row.eq(27).text(),
			});
		});
		if (player.pos == 'QB') {
			let rows = $('#passing tr.full_table');
			rows.each((i, obj) => {
				let row = $(obj).find('td');
				let year = years.find('th').eq(i).text().substring(0,4);
				playerStats.career[i].skills.push({
					qb_record: row.eq(6).text(),
					completions: row.eq(7).text(),
					yards: row.eq(8).text(),
					touchdowns: row.eq(9).text(),
					touchdown_percentage: row.eq(10).text(),
					interceptions: row.eq(11).text(),
					interception_percentage: row.eq(12).text(),
					longest_completion: row.eq(13).text(),
					yards_per_attempt: row.eq(14).text(),
					adjusted_yards_per_attempt: row.eq(15).text(),
					yards_per_completion: row.eq(16).text(),
					yards_per_game: row.eq(17).text(),
					qbr: row.eq(18).text()
				});
			});
		}
	} else if (player.pos === 'WR' || player.pos === 'TE') {
		let years = $('#receiving_and_rushing tr.full_table');
		years.each((i, obj) => {
			let row = $(obj).find('td');
			let year = years.find('th').eq(i).text().substring(0,4);
			playerStats.career.push({
				age: row.eq(0).text(),
				team: row.eq(1).find('a').attr('title'),
				season: year,
				position: player.pos,
				number: row.eq(3).text(),
				games: row.eq(4).text(),
				games_started: row.eq(5).text(),
				skills: [{
					targets: row.eq(6).text(),
					receptions: row.eq(7).text(),
					yards: row.eq(8).text(),
					yard_per_reception: row.eq(9).text(),
					touchdowns: row.eq(10).text(),
					longest_reception: row.eq(11).text(),
					receptions_per_game: row.eq(12).text(),
					yards_per_game: row.eq(13).text(),
					catch_percentage: row.eq(14).text(),
					yards_per_target: row.eq(15).text()
				}, {
					attempts: row.eq(16).text(),
					yards: row.eq(17).text(),
					touchdowns: row.eq(18).text(),
					longest_attempt: row.eq(19).text(),
					yards_per_attempt: row.eq(20).text(),
					yards_per_game: row.eq(21).text(),
					attempts_per_game: row.eq(22).text()
				}],
				summary: {
					touches: row.eq(23).text(),
					yards_per_touch: row.eq(24).text(),
					scrimmage: row.eq(25).text(),
					total_touchdowns: row.eq(26).text(),
				},
				fumbles: row.eq(27).text(),
			});
		});
	}
	return playerStats;
}

let getADP = () => {
	return new Promise((resolve, reject) => {
		axios.get(url, {headers: {'origin': 1}})
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

let getLastInitial = (name) => {
	let nameArray = name.trim().toUpperCase().replace('JR.', '').replace(' JR', '').replace('JR ').split(' ');
	let initial = nameArray[nameArray.length -1].charAt(0);
	return initial;	
}

let getPlayerStats = (player) => {
	let pfr = 'https://cors-anywhere.herokuapp.com/https://www.pro-football-reference.com';
	let team = pfrDict[player.team];
	let teamPage = `${pfr}/teams/${team}`;
	let initial = getLastInitial(player.name);
	if (player.pos === 'DEF') {
		return new Promise((resolve, reject) => {
			axios.get(teamPage, {headers: {'origin': 1}})
			.then(res => {
				let $ = cheerio.load(res.data);
				let year = $('[data-stat=year_id] a').eq(0).attr('href');
				let teamYearSum = `${pfr}${year}`;
				axios.get(teamYearSum, {headers: {'origin': 1}})
				.then(res => {
					resolve(scrapePlayerStats(player, res.data));
				})
				.catch(err => {
					console.log(err);
				});
			})
			.catch(err => {
				console.log(err);
			});
		});
	}
	return new Promise((resolve, reject) => {
		let playersPageURL = `${pfr}/players/${initial}`;
		axios.get(playersPageURL, {headers: {'origin': 1}})
		.then(res => {
			let playersPage = cheerio.load(res.data);
			playersPage('#div_players p b a').each((i, obj) => {
				let pfrName = playersPage(obj).text().toLowerCase().replace('jr.', '').replace(' jr', '').replace('jr ', '').replace("'", "");
				let adpName = player.name.toLowerCase().replace('jr.', '').replace(' jr', '').replace('jr ', '').replace("'", "");
				if (pfrName === adpName) {
					let statsPageRef = playersPage(obj).attr('href');
					let statsPageURL = `${pfr}${statsPageRef}`;
					axios.get(statsPageURL, {headers: {'origin': 1}})
					.then(res => {
						resolve(scrapePlayerStats(player, res.data));
					})
					.catch(err => {
						reject(err);
					});
				}
			}, () => { reject('Didnt find anything with this URL!') });
		})
		.catch(err => {
			reject(err);
		}); 
	});
};
module.exports = {getADP, getPlayerStats};