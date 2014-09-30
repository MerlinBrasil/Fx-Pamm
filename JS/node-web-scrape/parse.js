var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var CronJob = require('cron').CronJob;

var target  = 'http://fx-trend.com/pamm/rating/';
var pammPageURL = target + '?rep_page=';

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
	
	var parsedResults = [];
	
	request(target, function(err, response, body){
	
		if (!err && response.statusCode == 200) {
			$ = cheerio.load(body);
		
			// Indexes form
			var indexes_form = $('form').filter(function(){
				return $(this).attr('name') === 'rep_index';
			});
		
			var indexes_trs = indexes_form.find('tr').filter(function(){
				return $(this).attr('class') != 'my_accounts_table_first' && $(this).children().length > 1;
			});
		
			// Pamms form
			var pamm_form = $('form').filter(function(){
				return $(this).attr('name') === 'rep';
			});
			
			// Pamms 2.0 form
			var pamm2_0_form = $('form').filter(function(){
				return $(this).attr('name') === 'rep_pamm2_0';
			});
			
			parsePamms(pamm_form);

			return;
		
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

/**
	Parse pamm accounts
*/
function parsePamms(form) {
	
	console.log('!!!!!!!!!!!!  parsePamms !!!!!!!!!!!! ');
	
	var trs = $(form).find('div.plashka div.pl_main div.pl_info table.my_accounts_table tr');
	
	var pages_count_td  = trs.children('td').filter(function(el){
		return $(this).attr('colspan') === '11' && $(this).attr('align') === 'center';
	});
	
	var lastPageURL = pages_count_td.children('a').last().attr('href');	
	var pagesCount = Number(lastPageURL.substring(lastPageURL.indexOf('=') + 1));
	
	parsePageWithContent(trs);
	
	if (pagesCount > 2) {
		
		for (var pageIdx = 2; pageIdx <= pagesCount; pageIdx++) {
			
			var pageUrl = pammPageURL + pageIdx;
			console.log(pageUrl);
			request(pageUrl, function(err, response, body){
				if (!err && response.statusCode == 200) {
					$ = cheerio.load(body);
					
					// Pamms form
					var pamm_form = $('form').filter(function(){
						return $(this).attr('name') === 'rep';
					});
					
					var trs = $(pamm_form).find('div.plashka div.pl_main div.pl_info table.my_accounts_table tr');
					parsePageWithContent(trs);
				} else {
					console.log("ERROR!!!!");
					console.log(err);
				}
			});
		}
	}
}

function parsePageWithContent(content) {
	
	$(content).each(function(el){
		
		var td_children = $(this).children('td');
		var td_child = $(td_children).first();
		
		if ($(td_child).hasClass('mat_number')) {
			// URL with name
			
			var detailsUrl = $(td_children).eq(0).children('a').first().attr('href');
			var pammName = $(td_children).eq(0).children('a').first().text();
			var pammNumber = pammNumberFromURL(detailsUrl);
			var creationDate = $(td_children).eq(2).text();
			var traidersCapital = Number($(td_children).eq(3).text());
			var investorsCapital = Number($(td_children).eq(4).text());
			var traidPeriod = $(td_children).eq(5).text();
			var conditionalyPeriodical = $(td_children).eq(6).text() === 'Yes';
			var profit = Number($(td_children).eq(7).text().replace('%',''));
			var last30DaysProfit = Number($(td_children).eq(8).text().replace('%',''));
			var ralativeDropdown = Number($(td_children).eq(9).text().replace('%',''));
			var maxDropdown = Number($(td_children).eq(10).text().replace('%',''));
			
			var pamm_description = {
				detailsUrl: detailsUrl,
				pammName: pammName,
				pammNumber: pammNumber,
				creationDate : creationDate,
				traidersCapital: traidersCapital,
				investorsCapital: investorsCapital,
				traidPeriod: traidPeriod,
				conditionalyPeriodical: conditionalyPeriodical,
				profit: profit,
				last30DaysProfit: last30DaysProfit,
				ralativeDropdown: ralativeDropdown,
				maxDropdown: maxDropdown
			}
			
			fs.writeFile('pamms/' + '_' + pammNumber + '_' + pammName + '.json', JSON.stringify(pamm_description, null, 4));
			console.log(pammName + '-' + pammNumber);
			console.log('---------------------------------');
		}
	})
}
