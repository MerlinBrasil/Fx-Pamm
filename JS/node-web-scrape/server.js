
var express = require('express');
var fs 		= require('fs');
var request = require('request');
var cheerio = require('cheerio');
var xpath 	= require('xpath');
var dom 	= require('xmldom').DOMParse;
var app     = express();


app.get('/api', function(req, res){
	
	var fs = require('fs');
	var obj;
	
	fs.readFile('parsing_results/pamm_details/_7031_details_.json', 'utf8', function (err, data) {
		if (err) throw err;
		obj = JSON.parse(data);
		res.end( JSON.stringify(obj) );
	});
});

app.get('/pmlist', function(req, res){

	fs.readdir('parsing_results/pamms/_*.json', function(err, files){
		console.log(files.length);
		res.send('end');
	});
});

app.listen('8081');

console.log('Magic happens on port 8081');
