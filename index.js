var scheduleUpdater = require('./lib/scheduleUpdater')
var fs = require('fs')

scheduleUpdater(function(err, results){
	fs.writeFileSync(__dirname+'/firstResult.json', JSON.stringify(results,null,2));
}
