// From http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var people = require(process.argv[2]);

var scrape = function(person, doneCallback) {
  var url = people[person];
  var data = {};

  request(url, function(err, resp, body) {
    $ = cheerio.load(body);

    var raw = $('#stats tr');
    var affiliation = $('span[id=cit-affiliation-display]')[0].children[0].data;
    var graph = $('td[width=475]')[0].children[2].attribs['src'];
    var year = graph.match(/0:\|(\d+)/)[1];

    var stats = {
      'citations' : [raw[1].children[1].children[0].data, raw[1].children[2].children[0].data],
      'hindex' : [raw[2].children[1].children[0].data, raw[2].children[2].children[0].data],
      'i10index' : [raw[3].children[1].children[0].data, raw[3].children[2].children[0].data]
    };

    data = { 
      'name' : person, 
      'affiliation' : affiliation,
      'url': url, 
      'year': year, 
      'stats' : stats
    };

    doneCallback(null, data);
  });
};

// http://javascriptplayground.com/blog/2013/06/think-async/
async.mapSeries(Object.keys(people), scrape, function (err, results) {
  var date = new Date();
  console.log('var date = "' + date + '"');
  console.log('var data = ' + JSON.stringify(results, null, 2) + ';');
});
