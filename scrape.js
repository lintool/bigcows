// From http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var people = {
  'James Allan': 'http://scholar.google.com/citations?user=-bLGeg0AAAAJ&hl=en',
  'Eugene Agichtein': 'http://scholar.google.com/citations?user=3BX3vWcAAAAJ&hl=en',
  'Charles L. A. Clarke': 'http://scholar.google.com/citations?user=TkVleDIAAAAJ&hl=en',
  'W. Bruce Croft': 'http://scholar.google.com/citations?user=ArV74ZMAAAAJ&hl=en',
  'Susan Dumais': 'http://scholar.google.com/citations?user=x8dED5cAAAAJ&hl=en',
  'Marti A. Hearst': 'http://scholar.google.com/citations?user=Yy6xbCYAAAAJ&hl=en',
  'Joemon M Jose': 'http://scholar.google.com/citations?user=ERvFJGkAAAAJ&hl=en',
  'Mounia Lalmas': 'http://scholar.google.com/citations?user=wAr9G5sAAAAJ&hl=en',
  'Jimmy Lin' : 'http://scholar.google.com/citations?user=0EWw1z8AAAAJ&hl=en',
  'Douglas W. Oard' : 'http://scholar.google.com/citations?user=3ctKkysAAAAJ&hl=en',
  'Cornelis van Rijsbergen': 'http://scholar.google.com/citations?user=NnFpD_sAAAAJ&hl=en',
  'Jaime Teevan': 'http://scholar.google.com/citations?user=F5Ik84MAAAAJ&hl=en',
  'Arjen P. de Vries': 'http://scholar.google.com/citations?user=iH9TVHQAAAAJ&hl=en',
  'Ryen W. White': 'http://scholar.google.com/citations?user=U69fiZMAAAAJ&hl=en',
  'ChengXiang Zhai': 'http://scholar.google.com/citations?user=YU-baPIAAAAJ&hl=en',
}

var process = function(person, doneCallback) {
  var url = people[person];
  var data = {};

  request(url, (function(person) { return function(err, resp, body) {
    $ = cheerio.load(body);

    var raw = $('#stats tr');
    var stats = {
      'citations' : [raw[1].children[1].children[0].data, raw[1].children[2].children[0].data],
      'hindex' : [raw[2].children[1].children[0].data, raw[2].children[2].children[0].data],
      'i10index' : [raw[3].children[1].children[0].data, raw[3].children[2].children[0].data]
    };

    data = { 'name' : person, 'stats' : stats};

    doneCallback(null, data);
  }})(person));
};

// http://javascriptplayground.com/blog/2013/06/think-async/
async.map(Object.keys(people), process, function (err, results) {
  console.log('var data = ' + JSON.stringify(results, null, 2) + ';');
});
