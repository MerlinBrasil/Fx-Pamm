var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var CronJob = require('cron').CronJob;

var target  = 'http://fx-trend.com/pamm/rating/';

// var CronJob = require('cron').CronJob;
// var job = new CronJob({
//   cronTime: '*/5 * * * *',
//   onTick: function() {
// 	  parseWork(target);
//   },
//   start: false
// });
//
// job.start();

var str = "5.2%";
str = str.replace('%', '');

console.log(str);

var file = "test.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

// fs.exists('database', function (exists) {
//   db = new sqlite3.Database('database.db');
//
//   if (!exists) {
//     console.info('Creating database. This may take a while...');
//     fs.readFile('DB_Schema/fx_pamm.sql', 'utf8', function (err, data) {
//       if (err) throw err;
//       db.exec(data, function (err) {
//         if (err) throw err;
//         console.info('Done.');
//       });
//     });
//   }
// });


parseWork(target);

function parseWork (target) {
	
	console.log("!!!!!!!!!!!! Parser Work stared at " + new Date() + "!!!!!!!!!!!!");
	
	var parsedResults = [];
	
	request(target, function(err, response, body){
	
		if (!err && response.statusCode == 200) {
			$ = cheerio.load(body);
		
			indexes_form = $('form').filter(function(){
				return $(this).attr('name') === 'rep_index';
			});
		
			indexes_trs = indexes_form.find('tr').filter(function(){
				return $(this).attr('class') != 'my_accounts_table_first' && $(this).children().length > 1;
			});
		
			for (index = 0; index < indexes_trs.length; index++) {
				tr = indexes_trs[index];
			
				var indexName = $(tr).children().eq(0).children('a').text();
				var indexUrl = $(tr).children().eq(0).children('a').attr('href');
				var indexProfit = $(tr).children().eq(1).text();
				var indexStartDate = $(tr).children().eq(2).text();
			
			
				var metadata = {
					name: indexName,
					url: indexUrl,
					profit: indexProfit.replace('%', ''),
					startDate: indexStartDate
				};
			
				parsedResults.push(metadata);
			}
		}
	
		if (parsedResults.length > 0) {
		
			 fs.writeFile('indexes/indexes.json', JSON.stringify(parsedResults, null, 4));
			// var stmt = db.prepare("INSERT INTO pamm_index (name, url, start_date, profit) VALUES (?, ?, ?, ?)");
			for (idx = 0; idx < parsedResults.length; idx++) {
				var index = parsedResults[idx];
			// 	stmt.run(index.name, index.url, index.startDate, index.profit );
				parseIndex(index);
			}
		}
	});
}

function parseIndex(index) {
	
	var pamms = {
		consistOf : [],
		weeklyGain: []
	};
	
	request(index.url, function(err, response, body){
		
		console.log('Processing data for index: ' + index.name);
		
		if (!err && response.statusCode == 200) {
			$ = cheerio.load(body);
			
			var consistOf  = [];
			var weeklyGain = [];
			
			$('div .mb_center_cr table tr td table tr td table').children().each(function(el){

				// Getting urls, names, and % parts of pamms wich are in an index;
				var ahref = $(this).children('tr td').eq(0).children('a').eq(0);
				var pammName = $(ahref).text();
				var pammURL = $(ahref).attr('href');

				var share = $(this).children('tr td').eq(1).text();

				var indexdata  = {
					name 	: pammName,
					pamm	: pammNumberFromURL(pammURL),
					url  	: pammURL,
					share	: share,
				};
				
				consistOf.push(indexdata);

			});
			
			$('div .mb_center_cr table tr td table.my_accounts_table').children('tr').filter(function(el){

				return ( $(this).attr('class') != 'my_accounts_table_first' &&
						 $(this).children('td').eq(0).attr('class') != 'mat_separ' );

			}).each(function(tr){

				var week = {
					title: $(this).children('td').eq(0).text(),
					gain : $(this).children('td').eq(1).text()
				}

				weeklyGain.push(week)

			});
			
			pamms.consistOf  = consistOf;
			pamms.weeklyGain = weeklyGain;
		}
		
		fs.writeFile('indexes/' + '_index_' + index.name + '.json', JSON.stringify(pamms, null, 4));
	});
}

function pammNumberFromURL(url) {
	
	var aPathComps = url.split("/"); 
	if (aPathComps.length > 2) {
		return aPathComps[aPathComps.length - 2];
	}
	return '';
}

