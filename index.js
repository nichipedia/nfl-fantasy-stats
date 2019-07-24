const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://fantasyfootballcalculator.com/adp';

let scapeADP = (html, callback) => {
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
		}
	});
	return players
};

let getADP = (callback) => {
	axios.get(url)
	.then(resp => {
		callback(getADP(resp.data), null);
	})
	.catch(err => {
		callback(null, err);
	});
};

module.exports = getADP;