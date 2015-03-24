var request = require('request')
var cheerio = require('cheerio')
var offices = require('./officeMap.json');
var async = require('async');
var _ = require('lodash');
var fs = require('fs');

var headers = {
	Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	'Accept-Encoding':'gzip, deflate',
	'Accept-Language':'en-US,en;q=0.8',
	'Cache-Control':'max-age=0',
	Connection:'keep-alive',
	Cookie:'PD_STATEFUL_05417d3c-3463-11e4-bb11-a224edf30402=%2Fportal; AMWEBJCT!%2Fportal!JSESSIONID=0000S1jaTGsf-VpdLOmgm3ViHic:18tlhprbb; PD_STATEFUL_05b765dc-0c5a-11e4-be4c-a224e2a50102=%2Fwasapp; __utmt=1; __utma=158387685.1213586830.1427165660.1427165660.1427165660.1; __utmb=158387685.50.10.1427165660; __utmc=158387685; __utmz=158387685.1427165660.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); AMWEBJCT!%2Fwasapp!JSESSIONID=000069dU5CzuOBNYVqN04BWr-Gj:18u4cegug',
	Host:'www.dmv.ca.gov',
	Origin:'https://www.dmv.ca.gov',
	Referrer:'https://www.dmv.ca.gov/wasapp/foa/clear.do?goTo=officeVisit',
	'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.50 Safari/537.36',
};

var form = {
	officeId: 632,
	numberItems:1,
	taskVR:true,
	firstName:'rando',
	lastName:'smarpson',
	telArea:415,
	telPrefix:555,
	telSuffix:1212,
	resetCheckFields:true,
};

var queryObjs = [];
for( var id in offices ){
	queryObjs.push({
		id:id,
		name:offices[id],
	});	
}

async.mapLimit( queryObjs, 3, function( item, cb ){
	getOffice( item, cb );
}, function (err, results) {

	fs.writeFileSync(__dirname+'/result.json', JSON.stringify(results,null,2));
	var sorted = _.sortBy(results, function(item){
		return item && item.soonest ? item.soonest : 0;
	});

	fs.writeFileSync(__dirname+'/firstResult.json', JSON.stringify(sorted,null,2));
});

function getOffice (opts, cb) {
	var name = opts.name;
	var id = opts.id;
				form.officeId = id;
				request.post({
					uri:'https://www.dmv.ca.gov/wasapp/foa/findOfficeVisit.do',
					gzip:true,
					form:form,
					headers:headers
				}, function (err, res, body) {
					if (err) return cb(err);

					var date = parseResult(body);
					var res = {
						office:name,
						soonest: date
					};
					cb(null, res);
				});
}

function parseResult(body){
  var $ = cheerio.load(body);
  var text;
	var result;
	try{
			var timeParts = $('#app_content p.alert').text().split(':')[1].split('at');
			var date = '' + timeParts[0] + ' ';
			var time = parseInt(timeParts[1]);
			date += time > 6 ? time : time + 12;
			date += ':00:00';
	    result = new Date(date);
	} catch (e) {
		result = text;	
	}
	return result;
}
