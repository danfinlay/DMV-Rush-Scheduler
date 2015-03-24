var list = require("./firstResult.json");
var _ = require('lodash');
var fs = require('fs');

var dated = list.map(function(item){
	item.soonest = new Date(item.soonest);
	return item;
});

var sorted = _.sortBy(dated, function(item){
	return item.soonest;
});

fs.writeFileSync(__dirname+'/finalResult.json', JSON.stringify(sorted,null,2));
