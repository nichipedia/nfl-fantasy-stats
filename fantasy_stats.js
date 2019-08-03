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
	let playerStats = {
		name: player.name,
		picture: '',
		ir: {},
		career: []
	};
	
	var COMMENT_PSEUDO_COMMENT_OR_LT_BANG = new RegExp(
    '<!--[\\s\\S]*?(?:-->)?'
    + '<!---+>?'  // A comment with no body
    + '|<!(?![dD][oO][cC][tT][yY][pP][eE]|\\[CDATA\\[)[^>]*>?'
    + '|<[?][^>]*>?',  // A pseudo-comment
    'g');
    let data = html.replace(COMMENT_PSEUDO_COMMENT_OR_LT_BANG, "");
	let $ = cheerio.load(data);
	let years = $('#rushing_and_receiving tr.full_table');
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

	let picture = $('[itemscope=image]').attr('src');
	playerStats.picture = picture;

	years.each((i, obj) => {
		let row = $(obj).find('td');
		let year = years.find('th').eq(i).text().substring(0,4);
		playerStats.career.push({
			age: $(obj).find('td').eq(0).text(),
			team: player.team,
			season: year,
			position: player.pos,
			number: $(obj).find('td').eq(3).text(),
			games: $(obj).find('td').eq(4).text(),
			games_started: $(obj).find('td').eq(5).text(),
			skills: [
			{
				attempts: $(obj).find('td').eq(6).text(),
				yards: $(obj).find('td').eq(7).text(),
				touchdowns: $(obj).find('td').eq(8).text(),
				longest_attempt: $(obj).find('td').eq(9).text(),
				yards_per_attempt: $(obj).find('td').eq(10).text(),
				yards_per_game: $(obj).find('td').eq(11).text(),
				attempts_per_game: $(obj).find('td').eq(12).text()
			},
			{
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
			}],
			summary: {
				touches: $(obj).find('td').eq(23).text(),
				yards_per_touch: $(obj).find('td').eq(24).text(),
				scrimmage: $(obj).find('td').eq(25).text(),
				total_touchdowns: $(obj).find('td').eq(26).text(),
			},
			fumbles: $(obj).find('td').eq(27).text(),
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
	return(playerStats);
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
	let nameArray = name.split(' ');
	let initial = nameArray[nameArray.length -1].charAt(0);
	return initial;	
}

let getPlayerStats = (player) => {
	let pfr = 'https://cors-anywhere.herokuapp.com/https://www.pro-football-reference.com';
	let team = pfrDict[player.team];
	let teamPage = `${pfr}/teams/${team}`;
	let initial = getLastInitial(player.name);
	return new Promise((resolve, reject) => {
		let playersPageURL = `${pfr}/players/${initial}`;
		axios.get(playersPageURL, {headers: {'origin': 1}})
		.then(res => {
			let playersPage = cheerio.load(res.data);
			playersPage('#div_players p b a').each((i, obj) => {
				if (playersPage(obj).text().toLowerCase() === player.name.toLowerCase()) {
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
			});
		}, () => { reject('Didnt find anything with this URL!') })
		.catch(err => {
			reject(err);
		}); 
	});
};
module.exports = {getADP, getPlayerStats};