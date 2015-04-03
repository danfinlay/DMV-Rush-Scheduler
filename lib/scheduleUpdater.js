// Utillities:
var request = require('request')
var cheerio = require('cheerio')
var async = require('async');
var _ = require('lodash');

// Static Data:
var opts = require('./opts');
var offices = require('./officeMap.json');
var headers = opts.headers;
var form = opts.form;

// A little formatting:
var queryObjs = [];
for( var id in offices ){
  queryObjs.push({
    id:id,
    name:offices[id],
  });
}

// Exported interface:
module.exports = function getLatestAppointments(cb){
  async.mapLimit( queryObjs, 3, function( item, cb ){
    getOffice( item, cb );
  }, function (err, results) {
    if (err) return cb (err);

    var sorted = _.sortBy(results, function(item){
      return item && item.soonest ? item.soonest : 0;
    });

    cb(null, sorted);

  });
}

// Get Office
//
// Takes an object with an office name + office ID
// (as defined by the DMV's own website internally)
// Calls back with that office's name paired with
// the next available appointment.
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

    var result = {
      office:name,
      soonest: date,
      id: id
    };
    cb(null, result);
  });
}

// Parse Result
//
// Takes the HTML result of POSTing our form to the DMV.
// (This could be finnicky if they change their website,
// but they have no API, so it will have to do for now.)
// Returns a Date object of the next available DMV appointment
// On that office's page.
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
